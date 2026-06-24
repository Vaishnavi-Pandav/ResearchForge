import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_name = Column(String, nullable=False)  # planner | searcher | credibility | synthesizer | citation
    event = Column(String, nullable=False)        # started | completed | failed | progress
    message = Column(Text, nullable=True)
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ResearchSession", back_populates="agent_logs")
