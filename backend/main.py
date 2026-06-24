from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
import sys
import uuid
import time
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from backend.app.api.router import api_router
from backend.app.core.config import settings
from backend.app.core.rate_limit import limiter

# ── Logging Setup ─────────────────────────────────────────────────────────────
logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>", level="INFO")
logger.add("logs/researchforge.log", rotation="10 MB", retention="10 days", level="DEBUG")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} API")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# ── Rate Limiting Middleware ──────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Correlation ID & Structured Logging Middleware ────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    correlation_id = str(uuid.uuid4())
    start_time = time.time()
    
    with logger.contextualize(request_id=correlation_id):
        logger.info(f"Incoming Request: {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Process-Time"] = str(process_time)
        
        logger.info(f"Response: {response.status_code} | Process Time: {process_time:.4f}s")
        return response

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
@limiter.exempt
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "version": "1.0.0", "docs": "/docs"}
