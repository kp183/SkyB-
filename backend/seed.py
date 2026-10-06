"""
Database Seed Script for SkyB.
Provisions initial schema tables and populates demo data:
1. Initial admin account (from environment variables or defaults).
2. Demo parent customer account.
3. Standard categories (Clothing, Toys, Footwear, Baby Care, School Accessories).
4. Representative sample products with safety tags, ratings, and min_price floors.
5. Seeded product reviews for Mid Demo presentation.
6. Sample discount coupons for the Smart Savings Agent.
"""

import os
import sys
import json
from datetime import datetime, date
from dotenv import load_dotenv

# Ensure root directory is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.db import Base, engine, SessionLocal
from backend.models import (
    User,
    Category,
    Product,
    Review,
    Coupon,
    BundleAssociation,
)
from backend.security import hash_password

load_dotenv()


def seed_database():
    print("[Seed] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Admin User
        admin_email = os.getenv("ADMIN_EMAIL", "admin@skyb.com")
        admin_pass = os.getenv("ADMIN_PASSWORD", "Admin@123")
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin = User(
                name="SkyB Administrator",
                email=admin_email,
                password_hash=hash_password(admin_pass),
                role="admin",
            )
            db.add(admin)
            print(f"[Seed] Created initial Admin: {admin_email} / {admin_pass}")

        # 2. Seed Demo Customer User
        customer_email = "parent@skyb.com"
        existing_customer = db.query(User).filter(User.email == customer_email).first()
        if not existing_customer:
            customer = User(
                name="Priya Sharma",
                email=customer_email,
                password_hash=hash_password("Parent@123"),
                role="customer",
            )
            db.add(customer)
            print(f"[Seed] Created demo Customer: {customer_email} / Parent@123")

        db.commit()

        # 3. Seed Categories (Idempotent by name)
        category_names = [
            "Clothing",
            "Toys",
            "Footwear",
            "Baby Care",
            "School Accessories",
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
        categories = {}
        for name in category_names:
            cat = db.query(Category).filter(Category.name == name).first()
            if not cat:
                cat = Category(name=name)
                db.add(cat)
                db.flush()
            categories[name] = cat

        db.commit()
        print(f"[Seed] Seeded {len(categories)} categories.")

        # 4. Seed Products
        sample_products = [
            {
                "name": "Organic Cotton Baby Romper",
                "description": "Super soft organic cotton baby onesie. Hypoallergenic, breathable fabric with nickel-free snap buttons for easy diaper changes.",
                "category": "Clothing",
                "age_group": "0-3m",
                "size": "0-3M",
                "price": 699.00,
                "min_price": 499.00,
                "max_price": 699.00,
                "stock_qty": 25,
                "image_url": "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=60",
                "safety_tags": ["Organic Cotton", "Hypoallergenic", "Non-Toxic"],
                "safety_score": "Good",
                "safety_summary": "Pure organic cotton with non-toxic dyes and hypoallergenic seams.",
            },
            {
                "name": "Montessori Wooden Stacking Rings",
                "description": "Natural hardwood ring stacker coated with water-based non-toxic food-grade lacquer. Smooth rounded edges with zero sharp burrs.",
                "category": "Toys",
                "age_group": "6-12m",
                "size": "M",
                "price": 899.00,
                "min_price": 650.00,
                "max_price": 899.00,
                "stock_qty": 18,
                "image_url": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60",
                "safety_tags": ["Non-Toxic", "BPA-Free", "Choking Hazard"],
                "safety_score": "Medium",
                "safety_summary": "Made of solid sustainable wood with water-based non-toxic paint. Supervised play recommended for smallest ring.",
            },
            {
                "name": "Anti-Slip Toddler First-Walker Shoes",
                "description": "Flexible ergonomic soft-sole shoes designed to support natural foot development. Breathable mesh with anti-slip rubber traction dots.",
                "category": "Footwear",
                "age_group": "1-2y",
                "size": "2-3Y",
                "price": 1199.00,
                "min_price": 850.00,
                "max_price": 1199.00,
                "stock_qty": 14,
                "image_url": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&auto=format&fit=crop&q=60",
                "safety_tags": ["Anti-Slip", "Ergonomic"],
                "safety_score": "Good",
                "safety_summary": "Orthopedically safe flexible sole for first walkers with non-slip grip.",
            },
            {
                "name": "Gentle Oatmeal Baby Lotion (300ml)",
                "description": "Gentle natural colloidal oatmeal soothing lotion. Free from parabens, phthalates, sulfates, and artificial fragrances.",
                "category": "Baby Care",
                "age_group": "0-12m",
                "size": None,
                "price": 499.00,
                "min_price": 380.00,
                "max_price": 499.00,
                "stock_qty": 40,
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
                "safety_tags": ["Hypoallergenic", "Paraben-Free", "Non-Toxic"],
                "safety_score": "Good",
                "safety_summary": "pH-balanced and hypoallergenic formula formulated specifically for delicate infant skin.",
            },
            {
                "name": "Ergonomic Kids School Backpack",
                "description": "Ultra-lightweight water-resistant school bag with padded spinal-support shoulder straps, safety reflector strips, and reinforced compartments.",
                "category": "School Accessories",
                "age_group": "3-5y",
                "size": "S",
                "price": 1499.00,
                "min_price": 1100.00,
                "max_price": 1499.00,
                "stock_qty": 10,
                "image_url": "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&auto=format&fit=crop&q=60",
                "safety_tags": ["Spinal Support", "Safety Reflectors"],
                "safety_score": "Good",
                "safety_summary": "Meets ergonomic weight distribution guidelines with high-visibility reflective bands.",
            },
        ]

        seeded_products = []
        from backend.scripts.migrate_additive import parse_age_group

        for pdata in sample_products:
            prod = db.query(Product).filter(Product.name == pdata["name"]).first()
            min_m, max_m = parse_age_group(pdata["age_group"])
            mrp_val = round(float(pdata["price"]) * 1.25, 2)
            if not prod:
                prod = Product(
                    name=pdata["name"],
                    description=pdata["description"],
                    category_id=categories[pdata["category"]].id,
                    age_group=pdata["age_group"],
                    age_min_months=min_m,
                    age_max_months=max_m,
                    gender="unisex",
                    mrp=mrp_val,
                    size=pdata["size"],
                    price=pdata["price"],
                    min_price=pdata["min_price"],
                    max_price=pdata["max_price"],
                    stock_qty=pdata["stock_qty"],
                    image_url=pdata["image_url"],
                    safety_tags=pdata["safety_tags"],
                    safety_score=pdata["safety_score"],
                    safety_summary=pdata["safety_summary"],
                )
                db.add(prod)
                db.flush()
            else:
                if prod.age_min_months is None:
                    prod.age_min_months = min_m
                    prod.age_max_months = max_m
                if prod.mrp is None:
                    prod.mrp = mrp_val
                if prod.gender is None:
                    prod.gender = "unisex"
            seeded_products.append(prod)

        db.commit()
        print(f"[Seed] Seeded {len(seeded_products)} sample products.")

        # 4b. Load Deterministic Catalog (catalog.json) Idempotently (upsert by name + category)
        catalog_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "data/catalog.json"))
        if not os.path.exists(catalog_path):
            from backend.scripts.generate_catalog import generate_catalog
            print("[Seed] catalog.json not found. Generating deterministic catalog...")
            generate_catalog()

        if os.path.exists(catalog_path):
            with open(catalog_path, "r", encoding="utf-8") as f:
                catalog_data = json.load(f)

            catalog_added = 0
            catalog_updated = 0
            for item in catalog_data:
                cat_id = categories[item["category"]].id
                prod = (
                    db.query(Product)
                    .filter(Product.name == item["name"], Product.category_id == cat_id)
                    .first()
                )
                if not prod:
                    prod = Product(
                        name=item["name"],
                        description=item["description"],
                        category_id=cat_id,
                        subcategory=item.get("subcategory"),
                        gender=item.get("gender"),
                        age_group=item["age_group"],
                        age_min_months=item.get("age_min_months"),
                        age_max_months=item.get("age_max_months"),
                        size=item.get("size"),
                        price=item["price"],
                        mrp=item.get("mrp"),
                        min_price=item["min_price"],
                        max_price=item["max_price"],
                        stock_qty=item["stock_qty"],
                        image_url=item["image_url"],
                        safety_tags=item.get("safety_tags"),
                        safety_score=item.get("safety_score"),
                        safety_summary=item.get("safety_summary"),
                    )
                    db.add(prod)
                    catalog_added += 1
                else:
                    # Update MRP, min_price, max_price, and metadata for generated catalog items
                    # Products 1-5 (sample_products) are skipped/left untouched
                    if prod.id > 5:
                        prod.description = item["description"]
                        prod.safety_summary = item["safety_summary"]
                        prod.safety_tags = item["safety_tags"]
                        prod.mrp = item.get("mrp")
                        prod.min_price = item["min_price"]
                        prod.max_price = item["max_price"]
                        prod.stock_qty = item["stock_qty"]
                        prod.price = item["price"]
                        catalog_updated += 1
            db.commit()
            print(f"[Seed] Processed catalog.json ({len(catalog_data)} items, {catalog_added} newly inserted, {catalog_updated} updated).")

        # 5. Seed Reviews on Products
        demo_reviews = [
            (5, "Absolutely loved the quality of the fabric! Very gentle on baby's skin."),
            (4, "Great product. Colors are vibrant and the stitching is very durable."),
            (5, "Safe and clean materials. Exactly what I was looking for my 1-year-old."),
        ]
        for prod in seeded_products:
            existing_rev = db.query(Review).filter(Review.product_id == prod.id).first()
            if not existing_rev:
                for rating, comment in demo_reviews:
                    rev = Review(
                        product_id=prod.id,
                        user_id=None,  # Static seeded reviews for demo
                        rating=rating,
                        comment=comment,
                    )
                    db.add(rev)
        db.commit()
        print("[Seed] Seeded demo reviews for product cards.")

        # 6. Seed Coupons
        coupons = [
            ("WELCOME10", "percent", 10.0, None),
            ("KIDS20", "percent", 20.0, 500.0),
            ("FLAT50", "flat", 50.0, 300.0),
            ("SUPER100", "flat", 100.0, 1000.0),
        ]
        for code, dtype, val, min_order in coupons:
            c = db.query(Coupon).filter(Coupon.code == code).first()
            if not c:
                c = Coupon(
                    code=code,
                    discount_type=dtype,
                    discount_value=val,
                    min_order_value=min_order,
                    active=True,
                )
                db.add(c)
        db.commit()
        print("[Seed] Seeded demo discount coupons.")

        # 7. Seed Bundle Associations
        bundles = [
            ("0-3m", "3-6m", categories["Clothing"].id),
            ("6-12m", "1-2y", categories["Toys"].id),
        ]
        for from_age, to_age, cat_id in bundles:
            b = (
                db.query(BundleAssociation)
                .filter(
                    BundleAssociation.from_age_group == from_age,
                    BundleAssociation.to_age_group == to_age,
                    BundleAssociation.category_id == cat_id,
                )
                .first()
            )
            if not b:
                b = BundleAssociation(
                    from_age_group=from_age,
                    to_age_group=to_age,
                    category_id=cat_id,
                )
                db.add(b)
        db.commit()
        print("[Seed] Seeded bundle developmental associations.")

        print("\n[Seed] Database seeding completed successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
