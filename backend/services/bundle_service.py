"""
Grows-With-Them Bundle Service (P2 Feature)
Logic: Recommends next developmental stage products in the same category
based on age group progression.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.product import Product
from backend.models.bundle import BundleAssociation

# Default hardcoded bracket progression mapping
NEXT_AGE_MAP = {
    "0-3m": "3-6m",
    "3-6m": "6-9m",
    "6-9m": "9-12m",
    "9-12m": "1-2y",
    "1-2y": "2-3y",
    "2-3y": "3-5y",
    "3-5y": "6-8y",
    "6-8y": "9-12y",
}


def suggest_bundles_for_product(db: Session, product: Product, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Finds products for the next developmental age bracket in the same category.
    """
    next_bracket = NEXT_AGE_MAP.get(product.age_group.lower(), "1-2y")

    # Check database bundle_associations first if populated
    assoc = (
        db.query(BundleAssociation)
        .filter(
            BundleAssociation.from_age_group == product.age_group,
            BundleAssociation.category_id == product.category_id,
        )
        .first()
    )
    if assoc:
        next_bracket = assoc.to_age_group

    matching_products = (
        db.query(Product)
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.age_group.ilike(f"%{next_bracket}%"),
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": p.id,
            "name": p.name,
            "age_group": p.age_group,
            "price": float(p.price),
            "image_url": p.image_url,
            "bundle_type": "Grows-With-Them Stage",
            "message": f"Pre-order or bundle for the upcoming '{next_bracket}' stage!",
        }
        for p in matching_products
    ]
