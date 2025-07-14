from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Model (What the Server Accepts)
class FragmentIn(BaseModel):
    text: str

# Receives text from the front
@app.post("/submit")
async def submit_fragment(fragment: FragmentIn):
    return {"message": f"Фрагмент получен: {fragment.text}"}
