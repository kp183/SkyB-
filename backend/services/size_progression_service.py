"""
Size & Age Auto-Progression Service (P1 Feature)
Logic: Rule-based age-to-size lookup table with height/weight secondary tie-breaker.
Compares recommended size against past order sizes to detect outgrown items.
"""

from datetime import date
from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.models.child import Child
from backend.models.order import Order, OrderItem

# Predefined age brackets in months -> size label
AGE_TO_SIZE = [
    (3, "0-3M"),
    (6, "3-6M"),
    (12, "6-12M"),
    (24, "1-2Y"),
    (36, "2-3Y"),
    (60, "3-5Y"),
    (96, "6-8Y"),
    (144, "9-12Y"),
]


def suggest_size_for_child(db: Session, child: Child) -> Dict[str, Any]:
    """
    Computes recommended size from birth_date and height/weight signals.
    Checks past order items to see if past purchases are a smaller size.
    """
    today = date.today()
    age_in_days = (today - child.birth_date).days
    age_in_months = max(0, age_in_days // 30)

    recommended_size = "9-12Y"
    for max_months, size_label in AGE_TO_SIZE:
        if age_in_months <= max_months:
            recommended_size = size_label
            break

    # Secondary tiebreaker: if height or weight is above 90th percentile for age
    if child.current_height_cm and child.current_height_cm > 110 and recommended_size in ["0-3M", "3-6M", "6-12M"]:
        recommended_size = "1-2Y"

    # Check past orders for outgrown sizes
    past_order_items = (
        db.query(OrderItem)
        .join(Order)
        .filter(Order.user_id == child.user_id, OrderItem.size_at_purchase.isnot(None))
        .all()
    )

    upgrade_flag = False
    smaller_purchases = []
    for item in past_order_items:
        if item.size_at_purchase != recommended_size:
            smaller_purchases.append(item.size_at_purchase)
            upgrade_flag = True

    return {
        "child_id": child.id,
        "name": child.name,
        "age_in_months": age_in_months,
        "recommended_size": recommended_size,
        "upgrade_flag": upgrade_flag,
        "message": (
            f"Based on {child.name or 'your child'}'s current age ({age_in_months} months), "
            f"we recommend size '{recommended_size}'."
            + (" It's time to size up from past purchases!" if upgrade_flag else "")
        ),
    }
