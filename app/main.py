from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from app.routes import auth

app = FastAPI(title="My API", description="API with JWT Authentication", version="1.0")

# Определяем OAuth2PasswordBearer (токен передается в Authorization Header)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login/")

@app.get("/")
async def read_root():
    return {"message": "Привет, FastAPI работает!"}

app.include_router(auth.router, prefix="/auth")

# ОПРЕДЕЛЯЕМ ПРАВИЛЬНУЮ OpenAPI-схему
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Твой API",
        version="1.0.0",
        description="Описание API",
        routes=app.routes,
    )

    # Настраиваем OAuth2PasswordBearer правильно (как на картинке друга)
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer"  # Правильная схема
        }
    }

    # Добавляем требование авторизации для всех эндпоинтов
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
