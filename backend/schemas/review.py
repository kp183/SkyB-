from typing import Optional
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=2)


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: Optional[int] = None
    rating: int
    comment: str

    class Config:
        from_attributes = True
