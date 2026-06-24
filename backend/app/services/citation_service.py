from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.repositories.citation_repository import CitationRepository
from backend.app.schemas.citation import CitationCreate, Citation

class CitationService:
    def __init__(self, db: AsyncSession):
        self.repository = CitationRepository(db)

    async def create_citation(self, citation_in: CitationCreate) -> Citation:
        return await self.repository.create(citation_in)

    async def get_source_citations(self, source_id: int) -> List[Citation]:
        return await self.repository.get_multi_by_source(source_id)
