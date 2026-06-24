"""Auth schemas — user responses and token verification."""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: UUID
    firebase_uid: str
    email: str
    display_name: Optional[str] = None
    plan: str = "free"
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenVerifyRequest(BaseModel):
    firebase_token: str
