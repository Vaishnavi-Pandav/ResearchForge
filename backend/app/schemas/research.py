"""Research schemas — session create/response, plan, analytics."""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ResearchSessionCreate(BaseModel):
    topic: str = Field(..., min_length=5, max_length=2000, description="The research topic or question")
    depth: str = Field("standard", pattern=r"^(quick|standard|deep|exhaustive)$")
    citation_style: str = Field("APA", pattern=r"^(APA|MLA|Chicago|Harvard)$")


class ResearchPlanResponse(BaseModel):
    id: UUID
    objectives: List[str] = []
    subtopics: List[str] = []
    search_queries: List[str] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class ResearchSessionResponse(BaseModel):
    id: UUID
    topic: str
    depth: str
    citation_style: str
    status: str
    agent_statuses: Dict[str, str] = {}
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    plan: Optional[ResearchPlanResponse] = None

    model_config = {"from_attributes": True}


class ResearchSessionListItem(BaseModel):
    id: UUID
    topic: str
    depth: str
    citation_style: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    source_count: int = 0

    model_config = {"from_attributes": True}


class AnalyticsStatsResponse(BaseModel):
    total_sessions: int = 0
    total_reports: int = 0
    total_sources: int = 0
    avg_credibility: float = 0.0
    sessions_this_week: int = 0
    completion_rate: float = 0.0
