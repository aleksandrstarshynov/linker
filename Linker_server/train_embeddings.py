import os
import json
from datetime import datetime
from sentence_transformers import SentenceTransformer, InputExample, losses, util
from torch.utils.data import DataLoader

# === Absolute paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TRAIN_TRIPLETS_FILE = os.path.join(BASE_DIR, 'TrainingData', 'triplets.json')
TEST_TRIPLETS_FILE = os.path.join(BASE_DIR, 'TrainingData', 'test_triplets.json')
MODEL_OUTPUT_DIR = os.path.join(BASE_DIR, 'models', 'custom-embeddings-v1')
LOG_FILE = os.path.join(BASE_DIR, 'training_logs.csv')

ACCURACY_THRESHOLD = 0.70

def train_and_validate():
    # Load training triplets
    with open(TRAIN_TRIPLETS_FILE, 'r', encoding='utf-8') as f:
        train_triplets = json.load(f)

    train_examples = [
        InputExample(texts=[item['anchor'], item['positive'], item['negative']])
        for item in train_triplets
    ]

    # Initialize the model
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=8)
    train_loss = losses.TripletLoss(model=model)

    # Training
    print("Training model...")
    model.fit(
        train_objectives=[(train_dataloader, train_loss)],
        epochs=1,
        warmup_steps=100,
        show_progress_bar=True
    )
    print("Training completed.")

    # Validation using test triplets
    with open(TEST_TRIPLETS_FILE, 'r', encoding='utf-8') as f:
        test_triplets = json.load(f)

    correct = 0
    for item in test_triplets:
        anchor_vec = model.encode(item['anchor'])
        positive_vec = model.encode(item['positive'])
        negative_vec = model.encode(item['negative'])

        positive_score = util.cos_sim(anchor_vec, positive_vec).item()
        negative_score = util.cos_sim(anchor_vec, negative_vec).item()

        if positive_score > negative_score:
            correct += 1

    accuracy = correct / len(test_triplets)
    print(f"Model accuracy: {accuracy:.2%}")

    # Logging the result
    log_line = f"{datetime.now().isoformat()},{MODEL_OUTPUT_DIR},{round(accuracy, 4)}\n"
    with open(LOG_FILE, mode='a', encoding='utf-8') as log_file:
        log_file.write(log_line)

    # Save model or discard based on accuracy
    if accuracy >= ACCURACY_THRESHOLD:
        model.save(MODEL_OUTPUT_DIR)
        print(f" Model saved at {MODEL_OUTPUT_DIR}")
        return {"status": "success", "accuracy": round(accuracy, 4)}
    else:
        print(f" Model NOT saved. Accuracy below threshold ({ACCURACY_THRESHOLD:.0%}).")
        return {"status": "failed", "accuracy": round(accuracy, 4)}


if __name__ == "__main__":
    result = train_and_validate()
    print(result)
