from sqlalchemy.orm import Session
from app.models.models import Product, Favorite
from app.schemas import FavoriteCreate
from app.models.build import Build
from app.schemas.build import BuildCreate

def create_product(db: Session, name: str, price: float, category: str, link: str):
    product = Product(name=name, price=price, category=category, link=link)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_favorites_by_user(db: Session, user_id: int):
    return db.query(Favorite).filter(Favorite.user_id == user_id).all()


def add_favorite(db: Session, user_id: int, product_id: int):
    favorite = Favorite(user_id=user_id, product_id=product_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


def remove_favorite(db: Session, user_id: int, product_id: int):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id, Favorite.product_id == product_id
    ).first()
    if favorite:
        db.delete(favorite)
        db.commit()
    return favorite

def create_build(db: Session, build: dict) -> Build:
    db_build = Build(**build) 
    db.add(db_build)
    db.commit()
    db.refresh(db_build)
    return db_build


def get_builds(db: Session):
    return db.query(Build).all()

def get_builds_by_user(db: Session, user_id: int):
    return db.query(Build).filter(Build.user_id == user_id).all()

def delete_build(db: Session, build_id: int, user_id: int) -> bool:
    build = db.query(Build).filter(Build.id == build_id, Build.user_id == user_id).first()
    if build:
        db.delete(build)
        db.commit()
        return True
    return False
