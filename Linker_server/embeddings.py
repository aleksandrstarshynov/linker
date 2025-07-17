from sentence_transformers import SentenceTransformer

# Load model once at module level
model = SentenceTransformer('all-MiniLM-L6-v2')  # 384-dimensional embeddings

# Generate embedding for text fragment
def generate_embedding(text: str) -> list[float]:
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

# Generate embedding for query (uses the same model)
def embed_query(query_text: str) -> list[float]:
    return generate_embedding(query_text)
