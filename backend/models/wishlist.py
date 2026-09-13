from sqlalchemy import Column, Integer, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    watch_price = Column(Numeric(10, 2), nullable=True)
    notified = Column(Boolean, default=False, nullable=False)
    notified_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", back_populates="wishlist_items")
