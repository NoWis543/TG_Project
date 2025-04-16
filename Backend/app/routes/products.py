from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product

router = APIRouter(tags=["Products"])

@router.get("/products/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [p.to_dict() for p in products]
