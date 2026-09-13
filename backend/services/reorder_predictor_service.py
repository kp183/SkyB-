"""
Recurring Essentials Predictor Service (P2 Feature)
Logic: Computes average order interval for recurring consumer items (diapers, wipes, formula)
and predicts next restock date.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.order import Order, OrderItem
from backend.models.product import Product


def predict_reorders_for_user(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """
    Analyzes historical orders for repeat products to project replenishment dates.
    """
    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id, Order.status.in_(["placed", "confirmed", "delivered"]))
        .order_by(Order.created_at.asc())
        .all()
    )

    if not orders:
        return []

    # Map product_id -> list of purchase timestamps
    product_purchases = {}
    for order in orders:
        for item in order.items:
            product_purchases.setdefault(item.product_id, []).append(order.created_at)

    predictions = []
    today = datetime.utcnow()

    for product_id, timestamps in product_purchases.items():
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            continue

        if len(timestamps) >= 2:
            intervals = [
                (timestamps[i] - timestamps[i - 1]).days
                for i in range(1, len(timestamps))
            ]
            avg_interval = max(7, sum(intervals) // len(intervals))
        else:
            # Default replenishment cycle for baby care products is 30 days
            avg_interval = 30

        last_ordered = timestamps[-1]
        predicted_date = last_ordered + timedelta(days=avg_interval)
        days_until = (predicted_date - today).days

        predictions.append({
            "product_id": product.id,
            "product_name": product.name,
            "image_url": product.image_url,
            "last_ordered_at": last_ordered.isoformat(),
            "predicted_reorder_date": predicted_date.strftime("%Y-%m-%d"),
            "estimated_interval_days": avg_interval,
            "due_soon": -2 <= days_until <= 2,
            "days_until_reorder": days_until,
        })

    return predictions
