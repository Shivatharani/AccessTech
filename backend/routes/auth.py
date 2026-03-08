from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime

from database import insert_data, fetch_data
from utils.auth_utils import hash_password, verify_password, create_token

router = APIRouter()


# -----------------------------
# Request Models
# -----------------------------

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    language: str
    level: str


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleLogin(BaseModel):
    token: str


# -----------------------------
# Signup API
# -----------------------------

@router.post("/signup")
def signup(user: SignupRequest):

    existing = fetch_data("users", "email", user.email)

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    insert_data("users", {
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "language": user.language,
        "level": user.level,
        "provider": "manual",
        "created_at": datetime.utcnow().isoformat()
    })

    return {"message": "Signup successful"}


# -----------------------------
# Login API
# -----------------------------

@router.post("/login")
def login(user: LoginRequest, request: Request):

    users = fetch_data("users", "email", user.email)

    if not users:
        raise HTTPException(status_code=404, detail="User not found")

    db_user = users[0]

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token(user.email)

    # store login activity
    insert_data("login_activity", {
        "email": user.email,
        "login_time": datetime.utcnow().isoformat(),
        "ip_address": request.client.host,
        "device": request.headers.get("user-agent")
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "language": db_user["language"],
        "level": db_user["level"]
    }


# -----------------------------
# Google Login (Temporary for testing)
# -----------------------------

@router.post("/google-login")
def google_login(data: GoogleLogin):

    email = data.token  # temporary simulation

    users = fetch_data("users", "email", email)

    if not users:

        insert_data("users", {
            "name": "Google User",
            "email": email,
            "provider": "google",
            "language": "English",
            "level": "Beginner",
            "created_at": datetime.utcnow().isoformat()
        })

    token = create_token(email)

    return {"access_token": token}