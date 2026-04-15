"""
Admin API router.
Provides protected access to contact submissions.
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
import os
from ..database import get_db
from ..models import ContactSubmission

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Get admin token from environment (default for local dev)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "admin123")

def verify_admin_token(x_admin_token: str = Header(None)):
    """Dependency to verify the admin token in the header."""
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(
            status_code=401, 
            detail="Unauthorized: Missing or invalid Admin Token"
        )
    return x_admin_token

@router.get("/submissions")
def get_submissions(
    db: Session = Depends(get_db), 
    token: str = Depends(verify_admin_token),
    limit: int = 50, 
    offset: int = 0
):
    """
    Get all contact submissions. Protected by Admin Token.
    """
    submissions = (
        db.query(ContactSubmission)
        .order_by(ContactSubmission.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    total = db.query(ContactSubmission).count()

    return {
        "total": total,
        "data": [
            {
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "subject": s.subject,
                "improvements": s.improvements,
                "features": s.features,
                "experience": s.experience,
                "message": s.message,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in submissions
        ],
    }
