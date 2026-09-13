from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.product import Product
from backend.models.child import Child
from backend.models.user import User
from backend.dependencies import get_current_user, success_response
from backend.services.safety_badge_service import get_or_generate_safety_badge
from backend.services.substitution_service import find_substitutes
from backend.services.size_progression_service import suggest_size_for_child
from backend.services.reorder_predictor_service import predict_reorders_for_user
from backend.services.bundle_service import suggest_bundles_for_product

router = APIRouter(tags=["AI Features"])


@router.get("/products/{id}/safety-badge")
def get_product_safety_badge(id: int, db: Session = Depends(get_db)):
    """
    Returns safety badge details (score, summary, tags).
    Generates and caches result on product record if not yet computed.
    """
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    badge_data = get_or_generate_safety_badge(db, product)
    return success_response(badge_data)


@router.get("/products/{id}/substitutes")
def get_product_substitutes(id: int, db: Session = Depends(get_db)):
    """P1: Returns similar in-stock alternatives for an out-of-stock product."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    substitutes = find_substitutes(db, product)
    return success_response(substitutes)


@router.get("/children/{id}/size-suggestion")
def get_child_size_suggestion(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """P1: Computes recommended size range and upgrade flag for a child."""
    child = db.query(Child).filter(Child.id == id, Child.user_id == current_user.id).first()
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child profile not found")

    suggestion = suggest_size_for_child(db, child)
    return success_response(suggestion)


@router.get("/users/{id}/reorder-predictions")
def get_user_reorder_predictions(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """P2: Predicts recurring replenishment essentials based on order history."""
    if current_user.id != id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

    predictions = predict_reorders_for_user(db, id)
    return success_response(predictions)


@router.get("/products/{id}/bundle-suggestions")
def get_bundle_suggestions(id: int, db: Session = Depends(get_db)):
    """P2: Recommends 'Grows-With-Them' next age-bracket bundle items."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    bundles = suggest_bundles_for_product(db, product)
    return success_response(bundles)
