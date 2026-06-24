import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class ResearchSession(Base):
    __tablename__ = "research_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic = Column(Text, nullable=False)
    depth = Column(String, default="standard")  # quick | standard | deep | exhaustive
    citation_style = Column(String, default="APA")  # APA | MLA | Chicago | Harvard
    status = Column(String, default="pending", index=True)
    # pending | planning | searching | scoring | synthesizing | formatting | completed | failed
    agent_statuses = Column(JSONB, default=dict)  # {planner: "done", searcher: "running", ...}
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="research_sessions")
    plan = relationship("ResearchPlan", back_populates="session", uselist=False, cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="session", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="session", cascade="all, delete-orphan")
    memories = relationship("ResearchMemory", back_populates="session", cascade="all, delete-orphan")
    agent_logs = relationship("AgentLog", back_populates="session", cascade="all, delete-orphan")
