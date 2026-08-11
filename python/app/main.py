import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

app = FastAPI()

FAISS_PATH = os.getenv("FAISS_PATH", "faiss_index.bin")
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# Load FAISS index and model at startup
@app.on_event("startup")
async def load_resources():
    global index, model
    if not os.path.exists(FAISS_PATH):
        raise RuntimeError(f"FAISS index file not found at {FAISS_PATH}")
    index = faiss.read_index(FAISS_PATH)
    model = SentenceTransformer(MODEL_NAME)

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/search")
async def search(req: QueryRequest):
    if not req.query:
        raise HTTPException(status_code=400, detail="Query string required")
    embedding = model.encode([req.query], convert_to_numpy=True).astype("float32")
    distances, indices = index.search(embedding, req.top_k)
    # Return indices and distances; further mapping to docs can be added
    return {"indices": indices.tolist(), "distances": distances.tolist()}
