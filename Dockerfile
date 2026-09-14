# Dockerfile for Arat Kilo Gibi Gubae API Backend
FROM python:3.11-slim

LABEL maintainer="Solomon Tsega <tsegasolomon538@gmail.com>"
LABEL description="Arat Kilo Gibi Gubae Community Hub API Backend"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements first for optimized caching
COPY requirements.txt /app/requirements.txt

# Upgrade pip and install dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . /app

# Ensure standard data and log folders exist with correct permissions
RUN mkdir -p /app/backend /app/data /app/docs /app/logs \
    && chmod -R 777 /app/backend /app/data /app/docs /app/logs

# Expose FastAPI default port
EXPOSE 8000

# Set Python environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO
ENV API_HOST=0.0.0.0
ENV API_PORT=8000

# Health check to ensure API is responsive
HEALTHCHECK --interval=15s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start the FastAPI application with Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
