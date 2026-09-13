from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class BundleAssociation(Base):
    __tablename__ = "bundle_associations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    from_age_group = Column(String(50), nullable=False, index=True)
    to_age_group = Column(String(50), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="bundle_associations")
