# 🕵️‍♂️ TruthLens (MisInfoX) — Hybrid ML & LLM Fact Checker

TruthLens is a high-performance web application designed to detect and analyze misinformation in text statements. It combines a localized machine learning pipeline with Gemini's large language model capabilities to provide instant credibility verdicts, interactive confidence scores, highlight maps, and detail-rich propagation insights.

---

## 🚀 Key Features

* **Dual-Engine Verdicts**: Local Scikit-learn predictive modeling combined with real-time Gemini LLM corroboration.
* **API Key Self-Management**: Secure, client-controlled Gemini API key management (encrypted at rest).
* **Protected Dashboard**: Fully secure registration, login, and historical audit trail dashboard.
* **Propagation Maps & Sources**: High-fidelity visualization of potential information spread paths and context links.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS
* **Backend**: FastAPI, SQLAlchemy, Uvicorn, SQLite/PostgreSQL
* **AI/ML**: Scikit-learn, Google Gemini AI (via `google-generativeai`)

---

## ⚙️ Environment Configuration

Both the frontend and backend are configured to read from standard environment configurations to avoid hardcoding secrets.

### Backend Environment Variables (`backend/.env`)

Create a file named `.env` in the `backend/` directory based on `backend/.env.example`:

```env
# Database configuration
# - For local development, it defaults to SQLite (sqlite:///./local.db) if unset
# - For production, use a PostgreSQL database URL (e.g. Supabase, Render PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db.kslxpksclkrqinkuumji.supabase.co:5432/postgres

# Encryption key for securing user API keys (must be a base64-encoded 32-byte key)
# Generate one using: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FERNET_KEY=your-base64-32byte-fernet-key-here

# Secret key for signing JWT auth tokens
JWT_SECRET_KEY=your-secure-jwt-secret-key-here
```

> [!NOTE]
> If these environment variables are missing, the backend will gracefully fallback to ephemeral/local defaults (e.g., local SQLite and randomly generated keys) so the application does not crash, printing a warning to the console.

---

## 📦 Local Installation & Setup

### Prerequisites

* Node.js (v18 or higher)
* Python (3.9 to 3.12)

### 1. Run the Backend

Navigate to the `backend/` directory:

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Train the local ML prediction model (this creates the required `pipeline.joblib` file):

```bash
python train.py
```

Start the FastAPI dev server:

```bash
uvicorn app:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000/docs`.

### 2. Run the Frontend

From the root directory, install npm packages:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

The application will be running at `http://localhost:5173/`.

---

## 🌐 Production Deployment Guide

### Backend Deployment (e.g., Render / Railway / Heroku)

1. Connect your GitHub repository to your host (e.g., Render Web Services).
2. Configure the **Build Command**:
   ```bash
   pip install -r backend/requirements.txt && python backend/train.py
   ```
3. Configure the **Start Command**:
   ```bash
   cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
4. Define the Environment Variables in the service settings:
   - `DATABASE_URL` (Your production PostgreSQL connection string)
   - `FERNET_KEY` (Your 32-byte base64 key)
   - `JWT_SECRET_KEY` (Your secure JWT secret key)

### Frontend Deployment (e.g., Vercel / Netlify)

1. Connect your repository to Vercel.
2. The framework preset should automatically detect **Vite**.
3. Set the build parameters:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. If you have a custom domain/production URL for your backend, you can specify it in your build configuration or API service config.

---

## 🔒 Security Policy

* **No Hardcoded Secrets**: All backend credentials (database URLs, signing secrets, encryption keys) are loaded from environment variables.
* **Encrypted API Keys**: Users' personal Gemini API keys are encrypted at rest using Fernet symmetric encryption before being saved in the database.
* **Security Scans**: The repository is pre-configured to pass GitHub Secret Scanning without flagging false positives.
