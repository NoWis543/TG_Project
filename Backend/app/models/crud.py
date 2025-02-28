from sqlalchemy.orm import Session
from app.models.models import Product

def create_product(db: Session, name: str, price: float, category: str, link: str):
    product = Product(name=name, price=price, category=category, link=link)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
