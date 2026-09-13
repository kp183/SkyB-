"""
Price-Drop Watcher Service (P2 Feature)
Logic: Threshold comparison for wishlist items.
Surfaces price-drops via in-app notified flag (no external SMS/email needed).
"""

from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.wishlist import WishlistItem
from backend.models.product import Product


def check_price_drops(db: Session) -> int:
    """
    Scans watched wishlist items. If current price <= watch_price,
    sets notified = True and notified_at = now().
    Returns count of updated items.
    """
    watched_items = (
        db.query(WishlistItem)
        .join(Product)
        .filter(WishlistItem.watch_price.isnot(None), WishlistItem.notified == False)
        .all()
    )

    triggered_count = 0
    now = datetime.utcnow()

    for item in watched_items:
        if item.product and float(item.product.price) <= float(item.watch_price):
            item.notified = True
            item.notified_at = now
            triggered_count += 1

    if triggered_count > 0:
        db.commit()

    return triggered_count


def get_user_price_drop_alerts(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """Retrieves all triggered price-drop notifications for a user."""
    items = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.notified == True)
        .all()
    )
    return [
        {
            "wishlist_id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else None,
            "current_price": float(item.product.price) if item.product else 0.0,
            "watch_price": float(item.watch_price) if item.watch_price else 0.0,
            "notified_at": item.notified_at.isoformat() if item.notified_at else None,
        }
        for item in items
    ]
