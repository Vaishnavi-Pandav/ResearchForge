"""Source Credibility Scorer Agent — Evaluates source trustworthiness using Gemini (free).
Scores: domain authority, author credibility, recency, citation quality, bias risk.
"""
import json
from typing import List, Dict
from loguru import logger

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from backend.app.core.config import settings

CREDIBILITY_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a source credibility analyst. Evaluate the following source and return a JSON object:

{{
  "credibility_score": <float 0.0-10.0>,
  "bias_risk": <float 0.0-1.0>,
  "reasoning": "<brief explanation>"
}}

Scoring criteria:
- Domain authority (edu, gov, org = higher; unknown blogs = lower)
- Content quality based on the snippet
- Recency and relevance
- Potential bias indicators

Return ONLY valid JSON, no markdown fences."""),
    ("human", "Source to evaluate:\nTitle: {title}\nDomain: {domain}\nURL: {url}\nSnippet: {snippet}")
])


class CredibilityAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.1,
        )
        self.chain = CREDIBILITY_PROMPT | self.llm | JsonOutputParser()

    async def score_source(self, source: Dict) -> Dict:
        """Score a single source for credibility."""
        try:
            result = await self.chain.ainvoke({
                "title": source.get("title", "Unknown"),
                "domain": source.get("domain", "unknown"),
                "url": source.get("url", ""),
                "snippet": source.get("snippet", "")[:500],
            })
            return {
                "credibility_score": min(10.0, max(0.0, float(result.get("credibility_score", 5.0)))),
                "bias_risk": min(1.0, max(0.0, float(result.get("bias_risk", 0.5)))),
            }
        except Exception as e:
            logger.warning(f"Credibility scoring failed for {source.get('url')}: {e}")
            return self._fallback_score(source)

    async def score_sources(self, sources: List[Dict]) -> List[Dict]:
        """Score multiple sources. Uses heuristic fallback to stay within free rate limits."""
        scored = []
        for i, source in enumerate(sources):
            # Use LLM for first 10 sources, heuristic for rest (to stay within free tier limits)
            if i < 10:
                scores = await self.score_source(source)
            else:
                scores = self._fallback_score(source)

            source.update(scores)
            scored.append(source)

        logger.info(f"Scored {len(scored)} sources for credibility")
        return scored

    def _fallback_score(self, source: Dict) -> Dict:
        """Heuristic-based credibility scoring (no LLM needed)."""
        domain = source.get("domain", "").lower()
        score = 5.0
        bias = 0.5

        # Domain authority heuristics
        if any(d in domain for d in [".edu", ".gov", ".ac."]):
            score = 8.5
            bias = 0.15
        elif any(d in domain for d in ["nature.com", "science.org", "pubmed", "springer", "wiley", "ieee"]):
            score = 9.0
            bias = 0.1
        elif any(d in domain for d in ["arxiv.org", "scholar.google", "semanticscholar"]):
            score = 8.0
            bias = 0.2
        elif any(d in domain for d in ["reuters.com", "apnews.com", "bbc.com"]):
            score = 7.5
            bias = 0.25
        elif any(d in domain for d in ["wikipedia.org"]):
            score = 6.5
            bias = 0.3
        elif any(d in domain for d in ["medium.com", "substack.com", "blogspot"]):
            score = 4.5
            bias = 0.6
        elif any(d in domain for d in ["reddit.com", "quora.com"]):
            score = 3.5
            bias = 0.7

        return {"credibility_score": score, "bias_risk": bias}
