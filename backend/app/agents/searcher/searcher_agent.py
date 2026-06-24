"""Web Search Agent — Gathers information from the web using DuckDuckGo (100% free).
No API key needed.
"""
import asyncio
from typing import List, Dict
from urllib.parse import urlparse
from loguru import logger

from duckduckgo_search import DDGS


DEPTH_SOURCE_LIMITS = {
    "quick": 10,
    "standard": 25,
    "deep": 50,
    "exhaustive": 80,
}


class SearcherAgent:
    def __init__(self):
        self.ddgs = DDGS()

    async def search(self, queries: List[str], depth: str = "standard") -> List[Dict]:
        """Execute search queries and return deduplicated source results."""
        max_sources = DEPTH_SOURCE_LIMITS.get(depth, 25)
        results_per_query = max(3, max_sources // len(queries)) if queries else 5

        all_results = []
        seen_urls = set()

        for query in queries:
            try:
                # DuckDuckGo search is synchronous — run in thread pool
                search_results = await asyncio.to_thread(
                    self._search_query, query, results_per_query
                )
                for r in search_results:
                    url = r.get("href") or r.get("link", "")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        domain = urlparse(url).netloc.replace("www.", "")
                        all_results.append({
                            "url": url,
                            "title": r.get("title", "Untitled"),
                            "snippet": r.get("body", ""),
                            "domain": domain,
                        })
            except Exception as e:
                logger.warning(f"Search failed for query '{query}': {e}")
                continue

            if len(all_results) >= max_sources:
                break

        logger.info(f"Searcher found {len(all_results)} unique sources for {len(queries)} queries")
        return all_results[:max_sources]

    def _search_query(self, query: str, max_results: int) -> List[dict]:
        """Synchronous DuckDuckGo search."""
        try:
            results = list(self.ddgs.text(query, max_results=max_results))
            return results
        except Exception as e:
            logger.warning(f"DDG search error: {e}")
            return []

    async def search_news(self, query: str, max_results: int = 5) -> List[Dict]:
        """Search recent news articles."""
        try:
            results = await asyncio.to_thread(
                lambda: list(self.ddgs.news(query, max_results=max_results))
            )
            return [
                {
                    "url": r.get("url", ""),
                    "title": r.get("title", ""),
                    "snippet": r.get("body", ""),
                    "domain": urlparse(r.get("url", "")).netloc.replace("www.", ""),
                    "published_date": r.get("date"),
                }
                for r in results
            ]
        except Exception as e:
            logger.warning(f"News search error: {e}")
            return []
