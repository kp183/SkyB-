from sqlalchemy import Column, Integer, String, Numeric, Boolean, Enum
from backend.db import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_type = Column(Enum("flat", "percent", name="coupon_discount_type_enum"), nullable=False)
    discount_value = Column(Numeric(10, 2), nullable=False)
    min_order_value = Column(Numeric(10, 2), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
