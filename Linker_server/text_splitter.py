import uuid
from nltk.tokenize import sent_tokenize

def split_and_assign_ids(full_text: str, parent_id: str) -> list[dict]:
    """
    Splits text into fragments, assigns unique part_ids, and attaches parent_id to each.

    Args:
        full_text (str): The complete text to split.
        parent_id (str): The parent ID assigned to the original full fragment.

    Returns:
        List of fragments, each as dict with part_id, parent_id, text_fragment.
    """
    parts = sent_tokenize(full_text)  # Use your preferred splitting logic here

    result = []
    for part in parts:
        part_id = str(uuid.uuid4())
        result.append({
            "part_id": part_id,
            "parent_id": parent_id,
            "text_fragment": part.strip()
        })

    return result
