from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.models.source import Source
from backend.app.schemas.source import SourceCreate

class SourceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: int) -> Optional[Source]:
        result = await self.db.execute(select(Source).filter(Source.id == id))
        return result.scalars().first()

    async def get_multi_by_session(self, session_id: int) -> List[Source]:
        result = await self.db.execute(
            select(Source).filter(Source.session_id == session_id)
        )
        return result.scalars().all()

    async def create(self, obj_in: SourceCreate) -> Source:
        db_obj = Source(**obj_in.model_dump())
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
