"""Source schemas."""
from datetime import datetime, date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class SourceResponse(BaseModel):
    id: UUID
    url: str
    title: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[date] = None
    domain: Optional[str] = None
    snippet: Optional[str] = None
    credibility_score: Optional[float] = None
    bias_risk: Optional[float] = None
    included: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}
