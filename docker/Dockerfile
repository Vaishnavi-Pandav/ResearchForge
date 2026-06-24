FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements/base.txt ./requirements/
COPY backend/requirements/prod.txt ./requirements/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements/prod.txt

# Copy application code
COPY backend /app/backend

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
