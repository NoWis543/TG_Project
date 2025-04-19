from pydantic import BaseModel
from typing import List, Dict, Any

class BuildBase(BaseModel):
    name: str
    total_price: float
    components: List[Dict[str, Any]]  # список компонентов без user_id

class BuildCreate(BuildBase):
    pass

class BuildOut(BuildBase):
    id: int

    class Config:
        from_attributes = True
