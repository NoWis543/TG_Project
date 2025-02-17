import hashlib
import jwt
import datetime
from fastapi import HTTPException
from app.models import User

def hash_password(password: str) -> str:
    """Хеширует пароль с использованием SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

SECRET_KEY = "mysecretkey"  # Вынеси в .env в будущем

def create_jwt_token(data: dict):
    """Создает JWT-токен с истечением через 1 час"""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def authenticate_user(username: str, password: str, db):
    """Проверяет логин и пароль пользователя"""
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401, detail="Неверные учетные данные")
    return create_jwt_token({"sub": user.username})
