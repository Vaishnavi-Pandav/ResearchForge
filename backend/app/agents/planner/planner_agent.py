"""Query Planner Agent — Analyzes user intent, generates research objectives, subtopics, search queries.
Uses Google Gemini 1.5 Flash (free tier: 15 RPM, 1M tokens/day).
"""
import json
from typing import List, Dict
from loguru import logger

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from backend.app.core.config import settings

PLANNER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a research planning expert. Given a research topic, analyze the user's intent and create a structured research plan.

Return a JSON object with exactly these keys:
{{
  "objectives": ["list of 3-5 clear research objectives"],
  "subtopics": ["list of 4-8 subtopics to investigate"],
  "search_queries": ["list of 6-12 specific search queries to find relevant sources"]
}}

Adjust the scope based on the depth parameter:
- quick: 3 objectives, 4 subtopics, 6 queries
- standard: 4 objectives, 6 subtopics, 8 queries
- deep: 5 objectives, 8 subtopics, 10 queries
- exhaustive: 5 objectives, 8 subtopics, 12 queries

Return ONLY valid JSON, no markdown fences."""),
    ("human", "Topic: {topic}\nDepth: {depth}")
])


class PlannerAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.3,
        )
        self.chain = PLANNER_PROMPT | self.llm | JsonOutputParser()

    async def create_plan(self, topic: str, depth: str = "standard") -> Dict:
        try:
            result = await self.chain.ainvoke({"topic": topic, "depth": depth})
            logger.info(f"Planner generated plan with {len(result.get('search_queries', []))} queries")
            return result
        except Exception as e:
            logger.error(f"Planner agent failed: {e}")
            # Fallback: generate basic plan without LLM
            return {
                "objectives": [f"Understand the current state of {topic}", f"Identify key trends in {topic}"],
                "subtopics": [topic, f"{topic} trends", f"{topic} challenges"],
                "search_queries": [topic, f"{topic} research 2024", f"{topic} latest developments"],
            }
