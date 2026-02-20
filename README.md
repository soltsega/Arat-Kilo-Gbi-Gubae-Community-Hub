# Arat Kilo Gibi Gubae - Quiz Mastery System

## Project Overview
The Arat Kilo Gibi Gubae Quiz Mastery System is a modern, responsive multi-page dashboard designed to facilitate academic excellence and spiritual wisdom. It tracks participant progress via automated Telegram quiz rankings and provides a centralized hub for leaderboards, academic resources, spiritual materials (Gospel summaries), and community links.

The system is optimized for both desktop and mobile use, featuring PWA-like capabilities for a "native app" feel when saved to a home screen.

## Key Features
- **Cumulative Leaderboard**: Automated ranking system based on a sophisticated 50/25/25 weighted scoring model.
- **Multi-Page Dashboard**:
  - **Results**: Real-time searchable leaderboard with a podium for top performers.
  - **Resources**: Dedicated tabs for Academic Support (Engineering/Science) and Spiritual Resources (Gospel of Mark summaries).
  - **Links**: Comprehensive portal for local community Telegram channels and wider EOTC resources.
- **Click-to-Reveal Remarks**: Hidden spiritual and humorous feedback based on performance (እግዚአብሔር ያክብራችሁ vs. Warning vs. Rebuking).
- **Backend API**: FastAPI-powered backend for efficient data processing and JSON delivery.
- **Docker Ready**: Fully containerized with Nginx reverse proxy and Redis support for production scalability.
- **Progressive UI**: Mobile-optimized design with Ethiopian language (Ge'ez/Amharic) font support.

## Technology Stack
- **Frontend**: HTML5, Vanilla CSS3 (Grid/Flexbox), JavaScript (ES6+)
- **Backend API**: Python 3.11+, FastAPI, Uvicorn
- **Data Science**: Pandas, NumPy
- **Deployment**: Docker, Docker Compose, Nginx
- **Security**: Non-root Docker execution, CORS middleware, PWA manifest configurations

## Project Structure
```
cumulative-Rank/
├── assets/                 # Frontend static assets
│   ├── css/               # Modular styling (style.css v3.0)
│   ├── img/               # Brand assets, icons, and logo
│   └── js/                # Performance-optimized client logic
├── data/                  # Data persistence layer
│   ├── quizRankData.txt   # Raw Telegram quiz data
│   └── cumulative_leaderboard.csv  # Processed rankings (cached)
├── docs/                  # Documentation and automated reports
│   └── CumulativeLeaderboard.md  # Generated markdown report
├── scripts/               # Application logic layer
│   ├── main.py           # FastAPI production server
│   ├── generate_rankings.py  # Ranking & Report generator
│   ├── clean_data.py     # Data normalization utilities
│   └── data_validator.py  # Input integrity checks
├── Dockerfile             # Production container specification
├── docker-compose.yml     # Multi-container orchestration
├── DEPLOYMENT.md          # Comprehensive deployment guide
├── index.html             # Main landing page
├── results.html           # Interactive leaderboard
├── resources.html         # Educational/Spiritual hub
├── links.html             # Community links portal
├── requirements.txt       # Python dependency manifest
└── README.md             # This file
```

## Detailed Scoring Logic
The system uses a weighted formula to ensure fairness and reward consistency:

1.  **50% Participation**: `(User Quizzes / Max Quizzes) * 50`
2.  **25% Accuracy**: `(User Avg Score / Max Avg Score) * 25`
3.  **25% Speed**:
    - **25 points** if average response time is ≤ 50 seconds.
    - `(50 / Avg Time) * 25` if average time > 50 seconds.

**Tie-Breaking Priority**:
1. Accuracy (Avg Points)
2. Speed (Avg Time)
3. Total Participation
4. Random Seed (for absolute ties)

## Installation and Setup

### Local Development
1. **Clone and Enter**:
   ```bash
   git clone <repository-url>
   cd cumulative-Rank
   ```
2. **Environment Setup**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
3. **Generate Rankings**:
   ```bash
   python scripts/generate_rankings.py
   ```
4. **Run Server**:
   ```bash
   python scripts/main.py
   ```

### Docker Deployment (Recommended for Production)
```bash
docker-compose up -d
```
Access the dashboard at `http://localhost`. The API runs on port `8000` behind an Nginx proxy.

## API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **Leaderboard JSON**: `http://localhost:8000/leaderboard`

## Maintenance
Developed and maintained by **Solomon Tsega**.
- **Role**: Computer Science Student, AAU
- **Contact**: tsegasolomon538@gmail.com
- **LinkedIn**: [linkedin.com/in/solomontsega](https://linkedin.com/in/solomontsega)

## License
All rights reserved. Arat Kilo Gibi Gubae 2026.
