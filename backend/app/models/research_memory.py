import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class ResearchMemory(Base):
    __tablename__ = "research_memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    chroma_id = Column(String, nullable=True)  # ID in ChromaDB
    content = Column(Text, nullable=False)
    content_type = Column(String, default="finding")  # finding | summary | source
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ResearchSession", back_populates="memories")
    user = relationship("User", back_populates="memories")
