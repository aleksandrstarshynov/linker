from sentence_transformers import SentenceTransformer, InputExample, losses, util
from torch.utils.data import DataLoader
import json
import os
from datetime import datetime

# --- Конфигурация ---
TRAIN_TRIPLETS_FILE = 'Data/TrainingData/triplets.json'
TEST_TRIPLETS_FILE = 'Data/TrainingData/test_triplets.json'
MODEL_OUTPUT_DIR = 'models/custom-embeddings-v1'
ACCURACY_THRESHOLD = 0.70  # Порог точности

def train_and_validate():
    # Загрузка тренировочных триплетов
    with open(TRAIN_TRIPLETS_FILE, 'r', encoding='utf-8') as f:
        train_triplets = json.load(f)

    train_examples = [
        InputExample(texts=[item['anchor'], item['positive'], item['negative']])
        for item in train_triplets
    ]

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=8)
    train_loss = losses.TripletLoss(model=model)

    model.fit(
        train_objectives=[(train_dataloader, train_loss)],
        epochs=1,
        warmup_steps=100,
        show_progress_bar=True
    )

    # Проверка качества
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

    # Логирование
    log_line = f"{datetime.now().isoformat()},{MODEL_OUTPUT_DIR},{round(accuracy, 4)}\n"
    with open('training_logs.csv', mode='a', encoding='utf-8') as log_file:
        log_file.write(log_line)

    # Сохранение или откат
    if accuracy >= ACCURACY_THRESHOLD:
        model.save(MODEL_OUTPUT_DIR)
        return {"status": "success", "accuracy": round(accuracy, 4)}
    else:
        return {"status": "failed", "accuracy": round(accuracy, 4)}

if __name__ == "__main__":
    result = train_and_validate()
    print(result)
