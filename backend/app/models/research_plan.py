import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class ResearchPlan(Base):
    __tablename__ = "research_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    objectives = Column(ARRAY(Text), default=list)
    subtopics = Column(ARRAY(Text), default=list)
    search_queries = Column(ARRAY(Text), default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ResearchSession", back_populates="plan")
