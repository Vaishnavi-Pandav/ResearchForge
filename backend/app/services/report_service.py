"""Report service."""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.repositories.report_repository import ReportRepository


class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ReportRepository(db)

    async def get_user_reports(self, user_id: UUID):
        return await self.repo.get_user_reports(user_id)

    async def get_report(self, report_id: UUID):
        return await self.repo.get_report(report_id)

    async def delete_report(self, report_id: UUID):
        await self.repo.delete_report(report_id)
