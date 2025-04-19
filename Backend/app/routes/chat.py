from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.utils.chatgpt import ask_gpt
from app.utils.match_utils import fuzzy_match
from app.models.models import Product
from app.database import get_db

router = APIRouter()

@router.get("/build_pc")
def build_pc(prompt: str = Query(...), budget: int = Query(...), db: Session = Depends(get_db)):
    # 1. Получить строки от GPT
    gpt_lines = [line.strip(" -•\n") for line in ask_gpt(prompt) if isinstance(line, str) and line.strip()]


    # 2. Все товары
    products = db.query(Product).all()
    products_list = [p.to_dict() for p in products]

    # 3. Совпадения и несопоставленные
    matched, unmatched = fuzzy_match(gpt_lines, products_list, return_unmatched=True)

    # 4. Отфильтровать по бюджету
    filtered = []
    total = 0
    for item in sorted(matched, key=lambda x: x["price"] or 0):
        if item["price"] is not None and (total + item["price"]) <= budget:
            filtered.append(item)
            total += item["price"]

    return {
        "gpt_raw": gpt_lines,
        "products": filtered,
        "unmatched": unmatched,
        "total_price": total
    }
