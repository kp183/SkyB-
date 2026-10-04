import os
import sys
import pytest
from sqlalchemy import func, or_, cast, String, case

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi.testclient import TestClient

from backend.main import app
from backend.db import SessionLocal
from backend.models.user import User
from backend.models.product import Product
from backend.models.review import Review
from backend.models.order import OrderItem
from backend.security import hash_password

client = TestClient(app)


@pytest.fixture(scope="module")
def admin_token():
    db = SessionLocal()
    try:
        admin_email = "admin@skyb.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name="Test Admin",
                email=admin_email,
                password_hash=hash_password("Admin@123"),
                role="admin",
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()

    res = client.post("/auth/login", json={"email": "admin@skyb.com", "password": "Admin@123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["data"]["token"]
    return token


def test_products_no_params():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).count()
    finally:
        db.close()

    res = client.get("/products")
    assert res.status_code == 200
    body = res.json()
    assert body["error"] is None
    assert isinstance(body["data"], list)
    assert "meta" in body
    meta = body["meta"]
    assert meta["total"] == expected_count
    assert meta["skip"] == 0
    assert meta["limit"] == 24
    assert len(body["data"]) == min(expected_count, 24)


def test_products_pagination():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).count()
    finally:
        db.close()

    res = client.get("/products?skip=10&limit=5")
    assert res.status_code == 200
    body = res.json()
    assert len(body["data"]) == 5
    assert body["meta"]["skip"] == 10
    assert body["meta"]["limit"] == 5
    assert body["meta"]["total"] == expected_count


