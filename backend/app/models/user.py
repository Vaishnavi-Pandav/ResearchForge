import uuid
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    firebase_uid = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    display_name = Column(String, nullable=True)
    plan = Column(String, default="free")  # free | pro | enterprise
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    research_sessions = relationship("ResearchSession", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("ResearchMemory", back_populates="user", cascade="all, delete-orphan")
