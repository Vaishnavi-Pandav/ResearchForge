from fastapi import APIRouter
from backend.app.api.routes import auth, research, reports, citations, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(citations.router, prefix="/citations", tags=["citations"])
