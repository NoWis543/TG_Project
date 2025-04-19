from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.build import BuildCreate, BuildOut
from app.models.crud import create_build, get_builds
from app.utils.auth import get_current_user
from app.models.models import User  # модель пользователя

router = APIRouter()

@router.post("/builds/", response_model=BuildOut)
def save_build(
    build: BuildCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    build_data = build.dict()
    build_data["user_id"] = current_user.id
    return create_build(db, build_data)

@router.get("/builds/", response_model=list[BuildOut])
def list_builds(db: Session = Depends(get_db)):
    return get_builds(db)
