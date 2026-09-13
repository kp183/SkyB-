from typing import Optional, Literal
from pydantic import BaseModel, Field


class CouponCreate(BaseModel):
    code: str = Field(..., min_length=2)
    discount_type: Literal["flat", "percent"]
    discount_value: float = Field(..., gt=0)
    min_order_value: Optional[float] = Field(None, ge=0)
    active: bool = True


class CouponUpdate(BaseModel):
    code: Optional[str] = None
    discount_type: Optional[Literal["flat", "percent"]] = None
    discount_value: Optional[float] = Field(None, gt=0)
    min_order_value: Optional[float] = Field(None, ge=0)
    active: Optional[bool] = None


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: float
    min_order_value: Optional[float] = None
    active: bool

    class Config:
        from_attributes = True
