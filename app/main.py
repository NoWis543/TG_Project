from fastapi import FastAPI
from app.routes import auth

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Привет, FastAPI работает!"}

app.include_router(auth.router, prefix="/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
