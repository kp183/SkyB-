from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.order import Order
from backend.models.product import Product
from backend.models.user import User
from backend.dependencies import require_admin_user, success_response
from backend.routers.orders import serialize_order

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin_user)])


class OrderStatusUpdate(BaseModel):
    status: str


@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Admin summary statistics: total revenue, orders, low stock items, total customers."""
    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0.0))
        .filter(Order.status.in_(["placed", "confirmed", "shipped", "delivered"]))
        .scalar()
    )
    total_orders = db.query(Order).count()
    low_stock_products = db.query(Product).filter(Product.stock_qty <= 5).all()
    total_customers = db.query(User).filter(User.role == "customer").count()

    return success_response({
        "total_revenue": float(total_revenue),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "low_stock_count": len(low_stock_products),
        "low_stock_items": [
            {"id": p.id, "name": p.name, "stock_qty": p.stock_qty}
            for p in low_stock_products
        ],
    })


@router.get("/orders")
def get_all_orders(
    order_status: Optional[str] = Query(None, alias="status", description="Filter by status"),
    db: Session = Depends(get_db),
):
    """Admin view of all customer orders, filterable by status."""
    query = db.query(Order)
    if order_status:
        query = query.filter(Order.status == order_status)
    orders = query.order_by(Order.created_at.desc()).all()
    return success_response([serialize_order(o) for o in orders])


@router.put("/orders/{id}/status")
def update_order_status(id: int, req: OrderStatusUpdate, db: Session = Depends(get_db)):
    """Admin update order status (placed -> confirmed -> shipped -> delivered, etc.)."""
    valid_statuses = [
        "pending_payment",
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "payment_failed",
        "cancelled",
    ]
    if req.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{req.status}'. Must be one of: {valid_statuses}",
        )

    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.status = req.status
    db.commit()
    db.refresh(order)
    return success_response(serialize_order(order))


@router.get("/customers")
def get_all_customers(db: Session = Depends(get_db)):
    """Admin list of registered customer accounts."""
    customers = db.query(User).filter(User.role == "customer").all()
    return success_response([
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in customers
    ])
