"""Auth routes — verify Firebase token, get current user."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.schemas.auth import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return user
