import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import FragmentIn
from supabase_client import save_fragment_to_supabase

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # или укажи конкретно: ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint for getting text and saving it
@app.post("/submit")
async def submit_fragment(fragment: FragmentIn):
    fragment_id = str(uuid.uuid4())

    # Saving text in Supabase
    await save_fragment_to_supabase(fragment_id, fragment.text)

    return {"message": f"The fragment is saved. ID: {fragment_id}"}
