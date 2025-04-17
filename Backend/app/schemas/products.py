from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    category: str
    link: str

    class Config:
        from_attributes = True  # если у тебя Pydantic v2
        # orm_mode = True        # если Pydantic v1