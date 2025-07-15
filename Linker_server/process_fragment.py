import uuid
from text_splitter import split_and_assign_ids

def process_incoming_fragment(full_text: str, source: str) -> list[dict]:
    """
    Orchestrator function that prepares fragments for processing.

    Args:
        full_text (str): The full text fragment submitted by the user.
        source (str): Optional source label for tracking.

    Returns:
        List of fragment dicts ready for embeddings and saving.
    """
    parent_id = str(uuid.uuid4())

    fragments = split_and_assign_ids(full_text, parent_id)

    for fragment in fragments:
        fragment["source"] = source  

    return fragments
