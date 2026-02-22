# D:\final-project1\final year project\main.py

import uvicorn
import os
import sys

# Add the app folder to Python path
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml_service", "app")
sys.path.insert(0, APP_DIR)

if __name__ == "__main__":
    print("=" * 50)
    print("  🏙  Smart City Issue Detection System")
    print("=" * 50)
    print("  📡 Starting API server...")
    print("  📖 Docs   → http://localhost:8000/docs")
    print("  ❤  Health → http://localhost:8000/health")
    print("=" * 50)

    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[APP_DIR]
    )