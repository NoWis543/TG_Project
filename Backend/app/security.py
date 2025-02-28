import hashlib
import jwt
import datetime
from fastapi import HTTPException
from app.models import User
from app.config import settings

def hash_password(password: str) -> str:
    """Хеширует пароль с использованием SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

SECRET_KEY = settings.SECRET_KEY

def create_jwt_token(data: dict):
    """Создает JWT-токен с истечением через N минут из .env"""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")


def authenticate_user(username: str, password: str, db):
    """Проверяет логин и пароль пользователя"""
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401, detail="Неверные учетные данные")
    return create_jwt_token({"sub": user.username})
