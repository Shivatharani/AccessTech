from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime

from database import insert_data, fetch_data
from utils.auth_utils import hash_password, verify_password, create_token
from oauth_google import verify_google_token

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str
    language: str
    level: str

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLogin(BaseModel):
    token: str


@router.post("/signup")
def signup(user: SignupRequest):

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

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


@router.post("/login")
def login(user: LoginRequest, request: Request):

    users = fetch_data("users", "email", user.email)

    if not users:
        raise HTTPException(status_code=404, detail="User not found")

    db_user = users[0]

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token(user.email)

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


@router.post("/google-login")
def google_login(data: GoogleLogin):

    idinfo = verify_google_token(data.token)

    email = idinfo["email"]
    name = idinfo.get("name", "Google User")

    users = fetch_data("users", "email", email)

    if not users:
        insert_data("users", {
            "name": name,
            "email": email,
            "provider": "google",
            "language": "English",
            "level": "Beginner",
            "created_at": datetime.utcnow().isoformat()
        })

    token = create_token(email)

    return {"access_token": token}