from typing import Optional, List, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, or_, case, cast, String
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.product import Product
from backend.models.order import OrderItem
from backend.models.review import Review
from backend.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from backend.dependencies import require_admin_user, success_response, error_response

router = APIRouter(prefix="/products", tags=["Products"])


def serialize_product(p: Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "category_id": p.category_id,
        "subcategory": p.subcategory,
        "gender": p.gender,
        "age_group": p.age_group,
        "age_min_months": p.age_min_months,
        "age_max_months": p.age_max_months,
        "size": p.size,
        "price": float(p.price) if p.price is not None else 0.0,
        "mrp": float(p.mrp) if p.mrp is not None else None,
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
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(24, ge=1, le=100, description="Page size limit (max 100)"),
    category_ids: Optional[str] = Query(None, description="Comma-separated category IDs"),
    category: Optional[int] = Query(None, description="Legacy single category ID filter"),
    gender: Optional[str] = Query(None, description="boys|girls; also returns unisex and null"),
    subcategory: Optional[str] = Query(None, description="Comma-separated subcategories"),
    age_min_months: Optional[int] = Query(None, description="Minimum age in months for overlap"),
    age_max_months: Optional[int] = Query(None, description="Maximum age in months for overlap"),
    age_group: Optional[str] = Query(None, description="Legacy age group filter"),
    min_price: Optional[float] = Query(None, description="Minimum customer selling price"),
    max_price: Optional[float] = Query(None, description="Maximum customer selling price"),
    min_rating: Optional[float] = Query(None, description="Average review rating threshold"),
    min_discount: Optional[float] = Query(None, description="Minimum discount percentage from MRP"),
    safety: Optional[str] = Query(None, description="Comma-separated safety flags"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability"),
    q: Optional[str] = Query(None, description="Search term across name and description"),
    search: Optional[str] = Query(None, description="Legacy search query alias"),
    sort: Optional[str] = Query("popular", description="popular | price_asc | price_desc | newest | discount"),
    db: Session = Depends(get_db),
):
    """
    List products with multi-attribute filtering, search, pagination, and sorting.
    Returns: { "data": [...], "meta": { "total": int, "skip": int, "limit": int }, "error": null }
    """
    query = db.query(Product)

    # 1. Category filter (category_ids or legacy category)
    cat_ids: List[int] = []
    if category_ids:
        for cid in category_ids.split(","):
            cid = cid.strip()
            if cid.isdigit():
                cat_ids.append(int(cid))
    elif category is not None:
        cat_ids.append(category)

    if cat_ids:
        query = query.filter(Product.category_id.in_(cat_ids))

    # 2. Gender filter (boys|girls; also returns unisex and null)
    if gender:
        g = gender.strip().lower()
        query = query.filter(
            or_(
                func.lower(Product.gender) == g,
                func.lower(Product.gender) == "unisex",
                Product.gender.is_(None),
            )
        )

    # 3. Subcategory filter (csv)
    if subcategory:
        subcats = [s.strip() for s in subcategory.split(",") if s.strip()]
        if subcats:
            query = query.filter(Product.subcategory.in_(subcats))

    # 4. Age range overlap filter
    if age_min_months is not None and age_max_months is not None:
        query = query.filter(
            Product.age_min_months <= age_max_months,
            Product.age_max_months >= age_min_months,
        )
    elif age_min_months is not None:
        query = query.filter(Product.age_max_months >= age_min_months)
    elif age_max_months is not None:
        query = query.filter(Product.age_min_months <= age_max_months)
    elif age_group:
        query = query.filter(Product.age_group == age_group)

    # 5. Price filter (selling price)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # 6. Min Rating filter (average of reviews; excludes products with no reviews)
    if min_rating is not None:
        rating_sub = (
            db.query(Review.product_id)
            .group_by(Review.product_id)
            .having(func.avg(Review.rating) >= min_rating)
            .subquery()
        )
        query = query.filter(Product.id.in_(rating_sub))

    # 7. Min Discount filter (percentage calculated from mrp and price; excludes null mrp)
    if min_discount is not None:
        query = query.filter(
            Product.mrp.isnot(None),
            Product.mrp > Product.price,
            ((Product.mrp - Product.price) / Product.mrp) * 100.0 >= min_discount,
        )

    # 8. Safety filter (csv of flags; matches against stored safety_tags JSON)
    if safety:
        flags = [f.strip().lower() for f in safety.split(",") if f.strip()]
        if flags:
            safety_clauses = [
                func.lower(cast(Product.safety_tags, String)).ilike(f"%{flag}%")
                for flag in flags
            ]
            query = query.filter(or_(*safety_clauses))

    # 9. Stock availability
    if in_stock is True:
        query = query.filter(Product.stock_qty > 0)
    elif in_stock is False:
        query = query.filter(Product.stock_qty <= 0)

    # 10. Search query (q or legacy search)
    search_term = q if q is not None else search
    if search_term and search_term.strip():
        term = f"%{search_term.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term),
            )
        )

    # Compute total matching before pagination
    total = query.count()

    # 11. Sorting
    if sort == "popular":
        # units sold (order_items count/quantity) descending, then id ascending
        sales_sub = (
            db.query(
                OrderItem.product_id,
                func.coalesce(func.sum(OrderItem.quantity), 0).label("units_sold"),
            )
            .group_by(OrderItem.product_id)
            .subquery()
        )
        query = query.outerjoin(sales_sub, Product.id == sales_sub.c.product_id)
        query = query.order_by(
            func.coalesce(sales_sub.c.units_sold, 0).desc(),
            Product.id.asc(),
        )
    elif sort == "price_asc":
        query = query.order_by(Product.price.asc(), Product.id.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc(), Product.id.asc())
    elif sort == "newest":
        query = query.order_by(Product.id.desc())
    elif sort == "discount":
        discount_expr = case(
            (
                (Product.mrp.isnot(None)) & (Product.mrp > Product.price),
                (Product.mrp - Product.price) / Product.mrp,
            ),
            else_=0.0,
        )
        query = query.order_by(discount_expr.desc(), Product.id.asc())
    else:
        # Default fallback
        query = query.order_by(Product.id.desc())

    # Pagination
    products = query.offset(skip).limit(limit).all()

    meta = {
        "total": total,
        "skip": skip,
        "limit": limit,
    }
    return success_response([serialize_product(p) for p in products], meta=meta)


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
        subcategory=req.subcategory,
        gender=req.gender,
        age_group=req.age_group,
        age_min_months=req.age_min_months,
        age_max_months=req.age_max_months,
        size=req.size,
        price=req.price,
        mrp=req.mrp,
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
