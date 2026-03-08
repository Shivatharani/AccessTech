from fastapi import FastAPI
from routes import auth, ai, dashboard

app = FastAPI(
    title="AccessTech API",
    description="Adaptive Multilingual AI Learning Platform",
    version="1.0"
)

app.include_router(auth.router, prefix="/auth")
app.include_router(ai.router, prefix="/ai")
app.include_router(dashboard.router, prefix="/dashboard")