from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.models import Favorite, User, Product  # Модель избранного и пользователь
from app.schemas import FavoriteCreate, FavoriteOut # Схемы для валидации
from app.schemas.products import ProductOut  # Схемы для валидации
from app.database import get_db  # Функция получения сессии БД
from app.utils.auth import get_current_user  # Получение текущего пользователя по токену

router = APIRouter()

@router.get("/", response_model=List[ProductOut])
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite_ids = (
        db.query(Favorite.product_id)
        .filter(Favorite.user_id == current_user.id)
        .subquery()
    )

    products = db.query(Product).filter(Product.id.in_(favorite_ids)).all()
    return products

@router.post("/", response_model=FavoriteOut)
def add_favorite(fav: FavoriteCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter_by(user_id=current_user.id, product_id=fav.product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    favorite = Favorite(user_id=current_user.id, product_id=fav.product_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

@router.delete("/{product_id}")
def remove_favorite(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter_by(user_id=current_user.id, product_id=product_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(fav)
    db.commit()
    return {"detail": "Removed"}
