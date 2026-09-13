from typing import Optional, List, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.product import Product
from backend.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from backend.dependencies import require_admin_user, success_response, error_response

router = APIRouter(prefix="/products", tags=["Products"])


def serialize_product(p: Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "category_id": p.category_id,
        "age_group": p.age_group,
        "size": p.size,
        "price": float(p.price) if p.price is not None else 0.0,
        "min_price": float(p.min_price) if p.min_price is not None else 0.0,
        "max_price": float(p.max_price) if p.max_price is not None else 0.0,
        "stock_qty": p.stock_qty,
        "image_url": p.image_url,
        "safety_tags": p.safety_tags,
        "safety_score": p.safety_score,
        "safety_summary": p.safety_summary,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }


@router.get("")
def list_products(
    category: Optional[int] = Query(None, description="Category ID"),
    age_group: Optional[str] = Query(None, description="Age group filter"),
    search: Optional[str] = Query(None, description="Search term for product name/description"),
    sort: Optional[str] = Query("price_asc", description="Sort order: price_asc, price_desc, newest"),
    min_price: Optional[float] = Query(None, description="Minimum customer price"),
    max_price: Optional[float] = Query(None, description="Maximum customer price"),
    db: Session = Depends(get_db),
):
    """List products with search, category, age_group, and price range filters."""
    query = db.query(Product)

    if category:
        query = query.filter(Product.category_id == category)
    if age_group:
        query = query.filter(Product.age_group == age_group)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(Product.name.ilike(search_pattern) | Product.description.ilike(search_pattern))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())

    products = query.all()
    return success_response([serialize_product(p) for p in products])


@router.get("/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    """Retrieve details of a single product."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return success_response(serialize_product(product))


@router.post("", dependencies=[Depends(require_admin_user)])
def create_product(req: ProductCreate, db: Session = Depends(get_db)):
    """Admin-only: Create a new product."""
    product = Product(
        name=req.name,
        description=req.description,
        category_id=req.category_id,
        age_group=req.age_group,
        size=req.size,
        price=req.price,
        min_price=req.min_price,
        max_price=req.max_price,
        stock_qty=req.stock_qty,
        image_url=req.image_url,
        safety_tags=req.safety_tags,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return success_response(serialize_product(product))


@router.put("/{id}", dependencies=[Depends(require_admin_user)])
def update_product(id: int, req: ProductUpdate, db: Session = Depends(get_db)):
    """Admin-only: Update product details."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = req.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return success_response(serialize_product(product))


@router.delete("/{id}", dependencies=[Depends(require_admin_user)])
def delete_product(id: int, db: Session = Depends(get_db)):
    """Admin-only: Delete a product."""
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()
    return success_response({"message": f"Product {id} deleted successfully"})
