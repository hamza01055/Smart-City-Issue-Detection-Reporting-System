# D:\final-project1\final year project\app\inference.py

import pickle
import numpy as np
from PIL import Image
import os

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
MODEL_PATH = r"D:\final-project1\final year project\ml_service\models\traffic_model.pkl"

# Validate model path exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

# ─────────────────────────────────────────────
# Load Model Once (on startup)
# ─────────────────────────────────────────────
print("🔄 Loading model...")

try:
    with open(MODEL_PATH, 'rb') as f:
        saved = pickle.load(f)
    
    model         = saved['model']
    label_encoder = saved['label_encoder']
    classes       = saved['classes']
    IMG_SIZE      = saved['img_size']
    print(f"✅ Model loaded | Classes: {classes}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    raise

# ─────────────────────────────────────────────
# Preprocess Image
# ─────────────────────────────────────────────
def preprocess_image(image_path: str) -> np.ndarray:
    """Load, resize, normalize and flatten image for prediction."""
    img = Image.open(image_path).convert('RGB').resize(IMG_SIZE)
    arr = np.array(img).astype(np.float32).flatten() / 255.0
    return arr.reshape(1, -1)

# ─────────────────────────────────────────────
# Predict
# ─────────────────────────────────────────────
def predict(image_path: str) -> dict:
    """Run prediction on a single image."""
    if not os.path.exists(image_path):
        return {"error": f"Image file not found: {image_path}", "status": "error"}
    
    try:
        features = preprocess_image(image_path)
    except Exception as e:
        return {"error": f"Could not load image: {str(e)}", "status": "error"}

    pred_index = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    confidence = float(round(proba[pred_index] * 100, 2))
    label = label_encoder.inverse_transform([pred_index])[0]

    all_probs = {cls: float(round(p * 100, 2)) for cls, p in zip(classes, proba)}
    category = "Garbage" if "Garbage" in label else "Pothole"
    has_issue = label.startswith("Has")

    return {
        "label": label,
        "category": category,
        "has_issue": has_issue,
        "confidence": confidence,
        "all_probs": all_probs,
        "status": "success"
    }

if __name__ == "__main__":
    import sys
    test_image = sys.argv[1] if len(sys.argv) > 1 else (
        r"D:\final-project1\final year project\datasets\data\garbage\yes\IMG (1).jpg"
    )
    print(f"\n🖼  Testing image: {test_image}")
    result = predict(test_image)
    
    if result.get("status") == "error":
        print(f"❌ Error: {result['error']}")
    else:
        print(f"\n{'='*40}")
        print(f"  Label      : {result['label']}")
        print(f"  Category   : {result['category']}")
        print(f"  Has Issue  : {'⚠ YES' if result['has_issue'] else '✅ NO'}")
        print(f"  Confidence : {result['confidence']}%")
        print(f"\n  All Probabilities:")
        for cls, prob in sorted(result['all_probs'].items(), key=lambda x: -x[1]):
            bar = '█' * int(prob / 5)
            print(f"    {cls:<20} {prob:>6.2f}%  {bar}")
        print(f"{'='*40}")
