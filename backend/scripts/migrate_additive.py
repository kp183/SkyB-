import os
import sys
import re
from sqlalchemy import inspect, text

# Add repository root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.db import Base, engine, SessionLocal
from backend.models.product import Product
from backend.models.category import Category


def parse_age_group(age_str: str) -> tuple[int, int]:
    """Parse age_group strings (e.g. '0-3m', '6-12m', '1-2y', '3-5y', 'new-born', '8+y') into months."""
    if not age_str:
        return 0, 144
    s = age_str.strip().lower()
    if "new" in s:
        return 0, 3
    # Months e.g. 0-3m, 6-12m, 0-12m
    m_month = re.match(r"^(\d+)\s*-\s*(\d+)\s*m(?:onths?)?$", s)
    if m_month:
        return int(m_month.group(1)), int(m_month.group(2))
    # Years e.g. 1-2y, 3-5y, 2-4y
    m_year = re.match(r"^(\d+)\s*-\s*(\d+)\s*y(?:ears?|rs)?$", s)
    if m_year:
        return int(m_year.group(1)) * 12, int(m_year.group(2)) * 12
    # Plus e.g. 8+y or 8y+
    m_plus = re.match(r"^(\d+)\+?\s*y(?:ears?|rs)?\+?$", s)
    if m_plus:
        return int(m_plus.group(1)) * 12, 144
    # Mixed e.g. 6m-2y
    m_mixed = re.match(r"^(\d+)\s*m\s*-\s*(\d+)\s*y$", s)
    if m_mixed:
        return int(m_mixed.group(1)), int(m_mixed.group(2)) * 12
    return 0, 144


def run_migration():
    print("=== STARTING ADDITIVE MIGRATION ===")
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    existing_cols = {c["name"] for c in inspector.get_columns("products")}

    columns_to_add = [
        ("subcategory", "VARCHAR(100)"),
        ("gender", "VARCHAR(20)"),
        ("mrp", "NUMERIC(10, 2)"),
        ("age_min_months", "INTEGER"),
        ("age_max_months", "INTEGER"),
    ]

    with engine.begin() as conn:
        for col_name, col_type in columns_to_add:
            if col_name not in existing_cols:
                print(f"Adding column '{col_name}' ({col_type}) to 'products' table...")
                conn.execute(text(f"ALTER TABLE products ADD COLUMN {col_name} {col_type};"))
            else:
                print(f"Column '{col_name}' already exists in 'products' table.")

    # Refresh inspector and check index
    inspector = inspect(engine)
    existing_indexes = {ix["name"] for ix in inspector.get_indexes("products")}
    if "idx_products_age_range" not in existing_indexes:
        print("Creating index 'idx_products_age_range' on products(age_min_months, age_max_months)...")
        with engine.begin() as conn:
            conn.execute(text("CREATE INDEX idx_products_age_range ON products (age_min_months, age_max_months);"))
    else:
        print("Index 'idx_products_age_range' already exists.")

    db = SessionLocal()
    try:
        # 1. Ensure 9 new categories exist idempotently
        new_categories = [
            "Boys Fashion",
            "Girls Fashion",
            "Diapering",
            "Gear",
            "Feeding",
            "Bath & Skincare",
            "Nursery",
            "Health & Safety",
            "School Essentials",
        ]
        existing_cat_names = {c.name for c in db.query(Category).all()}
        for cat_name in new_categories:
            if cat_name not in existing_cat_names:
                print(f"Adding new category: '{cat_name}'...")
                db.add(Category(name=cat_name))
            else:
                print(f"Category '{cat_name}' already present.")
        db.commit()

        # 2. Backfill existing products
        products = db.query(Product).all()
        print(f"\nBackfilling {len(products)} existing products...")
        for p in products:
            min_m, max_m = parse_age_group(p.age_group)
            p.age_min_months = min_m
            p.age_max_months = max_m

            # For legacy products (or products with missing mrp/gender)
            if p.mrp is None:
                p.mrp = round(float(p.price) * 1.25, 2)
            if p.gender is None:
                p.gender = "unisex"
            print(f"  Product {p.id} ('{p.name}'): age={min_m}-{max_m}m, mrp={p.mrp}, gender={p.gender}")

        db.commit()
        print("\n=== ADDITIVE MIGRATION COMPLETED SUCCESSFULLY ===")
    finally:
        db.close()


if __name__ == "__main__":
    run_migration()
