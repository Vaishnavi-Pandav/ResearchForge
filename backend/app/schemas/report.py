"""Report schemas."""
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

from backend.app.schemas.source import SourceResponse
from backend.app.schemas.citation import CitationResponse


class ReportResponse(BaseModel):
    id: UUID
    session_id: UUID
    title: Optional[str] = None
    executive_summary: Optional[str] = None
    full_content: Optional[str] = None
    citation_style: str = "APA"
    word_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportDetailResponse(ReportResponse):
    citations: List[CitationResponse] = []
    sources: List[SourceResponse] = []

    model_config = {"from_attributes": True, "frozen": False}
