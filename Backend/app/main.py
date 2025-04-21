from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.routes import products
from app.routes import favorites
from app.routes import chat
from app.routes import builds

app = FastAPI(title="My API", description="API with JWT Authentication", version="1.0")

#CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login/")

@app.get("/")
async def read_root():
    return {"message": "Привет, FastAPI работает!"}

app.include_router(auth.router, prefix="/auth")
app.include_router(products.router)
app.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
app.include_router(chat.router)
app.include_router(builds.router)

# OpenAPI-схема
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Твой API",
        version="1.0.0",
        description="Описание API",
        routes=app.routes,
    )

    
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer"  
        }
    }

    # требование авторизации для всех эндпоинтов
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
