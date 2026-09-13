"""
Smart Substitution Service (P1 Feature)
Logic: Nearest-neighbor heuristic scoring on structured attributes for out-of-stock products.
Scoring: Same category (+2), same age_group (+2), price within 20% (+1).
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.product import Product


def find_substitutes(db: Session, product: Product, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Finds and ranks in-stock alternatives for an out-of-stock product.
    """
    # Find in-stock candidates
    candidates = (
        db.query(Product)
        .filter(Product.id != product.id, Product.stock_qty > 0)
        .all()
    )

    scored_candidates = []
    base_price = float(product.price)

    for cand in candidates:
        score = 0
        reasons = []

        if cand.category_id == product.category_id:
            score += 2
            reasons.append("Same category")

        if cand.age_group == product.age_group:
            score += 2
            reasons.append("Same age group")

        cand_price = float(cand.price)
        if base_price > 0 and abs(cand_price - base_price) / base_price <= 0.20:
            score += 1
            reasons.append("Similar price point (within 20%)")

        if score > 0:
            scored_candidates.append({
                "product_id": cand.id,
                "name": cand.name,
                "price": cand_price,
                "stock_qty": cand.stock_qty,
                "image_url": cand.image_url,
                "score": score,
                "reason": " & ".join(reasons) if reasons else "Good alternative",
            })

    # Sort descending by score, then price
    scored_candidates.sort(key=lambda x: (x["score"], -x["price"]), reverse=True)
    return scored_candidates[:limit]
