from typing import List, Optional
from pydantic import BaseModel


class SafetyBadgeResponse(BaseModel):
    product_id: int
    safety_score: Optional[str] = None
    safety_summary: Optional[str] = None
    safety_tags: List[str] = []


class SubstituteResponse(BaseModel):
    product_id: int
    name: str
    price: float
    stock_qty: int
    image_url: Optional[str] = None
    score: int
    reason: str


class SizeSuggestionResponse(BaseModel):
    child_id: int
    name: Optional[str] = None
    age_in_months: int
    recommended_size: str
    upgrade_flag: bool
    message: str


class ReorderPredictionResponse(BaseModel):
    product_id: int
    product_name: str
    image_url: Optional[str] = None
    last_ordered_at: str
    predicted_reorder_date: str
    estimated_interval_days: int
    due_soon: bool
    days_until_reorder: int


class BundleSuggestionResponse(BaseModel):
    product_id: int
    name: str
    age_group: str
    price: float
    image_url: Optional[str] = None
    bundle_type: str
    message: str