def test_products_category_ids_filter():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(Product.category_id.in_([1, 2])).count()
    finally:
        db.close()

    res = client.get("/products?category_ids=1,2&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert p["category_id"] in [1, 2]


def test_products_subcategory_csv_filter():
    subcats = ["T-Shirts", "Soft Toys"]
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(Product.subcategory.in_(subcats)).count()
    finally:
        db.close()

    res = client.get("/products?subcategory=T-Shirts,Soft Toys&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    assert len(body["data"]) == min(expected_count, 100)
    for p in body["data"]:
        assert p["subcategory"] in subcats


def test_products_gender_filter_boys():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            or_(
                func.lower(Product.gender) == "boys",
                func.lower(Product.gender) == "unisex",
                Product.gender.is_(None),
            )
        ).count()
    finally:
        db.close()

    res = client.get("/products?gender=boys&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert p["gender"] in ["boys", "unisex", None]


def test_products_gender_filter_girls():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            or_(
                func.lower(Product.gender) == "girls",
                func.lower(Product.gender) == "unisex",
                Product.gender.is_(None),
            )
        ).count()
    finally:
        db.close()

    res = client.get("/products?gender=girls&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert p["gender"] in ["girls", "unisex", None]


def test_products_age_overlap_and_boundary():
    # Test interval [12, 24] months
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            Product.age_min_months <= 24,
            Product.age_max_months >= 12,
        ).count()
    finally:
        db.close()

    res = client.get("/products?age_min_months=12&age_max_months=24&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert p["age_min_months"] <= 24
        assert p["age_max_months"] >= 12


def test_products_price_filter_boundary():
    # Test boundary exact match: min_price=499, max_price=799
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            Product.price >= 499.0,
            Product.price <= 799.0,
        ).count()
    finally:
        db.close()

    res = client.get("/products?min_price=499&max_price=799&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert 499.0 <= p["price"] <= 799.0


def test_products_min_rating_filter():
    # Find products with reviews
    db = SessionLocal()
    try:
        rating_sub = (
            db.query(Review.product_id)
            .group_by(Review.product_id)
            .having(func.avg(Review.rating) >= 4.0)
            .subquery()
        )
        expected_count = db.query(Product).filter(Product.id.in_(rating_sub)).count()
    finally:
        db.close()

    res = client.get("/products?min_rating=4.0&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    # Should exclude products without reviews
    assert expected_count >= 1
    for p in body["data"]:
        assert p["id"] in [1, 2, 3, 4, 5]


def test_products_min_discount_filter():
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            Product.mrp.isnot(None),
            Product.mrp > Product.price,
            ((Product.mrp - Product.price) / Product.mrp) * 100.0 >= 20.0,
        ).count()
    finally:
        db.close()

    res = client.get("/products?min_discount=20.0&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        assert p["mrp"] is not None
        assert p["mrp"] > p["price"]
        disc = ((p["mrp"] - p["price"]) / p["mrp"]) * 100.0
        assert disc >= 19.99


def test_products_in_stock_filters():
    db = SessionLocal()
    try:
        in_stock_cnt = db.query(Product).filter(Product.stock_qty > 0).count()
        out_of_stock_cnt = db.query(Product).filter(Product.stock_qty <= 0).count()
    finally:
        db.close()

    res_in = client.get("/products?in_stock=true&limit=100")
    assert res_in.status_code == 200
    assert res_in.json()["meta"]["total"] == in_stock_cnt
    for p in res_in.json()["data"]:
        assert p["stock_qty"] > 0

    res_out = client.get("/products?in_stock=false&limit=100")
    assert res_out.status_code == 200
    assert res_out.json()["meta"]["total"] == out_of_stock_cnt
    for p in res_out.json()["data"]:
        assert p["stock_qty"] <= 0


def test_products_safety_filter():
    # Check "Organic Cotton" filter
    db = SessionLocal()
    try:
        expected_count = db.query(Product).filter(
            func.lower(cast(Product.safety_tags, String)).ilike("%organic cotton%")
        ).count()
    finally:
        db.close()

    res = client.get("/products?safety=organic cotton&limit=100")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_count
    for p in body["data"]:
        tags = [t.lower() for t in (p["safety_tags"] or [])]
        assert any("organic cotton" in t for t in tags)


def test_products_search_q():
    res = client.get("/products?q=romper")
    assert res.status_code == 200
    body = res.json()
    assert len(body["data"]) >= 1
    for p in body["data"]:
        assert "romper" in p["name"].lower() or "romper" in (p["description"] or "").lower()


def test_products_sort_popular():
    # Popular: units sold descending, then id ascending
    db = SessionLocal()
    try:
        sales_sub = (
            db.query(
                OrderItem.product_id,
                func.coalesce(func.sum(OrderItem.quantity), 0).label("units_sold"),
            )
            .group_by(OrderItem.product_id)
            .subquery()
        )
        sql_products = (
            db.query(Product)
            .outerjoin(sales_sub, Product.id == sales_sub.c.product_id)
            .order_by(
                func.coalesce(sales_sub.c.units_sold, 0).desc(),
                Product.id.asc(),
            )
            .limit(20)
            .all()
        )
        expected_ids = [p.id for p in sql_products]
    finally:
        db.close()

    res = client.get("/products?sort=popular&limit=20")
    assert res.status_code == 200
    actual_ids = [p["id"] for p in res.json()["data"]]
    assert actual_ids == expected_ids


def test_products_sort_rating():
    # Rating: avg review rating desc, then id ascending
    db = SessionLocal()
    try:
        rating_sub = (
            db.query(
                Review.product_id,
                func.coalesce(func.avg(Review.rating), 0).label("avg_rating"),
            )
            .group_by(Review.product_id)
            .subquery()
        )
        sql_products = (
            db.query(Product)
            .outerjoin(rating_sub, Product.id == rating_sub.c.product_id)
            .order_by(
                func.coalesce(rating_sub.c.avg_rating, 0).desc(),
                Product.id.asc(),
            )
            .limit(10)
            .all()
        )
        expected_ids = [p.id for p in sql_products]
    finally:
        db.close()

    res = client.get("/products?sort=rating&limit=10")
    assert res.status_code == 200
    actual_ids = [p["id"] for p in res.json()["data"]]
    assert actual_ids == expected_ids


def test_products_sort_price_asc():
    res = client.get("/products?sort=price_asc&limit=50")
    assert res.status_code == 200
    prices = [p["price"] for p in res.json()["data"]]
    assert prices == sorted(prices)


def test_products_sort_price_desc():
    res = client.get("/products?sort=price_desc&limit=50")
    assert res.status_code == 200
    prices = [p["price"] for p in res.json()["data"]]
    assert prices == sorted(prices, reverse=True)


def test_products_sort_discount():
    res = client.get("/products?sort=discount&limit=50")
    assert res.status_code == 200
    data = res.json()["data"]
    discounts = [
        ((p["mrp"] - p["price"]) / p["mrp"]) if p["mrp"] and p["mrp"] > p["price"] else 0.0
        for p in data
    ]
    assert discounts == sorted(discounts, reverse=True)


def test_products_combined_filters():
    # Category 6 (Boys Fashion) + max_price 1000 + age_min_months 12, age_max_months 36 + sort=price_asc
    db = SessionLocal()
    try:
        sql_prods = (
            db.query(Product)
            .filter(
                Product.category_id == 6,
                Product.price <= 1000.0,
                Product.age_min_months <= 36,
                Product.age_max_months >= 12,
            )
            .order_by(Product.price.asc(), Product.id.asc())
            .all()
        )
        expected_total = len(sql_prods)
        expected_ids = [p.id for p in sql_prods[:10]]
    finally:
        db.close()

    res = client.get(
        "/products?category_ids=6&max_price=1000&age_min_months=12&age_max_months=36&sort=price_asc&limit=10"
    )
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["total"] == expected_total
    actual_ids = [p["id"] for p in body["data"]]
    assert actual_ids == expected_ids
    for p in body["data"]:
        assert p["category_id"] == 6
        assert p["price"] <= 1000.0
        assert p["age_min_months"] <= 36
        assert p["age_max_months"] >= 12


def test_categories_endpoint():
    res = client.get("/categories")
    assert res.status_code == 200
    cats = res.json()["data"]
    cat_names = [c["name"] for c in cats]
    assert "Clothing" in cat_names
    assert "Boys Fashion" in cat_names
    assert "Girls Fashion" in cat_names
    assert len(cats) >= 14


def test_admin_chart_data_unauthorized():
    res = client.get("/admin/chart-data")
    assert res.status_code == 401


def test_admin_chart_data_authorized(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/admin/chart-data?days=14", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert body["error"] is None
    data = body["data"]
    assert len(data) == 14
    for row in data:
        assert "date" in row
        assert "revenue" in row
        assert "order_count" in row
        assert isinstance(row["revenue"], (int, float))
        assert isinstance(row["order_count"], int)
