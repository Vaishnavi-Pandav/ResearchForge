"""Research workflow state for LangGraph."""
from typing import Annotated, List, Dict, Optional
from typing_extensions import TypedDict
from uuid import UUID


class SourceDoc(TypedDict, total=False):
    url: str
    title: str
    snippet: str
    domain: str
    author: str
    published_date: str
    credibility_score: float
    bias_risk: float
    id: str  # DB UUID after persistence


class ResearchState(TypedDict, total=False):
    # Input
    session_id: str
    user_id: str
    topic: str
    depth: str
    citation_style: str

    # Planner output
    objectives: List[str]
    subtopics: List[str]
    search_queries: List[str]

    # Searcher output
    raw_sources: List[Dict]

    # Credibility output
    scored_sources: List[Dict]

    # Synthesizer output
    report_title: str
    executive_summary: str
    full_report_md: str

    # Citation output
    citations: List[Dict]

    # Meta
    current_agent: str
    agent_statuses: Dict[str, str]
    errors: List[str]
