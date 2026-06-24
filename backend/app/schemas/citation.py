"""Citation schemas."""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class CitationResponse(BaseModel):
    id: UUID
    source_id: Optional[UUID] = None
    apa: Optional[str] = None
    mla: Optional[str] = None
    chicago: Optional[str] = None
    harvard: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
