"""Research service — orchestrates research creation and agent execution."""
import asyncio
from uuid import UUID
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.repositories.research_repository import ResearchRepository
from backend.app.repositories.report_repository import ReportRepository
from backend.app.schemas.research import ResearchSessionCreate


class ResearchService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ResearchRepository(db)
        self.report_repo = ReportRepository(db)

    async def create_session(self, user_id: UUID, data: ResearchSessionCreate):
        session = await self.repo.create_session(
            user_id=user_id,
            topic=data.topic,
            depth=data.depth,
            citation_style=data.citation_style,
        )
        logger.info(f"Created research session {session.id} for user {user_id}")
        return session

    async def get_session(self, session_id: UUID):
        return await self.repo.get_session(session_id)

    async def get_user_sessions(self, user_id: UUID):
        return await self.repo.get_user_sessions(user_id)

    async def get_session_sources(self, session_id: UUID):
        return await self.repo.get_session_sources(session_id)

    async def get_analytics(self, user_id: UUID):
        total_sessions = await self.repo.count_user_sessions(user_id)
        total_reports = await self.report_repo.count_user_reports(user_id)
        total_sources = await self.repo.count_user_sources(user_id)
        avg_cred = await self.repo.avg_credibility(user_id)
        completed = len([
            s for s in await self.repo.get_user_sessions(user_id) if s.status == "completed"
        ])
        rate = (completed / total_sessions * 100) if total_sessions > 0 else 0

        return {
            "total_sessions": total_sessions,
            "total_reports": total_reports,
            "total_sources": total_sources,
            "avg_credibility": avg_cred,
            "sessions_this_week": 0,  # TODO: filter by date
            "completion_rate": round(rate, 1),
        }
