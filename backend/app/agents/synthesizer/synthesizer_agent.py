"""Synthesizer Agent — Combines findings, generates insights, produces report using Gemini (free).
Uses ChromaDB for RAG when available, falls back to direct synthesis.
"""
from typing import List, Dict
from loguru import logger

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

from backend.app.core.config import settings

SYNTHESIS_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a world-class research synthesizer. Given a research topic and a collection of scored sources with snippets, produce a comprehensive research report in Markdown format.

Your report MUST include:
1. **Title** (as an H1 heading)
2. **Executive Summary** (2-3 paragraph overview of key findings)
3. **Key Findings** (organized by subtopic with H3 headings, citing sources inline)
4. **Analysis & Insights** (identify patterns, contradictions, and novel insights)
5. **Methodology** (list search databases used, number of sources, date range, average credibility score)
6. **Conclusion** (actionable summary)

Guidelines:
- Write in a professional, academic tone
- Cite sources by their title and domain inline
- Identify any contradictions between sources
- Highlight the most credible findings (high credibility scores)
- Filter out low-credibility sources (score < 4.0)
- Be thorough but concise. Aim for 1500-3000 words depending on depth.
- Use bullet points and tables where appropriate"""),
    ("human", """Research Topic: {topic}
Research Depth: {depth}
Citation Style: {citation_style}

Subtopics to cover:
{subtopics}

Sources (sorted by credibility score, highest first):
{sources_text}

Generate the full research report now.""")
])


class SynthesizerAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.4,
            max_output_tokens=8192,
        )
        self.chain = SYNTHESIS_PROMPT | self.llm

    async def synthesize(
        self,
        topic: str,
        depth: str,
        citation_style: str,
        subtopics: List[str],
        sources: List[Dict],
    ) -> Dict:
        """Generate a full research report from scored sources."""
        # Filter to credible sources only
        credible_sources = [s for s in sources if (s.get("credibility_score") or 0) >= 3.5]
        if not credible_sources:
            credible_sources = sources[:10]  # Fallback

        # Format sources for the prompt
        sources_text = self._format_sources(credible_sources)
        subtopics_text = "\n".join(f"- {st}" for st in subtopics)

        try:
            result = await self.chain.ainvoke({
                "topic": topic,
                "depth": depth,
                "citation_style": citation_style,
                "subtopics": subtopics_text,
                "sources_text": sources_text,
            })
            report_md = result.content if hasattr(result, "content") else str(result)

            # Extract executive summary (first paragraph after "Executive Summary" heading)
            exec_summary = self._extract_executive_summary(report_md)

            logger.info(f"Synthesizer generated report: {len(report_md)} chars")
            return {
                "full_report_md": report_md,
                "executive_summary": exec_summary,
                "title": self._extract_title(report_md) or f"Research Report: {topic}",
            }
        except Exception as e:
            logger.error(f"Synthesizer failed: {e}")
            return {
                "full_report_md": f"# Research Report: {topic}\n\nReport generation failed. Please try again.\n\nError: {str(e)}",
                "executive_summary": "Report generation encountered an error.",
                "title": f"Research Report: {topic}",
            }

    def _format_sources(self, sources: List[Dict]) -> str:
        lines = []
        for i, s in enumerate(sources[:30], 1):
            score = s.get("credibility_score", "N/A")
            lines.append(
                f"{i}. [{s.get('title', 'Untitled')}]({s.get('url', '')})\n"
                f"   Domain: {s.get('domain', 'unknown')} | Credibility: {score}/10\n"
                f"   Snippet: {(s.get('snippet') or '')[:300]}\n"
            )
        return "\n".join(lines)

    def _extract_title(self, md: str) -> str:
        for line in md.split("\n"):
            line = line.strip()
            if line.startswith("# ") and not line.startswith("## "):
                return line[2:].strip()
        return ""

    def _extract_executive_summary(self, md: str) -> str:
        lines = md.split("\n")
        capture = False
        summary_lines = []
        for line in lines:
            if "executive summary" in line.lower() or "overview" in line.lower():
                capture = True
                continue
            if capture:
                if line.startswith("## ") or line.startswith("# "):
                    break
                if line.strip():
                    summary_lines.append(line.strip())
        return " ".join(summary_lines[:5]) if summary_lines else ""
