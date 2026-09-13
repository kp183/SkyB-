from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class WishlistAddRequest(BaseModel):
    product_id: int
    watch_price: Optional[float] = Field(None, gt=0)


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    current_price: float
    watch_price: Optional[float] = None
    notified: bool
    notified_at: Optional[datetime] = None

    class Config:
        from_attributes = True
