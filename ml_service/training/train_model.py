import os
import csv
import pickle
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score

# CONFIG
CSV_PATH   = r"D:\final-project1\final year project\datasets\traffic_data.csv"
MODEL_DIR  = r"D:\final-project1\final year project\ml_service\models"
MODEL_PATH = os.path.join(MODEL_DIR, "traffic_model.pkl")
IMG_SIZE   = (64, 64)   # smaller = faster, fine for sklearn

os.makedirs(MODEL_DIR, exist_ok=True)

# STEP 1: Load Images from CSV
print(" Loading dataset...")

images, labels = [], []
skipped = 0

try:
    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            path  = row['Full Path']
            label = row['Sub-Category']   # Has Garbage / No Garbage / Has Pothole / No Pothole

            if not os.path.exists(path):
                skipped += 1
                continue

            try:
                img = Image.open(path).convert('RGB').resize(IMG_SIZE)
                images.append(np.array(img).flatten() / 255.0)  # flatten to 1D
                labels.append(label)
            except Exception as e:
                print(f"   Skipping {path}: {e}")
                skipped += 1
except FileNotFoundError:
    print(f" CSV file not found: {CSV_PATH}")
    exit(1)

print(f"   Loaded : {len(images)} images")
print(f"   Skipped: {skipped} images")

if len(images) == 0:
    print(" No images loaded. Exiting.")
    exit(1)

# STEP 2: Encode Labels
le = LabelEncoder()
y  = le.fit_transform(labels)
X  = np.array(images)

print(f"\n🏷  Classes: {list(le.classes_)}")

# STEP 3: Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f" Train: {len(X_train)} | Test: {len(X_test)}")

# STEP 4: Train Model
print("\n Training RandomForest...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,        # use all CPU cores
    verbose=1
)
model.fit(X_train, y_train)

# STEP 5: Evaluate
y_pred = model.predict(X_test)
acc    = accuracy_score(y_test, y_pred)

print(f"\n Test Accuracy: {acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# STEP 6: Save Model
print("\n Saving model...")

try:
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({
            'model':         model,
            'label_encoder': le,
            'classes':       list(le.classes_),
            'img_size':      IMG_SIZE
        }, f)
    print(f"   Saved  done → {MODEL_PATH}")
except Exception as e:
    print(f" Failed to save model: {e}")
    exit(1)
