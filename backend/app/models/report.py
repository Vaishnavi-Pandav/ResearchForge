import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(Text, nullable=True)
    executive_summary = Column(Text, nullable=True)
    full_content = Column(Text, nullable=True)  # Markdown
    citation_style = Column(String, default="APA")
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ResearchSession", back_populates="reports")
    user = relationship("User", back_populates="reports")
    citations = relationship("Citation", back_populates="report", cascade="all, delete-orphan")
