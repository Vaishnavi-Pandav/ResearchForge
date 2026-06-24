"""Research repository — CRUD for sessions, plans, sources, agent logs."""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload

from backend.app.models.research_session import ResearchSession
from backend.app.models.research_plan import ResearchPlan
from backend.app.models.source import Source
from backend.app.models.agent_log import AgentLog


class ResearchRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ── Sessions ────────────────────────────────────────────────────
    async def create_session(
        self, user_id: UUID, topic: str, depth: str, citation_style: str
    ) -> ResearchSession:
        session = ResearchSession(
            user_id=user_id,
            topic=topic,
            depth=depth,
            citation_style=citation_style,
            status="pending",
            agent_statuses={},
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session(self, session_id: UUID) -> Optional[ResearchSession]:
        result = await self.db.execute(
            select(ResearchSession)
            .options(selectinload(ResearchSession.plan))
            .options(selectinload(ResearchSession.sources))
            .where(ResearchSession.id == session_id)
        )
        return result.scalars().first()

    async def get_user_sessions(self, user_id: UUID) -> List[ResearchSession]:
        result = await self.db.execute(
            select(ResearchSession)
            .where(ResearchSession.user_id == user_id)
            .order_by(ResearchSession.created_at.desc())
        )
        return list(result.scalars().all())

    async def update_session_status(
        self, session_id: UUID, status: str, agent_statuses: dict = None, error: str = None
    ):
        values = {"status": status}
        if agent_statuses is not None:
            values["agent_statuses"] = agent_statuses
        if error is not None:
            values["error_message"] = error
        if status == "completed":
            values["completed_at"] = func.now()
        await self.db.execute(
            update(ResearchSession).where(ResearchSession.id == session_id).values(**values)
        )
        await self.db.commit()

    # ── Plans ───────────────────────────────────────────────────────
    async def create_plan(
        self, session_id: UUID, objectives: list, subtopics: list, search_queries: list
    ) -> ResearchPlan:
        plan = ResearchPlan(
            session_id=session_id,
            objectives=objectives,
            subtopics=subtopics,
            search_queries=search_queries,
        )
        self.db.add(plan)
        await self.db.commit()
        await self.db.refresh(plan)
        return plan

    # ── Sources ─────────────────────────────────────────────────────
    async def add_sources(self, session_id: UUID, sources_data: List[dict]) -> List[Source]:
        sources = []
        for s in sources_data:
            source = Source(session_id=session_id, **s)
            self.db.add(source)
            sources.append(source)
        await self.db.commit()
        for s in sources:
            await self.db.refresh(s)
        return sources

    async def get_session_sources(self, session_id: UUID) -> List[Source]:
        result = await self.db.execute(
            select(Source).where(Source.session_id == session_id).order_by(Source.credibility_score.desc().nullslast())
        )
        return list(result.scalars().all())

    async def update_source_scores(self, source_id: UUID, score: float, bias: float):
        await self.db.execute(
            update(Source)
            .where(Source.id == source_id)
            .values(credibility_score=score, bias_risk=bias)
        )
        await self.db.commit()

    # ── Agent Logs ──────────────────────────────────────────────────
    async def add_agent_log(
        self, session_id: UUID, agent_name: str, event: str, message: str = "", metadata: dict = None
    ) -> AgentLog:
        log = AgentLog(
            session_id=session_id,
            agent_name=agent_name,
            event=event,
            message=message,
            metadata_=metadata or {},
        )
        self.db.add(log)
        await self.db.commit()
        return log

    # ── Stats ───────────────────────────────────────────────────────
    async def count_user_sessions(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(ResearchSession).where(ResearchSession.user_id == user_id)
        )
        return result.scalar() or 0

    async def count_user_sources(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(func.count())
            .select_from(Source)
            .join(ResearchSession)
            .where(ResearchSession.user_id == user_id)
        )
        return result.scalar() or 0

    async def avg_credibility(self, user_id: UUID) -> float:
        result = await self.db.execute(
            select(func.avg(Source.credibility_score))
            .join(ResearchSession)
            .where(ResearchSession.user_id == user_id)
            .where(Source.credibility_score.isnot(None))
        )
        return round(result.scalar() or 0.0, 1)
