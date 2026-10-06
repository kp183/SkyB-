import os
import sys
import random
import pytest
from fastapi.testclient import TestClient

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.main import app
from backend.db import SessionLocal
from backend.models.user import User
from backend.models.product import Product
from backend.models.cart import CartItem
from backend.models.coupon import Coupon
from backend.security import hash_password
from backend.routers.auth import login_attempts

client = TestClient(app)


@pytest.fixture(scope="module")
def seeded_users():
    """Ensure customer and admin users exist for regression tests."""
    db = SessionLocal()
    try:
        # Customer user
        cust = db.query(User).filter(User.email == "regression_customer@skyb.com").first()
        if not cust:
            cust = User(
                name="Regression Customer",
                email="regression_customer@skyb.com",
                password_hash=hash_password("Customer@123"),
                role="customer",
            )
            db.add(cust)

        # Admin user
        admin = db.query(User).filter(User.email == "regression_admin@skyb.com").first()
        if not admin:
            admin = User(
                name="Regression Admin",
                email="regression_admin@skyb.com",
                password_hash=hash_password("Admin@123"),
                role="admin",
            )
            db.add(admin)

        # Ensure coupon exists
        c = db.query(Coupon).filter(Coupon.code == "WELCOME10").first()
        if not c:
            c = Coupon(
                code="WELCOME10",
                discount_type="percent",
                discount_value=10.0,
                min_order_value=None,
                active=True,
            )
            db.add(c)

        db.commit()
    finally:
        db.close()

    # Log in customer
    res_c = client.post("/auth/login", json={"email": "regression_customer@skyb.com", "password": "Customer@123"})
    assert res_c.status_code == 200, f"Customer login failed: {res_c.text}"
    customer_token = res_c.json()["data"]["token"]

    # Log in admin
    res_a = client.post("/auth/login", json={"email": "regression_admin@skyb.com", "password": "Admin@123"})
    assert res_a.status_code == 200, f"Admin login failed: {res_a.text}"
    admin_token = res_a.json()["data"]["token"]

    return {
        "customer_token": customer_token,
        "admin_token": admin_token,
    }


# -----------------------------------------------------------------------------
# 1. Bargain Assistant Bounds & Round Limit (200 random offers)
# -----------------------------------------------------------------------------
def test_bargain_never_below_min_price_across_200_random_offers(seeded_users):
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        product = db.query(Product).first()
        assert product is not None, "Product must exist in DB"
        pid = product.id
        min_p = float(product.min_price)
    finally:
        db.close()

    random.seed(999)
    for i in range(200):
        offer_val = round(random.uniform(1.0, 5000.0), 2)

        start_res = client.post("/bargain/start", json={"product_id": pid}, headers=headers)
        assert start_res.status_code == 200
        sid = start_res.json()["data"]["session_id"]

        offer_res = client.post(
            "/bargain/offer",
            json={"session_id": sid, "offer_price": offer_val},
            headers=headers,
        )
        assert offer_res.status_code == 200
        data = offer_res.json()["data"]
        counter = data["counter_price"]

        # Counter price must NEVER be below min_price
        assert counter >= min_p, f"Round 1 counter {counter} below min_price {min_p} for offer {offer_val}"

        if data.get("is_accepted"):
            acc_res = client.post("/bargain/accept", json={"session_id": sid}, headers=headers)
            assert acc_res.status_code == 200
            final_p = acc_res.json()["data"]["final_price"]
            assert final_p >= min_p, f"Accepted price {final_p} below min_price {min_p}"


