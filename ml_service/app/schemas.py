# D:\final-project1\final year project\app\schemas.py

from pydantic import BaseModel
from typing import Dict

class PredictionResponse(BaseModel):
    label: str  # "Has Garbage"
    category: str  # "Garbage"
    has_issue: bool  # True
    confidence: float  # 71.0
    all_probs: Dict[str, float]  # {"Has Garbage": 71.0, ...}
    status: str  # "success"

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str