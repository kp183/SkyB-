import os
import sys
import pytest

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi.testclient import TestClient

from backend.main import app
from backend.db import SessionLocal
from backend.models.user import User
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
    res = client.get("/products")
    assert res.status_code == 200
    body = res.json()
    assert body["error"] is None
    assert isinstance(body["data"], list)
    assert "meta" in body
    meta = body["meta"]
    assert meta["total"] >= 5
    assert meta["skip"] == 0
    assert meta["limit"] == 24


def test_products_pagination():
    res = client.get("/products?skip=1&limit=2")
    assert res.status_code == 200
    body = res.json()
    assert len(body["data"]) <= 2
    assert body["meta"]["skip"] == 1
    assert body["meta"]["limit"] == 2
    assert body["meta"]["total"] >= 5


def test_products_category_ids_filter():
    res = client.get("/products?category_ids=1,2")
    assert res.status_code == 200
    body = res.json()
    for p in body["data"]:
        assert p["category_id"] in [1, 2]


def test_products_gender_filter():
    res = client.get("/products?gender=girls")
    assert res.status_code == 200
    body = res.json()
    for p in body["data"]:
        assert p["gender"] in ["girls", "unisex", None]


def test_products_age_overlap():
    res = client.get("/products?age_min_months=0&age_max_months=6")
    assert res.status_code == 200
    body = res.json()
    for p in body["data"]:
        # Overlap: p.min <= 6 and p.max >= 0
        if p["age_min_months"] is not None and p["age_max_months"] is not None:
            assert p["age_min_months"] <= 6
            assert p["age_max_months"] >= 0


def test_products_search_q():
    res = client.get("/products?q=romper")
    assert res.status_code == 200
    body = res.json()
    assert len(body["data"]) >= 1
    assert "romper" in body["data"][0]["name"].lower()


def test_products_sort_price_asc():
    res = client.get("/products?sort=price_asc")
    assert res.status_code == 200
    prices = [p["price"] for p in res.json()["data"]]
    assert prices == sorted(prices)


def test_products_sort_price_desc():
    res = client.get("/products?sort=price_desc")
    assert res.status_code == 200
    prices = [p["price"] for p in res.json()["data"]]
    assert prices == sorted(prices, reverse=True)


def test_products_sort_discount():
    res = client.get("/products?sort=discount")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) >= 1
    # Check that mrp exists on products
    assert data[0]["mrp"] is not None


def test_products_meta_total():
    db = SessionLocal()
    try:
        from backend.models.product import Product
        expected_total = db.query(Product).count()
    finally:
        db.close()

    res = client.get("/products?limit=100")
    meta = res.json()["meta"]
    assert meta["total"] == expected_total
    assert len(res.json()["data"]) == min(expected_total, 100)


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
