from typing import List

class EmbeddingService:
    def __init__(self):
        pass

    async def get_embeddings(self, text: str) -> List[float]:
        # Placeholder for embedding generation logic
        return [0.0] * 1536

    async def get_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        return [[0.0] * 1536 for _ in texts]
