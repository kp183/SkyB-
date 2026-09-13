from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.review import Review
from backend.models.product import Product
from backend.models.user import User
from backend.dependencies import get_current_user, success_response

router = APIRouter(tags=["Reviews"])


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str


@router.get("/products/{id}/reviews")
def get_product_reviews(id: int, db: Session = Depends(get_db)):
    """Retrieve all reviews for a product (seeded for demo)."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    reviews = db.query(Review).filter(Review.product_id == id).all()
    data = [
        {
            "id": r.id,
            "product_id": r.product_id,
            "user_id": r.user_id,
            "rating": r.rating,
            "comment": r.comment,
        }
        for r in reviews
    ]
    return success_response(data)


@router.post("/products/{id}/reviews")
def create_product_review(
    id: int,
    req: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """P2 stretch: Authenticated customer submits a review."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    review = Review(
        product_id=id,
        user_id=current_user.id,
        rating=req.rating,
        comment=req.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return success_response({
        "id": review.id,
        "product_id": review.product_id,
        "user_id": review.user_id,
        "rating": review.rating,
        "comment": review.comment,
    })
