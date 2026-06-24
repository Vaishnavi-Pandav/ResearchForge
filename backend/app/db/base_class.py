import uuid
from typing import Any
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID


class Base(DeclarativeBase):
    id: Any

    @declared_attr.directive
    def __tablename__(cls) -> str:
        # Convert CamelCase to snake_case
        import re
        name = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()
        return name

    def to_dict(self) -> dict:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
