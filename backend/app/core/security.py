"""get_current_user FastAPI dependency — resolves Firebase token to DB user."""
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status

from backend.app.core.firebase_auth import verify_firebase_token
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.repositories.user_repository import UserRepository


async def get_current_user(
    token_data: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Resolves the Firebase token to a User DB record.
    Auto-creates the user record on first login (upsert by firebase_uid).
    """
    repo = UserRepository(db)
    firebase_uid = token_data.get("uid")
    email = token_data.get("email", "")
    display_name = token_data.get("name", token_data.get("display_name", ""))

    user = await repo.get_by_firebase_uid(firebase_uid)
    if not user:
        # Auto-register user on first authenticated request
        user = await repo.create_from_firebase(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
        )

    return user
