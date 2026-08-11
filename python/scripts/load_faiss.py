import os
from pathlib import Path
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load documentation files (adjust path as needed)
DOCS_DIR = Path(__file__).resolve().parents[2] / "docs"
texts = []
for p in DOCS_DIR.rglob("*.txt"):
    texts.append(p.read_text())

if not texts:
    raise RuntimeError(f"No documentation files found in {DOCS_DIR}")

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

dim = embeddings.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(np.array(embeddings, dtype="float32"))

faiss_path = os.getenv("FAISS_PATH", "faiss_index.bin")
faiss.write_index(index, faiss_path)
print(f"FAISS index saved to {faiss_path}")
