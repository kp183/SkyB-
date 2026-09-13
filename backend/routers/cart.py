from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.cart import CartItem
from backend.models.product import Product
from backend.models.user import User
from backend.schemas.cart import CartAddRequest, CartUpdateRequest, CartItemResponse, CartSummaryResponse
from backend.dependencies import get_current_user, success_response

router = APIRouter(prefix="/cart", tags=["Cart"])


def serialize_cart_item(item: CartItem) -> dict:
    return {
        "id": item.id,
        "product_id": item.product_id,
        "product_name": item.product.name if item.product else None,
        "product_image": item.product.image_url if item.product else None,
        "original_price": float(item.product.price) if item.product else 0.0,
        "agreed_price": float(item.agreed_price),
        "is_bargained": item.is_bargained,
        "quantity": item.quantity,
        "subtotal": float(item.agreed_price) * item.quantity,
    }


@router.get("")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all cart items for the logged-in user."""
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    serialized = [serialize_cart_item(item) for item in items]

    total_amount = sum(item["subtotal"] for item in serialized)
    non_bargained_subtotal = sum(item["subtotal"] for item in serialized if not item["is_bargained"])
    bargained_subtotal = sum(item["subtotal"] for item in serialized if item["is_bargained"])

    return success_response({
        "items": serialized,
        "total_amount": total_amount,
        "non_bargained_subtotal": non_bargained_subtotal,
        "bargained_subtotal": bargained_subtotal,
    })


@router.post("/add")
def add_to_cart(
    req: CartAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a product to cart (or update quantity if already present)."""
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    existing_item = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id, CartItem.product_id == req.product_id)
        .first()
    )

    if existing_item:
        existing_item.quantity += req.quantity
        db.commit()
        db.refresh(existing_item)
        return success_response(serialize_cart_item(existing_item))

    new_item = CartItem(
        user_id=current_user.id,
        product_id=product.id,
        quantity=req.quantity,
        agreed_price=product.price,
        is_bargained=False,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return success_response(serialize_cart_item(new_item))


@router.put("/{item_id}")
def update_cart_item(
    item_id: int,
    req: CartUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update item quantity in cart."""
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    item.quantity = req.quantity
    db.commit()
    db.refresh(item)
    return success_response(serialize_cart_item(item))


@router.delete("/{item_id}")
def delete_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove item from cart."""
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return success_response({"message": f"Cart item {item_id} removed"})
