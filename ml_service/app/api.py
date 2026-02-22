# D:\final-project1\final year project\app\api.py

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictionResponse, HealthResponse
import shutil
import uuid
import os
import sys
from pathlib import Path

try:
    import inference
except ModuleNotFoundError as e:
    print(f"Error: Could not import inference module: {e}")
    sys.exit(1)

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
app = FastAPI(
    title="Smart City Issue Detection API",
    description="AI-powered detection of garbage and potholes from images",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(str(Path(__file__).parent.parent.parent), "uploads", "temp")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/", response_model=HealthResponse)
def root():
    return {
        "status":  "running",
        "message": "Smart City Issue Detection API is live",
        "version": "1.0.0"
    }

@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status":  "healthy",
        "message": "Model loaded and ready",
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Upload an image to detect urban issues.
    Returns: label, category, confidence, and all class probabilities.
    """

    # Validate file extension
    ext = os.path.splitext(file.filename)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}"
        )

    # Save temp file
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{ext}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run prediction
        result = inference.predict(temp_path)

        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        return result

    finally:
        # Always clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/classes")
def get_classes():
    """Return all classes the model can detect."""
    return {
        "classes": inference.classes,
        "total":   len(inference.classes)
    }