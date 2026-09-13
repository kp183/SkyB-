"""
Smart Savings Agent Service (P1 Feature, with P0 Checkout Hook)
Logic: Evaluates active coupons against the non-bargained cart subtotal and
selects the SINGLE BEST coupon (no multi-coupon stacking).
Bargained items (is_bargained=True) are strictly exempt from discounting.
"""

from typing import Tuple, Optional
from sqlalchemy.orm import Session
from backend.models.coupon import Coupon


def calculate_best_savings(
    db: Session,
    non_bargained_subtotal: float,
) -> Tuple[float, Optional[str]]:
    """
    Finds the single coupon that produces the maximum discount on the non-bargained subtotal.
    Returns: (discount_amount, best_coupon_code)
    """
    if non_bargained_subtotal <= 0:
        return 0.0, None

    active_coupons = db.query(Coupon).filter(Coupon.active == True).all()
    if not active_coupons:
        return 0.0, None

    best_discount = 0.0
    best_coupon_code = None

    for coupon in active_coupons:
        min_val = float(coupon.min_order_value) if coupon.min_order_value is not None else 0.0
        if non_bargained_subtotal < min_val:
            continue

        val = float(coupon.discount_value)
        if coupon.discount_type == "percent":
            discount = round(non_bargained_subtotal * (val / 100.0), 2)
        else:  # flat discount
            discount = min(non_bargained_subtotal, val)

        if discount > best_discount:
            best_discount = discount
            best_coupon_code = coupon.code

    return best_discount, best_coupon_code
