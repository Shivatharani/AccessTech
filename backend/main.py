from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, ai, dashboard, contact

app = FastAPI(
    title="AccessTech API",
    description="Adaptive Multilingual AI Learning Platform",
    version="1.0"
)

import os

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allow_origins.append(frontend_url.rstrip("/"))
    # Also allow version without https for some specific environments if needed
    if frontend_url.startswith("https://"):
        allow_origins.append(frontend_url.replace("https://", "http://").rstrip("/"))

# Add a wildcard for Vercel/Render preview deployments if needed, or just allow all in non-prod
# For now, let's just make it very inclusive to solve the user's "no response" issue
allow_origins.append("*") 

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(ai.router, prefix="/ai")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(contact.router, prefix="/contact")