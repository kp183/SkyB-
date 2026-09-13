from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.bargain import BargainSession, BargainOffer
from backend.models.product import Product
from backend.models.cart import CartItem
from backend.models.user import User
from backend.schemas.bargain import (
    BargainStartRequest,
    BargainOfferRequest,
    BargainAcceptRequest,
    BargainStartResponse,
    BargainOfferResponse,
    BargainAcceptResponse,
)
from backend.dependencies import get_current_user, success_response
from backend.services.bargain_service import process_offer

router = APIRouter(prefix="/bargain", tags=["Bargain Assistant"])


@router.post("/start")
def start_bargain_session(
    req: BargainStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Step 1: Start negotiation session for a product.
    Returns session_id for subsequent offer rounds.
    """
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    session = BargainSession(
        user_id=current_user.id,
        product_id=product.id,
        status="ongoing",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return success_response({
        "session_id": session.id,
        "product_id": product.id,
        "product_name": product.name,
        "original_price": float(product.price),
        "status": session.status,
    })


@router.post("/offer")
def make_bargain_offer(
    req: BargainOfferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Step 2: Submit customer offer for a round (max 3 rounds).
    Records bargain_offers row and returns system counter-offer with LLM message.
    """
    session = (
        db.query(BargainSession)
        .filter(BargainSession.id == req.session_id, BargainSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bargain session not found")

    if session.status != "ongoing":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Session is already closed with status '{session.status}'",
        )

    product = db.query(Product).filter(Product.id == session.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Delegate pricing bounds check and phrasing to bargain_service
    result = process_offer(db=db, session=session, product=product, offer_price=req.offer_price)

    return success_response(result)


@router.post("/accept")
def accept_bargain(
    req: BargainAcceptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Step 3: Customer accepts the negotiated deal.
    Sets final_price, marks session accepted, and applies the price to cart
    with is_bargained=true (auto-inserting item at qty=1 if not already present).
    """
    session = (
        db.query(BargainSession)
        .filter(BargainSession.id == req.session_id, BargainSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bargain session not found")

    latest_offer = (
        db.query(BargainOffer)
        .filter(BargainOffer.session_id == session.id)
        .order_by(BargainOffer.round_number.desc())
        .first()
    )
    if not latest_offer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No offers found in this session")

    # Final price is the system counter price (or customer offer if accepted directly)
    final_price = latest_offer.counter_price
    session.final_price = final_price
    session.status = "accepted"

    # Cart handoff per business rule:
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id, CartItem.product_id == session.product_id)
        .first()
    )

    if cart_item:
        cart_item.agreed_price = final_price
        cart_item.is_bargained = True
    else:
        cart_item = CartItem(
            user_id=current_user.id,
            product_id=session.product_id,
            quantity=1,
            agreed_price=final_price,
            is_bargained=True,
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return success_response({
        "session_id": session.id,
        "final_price": float(final_price),
        "status": session.status,
        "cart_item_id": cart_item.id,
        "is_bargained": cart_item.is_bargained,
    })
