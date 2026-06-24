"""Full LangGraph research workflow — 5-agent pipeline with DB persistence."""
import asyncio
from uuid import UUID
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from langgraph.graph import StateGraph, END
from backend.app.workflows.state import ResearchState
from backend.app.workflows.nodes import (
    planner_node,
    searcher_node,
    credibility_node,
    synthesizer_node,
    citation_node,
)
from backend.app.repositories.research_repository import ResearchRepository
from backend.app.repositories.report_repository import ReportRepository
from backend.app.db.session import async_session_local


def create_research_graph():
    """Build the 5-agent LangGraph DAG."""
    workflow = StateGraph(ResearchState)

    workflow.add_node("planner", planner_node)
    workflow.add_node("searcher", searcher_node)
    workflow.add_node("credibility", credibility_node)
    workflow.add_node("synthesizer", synthesizer_node)
    workflow.add_node("citation", citation_node)

    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "searcher")
    workflow.add_edge("searcher", "credibility")
    workflow.add_edge("credibility", "synthesizer")
    workflow.add_edge("synthesizer", "citation")
    workflow.add_edge("citation", END)

    return workflow.compile()


async def run_research_workflow(session_id: str, user_id: str, topic: str, depth: str, citation_style: str):
    """
    Execute the full 5-agent research pipeline.
    Runs as a background task — persists results to DB at each stage.
    """
    graph = create_research_graph()

    initial_state: ResearchState = {
        "session_id": session_id,
        "user_id": user_id,
        "topic": topic,
        "depth": depth,
        "citation_style": citation_style,
        "objectives": [],
        "subtopics": [],
        "search_queries": [],
        "raw_sources": [],
        "scored_sources": [],
        "report_title": "",
        "executive_summary": "",
        "full_report_md": "",
        "citations": [],
        "current_agent": "planner",
        "agent_statuses": {"planner": "running"},
        "errors": [],
    }

    logger.info(f"Starting research workflow for session {session_id}")

    # Update DB status to planning
    async with async_session_local() as db:
        repo = ResearchRepository(db)
        await repo.update_session_status(
            UUID(session_id), "planning", {"planner": "running"}
        )

    try:
        # Run the full graph
        final_state = await graph.ainvoke(initial_state)

        # ── Persist results to DB ────────────────────────────────────
        async with async_session_local() as db:
            repo = ResearchRepository(db)
            report_repo = ReportRepository(db)

            # Save research plan
            await repo.create_plan(
                session_id=UUID(session_id),
                objectives=final_state.get("objectives", []),
                subtopics=final_state.get("subtopics", []),
                search_queries=final_state.get("search_queries", []),
            )

            # Save sources with scores
            sources_to_save = []
            for s in final_state.get("scored_sources", []):
                sources_to_save.append({
                    "url": s.get("url", ""),
                    "title": s.get("title"),
                    "domain": s.get("domain"),
                    "snippet": s.get("snippet"),
                    "credibility_score": s.get("credibility_score"),
                    "bias_risk": s.get("bias_risk"),
                })
            saved_sources = await repo.add_sources(UUID(session_id), sources_to_save)

            # Save report
            report = await report_repo.create_report(
                session_id=UUID(session_id),
                user_id=UUID(user_id),
                title=final_state.get("report_title", f"Research: {topic}"),
                executive_summary=final_state.get("executive_summary", ""),
                full_content=final_state.get("full_report_md", ""),
                citation_style=citation_style,
            )

            # Save citations
            citations_data = []
            for c in final_state.get("citations", []):
                citations_data.append({
                    "apa": c.get("apa", ""),
                    "mla": c.get("mla", ""),
                    "chicago": c.get("chicago", ""),
                    "harvard": c.get("harvard", ""),
                })
            if citations_data:
                await report_repo.add_citations(report.id, citations_data)

            # Mark session as completed
            await repo.update_session_status(
                UUID(session_id),
                "completed",
                final_state.get("agent_statuses", {}),
            )

            # Log completion
            await repo.add_agent_log(
                UUID(session_id), "workflow", "completed",
                f"Completed with {len(saved_sources)} sources and {len(citations_data)} citations"
            )

        logger.info(f"Research workflow completed for session {session_id}")

    except Exception as e:
        logger.error(f"Research workflow failed for session {session_id}: {e}")
        async with async_session_local() as db:
            repo = ResearchRepository(db)
            await repo.update_session_status(
                UUID(session_id), "failed", error=str(e)
            )
            await repo.add_agent_log(
                UUID(session_id), "workflow", "failed", str(e)
            )
