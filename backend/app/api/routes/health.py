"""Health check route."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ResearchForge API", "version": "1.0.0"}
