from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "ResearchForge"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    SECRET_KEY: str = "change-me"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5174"]

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "researchforge"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        )

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # FREE LLM: Google Gemini 1.5 Flash (15 RPM free tier)
    GOOGLE_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # FREE Embeddings: sentence-transformers (local, no API key)
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001
    CHROMA_COLLECTION: str = "researchforge_memory"

    # Firebase Admin SDK
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "./firebase-service-account.json"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
