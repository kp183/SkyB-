from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class Child(Base):
    __tablename__ = "children"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=True)
    birth_date = Column(Date, nullable=False)
    current_height_cm = Column(Integer, nullable=True)
    current_weight_kg = Column(Integer, nullable=True)

    # Relationships
    user = relationship("User", back_populates="children")
