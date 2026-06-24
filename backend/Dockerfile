# ── Base Image ──────────────────────────────────────────────────────────────────
FROM python:3.11-slim as base
WORKDIR /app

# Set env vars
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ── Dependencies ──────────────────────────────────────────────────────────────
FROM base as builder
COPY requirements/base.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r base.txt

# ── Final Image ───────────────────────────────────────────────────────────────
FROM base
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/base.txt .

RUN pip install --default-timeout=1000 --no-cache /wheels/*

# Copy app code
COPY ./app /app/backend/app
COPY ./main.py /app/backend/main.py
COPY ./alembic.ini /app/

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
