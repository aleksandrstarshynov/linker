import uuid
import nltk
from nltk.tokenize import sent_tokenize
import os

# Полное решение для инициализации NLTK
def initialize_nltk():
    # Устанавливаем пути к данным NLTK
    nltk_data_paths = [
        os.path.join(os.path.expanduser('~'), 'nltk_data'),
        os.path.join(os.getenv('APPDATA', ''), 'nltk_data'),
        os.path.join(os.getenv('PROGRAMDATA', ''), 'nltk_data'),
        'C:/nltk_data',
        'D:/nltk_data',
        'E:/nltk_data'
    ]
    
    # Добавляем все возможные пути
    for path in nltk_data_paths:
        if os.path.exists(path):
            nltk.data.path.append(path)
    
    # Пытаемся найти или скачать необходимые ресурсы
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('punkt_tab', quiet=True)  # Явно скачиваем punkt_tab
        except Exception as e:
            print(f"Failed to download NLTK resources: {e}")
            raise

# Инициализируем NLTK при импорте модуля
initialize_nltk()

def split_and_assign_ids(full_text: str, parent_id: str) -> list[dict]:
    """
    Splits text into fragments, assigns unique part_ids, and attaches parent_id to each.

    Args:
        full_text (str): The complete text to split.
        parent_id (str): The parent ID assigned to the original full fragment.

    Returns:
        List of fragments, each as dict with part_id, parent_id, text_fragment.
    """
    try:
        # Проверка входных данных
        if not full_text or not isinstance(full_text, str):
            raise ValueError("Input text must be a non-empty string")
            
        if not parent_id or not isinstance(parent_id, str):
            raise ValueError("Parent ID must be a non-empty string")

        # Токенизация с обработкой возможных ошибок
        try:
            parts = sent_tokenize(full_text)
        except Exception as tokenize_error:
            print(f"Tokenization error: {tokenize_error}")
            # Попробуем с явным указанием языка
            parts = sent_tokenize(full_text, language='english')
            
        # Создание фрагментов
        result = []
        for part in parts:
            if part.strip():  # Игнорируем пустые предложения
                result.append({
                    "part_id": str(uuid.uuid4()),
                    "parent_id": parent_id,
                    "text_fragment": part.strip()
                })
                
        return result
        
    except Exception as e:
        print(f"Error in split_and_assign_ids: {e}")
        raise  # Пробрасываем исключение дальше