from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from qdrant_client.http.exceptions import UnexpectedResponse
from config import QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION_NAME
import logging

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=30  # Увеличиваем таймаут для надежности
)

# Initialize collection on startup
def initialize_collection():
    try:
        # Проверяем существование коллекции
        if not qdrant_client.collection_exists(QDRANT_COLLECTION_NAME):
            create_fragments_collection()
    except Exception as e:
        logging.error(f"Error initializing collection: {e}")
        raise

# Create collection with error handling
def create_fragments_collection():
    try:
        qdrant_client.recreate_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )
        logging.info(f"Collection '{QDRANT_COLLECTION_NAME}' created successfully.")
    except Exception as e:
        logging.error(f"Failed to create collection: {e}")
        raise

# Save vector with retry logic
def save_vector_to_qdrant(part_id: str, parent_id: str, vector: list[float]):
    try:
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
        logging.info(f"Saved to Qdrant: {part_id}")
    except UnexpectedResponse as e:
        if "doesn't exist" in str(e):
            logging.warning("Collection not found, attempting to create...")
            create_fragments_collection()
            # Retry after creation
            save_vector_to_qdrant(part_id, parent_id, vector)
        else:
            raise