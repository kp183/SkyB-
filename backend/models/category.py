from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.db import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)

    # Relationships
    products = relationship("Product", back_populates="category")
    bundle_associations = relationship("BundleAssociation", back_populates="category")
