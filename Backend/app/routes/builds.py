from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.build import BuildCreate, BuildOut
from app.models.crud import create_build, get_builds, get_builds_by_user, delete_build
from app.utils.auth import get_current_user
from app.models.models import User  
from fastapi import HTTPException

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
def list_user_builds(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_builds_by_user(db, user_id=current_user.id)

@router.delete("/builds/{build_id}")
def delete_user_build(
    build_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = delete_build(db, build_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Сборка не найдена")
    return {"detail": "Сборка удалена"}