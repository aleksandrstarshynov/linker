from postgrest import AsyncPostgrestClient
from config import SUPABASE_URL, SUPABASE_KEY

# Подключение к Supabase (PostgREST endpoint)
supabase_client = AsyncPostgrestClient(f"{SUPABASE_URL}/rest/v1")

# Установка заголовков (API ключ)
supabase_client.session.headers.update({
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
})

# Функция сохранения фрагмента
async def save_fragment_to_supabase(fragment_id: str, text: str):
    data = {
        "id": fragment_id,
        "text": text
    }
    response = await supabase_client.from_("fragments").insert(data).execute()
    print(response)
    return response
