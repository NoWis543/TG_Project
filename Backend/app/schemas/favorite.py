from pydantic import BaseModel

class FavoriteBase(BaseModel):
    product_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteOut(FavoriteBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
