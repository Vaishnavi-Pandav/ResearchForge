"""Citation Formatter Agent — Generates APA, MLA, Chicago, Harvard citations using Gemini (free)."""
from typing import List, Dict
from loguru import logger

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from backend.app.core.config import settings

CITATION_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an expert citation formatter. Given source metadata, generate properly formatted citations in all 4 styles.

Return a JSON object:
{{
  "apa": "<full APA 7th edition citation>",
  "mla": "<full MLA 9th edition citation>",
  "chicago": "<full Chicago 17th edition citation>",
  "harvard": "<full Harvard citation>"
}}

If information is missing (e.g., author unknown), use standard citation practices for handling missing data (e.g., use the organization name, or start with the title).

Return ONLY valid JSON, no markdown fences."""),
    ("human", """Source:
Title: {title}
Author: {author}
URL: {url}
Domain: {domain}
Published Date: {published_date}""")
])


class CitationAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.1,
        )
        self.chain = CITATION_PROMPT | self.llm | JsonOutputParser()

    async def format_citation(self, source: Dict) -> Dict:
        """Generate all 4 citation formats for a single source."""
        try:
            result = await self.chain.ainvoke({
                "title": source.get("title", "Untitled"),
                "author": source.get("author", "Unknown"),
                "url": source.get("url", ""),
                "domain": source.get("domain", ""),
                "published_date": str(source.get("published_date", "n.d.")),
            })
            return {
                "apa": result.get("apa", ""),
                "mla": result.get("mla", ""),
                "chicago": result.get("chicago", ""),
                "harvard": result.get("harvard", ""),
            }
        except Exception as e:
            logger.warning(f"Citation formatting failed: {e}")
            return self._fallback_citation(source)

    async def format_citations(self, sources: List[Dict]) -> List[Dict]:
        """Generate citations for multiple sources. Uses LLM for top sources, fallback for rest."""
        citations = []
        for i, source in enumerate(sources):
            if i < 15:  # LLM for top 15, fallback for rest (rate limit safety)
                citation = await self.format_citation(source)
            else:
                citation = self._fallback_citation(source)

            citation["source_id"] = source.get("id")
            citations.append(citation)

        logger.info(f"Formatted {len(citations)} citations")
        return citations

    def _fallback_citation(self, source: Dict) -> Dict:
        """Basic citation formatting without LLM."""
        title = source.get("title", "Untitled")
        author = source.get("author", "")
        url = source.get("url", "")
        domain = source.get("domain", "")
        date = source.get("published_date", "n.d.")

        author_str = author if author else domain.capitalize()

        return {
            "apa": f"{author_str}. ({date}). {title}. Retrieved from {url}",
            "mla": f"{author_str}. \"{title}.\" {domain}, {date}. Web. {url}.",
            "chicago": f"{author_str}. \"{title}.\" {domain}. {date}. {url}.",
            "harvard": f"{author_str} ({date}) '{title}', {domain}. Available at: {url}.",
        }
