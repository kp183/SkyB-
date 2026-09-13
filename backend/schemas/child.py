from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class ChildCreate(BaseModel):
    name: Optional[str] = None
    birth_date: date
    height_cm: Optional[int] = Field(None, gt=0)
    weight_kg: Optional[int] = Field(None, gt=0)


class ChildUpdate(BaseModel):
    name: Optional[str] = None
    birth_date: Optional[date] = None
    height_cm: Optional[int] = Field(None, gt=0)
    weight_kg: Optional[int] = Field(None, gt=0)


class ChildResponse(BaseModel):
    id: int
    user_id: int
    name: Optional[str] = None
    birth_date: date
    current_height_cm: Optional[int] = None
    current_weight_kg: Optional[int] = None

    class Config:
        from_attributes = True
