# supabase_client.py

from postgrest import AsyncPostgrestClient
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase_client = AsyncPostgrestClient(f"{SUPABASE_URL}/rest/v1")

# Set API Key Headers
supabase_client.session.headers.update({
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
})


# Save one text fragment (with parent_id and source)
async def save_part_to_supabase(part_id: str, parent_id: str, source: str, text_fragment: str):
    data = {
        "id": part_id,
        "parent_id": parent_id,
        "source": source,
        "text": text_fragment
    }

    response = await supabase_client.from_("fragments").insert(data).execute()
    print(f"Saved to Supabase: {part_id}")
    return response


# Fetch all fragments
async def fetch_all_fragments():
    response = await supabase_client.from_("fragments").select("*").execute()
    return response.data


# Search fragments by text content (case-insensitive)
async def search_fragments(search_term: str):
    response = await supabase_client.from_("fragments") \
        .select("*") \
        .ilike("text_fragment", f"%{search_term}%") \
        .execute()
    return response.data
