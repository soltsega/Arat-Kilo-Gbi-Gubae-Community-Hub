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
    email: EmailStr
    subject: Optional[str] = None
    improvements: Optional[str] = None
    features: Optional[str] = None
    experience: Optional[str] = None
    message: Optional[str] = None
    # Hidden field to catch bots. If filled, we discard the message.
    honeypot: Optional[str] = None


class ContactResponse(BaseModel):
    """Response after successful submission."""
    result: str
    message: str
    id: int


@router.post("/", response_model=ContactResponse)
def submit_contact(form: ContactForm, db: Session = Depends(get_db)):
    """
    Submit a contact/feedback form.
    Stores the submission in the database.
    Includes honeypot check for spam mitigation.
    """
    print(f"DEBUG: Received contact form from {form.email}")
    # Honeypot check: Bots usually fill all fields
    if form.honeypot:
        # Return success to trick the bot, but don't save anything.
        return ContactResponse(
            result="success",
            message="Thank you for your feedback!",
            id=0
        )

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


# Submissions moved to protected /api/admin/submissions endpoint
