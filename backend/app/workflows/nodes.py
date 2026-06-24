"""LangGraph nodes — each node wraps an agent and updates state."""
from loguru import logger
from backend.app.workflows.state import ResearchState
from backend.app.agents.planner.planner_agent import PlannerAgent
from backend.app.agents.searcher.searcher_agent import SearcherAgent
from backend.app.agents.credibility.credibility_agent import CredibilityAgent
from backend.app.agents.synthesizer.synthesizer_agent import SynthesizerAgent
from backend.app.agents.citation.citation_agent import CitationAgent


async def planner_node(state: ResearchState) -> dict:
    """Node 1: Query Planner — generates objectives, subtopics, search queries."""
    logger.info(f"[Planner] Starting for topic: {state['topic']}")
    agent = PlannerAgent()
    plan = await agent.create_plan(state["topic"], state.get("depth", "standard"))

    statuses = dict(state.get("agent_statuses", {}))
    statuses["planner"] = "done"
    statuses["searcher"] = "running"

    return {
        "objectives": plan.get("objectives", []),
        "subtopics": plan.get("subtopics", []),
        "search_queries": plan.get("search_queries", []),
        "current_agent": "searcher",
        "agent_statuses": statuses,
    }


async def searcher_node(state: ResearchState) -> dict:
    """Node 2: Web Searcher — searches DuckDuckGo for sources."""
    logger.info(f"[Searcher] Executing {len(state.get('search_queries', []))} queries")
    agent = SearcherAgent()
    sources = await agent.search(
        state.get("search_queries", [state["topic"]]),
        state.get("depth", "standard"),
    )

    statuses = dict(state.get("agent_statuses", {}))
    statuses["searcher"] = "done"
    statuses["credibility"] = "running"

    return {
        "raw_sources": sources,
        "current_agent": "credibility",
        "agent_statuses": statuses,
    }


async def credibility_node(state: ResearchState) -> dict:
    """Node 3: Credibility Scorer — evaluates source trustworthiness."""
    logger.info(f"[Credibility] Scoring {len(state.get('raw_sources', []))} sources")
    agent = CredibilityAgent()
    scored = await agent.score_sources(state.get("raw_sources", []))

    # Sort by credibility score (highest first)
    scored.sort(key=lambda s: s.get("credibility_score", 0), reverse=True)

    statuses = dict(state.get("agent_statuses", {}))
    statuses["credibility"] = "done"
    statuses["synthesizer"] = "running"

    return {
        "scored_sources": scored,
        "current_agent": "synthesizer",
        "agent_statuses": statuses,
    }


async def synthesizer_node(state: ResearchState) -> dict:
    """Node 4: Synthesizer — generates the full research report."""
    logger.info(f"[Synthesizer] Generating report from {len(state.get('scored_sources', []))} sources")
    agent = SynthesizerAgent()
    result = await agent.synthesize(
        topic=state["topic"],
        depth=state.get("depth", "standard"),
        citation_style=state.get("citation_style", "APA"),
        subtopics=state.get("subtopics", []),
        sources=state.get("scored_sources", []),
    )

    statuses = dict(state.get("agent_statuses", {}))
    statuses["synthesizer"] = "done"
    statuses["citation"] = "running"

    return {
        "report_title": result.get("title", ""),
        "executive_summary": result.get("executive_summary", ""),
        "full_report_md": result.get("full_report_md", ""),
        "current_agent": "citation",
        "agent_statuses": statuses,
    }


async def citation_node(state: ResearchState) -> dict:
    """Node 5: Citation Formatter — generates formatted citations for included sources."""
    credible_sources = [
        s for s in state.get("scored_sources", [])
        if (s.get("credibility_score") or 0) >= 3.5
    ]
    logger.info(f"[Citation] Formatting citations for {len(credible_sources)} credible sources")

    agent = CitationAgent()
    citations = await agent.format_citations(credible_sources)

    statuses = dict(state.get("agent_statuses", {}))
    statuses["citation"] = "done"

    return {
        "citations": citations,
        "current_agent": "done",
        "agent_statuses": statuses,
    }
