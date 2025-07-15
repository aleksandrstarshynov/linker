import uuid
from fastapi import FastAPI
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from models import FragmentIn
from supabase_client import save_fragment_to_supabase
from supabase_client import fetch_all_fragments
from supabase_client import search_fragments
from process_fragment import process_incoming_fragment

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # или укажи конкретно: ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint for sending text and saving it in DB
@app.post("/submit")
async def submit_fragment(fragment: FragmentIn):
    source = "User input"

    # run orchestrator
    fragments = process_incoming_fragment(fragment.text, source)

    # Step by step processing of each part
    for fragment_data in fragments:
        part_id = fragment_data["part_id"]
        parent_id = fragment_data["parent_id"]
        text = fragment_data["text_fragment"]
        source = fragment_data["source"]

        # Embedding generation
        embedding = generate_embedding(text)

        # Save in Supabase
        await save_part_to_supabase(part_id, parent_id, source, text)

        # Save in Qdrant
        save_vector_to_qdrant(part_id, parent_id, embedding)

    return {"message": f"{len(fragments)} fragments saved", "parent_id": fragments[0]["parent_id"]}

# Endpoint for getting all texts
@app.get("/get_fragments")
async def get_fragments():
    fragments = await fetch_all_fragments()
    return {"fragments": fragments}

# Endpoint for getting fragments by text
@app.get("/search")
async def search(query: str = Query(...)):
    results = await search_fragments(query)
    return {"results": results}