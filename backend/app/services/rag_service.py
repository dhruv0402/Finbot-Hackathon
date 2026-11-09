import os
import json
import numpy as np
from typing import List, Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CORPUS_PATH = os.path.join(BASE_DIR, "data", "knowledge_base", "financial_corpus.json")

_embedding_model = None
_faiss_index = None
_corpus_docs: List[Dict[str, Any]] = []

def _load_corpus() -> List[Dict[str, Any]]:
    global _corpus_docs
    if not _corpus_docs and os.path.exists(CORPUS_PATH):
        try:
            with open(CORPUS_PATH, "r", encoding="utf-8") as f:
                _corpus_docs = json.load(f)
        except Exception as e:
            print("Error loading financial corpus:", e)
    return _corpus_docs

def _initialize_index():
    global _embedding_model, _faiss_index, _corpus_docs
    if _faiss_index is not None:
        return

    docs = _load_corpus()
    if not docs:
        return

    try:
        from sentence_transformers import SentenceTransformer
        import faiss

        # Fast, high-quality, lightweight 384-dimensional embedding model
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        texts = [f"{d['topic']}: {d['content']}" for d in docs]
        embeddings = _embedding_model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

        dimension = embeddings.shape[1]
        _faiss_index = faiss.IndexFlatIP(dimension)  # Inner product on normalized vectors = Cosine similarity
        _faiss_index.add(embeddings)
    except Exception as e:
        print("Notice: Vector indexing initialization fallback:", e)

def search_knowledge_base(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """
    Retrieves the top-k most semantically relevant financial knowledge chunks using FAISS.
    Returns empty list if similarity score is below the relevance threshold (guardrail).
    """
    docs = _load_corpus()
    if not docs:
        return []

    _initialize_index()

    if _faiss_index is not None and _embedding_model is not None:
        try:
            query_emb = _embedding_model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
            distances, indices = _faiss_index.search(query_emb, top_k)

            results = []
            for score, idx in zip(distances[0], indices[0]):
                if idx >= 0 and idx < len(docs):
                    # Cosine similarity threshold >= 0.30 for financial domain relevance
                    if float(score) >= 0.30:
                        doc = dict(docs[idx])
                        doc["similarity_score"] = round(float(score), 4)
                        results.append(doc)
            return results
        except Exception as e:
            print("FAISS search notice:", e)

    # Lightweight Keyword-Overlap Fallback if vector model is unavailable
    q_lower = query.lower()
    scored = []
    for d in docs:
        combined = f"{d['topic']} {d['content']}".lower()
        overlap = sum(1 for word in q_lower.split() if len(word) > 3 and word in combined)
        if overlap > 0:
            scored.append((overlap, d))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored[:top_k]]
