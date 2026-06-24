"""Report routes — list, get, delete reports."""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.report import ReportResponse, ReportDetailResponse
from backend.app.services.report_service import ReportService

router = APIRouter()


@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all reports for the current user."""
    service = ReportService(db)
    return await service.get_user_reports(user.id)


@router.get("/{report_id}", response_model=ReportDetailResponse)
async def get_report(
    report_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific report with citations and sources."""
    service = ReportService(db)
    report = await service.get_report(report_id)
    if not report or report.user_id != user.id:
        raise HTTPException(status_code=404, detail="Report not found")

    # Get sources for the session
    from backend.app.services.research_service import ResearchService
    research_service = ResearchService(db)
    sources = await research_service.get_session_sources(report.session_id)

    detail = ReportDetailResponse.model_validate(report)
    detail.citations = list(report.citations) if report.citations else []
    detail.sources = sources
    return detail


@router.delete("/{report_id}")
async def delete_report(
    report_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a report."""
    service = ReportService(db)
    report = await service.get_report(report_id)
    if not report or report.user_id != user.id:
        raise HTTPException(status_code=404, detail="Report not found")
    await service.delete_report(report_id)
    return {"deleted": True}
