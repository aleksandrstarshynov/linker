import uuid
from fastapi import FastAPI
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from models import FragmentIn
from supabase_client import save_fragment_to_supabase
from supabase_client import fetch_all_fragments
from supabase_client import search_fragments

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
    fragment_id = str(uuid.uuid4())

    # Saving text in Supabase
    await save_fragment_to_supabase(fragment_id, fragment.text)

    return {"message": f"The fragment is saved. ID: {fragment_id}"}

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