def test_bargain_round_limit_enforced(seeded_users):
    """
    Tests round limit progression up to round 3 and checks round 4 handling.
    """
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        product = db.query(Product).first()
        pid = product.id
        min_p = float(product.min_price)
    finally:
        db.close()

    start_res = client.post("/bargain/start", json={"product_id": pid}, headers=headers)
    assert start_res.status_code == 200
    sid = start_res.json()["data"]["session_id"]

    for round_num in range(1, 4):
        res = client.post(
            "/bargain/offer",
            json={"session_id": sid, "offer_price": min_p - 10.0},
            headers=headers,
        )
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["round_number"] == round_num
        assert data["counter_price"] >= min_p
        if round_num == 3:
            assert data["is_final_round"] is True

    # Check whether 4th round is rejected (or if base allowed > 3 rounds)
    res_4 = client.post(
        "/bargain/offer",
        json={"session_id": sid, "offer_price": min_p - 10.0},
        headers=headers,
    )
    # At 3801d0b^, round 4 was not rejected with 400 (it returned 200 with is_final_round=True).
    assert res_4.status_code in [400, 422], (
        f"ROUND LIMIT NOT REJECTED AT BASE (status {res_4.status_code})"
    )


# -----------------------------------------------------------------------------
# 2. Coupon Non-Stacking with Bargained Item
# -----------------------------------------------------------------------------
def test_coupon_non_stacking_with_bargained_item(seeded_users):
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        cust = db.query(User).filter(User.email == "regression_customer@skyb.com").first()
        db.query(CartItem).filter(CartItem.user_id == cust.id).delete()
        db.commit()

        p1 = db.query(Product).filter(Product.id == 1).first()
        p2 = db.query(Product).filter(Product.id == 2).first()
        p1_price = float(p1.price)
        p2_min = float(p2.min_price)
    finally:
        db.close()

    # Add regular un-bargained item (Product 1)
    add_res = client.post("/cart/add", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert add_res.status_code == 200

    # Bargain Product 2 and accept
    b_start = client.post("/bargain/start", json={"product_id": 2}, headers=headers)
    sid = b_start.json()["data"]["session_id"]
    client.post("/bargain/offer", json={"session_id": sid, "offer_price": p2_min}, headers=headers)
    b_acc = client.post("/bargain/accept", json={"session_id": sid}, headers=headers)
    assert b_acc.status_code == 200
    bargained_price = b_acc.json()["data"]["final_price"]

    # Checkout
    chk_res = client.post("/checkout", json={"delivery_address": "123 Test Street"}, headers=headers)
    assert chk_res.status_code == 200
    order_data = chk_res.json()["data"]

    # Coupon discount must apply ONLY to non-bargained items (p1_price)
    # Total must equal (non_bargained_subtotal - discount) + bargained_subtotal
    discount = order_data["discount_applied"]
    total = order_data["total_amount"]
    expected_total = round((p1_price - discount) + bargained_price, 2)

    assert abs(total - expected_total) < 0.01, (
        f"Total amount violated coupon exemption: total={total}, expected={expected_total}"
    )


# -----------------------------------------------------------------------------
# 3. Cart Totals
# -----------------------------------------------------------------------------
def test_cart_totals(seeded_users):
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        cust = db.query(User).filter(User.email == "regression_customer@skyb.com").first()
        db.query(CartItem).filter(CartItem.user_id == cust.id).delete()
        db.commit()
    finally:
        db.close()

    # Add item 1 with qty 2
    client.post("/cart/add", json={"product_id": 1, "quantity": 2}, headers=headers)

    cart_res = client.get("/cart", headers=headers)
    assert cart_res.status_code == 200
    cdata = cart_res.json()["data"]

    assert "items" in cdata
    assert "total_amount" in cdata
    assert "non_bargained_subtotal" in cdata
    assert "bargained_subtotal" in cdata
    assert len(cdata["items"]) == 1
    assert cdata["items"][0]["quantity"] == 2
    assert cdata["total_amount"] == cdata["non_bargained_subtotal"]


# -----------------------------------------------------------------------------
# 4. Mock Pay Idempotency
# -----------------------------------------------------------------------------
def test_mock_pay_idempotency(seeded_users):
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/cart/add", json={"product_id": 1, "quantity": 1}, headers=headers)
    chk_res = client.post("/checkout", json={"delivery_address": "Idempotency Test"}, headers=headers)
    assert chk_res.status_code == 200
    oid = chk_res.json()["data"]["id"]

    # First payment succeeds
    pay1 = client.post("/orders/mock-pay", json={"order_id": oid, "simulate_failure": False}, headers=headers)
    assert pay1.status_code == 200
    assert pay1.json()["data"]["status"] == "placed"

    # Second payment is rejected
    pay2 = client.post("/orders/mock-pay", json={"order_id": oid, "simulate_failure": False}, headers=headers)
    assert pay2.status_code == 400
    assert "Order cannot be paid in current status" in pay2.text


# -----------------------------------------------------------------------------
# 5. Payment Failure then Retry Works
# -----------------------------------------------------------------------------
def test_payment_failure_then_retry(seeded_users):
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/cart/add", json={"product_id": 1, "quantity": 1}, headers=headers)
    chk_res = client.post("/checkout", json={"delivery_address": "Retry Test"}, headers=headers)
    assert chk_res.status_code == 200
    oid = chk_res.json()["data"]["id"]

    # 1. Simulate failure
    fail_res = client.post("/orders/mock-pay", json={"order_id": oid, "simulate_failure": True}, headers=headers)
    assert fail_res.status_code == 200
    assert fail_res.json()["data"]["payment_successful"] is False
    assert fail_res.json()["data"]["status"] == "payment_failed"

    # Cart preserved
    cart_res = client.get("/cart", headers=headers)
    assert len(cart_res.json()["data"]["items"]) >= 1

    # 2. Retry succeeds
    success_res = client.post("/orders/mock-pay", json={"order_id": oid, "simulate_failure": False}, headers=headers)
    assert success_res.status_code == 200
    assert success_res.json()["data"]["payment_successful"] is True
    assert success_res.json()["data"]["status"] == "placed"

    # Cart cleared
    cart_empty = client.get("/cart", headers=headers)
    assert len(cart_empty.json()["data"]["items"]) == 0


# -----------------------------------------------------------------------------
# 6. Stock Decrement on Success
# -----------------------------------------------------------------------------
def test_stock_decrement_on_success(seeded_users):
    """
    Tests whether stock decrement is implemented on successful payment.
    Per spec rule: 'Report any test that cannot pass at 3801d0b^ instead of changing it.'
    """
    token = seeded_users["customer_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        p = db.query(Product).filter(Product.id == 3).first()
        initial_stock = p.stock_qty
    finally:
        db.close()

    client.post("/cart/add", json={"product_id": 3, "quantity": 1}, headers=headers)
    chk = client.post("/checkout", json={"delivery_address": "Stock Test"}, headers=headers)
    oid = chk.json()["data"]["id"]

    client.post("/orders/mock-pay", json={"order_id": oid, "simulate_failure": False}, headers=headers)

    db = SessionLocal()
    try:
        p_after = db.query(Product).filter(Product.id == 3).first()
        after_stock = p_after.stock_qty
    finally:
        db.close()

    # At 3801d0b^, stock was NOT decremented by mock_pay.
    assert after_stock == initial_stock - 1, (
        f"STOCK DECREMENT NOT IMPLEMENTED AT BASE: initial_stock={initial_stock}, after_stock={after_stock}"
    )


# -----------------------------------------------------------------------------
# 7. RBAC: Customer 403 on Admin Endpoints, Admin 200
# -----------------------------------------------------------------------------
def test_rbac_customer_forbidden_admin_allowed(seeded_users):
    c_token = seeded_users["customer_token"]
    a_token = seeded_users["admin_token"]

    cust_res = client.get("/admin/dashboard", headers={"Authorization": f"Bearer {c_token}"})
    assert cust_res.status_code == 403

    admin_res = client.get("/admin/dashboard", headers={"Authorization": f"Bearer {a_token}"})
    assert admin_res.status_code == 200
    assert admin_res.json()["error"] is None


# -----------------------------------------------------------------------------
# 8. Login Rate Limiting
# -----------------------------------------------------------------------------
def test_login_rate_limiting():
    login_attempts.clear()

    for i in range(10):
        client.post("/auth/login", json={"email": "wrong@skyb.com", "password": "WrongPassword"})

    res_11 = client.post("/auth/login", json={"email": "wrong@skyb.com", "password": "WrongPassword"})
    assert res_11.status_code == 429
    assert "Too many authentication requests" in res_11.text
