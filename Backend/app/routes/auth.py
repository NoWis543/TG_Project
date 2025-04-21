from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.schemas.schemas import UserCreate, UserLogin
from app.security import hash_password, authenticate_user, create_jwt_token
from app.utils.auth import get_current_user  
from fastapi.security import OAuth2PasswordRequestForm

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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    token = authenticate_user(form_data.username, form_data.password, db)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me/")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["sub"]}
