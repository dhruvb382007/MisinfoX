"""
app.py — MisInfoX FastAPI inference server.

Includes User Authentication, API Key Management, and Gemini Fact Checking.
"""

import os, json
import numpy as np
import joblib
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables before local imports
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

# Local imports
from database import get_db, engine, Base
import models
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
from encryption import encrypt_api_key, decrypt_api_key

from train import (
    extract_highlights,
    generate_explanations,
    generate_propagation,
    generate_sources,
)

# ── Initialize DB ──────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Load model ────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "pipeline.joblib")
META_PATH  = os.path.join(os.path.dirname(__file__), "model", "meta.json")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Model not found. Run `python train.py` first.")

pipeline = joblib.load(MODEL_PATH)
with open(META_PATH) as f:
    meta = json.load(f)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title="MisInfoX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174", 
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://misinfo-x-jade.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ── Pydantic Models ───────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    has_api_key: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class ApiKeyUpdate(BaseModel):
    api_key: str

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    verdict: str
    confidence: float
    highlights: list
    explanations: list
    propagation: dict
    sources: list
    model_accuracy: float

# ── Dependencies ──────────────────────────────────────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

# ── Auth Endpoints ────────────────────────────────────────────────────────────
@app.post("/api/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# ── User Endpoints ────────────────────────────────────────────────────────────
@app.get("/api/user/me", response_model=UserResponse)
def get_user_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "has_api_key": current_user.api_key is not None
    }

@app.post("/api/user/api-key")
def update_api_key(req: ApiKeyUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    clean_key = req.api_key.strip()
    if not clean_key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")
    
    current_user.api_key = encrypt_api_key(clean_key)
    db.commit()
    return {"message": "API key updated successfully"}

@app.delete("/api/user/api-key")
def remove_api_key(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    current_user.api_key = None
    db.commit()
    return {"message": "API key removed"}

@app.get("/api/user/history")
def get_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    analyses = db.query(models.Analysis).filter(models.Analysis.user_id == current_user.id).order_by(models.Analysis.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "text": a.claim[:120] + ("..." if len(a.claim) > 120 else ""),
            "verdict": a.verdict,
            "confidence": a.confidence_score,
            "ts": a.created_at.isoformat()
        } for a in analyses
    ]

# ── Analysis Endpoint ─────────────────────────────────────────────────────────
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.api_key:
        raise HTTPException(status_code=403, detail="Gemini API Key is required. Please set it in your profile.")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(text) > 10_000:
        raise HTTPException(status_code=400, detail="Text too long (max 10,000 characters)")

    # ── ML Predict ────────────────────────────────────────────────────────────
    proba  = pipeline.predict_proba([text])[0]
    classes = list(pipeline.classes_)
    pred_idx = int(np.argmax(proba))
    verdict  = classes[pred_idx]
    confidence = round(float(proba[pred_idx]) * 100, 1)

    # ── Highlights & Explanations ─────────────────────────────────────────────
    highlights = extract_highlights(text, verdict, pipeline)
    explanations = generate_explanations(verdict, confidence, highlights)

    # ── Gemini Fact Check ─────────────────────────────────────────────────────
    try:
        decrypted_key = decrypt_api_key(current_user.api_key)
        genai.configure(api_key=decrypted_key)
        
        # We use gemini-1.5-flash as it is fast and capable of JSON outputs
        model = genai.GenerativeModel(
            'gemini-1.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )
        prompt = (
            "You are a factual verification assistant. Evaluate the statement. "
            "Output ONLY valid JSON containing two keys: "
            "'fact' (string, either 'true', 'false', or 'uncertain') and "
            "'reason' (string, a short 1 sentence explanation of the facts).\n\n"
            f"Statement: {text}"
        )
        response = model.generate_content(prompt)
        response_json = json.loads(response.text)
        
        fact_status = response_json.get("fact", "uncertain").lower()
        reason = response_json.get("reason", "")
        
        # Override ML verdict with LLM logic
        if fact_status == "true":
            verdict = "Reliable"
            confidence = max(confidence, 90.0)
            explanations.insert(0, f"✅ Verified by Gemini: {reason}")
        elif fact_status == "false":
            verdict = "Misleading"
            confidence = max(confidence, 90.0)
            explanations.insert(0, f"❌ Debunked by Gemini: {reason}")
        else:
            explanations.insert(0, f"💡 Gemini Note: {reason}")

    except Exception as e:
        print(f"Gemini verification error: {e}")
        # Note: Depending on product spec, we might want to return an error 
        # to the user if the API key is invalid, instead of silent fail.
        # But for resilience we fallback to ML.

    # ── Propagation graph & Sources ───────────────────────────────────────────
    propagation = generate_propagation(verdict)
    sources = generate_sources(verdict)

    # ── Save Analysis to DB ───────────────────────────────────────────────────
    analysis_record = models.Analysis(
        user_id=current_user.id,
        claim=text,
        verdict=verdict,
        confidence_score=confidence,
        highlights=highlights,
        explanations=explanations,
        propagation=propagation,
        sources=sources
    )
    db.add(analysis_record)
    db.commit()

    return AnalyzeResponse(
        verdict=verdict,
        confidence=confidence,
        highlights=highlights,
        explanations=explanations,
        propagation=propagation,
        sources=sources,
        model_accuracy=meta["accuracy"],
    )

@app.get("/health")
def health():
    return {"status": "healthy"}
