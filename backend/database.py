"""
SQLAlchemy database configuration for SQLite.
Stores contact form submissions.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# Database configuration
# Vercel provides POSTGRES_URL. Locally we use SQLite.
DATABASE_URL = os.getenv("POSTGRES_URL")

if DATABASE_URL:
    # Vercel Postgres URL often starts with postgres://, but SQLAlchemy needs postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    # Convert pooled URL to standard if needed (Vercel specific)
    DATABASE_URL = DATABASE_URL.replace("?sslmode=require", "") # Simplification for SQLAlchemy
    engine = create_engine(DATABASE_URL)
    # No check_same_thread for postgres
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    # Fallback to local SQLite
    DB_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASE_URL = f"sqlite:///{os.path.join(DB_DIR, 'database.db')}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
