from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class CheckoutRequest(BaseModel):
    delivery_address: str = Field(..., min_length=5)


class MockPayRequest(BaseModel):
    order_id: int
    simulate_failure: bool = False


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    price_at_purchase: float
    size_at_purchase: Optional[str] = None
    subtotal: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    discount_applied: float
    applied_coupon_code: Optional[str] = None
    status: str
    delivery_address: str
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class MockPayResponse(BaseModel):
    order_id: int
    status: str
    payment_successful: bool
    message: str
