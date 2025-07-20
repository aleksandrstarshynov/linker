import uuid
import nltk
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import FragmentIn
from supabase_client import save_part_to_supabase, fetch_all_fragments, search_fragments
from process_fragment import process_incoming_fragment
from embeddings import generate_embedding
from qdrant_service import save_vector_to_qdrant, initialize_collection
import logging
from qdrant_service import search_in_qdrant
from supabase_client import fetch_fragments_by_ids
from embeddings import embed_query
from fastapi import APIRouter
from qdrant_service import qdrant_service, QDRANT_COLLECTION_NAME
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import subprocess

# Настройка логгирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Инициализация сервисов при запуске приложения"""
    try:
        # Инициализация Qdrant
        initialize_collection()
        
        # Инициализация NLTK
        nltk.data.path.append("C:/Users/aleks/AppData/Roaming/nltk_data")
        
        # Проверка и загрузка ресурсов NLTK
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
            nltk.download('punkt_tab', quiet=True)
        
        logger.info("Application services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise

@app.post("/submit")
async def submit_fragment(fragment: FragmentIn):
    """Эндпоинт для обработки и сохранения текстовых фрагментов"""
    try:
        source = "User input"
        
        # Проверка входных данных
        if not fragment.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Обработка фрагмента
        fragments = process_incoming_fragment(fragment.text, source)
        
        if not fragments:
            raise HTTPException(status_code=400, detail="No fragments were generated")
        
        # Обработка каждого фрагмента
        for fragment_data in fragments:
            part_id = fragment_data["part_id"]
            parent_id = fragment_data["parent_id"]
            text = fragment_data["text_fragment"]
            
            # Генерация эмбеддинга
            try:
                embedding = generate_embedding(text)
            except Exception as e:
                logger.error(f"Failed to generate embedding: {e}")
                continue  # Пропускаем фрагмент или обрабатываем иначе
            
            # Сохранение в Supabase
            try:
                await save_part_to_supabase(part_id, parent_id, source, text)
            except Exception as e:
                logger.error(f"Failed to save to Supabase: {e}")
                continue
            
            # Сохранение в Qdrant
            try:
                save_vector_to_qdrant(part_id, parent_id, embedding)
            except Exception as e:
                logger.error(f"Failed to save to Qdrant: {e}")
                continue
        
        return {
            "message": f"{len(fragments)} fragments processed",
            "parent_id": fragments[0]["parent_id"]
        }
        
    except Exception as e:
        logger.error(f"Error in submit_fragment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_fragments")
async def get_fragments():
    """Получение всех фрагментов"""
    try:
        fragments = await fetch_all_fragments()
        return {"fragments": fragments}
    except Exception as e:
        logger.error(f"Failed to fetch fragments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch fragments")

@app.get("/search")
async def search(query: str = Query(..., min_length=1)):
    """Поиск фрагментов по тексту"""
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        results = await search_fragments(query)
        return {"results": results}
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail="Search failed")
    
@app.get("/search_vectors")
async def search_vectors(query: str):
    query_vector = embed_query(query)
    fragment_ids = search_in_qdrant(query_vector, top_k=5)
    fragments = await fetch_fragments_by_ids(fragment_ids)
    return {"results": fragments}






# TEST endpoint
@app.get("/debug_qdrant")
async def debug_qdrant():
    result = qdrant_service.scroll(
        collection_name=QDRANT_COLLECTION_NAME,
        limit=1,
        with_vectors=True  # ОБЯЗАТЕЛЬНО
    )
    points = result[0]

    if not points:
        return {"error": "No points found in Qdrant"}

    test_point = points[0]

    # Логгируем всю точку для проверки
    print(f"Full test_point object: {test_point}")

    # Пытаемся достать вектор
    if isinstance(test_point, dict):
        test_vector = test_point.get("vector")
    else:
        test_vector = getattr(test_point, "vector", None)

    # Логгируем сам вектор
    print(f"Extracted vector: {test_vector}")

    return {
        "raw_point": test_point,
        "vector": test_vector
    }

# endpoint to start AI model training process
        # I use Get here even though it contradicts REST
@app.get("/train")
async def retrain_model():
    try:
        result = subprocess.run(
            ['python', 'train_embeddings.py'],
            capture_output=True,
            text=True,
            timeout=3600
        )

        return JSONResponse({
            "status": "completed",
            "output": result.stdout,
            "error": result.stderr
        })

    except subprocess.TimeoutExpired:
        return JSONResponse({"status": "timeout", "error": "Training took too long."})

    except Exception as e:
        return JSONResponse({"status": "error", "error": str(e)})