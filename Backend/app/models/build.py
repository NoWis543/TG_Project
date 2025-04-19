from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Build(Base):
    __tablename__ = "builds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # если есть пользователи
    name = Column(String, nullable=False)
    total_price = Column(Float, nullable=False)
    components = Column(JSON, nullable=False)

    user = relationship("User", back_populates="builds")
