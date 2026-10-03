from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.order import Order, OrderItem
from backend.models.cart import CartItem
from backend.models.user import User
from backend.schemas.order import (
    CheckoutRequest,
    MockPayRequest,
    OrderResponse,
    OrderItemResponse,
    MockPayResponse,
)
from backend.dependencies import get_current_user, success_response
from backend.services.savings_service import calculate_best_savings

router = APIRouter(tags=["Checkout & Orders"])


def serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "user_id": order.user_id,
        "total_amount": float(order.total_amount),
        "discount_applied": float(order.discount_applied),
        "applied_coupon_code": order.applied_coupon_code,
        "status": order.status,
        "delivery_address": order.delivery_address,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else None,
                "quantity": item.quantity,
                "price_at_purchase": float(item.price_at_purchase),
                "size_at_purchase": item.size_at_purchase,
                "subtotal": float(item.price_at_purchase) * item.quantity,
            }
            for item in order.items
        ],
    }


@router.post("/checkout")
def checkout(
    req: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Creates an order with status='pending_payment'.
    Exempts is_bargained items from coupon discounts (coupons apply only to non-bargained subtotal).
    """
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    # Compute subtotals
    non_bargained_subtotal = sum(
        float(item.agreed_price) * item.quantity for item in cart_items if not item.is_bargained
    )
    bargained_subtotal = sum(
        float(item.agreed_price) * item.quantity for item in cart_items if item.is_bargained
    )

    # Apply Smart Savings Agent (P1 hook, defaults to 0 discount if no active coupons or service stub)
    discount, coupon_code = calculate_best_savings(db, non_bargained_subtotal)

    total_amount = max(0.0, (non_bargained_subtotal - discount) + bargained_subtotal)

    try:
        order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            discount_applied=discount,
            applied_coupon_code=coupon_code,
            status="pending_payment",
            delivery_address=req.delivery_address,
        )
        db.add(order)
        db.flush()  # Flush to get order.id

        for item in cart_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=item.agreed_price,
                size_at_purchase=item.product.size if item.product else None,
            )
            db.add(order_item)

        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(order)
    return success_response(serialize_order(order))


@router.post("/orders/mock-pay")
def mock_pay(
    req: MockPayRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Simulates payment gateway.
    Accepts optional simulate_failure: bool so faculty can be shown both success and failure paths.
    On success: order status -> 'placed', cart cleared (atomic transaction).
    On failure: order status -> 'payment_failed', cart preserved.
    """
    order = (
        db.query(Order)
        .filter(Order.id == req.order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.status not in ["pending_payment", "payment_failed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order cannot be paid in current status '{order.status}'",
        )

    if req.simulate_failure:
        try:
            order.status = "payment_failed"
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(order)
        return success_response({
            "order_id": order.id,
            "status": order.status,
            "payment_successful": False,
            "message": "Payment simulation failed as requested. Cart preserved for retry.",
        })

    # Payment successful: atomic update of order status + cart clearing in single commit
    try:
        order.status = "placed"
        # Clear user's cart on payment success
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(order)
    return success_response({
        "order_id": order.id,
        "status": order.status,
        "payment_successful": True,
        "message": "Payment completed successfully. Order placed.",
    })


@router.get("/orders")
def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List authenticated user's order history."""
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return success_response([serialize_order(o) for o in orders])


@router.get("/orders/{id}")
def get_order(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details of a single order."""
    order = (
        db.query(Order)
        .filter(Order.id == id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return success_response(serialize_order(order))
