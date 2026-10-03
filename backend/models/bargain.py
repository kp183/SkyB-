from datetime import datetime
from sqlalchemy import Column, Integer, Text, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class BargainSession(Base):
    __tablename__ = "bargain_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum("ongoing", "accepted", "rejected", name="bargain_status_enum"), default="ongoing", nullable=False)
    final_price = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="bargain_sessions")
    product = relationship("Product", back_populates="bargain_sessions")
    offers = relationship("BargainOffer", back_populates="session", cascade="all, delete-orphan")


class BargainOffer(Base):
    __tablename__ = "bargain_offers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("bargain_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    round_number = Column(Integer, nullable=False)  # 1, 2, 3 (capped at 3)
    offer_price = Column(Numeric(10, 2), nullable=False)
    counter_price = Column(Numeric(10, 2), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    session = relationship("BargainSession", back_populates="offers")
