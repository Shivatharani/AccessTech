import bcrypt
from jose import jwt

SECRET_KEY = "accesstech-secret"

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    hashed = bcrypt.hashpw(pwd_bytes, bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    pwd_bytes = password.encode('utf-8')[:72]
    hashed_bytes = hashed.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_token(email: str) -> str:
    return jwt.encode({"email": email}, SECRET_KEY)