from pydantic import BaseModel

class FragmentIn(BaseModel):
    text: str
    source: str = "User input"
