import os
import warnings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use Supabase PostgreSQL if provided, otherwise fallback to SQLite
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    warnings.warn(
        "WARNING: DATABASE_URL environment variable is not set. "
        "Falling back to local SQLite database (sqlite:///./local.db). "
        "Do not use this default in production!",
        UserWarning
    )
    DATABASE_URL = "sqlite:///./local.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
