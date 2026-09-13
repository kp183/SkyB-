from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    age_group = Column(String(50), nullable=False, index=True)
    size = Column(String(50), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    min_price = Column(Numeric(10, 2), nullable=False)
    max_price = Column(Numeric(10, 2), nullable=False)
    stock_qty = Column(Integer, default=0, nullable=False)
    image_url = Column(String(1024), nullable=True)
    safety_tags = Column(JSON, nullable=True)
    safety_score = Column(Enum("Low", "Medium", "Good", name="safety_score_enum"), nullable=True)
    safety_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    bargain_sessions = relationship("BargainSession", back_populates="product")
