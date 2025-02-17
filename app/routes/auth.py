from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.schemas.schemas import UserCreate, UserLogin
from app.security import hash_password, authenticate_user, create_jwt_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, password_hash=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Пользователь зарегистрирован"}

@router.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = authenticate_user(user.username, user.password, db)
    return {"access_token": token, "token_type": "bearer"}
