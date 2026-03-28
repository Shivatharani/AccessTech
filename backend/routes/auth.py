from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from database import insert_data, fetch_data, update_data
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

class UpdateProfileRequest(BaseModel):
    email: str
    language: Optional[str] = None
    level: Optional[str] = None


@router.post("/signup")
def signup(user: SignupRequest):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = fetch_data("users", "email", user.email)

    if isinstance(existing, dict) and existing.get("error"):
        raise HTTPException(status_code=500, detail=f"Database lookup error: {existing.get('message')}")

    if isinstance(existing, list) and len(existing) > 0:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    res = insert_data("users", {
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "language": user.language,
        "level": user.level,
        "provider": "manual",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    if isinstance(res, dict) and res.get("error"):
        raise HTTPException(status_code=500, detail=f"Signup failed: {res.get('message', 'Unknown error')}")

    return {"message": "Signup successful"}


@router.post("/login")
def login(user: LoginRequest, request: Request):
    users = fetch_data("users", "email", user.email)

    if isinstance(users, dict) and users.get("error"):
        raise HTTPException(status_code=500, detail=f"Database error during login: {users.get('message')}")

    if not isinstance(users, list) or len(users) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    db_user = users[0]

    # Handle users who signed up via Google and don't have a password
    if not db_user.get("password"):
        raise HTTPException(
            status_code=400,
            detail="This account uses Google Login. Please use 'Sign in with Google'."
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token(user.email)

    insert_data("login_activity", {
        "email": user.email,
        "login_time": datetime.utcnow().isoformat() + "Z",
        "ip_address": request.client.host,
        "device": request.headers.get("user-agent")
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "language": db_user.get("language", "English"),
        "level": db_user.get("level", "Beginner"),
        "name": db_user.get("name", db_user.get("email").split("@")[0])
    }


@router.post("/google-login")
def google_login(data: GoogleLogin, request: Request):
    try:
        idinfo = verify_google_token(data.token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google authentication failed: {str(e)}")

    email = idinfo["email"]
    name = idinfo.get("name", "Google User")

    users = fetch_data("users", "email", email)

    # Treat a DB error as a 500, not as "user not found"
    if isinstance(users, dict) and users.get("error"):
        raise HTTPException(status_code=500, detail=f"Database error: {users.get('message')}")

    if not isinstance(users, list) or len(users) == 0:
        res = insert_data("users", {
            "name": name,
            "email": email,
            "provider": "google",
            "language": "English",
            "level": "Beginner",
            "created_at": datetime.utcnow().isoformat() + "Z"
        })
        if isinstance(res, dict) and res.get("error"):
            raise HTTPException(status_code=500, detail=f"Failed to create user: {res.get('message')}")

        # Re-fetch after insert so we return the persisted record
        users = fetch_data("users", "email", email)
        if isinstance(users, dict) and users.get("error"):
            raise HTTPException(status_code=500, detail=f"Database error after insert: {users.get('message')}")

    insert_data("login_activity", {
        "email": email,
        "login_time": datetime.utcnow().isoformat() + "Z",
        "ip_address": request.client.host,
        "device": request.headers.get("user-agent")
    })

    token = create_token(email)

    user_data = users[0] if isinstance(users, list) and len(users) > 0 else {}

    return {
        "access_token": token,
        "email": email,
        "language": user_data.get("language", "English"),
        "level": user_data.get("level", "Beginner"),
        "name": user_data.get("name", email.split("@")[0])
    }


@router.post("/update-profile")
def update_profile(data: UpdateProfileRequest):
    users = fetch_data("users", "email", data.email)

    if isinstance(users, dict) and users.get("error"):
        raise HTTPException(status_code=500, detail=f"Database error: {users.get('message')}")

    if not isinstance(users, list) or len(users) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = {}
    if data.language:
        update_fields["language"] = data.language
    if data.level:
        update_fields["level"] = data.level

    if update_fields:
        res = update_data("users", "email", data.email, update_fields)
        if isinstance(res, dict) and res.get("error"):
            raise HTTPException(status_code=500, detail=f"Update failed: {res.get('message')}")

    return {"message": "Profile updated successfully"}