"""Report repository."""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from backend.app.models.report import Report
from backend.app.models.citation import Citation


class ReportRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_report(
        self,
        session_id: UUID,
        user_id: UUID,
        title: str,
        executive_summary: str,
        full_content: str,
        citation_style: str,
    ) -> Report:
        word_count = len(full_content.split()) if full_content else 0
        report = Report(
            session_id=session_id,
            user_id=user_id,
            title=title,
            executive_summary=executive_summary,
            full_content=full_content,
            citation_style=citation_style,
            word_count=word_count,
        )
        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)
        return report

    async def get_report(self, report_id: UUID) -> Optional[Report]:
        result = await self.db.execute(
            select(Report)
            .options(selectinload(Report.citations))
            .where(Report.id == report_id)
        )
        return result.scalars().first()

    async def get_user_reports(self, user_id: UUID) -> List[Report]:
        result = await self.db.execute(
            select(Report)
            .where(Report.user_id == user_id)
            .order_by(Report.created_at.desc())
        )
        return list(result.scalars().all())

    async def count_user_reports(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(Report).where(Report.user_id == user_id)
        )
        return result.scalar() or 0

    async def add_citations(self, report_id: UUID, citations_data: List[dict]) -> List[Citation]:
        citations = []
        for c in citations_data:
            citation = Citation(report_id=report_id, **c)
            self.db.add(citation)
            citations.append(citation)
        await self.db.commit()
        return citations

    async def delete_report(self, report_id: UUID):
        report = await self.get_report(report_id)
        if report:
            await self.db.delete(report)
            await self.db.commit()
