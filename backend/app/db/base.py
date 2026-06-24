from backend.app.db.base_class import Base  # noqa: F401

# Import all models here so Alembic can detect them for migrations
from backend.app.models.user import User  # noqa: F401
from backend.app.models.research_session import ResearchSession  # noqa: F401
from backend.app.models.research_plan import ResearchPlan  # noqa: F401
from backend.app.models.source import Source  # noqa: F401
from backend.app.models.report import Report  # noqa: F401
from backend.app.models.citation import Citation  # noqa: F401
from backend.app.models.research_memory import ResearchMemory  # noqa: F401
from backend.app.models.agent_log import AgentLog  # noqa: F401
