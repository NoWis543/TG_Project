from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
from sqlalchemy.orm import DeclarativeBase

# Создаём подключение к БД
engine = create_engine(settings.DATABASE_URL)

print(settings.DATABASE_URL)
# Создаём сессию для работы с БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс моделей
Base = declarative_base()
