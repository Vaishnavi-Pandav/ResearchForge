"""Citations routes — currently handled via reports. Stub for future expansion."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_citations():
    """Citations are currently embedded in report responses."""
    return {"message": "Citations are available via GET /api/v1/reports/{id}"}
