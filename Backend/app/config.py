from pydantic_settings import BaseSettings
from dotenv import load_dotenv

class Settings(BaseSettings):
    DATABASE_URL: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SECRET_KEY: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    OPENAI_API_KEY: str
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
settings = Settings()
