from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.category import Category
from backend.dependencies import require_admin_user, success_response

router = APIRouter(prefix="/categories", tags=["Categories"])


class CategoryCreate(BaseModel):
    name: str


@router.get("")
def list_categories(db: Session = Depends(get_db)):
    """List all categories."""
    categories = db.query(Category).all()
    return success_response([{"id": c.id, "name": c.name} for c in categories])


@router.post("", dependencies=[Depends(require_admin_user)])
def create_category(req: CategoryCreate, db: Session = Depends(get_db)):
    """Admin-only: Create a new category."""
    existing = db.query(Category).filter(Category.name == req.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    category = Category(name=req.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return success_response({"id": category.id, "name": category.name})
