"""User repository — CRUD operations for the User model."""
from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.firebase_uid == firebase_uid)
        )
        return result.scalars().first()

    async def create_from_firebase(
        self, firebase_uid: str, email: str, display_name: str = ""
    ) -> User:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name or email.split("@")[0],
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
