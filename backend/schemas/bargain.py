from typing import Optional
from pydantic import BaseModel, Field


class BargainStartRequest(BaseModel):
    product_id: int


class BargainStartResponse(BaseModel):
    session_id: int
    product_id: int
    product_name: str
    original_price: float
    status: str


class BargainOfferRequest(BaseModel):
    session_id: int
    offer_price: float = Field(..., gt=0)


class BargainOfferResponse(BaseModel):
    counter_price: float
    message: str
    round_number: int
    status: str
    is_final_round: bool


class BargainAcceptRequest(BaseModel):
    session_id: int


class BargainAcceptResponse(BaseModel):
    session_id: int
    final_price: float
    status: str
    cart_item_id: int
    is_bargained: bool
