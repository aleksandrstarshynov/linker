from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import requests
import qdrant_client
from qdrant_client.http.models import PointStruct
import supabase

app = FastAPI()

# Настройки подключения
QDRANT_URL = "https://YOUR-QDRANT-URL"
SUPABASE_URL = "https://YOUR-SUPABASE-URL"
SUPABASE_KEY = "YOUR-SUPABASE-KEY"

qdrant = qdrant_client.QdrantClient(url=QDRANT_URL)
supabase_client = supabase.Client(SUPABASE_URL, SUPABASE_KEY)

# Модель запроса
class FragmentIn(BaseModel):
    text: str

@app.post("/submit")
def submit_fragment(fragment: FragmentIn):
    # Генерация ID и embedding (псевдо, вставь свою модель)
    fragment_id = str(uuid.uuid4())
    embedding = generate_embedding(fragment.text)  # Реализуй или подключи API

    # Сохраняем текст в Supabase
    response = supabase_client.table('fragments').insert({
        "id": fragment_id,
        "text": fragment.text
    }).execute()

    if not response:
        raise HTTPException(status_code=500, detail="Ошибка записи в Supabase")

    # Сохраняем embedding в Qdrant
    qdrant.upsert(
        collection_name="fragments",
        points=[
            PointStruct(id=fragment_id, vector=embedding, payload={"text": fragment.text})
        ]
    )

    return {"message": f"Фрагмент сохранён. ID: {fragment_id}"}

def generate_embedding(text: str):
    # Пример заглушки, тут должен быть вызов модели или API
    return [0.0] * 768  # Или реальный embedding
