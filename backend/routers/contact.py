"""
Contact form API router.
Stores submissions in SQLite database.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import ContactSubmission

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactForm(BaseModel):
    """Pydantic model for contact form validation."""
    name: str
    email: str
    subject: Optional[str] = None
    improvements: Optional[str] = None
    features: Optional[str] = None
    experience: Optional[str] = None
    message: Optional[str] = None


class ContactResponse(BaseModel):
    """Response after successful submission."""
    result: str
    message: str
    id: int


@router.post("/", response_model=ContactResponse)
def submit_contact(form: ContactForm, db: Session = Depends(get_db)):
    """
    Submit a contact/feedback form.
    Stores the submission in the SQLite database.
    """
    try:
        submission = ContactSubmission(
            name=form.name,
            email=form.email,
            subject=form.subject,
            improvements=form.improvements,
            features=form.features,
            experience=form.experience,
            message=form.message,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        return ContactResponse(
            result="success",
            message="Thank you for your feedback! Your submission has been recorded.",
            id=submission.id,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save submission: {str(e)}")


@router.get("/submissions")
def get_submissions(db: Session = Depends(get_db), limit: int = 50, offset: int = 0):
    """
    Get all contact submissions (admin use).
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
