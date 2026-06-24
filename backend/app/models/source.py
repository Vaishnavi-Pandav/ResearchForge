import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class Source(Base):
    __tablename__ = "sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(Text, nullable=False)
    title = Column(Text, nullable=True)
    author = Column(String(512), nullable=True)
    published_date = Column(Date, nullable=True)
    domain = Column(String(255), nullable=True)
    snippet = Column(Text, nullable=True)
    full_content = Column(Text, nullable=True)
    credibility_score = Column(Float, nullable=True)  # 0.0 - 10.0
    bias_risk = Column(Float, nullable=True)           # 0.0 - 1.0
    included = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ResearchSession", back_populates="sources")
    citations = relationship("Citation", back_populates="source", cascade="all, delete-orphan")
