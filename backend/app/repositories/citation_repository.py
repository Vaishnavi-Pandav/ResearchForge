from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.models.citation import Citation
from backend.app.schemas.citation import CitationCreate

class CitationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: int) -> Optional[Citation]:
        result = await self.db.execute(select(Citation).filter(Citation.id == id))
        return result.scalars().first()

    async def get_multi_by_source(self, source_id: int) -> List[Citation]:
        result = await self.db.execute(
            select(Citation).filter(Citation.source_id == source_id)
        )
        return result.scalars().all()

    async def create(self, obj_in: CitationCreate) -> Citation:
        db_obj = Citation(**obj_in.model_dump())
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
