from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from config import QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION_NAME

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

# Create collection (call once)
def create_fragments_collection():
    qdrant_client.recreate_collection(
        collection_name=QDRANT_COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )
    print(f"Collection '{QDRANT_COLLECTION_NAME}' created successfully.")


# Save vector to Qdrant
def save_vector_to_qdrant(part_id: str, parent_id: str, vector: list[float]):
    qdrant_client.upsert(
        collection_name=QDRANT_COLLECTION_NAME,
        points=[
            PointStruct(
                id=part_id,
                vector=vector,
                payload={"parent_id": parent_id}
            )
        ]
    )
    print(f"Saved to Qdrant: {part_id}")
