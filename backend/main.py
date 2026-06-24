from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger

from backend.app.api.router import api_router
from backend.app.core.config import settings


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

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "version": "1.0.0", "docs": "/docs"}
