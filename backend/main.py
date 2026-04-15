"""
Arat Kilo Gibi Gubae — FastAPI Backend
Main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .database import init_db
from .routers import leaderboard, contact, resources, links

# Initialize FastAPI app
app = FastAPI(
    title="Arat Kilo Gibi Gubae API",
    description="Backend API for the Arat Kilo Gibi Gubae community website",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alternate dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leaderboard.router)
app.include_router(contact.router)
app.include_router(resources.router)
app.include_router(links.router)

# Serve static images from the data directory (saint icons)
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
if os.path.exists(DATA_DIR):
    app.mount("/static/data", StaticFiles(directory=DATA_DIR), name="data-static")

# Serve static images from assets/img (gallery, logo)
ASSETS_IMG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")
if os.path.exists(ASSETS_IMG_DIR):
    app.mount("/static/img", StaticFiles(directory=ASSETS_IMG_DIR), name="img-static")


@app.on_event("startup")
def on_startup():
    """Initialize database on startup."""
    init_db()


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "Arat Kilo Gibi Gubae API"}
