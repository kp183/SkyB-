from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.child import Child
from backend.models.user import User
from backend.dependencies import get_current_user, success_response

router = APIRouter(prefix="/children", tags=["Children Profiles"])


class ChildCreate(BaseModel):
    name: Optional[str] = None
    birth_date: date
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None


class ChildUpdate(BaseModel):
    name: Optional[str] = None
    birth_date: Optional[date] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None


def serialize_child(c: Child) -> dict:
    return {
        "id": c.id,
        "user_id": c.user_id,
        "name": c.name,
        "birth_date": c.birth_date.isoformat() if c.birth_date else None,
        "current_height_cm": c.current_height_cm,
        "current_weight_kg": c.current_weight_kg,
    }


@router.get("")
def list_children(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all children profiles associated with the logged-in user."""
    children = db.query(Child).filter(Child.user_id == current_user.id).all()
    return success_response([serialize_child(c) for c in children])


@router.post("")
def add_child(
    req: ChildCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new child profile for Size & Age Auto-Progression."""
    child = Child(
        user_id=current_user.id,
        name=req.name,
        birth_date=req.birth_date,
        current_height_cm=req.height_cm,
        current_weight_kg=req.weight_kg,
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    return success_response(serialize_child(child))


@router.put("/{id}")
def update_child(
    id: int,
    req: ChildUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update child age/height/weight measurements."""
    child = (
        db.query(Child)
        .filter(Child.id == id, Child.user_id == current_user.id)
        .first()
    )
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child profile not found")

    if req.name is not None:
        child.name = req.name
    if req.birth_date is not None:
        child.birth_date = req.birth_date
    if req.height_cm is not None:
        child.current_height_cm = req.height_cm
    if req.weight_kg is not None:
        child.current_weight_kg = req.weight_kg

    db.commit()
    db.refresh(child)
    return success_response(serialize_child(child))
