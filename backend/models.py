"""
SQLAlchemy models for the application.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class ContactSubmission(Base):
    """Stores feedback form submissions from the Contact Us page."""
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=True)
    improvements = Column(Text, nullable=True)
    features = Column(Text, nullable=True)
    experience = Column(String(50), nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<ContactSubmission(id={self.id}, name='{self.name}', email='{self.email}')>"
