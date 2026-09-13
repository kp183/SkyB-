from typing import List, Optional
from pydantic import BaseModel, Field


class CartAddRequest(BaseModel):
    product_id: int
    quantity: int = Field(1, ge=1)


class CartUpdateRequest(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    original_price: float
    agreed_price: float
    is_bargained: bool
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class CartSummaryResponse(BaseModel):
    items: List[CartItemResponse]
    total_amount: float
    non_bargained_subtotal: float
    bargained_subtotal: float
