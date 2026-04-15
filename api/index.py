"""
Vercel Function entry point.
This file is required for Vercel to correctly identify and serve the FastAPI application.
"""
from backend.main import app

# Vercel's Python runtime will find 'app' automatically
