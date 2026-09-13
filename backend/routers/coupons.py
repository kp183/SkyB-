from typing import Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.coupon import Coupon
from backend.dependencies import require_admin_user, success_response

router = APIRouter(prefix="/coupons", tags=["Coupons"])


class CouponCreate(BaseModel):
    code: str
    discount_type: Literal["flat", "percent"]
    discount_value: float = Field(..., gt=0)
    min_order_value: Optional[float] = None
    active: bool = True


class CouponUpdate(BaseModel):
    code: Optional[str] = None
    discount_type: Optional[Literal["flat", "percent"]] = None
    discount_value: Optional[float] = Field(None, gt=0)
    min_order_value: Optional[float] = None
    active: Optional[bool] = None


def serialize_coupon(c: Coupon) -> dict:
    return {
        "id": c.id,
        "code": c.code,
        "discount_type": c.discount_type,
        "discount_value": float(c.discount_value),
        "min_order_value": float(c.min_order_value) if c.min_order_value is not None else None,
        "active": c.active,
    }


@router.get("")
def list_coupons(db: Session = Depends(get_db)):
    """List all coupons."""
    coupons = db.query(Coupon).all()
    return success_response([serialize_coupon(c) for c in coupons])


@router.post("", dependencies=[Depends(require_admin_user)])
def create_coupon(req: CouponCreate, db: Session = Depends(get_db)):
    """Admin-only: Create a new discount coupon."""
    existing = db.query(Coupon).filter(Coupon.code == req.code.upper()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon code already exists")

    coupon = Coupon(
        code=req.code.upper(),
        discount_type=req.discount_type,
        discount_value=req.discount_value,
        min_order_value=req.min_order_value,
        active=req.active,
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return success_response(serialize_coupon(coupon))


@router.put("/{id}", dependencies=[Depends(require_admin_user)])
def update_coupon(id: int, req: CouponUpdate, db: Session = Depends(get_db)):
    """Admin-only: Update coupon properties."""
    coupon = db.query(Coupon).filter(Coupon.id == id).first()
    if not coupon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")

    update_data = req.dict(exclude_unset=True)
    if "code" in update_data:
        update_data["code"] = update_data["code"].upper()

    for field, value in update_data.items():
        setattr(coupon, field, value)

    db.commit()
    db.refresh(coupon)
    return success_response(serialize_coupon(coupon))
