from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.wishlist import WishlistItem
from backend.models.product import Product
from backend.models.user import User
from backend.dependencies import get_current_user, success_response

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


class WishlistAddRequest(BaseModel):
    product_id: int
    watch_price: Optional[float] = None


def serialize_wishlist_item(item: WishlistItem) -> dict:
    return {
        "id": item.id,
        "product_id": item.product_id,
        "product_name": item.product.name if item.product else None,
        "product_image": item.product.image_url if item.product else None,
        "current_price": float(item.product.price) if item.product else 0.0,
        "watch_price": float(item.watch_price) if item.watch_price is not None else None,
        "notified": item.notified,
        "notified_at": item.notified_at.isoformat() if item.notified_at else None,
    }


@router.get("")
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all wishlist items for the logged-in user."""
    items = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()
    return success_response([serialize_wishlist_item(item) for item in items])


@router.post("/add")
def add_to_wishlist(
    req: WishlistAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a product to wishlist with an optional watch price for the Price-Drop Watcher."""
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == req.product_id)
        .first()
    )
    if existing:
        if req.watch_price is not None:
            existing.watch_price = req.watch_price
            existing.notified = False
            db.commit()
            db.refresh(existing)
        return success_response(serialize_wishlist_item(existing))

    item = WishlistItem(
        user_id=current_user.id,
        product_id=product.id,
        watch_price=req.watch_price,
        notified=False,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return success_response(serialize_wishlist_item(item))


@router.delete("/{item_id}")
def delete_wishlist_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from the user's wishlist."""
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.id == item_id, WishlistItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
    return success_response({"message": f"Wishlist item {item_id} removed"})
