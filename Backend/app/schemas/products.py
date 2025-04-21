from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    category: str
    link: str

    class Config:
        from_attributes = True  # для Pydantic v2
        # orm_mode = True        # для Pydantic v1