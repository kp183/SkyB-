from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    discount_applied = Column(Numeric(10, 2), default=0.0, nullable=False)
    applied_coupon_code = Column(String(50), nullable=True)
    status = Column(
        Enum(
            "pending_payment",
            "placed",
            "confirmed",
            "shipped",
            "delivered",
            "payment_failed",
            "cancelled",
            name="order_status_enum",
        ),
        default="pending_payment",
        nullable=False,
    )
    delivery_address = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)
    size_at_purchase = Column(String(50), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
