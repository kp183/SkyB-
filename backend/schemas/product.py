from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str
    description: str
    category_id: int
    subcategory: Optional[str] = None
    gender: Optional[str] = None
    age_group: str
    age_min_months: Optional[int] = None
    age_max_months: Optional[int] = None
    size: Optional[str] = None
    price: float = Field(..., gt=0)
    mrp: Optional[float] = Field(None, gt=0)
    min_price: float = Field(..., gt=0)
    max_price: float = Field(..., gt=0)
    stock_qty: int = Field(0, ge=0)
    image_url: Optional[str] = None
    safety_tags: Optional[List[str]] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory: Optional[str] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None
    age_min_months: Optional[int] = None
    age_max_months: Optional[int] = None
    size: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    mrp: Optional[float] = Field(None, gt=0)
    min_price: Optional[float] = Field(None, gt=0)
    max_price: Optional[float] = Field(None, gt=0)
    stock_qty: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    safety_tags: Optional[List[str]] = None


class ProductResponse(ProductBase):
    id: int
    safety_score: Optional[str] = None
    safety_summary: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
