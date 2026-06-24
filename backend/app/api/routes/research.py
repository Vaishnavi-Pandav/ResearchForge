"""Research routes — create sessions, list, get details, stream progress."""
import asyncio
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_current_user
from backend.app.core.rate_limit import limiter
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.research import (
    ResearchSessionCreate,
    ResearchSessionResponse,
    AnalyticsStatsResponse,
)
from backend.app.schemas.source import SourceResponse
from backend.app.services.research_service import ResearchService
from backend.app.workflows.research_graph import run_research_workflow

router = APIRouter()


@router.post("/", response_model=ResearchSessionResponse)
@limiter.limit("5/minute")
async def create_research_session(
    request: Request,
    data: ResearchSessionCreate,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new research session and start the 5-agent pipeline in background."""
    service = ResearchService(db)
    session = await service.create_session(user_id=user.id, data=data)

    # Launch the research workflow as a background task
    background_tasks.add_task(
        run_research_workflow,
        session_id=str(session.id),
        user_id=str(user.id),
        topic=data.topic,
        depth=data.depth,
        citation_style=data.citation_style,
    )

    return session


@router.get("/", response_model=List[ResearchSessionResponse])
async def list_research_sessions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all research sessions for the current user."""
    service = ResearchService(db)
    return await service.get_user_sessions(user.id)


@router.get("/analytics", response_model=AnalyticsStatsResponse)
async def get_analytics(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get analytics stats for the current user."""
    service = ResearchService(db)
    return await service.get_analytics(user.id)


@router.get("/{session_id}", response_model=ResearchSessionResponse)
async def get_research_session(
    session_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific research session with plan and agent statuses."""
    service = ResearchService(db)
    session = await service.get_session(session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Research session not found")
    return session


@router.get("/{session_id}/sources", response_model=List[SourceResponse])
async def get_session_sources(
    session_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all sources for a research session."""
    service = ResearchService(db)
    session = await service.get_session(session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Research session not found")
    return await service.get_session_sources(session_id)
