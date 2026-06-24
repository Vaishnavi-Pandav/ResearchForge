import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class Citation(Base):
    __tablename__ = "citations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    source_id = Column(UUID(as_uuid=True), ForeignKey("sources.id", ondelete="SET NULL"), nullable=True)
    apa = Column(Text, nullable=True)
    mla = Column(Text, nullable=True)
    chicago = Column(Text, nullable=True)
    harvard = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("Report", back_populates="citations")
    source = relationship("Source", back_populates="citations")
