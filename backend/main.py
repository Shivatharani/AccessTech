from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, ai, dashboard, contact

app = FastAPI(
    title="AccessTech API",
    description="Adaptive Multilingual AI Learning Platform",
    version="1.0"
)

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(ai.router, prefix="/ai")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(contact.router, prefix="/contact")