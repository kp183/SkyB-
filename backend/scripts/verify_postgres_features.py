"""
Verification script for PostgreSQL-specific queries:
1. ILIKE search (case-insensitive)
2. sort=popular with ties (order_items units desc, id asc)
3. min_rating aggregation (avg review score >= min_rating, excluding unreviewed)
4. min_discount calculation ((mrp - price)/mrp * 100 >= min_discount)
5. Age-overlap query (age_min_months <= max_req AND age_max_months >= min_req)
"""
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.db import engine, SessionLocal
from backend.models import Product, Review, OrderItem
from sqlalchemy import func, or_, select, text

def run_postgres_verifications():
    print("=== RUNNING POSTGRESQL SPECIFIC VERIFICATIONS ===")
    print(f"Database dialect: {engine.dialect.name}")
    assert engine.dialect.name == "postgresql", f"Expected postgresql dialect, got {engine.dialect.name}"

    db = SessionLocal()
    try:
        # 1. ILIKE search
        print("\n--- 1. ILIKE Search (Case-Insensitive) ---")
        q_term = "cotton"
        pattern = f"%{q_term}%"
        ilike_query = db.query(Product).filter(
            or_(Product.name.ilike(pattern), Product.description.ilike(pattern))
        )
        ilike_count = ilike_query.count()
        sample = ilike_query.first()
        print(f"ILIKE query matched {ilike_count} products for term '{q_term}'.")
        if sample:
            print(f"Sample product #{sample.id}: '{sample.name}' (Desc snippet: {sample.description[:60]}...)")
        assert ilike_count > 0, "ILIKE search returned 0 items"

        # 2. sort=popular with ties (order_items units sold DESC, id ASC)
        print("\n--- 2. sort=popular with ties ---")
        subq = (
            select(
                OrderItem.product_id,
                func.coalesce(func.sum(OrderItem.quantity), 0).label("units_sold"),
            )
            .group_by(OrderItem.product_id)
            .subquery()
        )
        pop_query = (
            db.query(Product, func.coalesce(subq.c.units_sold, 0).label("units_sold"))
            .outerjoin(subq, Product.id == subq.c.product_id)
            .order_by(text("units_sold DESC"), Product.id.asc())
            .limit(10)
        )
        pop_results = pop_query.all()
        print(f"Top {len(pop_results)} popular products:")
        for prod, units in pop_results:
            print(f"  ID {prod.id}: '{prod.name}' - Units Sold: {units}")
        # Verify ties are sorted by ID ascending
        zero_units = [p.id for p, u in pop_results if u == 0]
        if len(zero_units) > 1:
            assert zero_units == sorted(zero_units), "Ties should be sorted by ID ascending!"
            print(f"Verified tie-breaking: ID order {zero_units[:5]} is strictly ascending.")

        # 3. min_rating aggregation
        print("\n--- 3. min_rating aggregation ---")
        min_rating = 4.0
        rating_sub = (
            select(Review.product_id)
            .group_by(Review.product_id)
            .having(func.avg(Review.rating) >= min_rating)
            .scalar_subquery()
        )
        rated_query = db.query(Product).filter(Product.id.in_(rating_sub))
        rated_count = rated_query.count()
        print(f"Found {rated_count} products with average rating >= {min_rating}")
        for p in rated_query.limit(5).all():
            avg_r = db.query(func.avg(Review.rating)).filter(Review.product_id == p.id).scalar()
            print(f"  ID {p.id}: '{p.name}' - Avg Rating: {float(avg_r):.2f}")
            assert float(avg_r) >= min_rating

        # 4. min_discount calculation
        print("\n--- 4. min_discount calculation ---")
        min_disc = 20.0
        disc_query = db.query(Product).filter(
            Product.mrp.isnot(None),
            ((Product.mrp - Product.price) * 100.0 / Product.mrp) >= min_disc
        )
        disc_count = disc_query.count()
        print(f"Found {disc_count} products with discount >= {min_disc}%")
        for p in disc_query.limit(5).all():
            pct = round(float((p.mrp - p.price) * 100 / p.mrp), 2)
            print(f"  ID {p.id}: '{p.name}' - MRP: ₹{p.mrp}, Price: ₹{p.price} ({pct}% off)")
            assert pct >= min_disc

        # 5. Age-overlap query
        print("\n--- 5. Age-overlap query ---")
        req_min, req_max = 6, 9
        overlap_query = db.query(Product).filter(
            Product.age_min_months <= req_max,
            Product.age_max_months >= req_min,
        )
        overlap_count = overlap_query.count()
        print(f"Found {overlap_count} products overlapping age bracket {req_min}-{req_max} months")
        for p in overlap_query.limit(5).all():
            print(f"  ID {p.id}: '{p.name}' - Range: [{p.age_min_months}, {p.age_max_months}] months")
            assert p.age_min_months <= req_max
            assert p.age_max_months >= req_min

        print("\n=== ALL POSTGRESQL SPECIFIC VERIFICATIONS PASSED! ===")
    finally:
        db.close()

if __name__ == "__main__":
    run_postgres_verifications()
