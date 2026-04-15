"""
Leaderboard API router.
Reads CSV files from data/processed/ and returns JSON.
"""
from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

# Path to data directory (relative to project root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")

# Mapping of tab keys to CSV filenames
LEADERBOARD_MAP = {
    "romans_corinthians_cumulative": "Romans_Corinthians_Cumulative.csv",
    "2corinthians": "SecondCorinthians_Leaderboard.csv",
    "1corinthians": "FirstCorintians_Leaderboard.csv",
    "romans": "Romans_Leaderboard.csv",
    "acts": "ACTS_Leaderboard.csv",
    "cumulative": "AllGospels_Leaderboard.csv",
    "john": "John_Leaderboard.csv",
    "luke": "Luke_Leaderboard.csv",
    "mark": "Mark_Leaderboard.csv",
}

# Tab metadata for the frontend
TABS = [
    {"key": "romans_corinthians_cumulative", "label": "ሮሜ - ፪ኛ ቆሮንቶስ", "icon": "Saint_Paul.png"},
    {"key": "2corinthians", "label": "፪ኛ ቆሮንቶስ", "icon": "Saint_Paul.png"},
    {"key": "1corinthians", "label": "፩ኛ ቆሮንቶስ", "icon": "Saint_Paul.png"},
    {"key": "romans", "label": "ወደ ሮሜ ሰዎች", "icon": "Saint_Paul.png"},
    {"key": "acts", "label": "ግብረ ሐዋርያት", "icon": "Acts.png"},
    {"key": "cumulative", "label": "አጠቃላይ - የ፬ቱ ወንጌላት", "icon": "All_Gospels.png"},
    {"key": "john", "label": "የቅዱስ ዮሐንስ ወንጌል", "icon": "Saint_John.png"},
    {"key": "luke", "label": "የቅዱስ ሉቃስ ወንጌል", "icon": "Saint_luke.png"},
    {"key": "mark", "label": "የቅዱስ ማርቆስ ወንጌል", "icon": "Saint_Mark.png"},
]


@router.get("/tabs")
def get_leaderboard_tabs():
    """Return list of available leaderboard tabs with metadata."""
    return TABS


@router.get("/{book}")
def get_leaderboard(book: str):
    """
    Get leaderboard data for a specific book/category.
    Returns parsed CSV as a list of JSON objects.
    """
    if book not in LEADERBOARD_MAP:
        raise HTTPException(status_code=404, detail=f"Leaderboard '{book}' not found. Available: {list(LEADERBOARD_MAP.keys())}")

    csv_path = os.path.join(DATA_DIR, LEADERBOARD_MAP[book])

    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail=f"CSV file not found: {LEADERBOARD_MAP[book]}")

    try:
        df = pd.read_csv(csv_path)

        # Standardize column names (strip whitespace)
        df.columns = df.columns.str.strip()

        # Filter out rows without Username or Rank
        df = df.dropna(subset=["Username", "Rank"])

        # Convert to list of dicts
        records = df.to_dict(orient="records")

        # Clean up numeric fields
        for record in records:
            for key in ["Final_Score", "Avg_Points", "Avg_Time"]:
                if key in record:
                    try:
                        record[key] = round(float(record[key]), 2)
                    except (ValueError, TypeError):
                        record[key] = 0.0
            if "Rank" in record:
                try:
                    record["Rank"] = int(record["Rank"])
                except (ValueError, TypeError):
                    pass
            if "Quizzes_Participated" in record:
                try:
                    record["Quizzes_Participated"] = int(record["Quizzes_Participated"])
                except (ValueError, TypeError):
                    pass

        return {"book": book, "count": len(records), "data": records}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading leaderboard data: {str(e)}")
