import json
import urllib.request

BASE_URL = "http://localhost:8000"

def post(endpoint, data, token=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {}),
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

# 1. Login
auth = post("/auth/login", {"email": "parent@skyb.com", "password": "Parent@123"})
token = auth["data"]["token"]
print("LOGIN SUCCESS. User ID:", auth["data"]["user"]["id"])

# 2. Get product 1 info
with urllib.request.urlopen(f"{BASE_URL}/products/1") as resp:
    prod = json.loads(resp.read().decode("utf-8"))["data"]
print(f"Product: {prod['name']}, Price: {prod['price']}, Min Price: {prod['min_price']}")

# 3. Start Bargain
start_resp = post("/bargain/start", {"product_id": 1}, token=token)
sess_id = start_resp["data"]["session_id"]
print(f"START SESSION: {json.dumps(start_resp, indent=2)}")

# 4. Round 1: Offer 520 (above min_price 450)
r1_req = {"session_id": sess_id, "offer_price": 520.0}
r1_resp = post("/bargain/offer", r1_req, token=token)
print("\n--- ROUND 1 ---")
print("Request:", json.dumps(r1_req))
print("Response:", json.dumps(r1_resp, indent=2))
assert r1_resp["data"]["counter_price"] >= prod["min_price"]

# 5. Round 2: Offer 350 (STRICTLY BELOW min_price 450)
r2_req = {"session_id": sess_id, "offer_price": 350.0}
r2_resp = post("/bargain/offer", r2_req, token=token)
print("\n--- ROUND 2 (BELOW MIN PRICE) ---")
print("Request:", json.dumps(r2_req))
print("Response:", json.dumps(r2_resp, indent=2))
assert r2_resp["data"]["counter_price"] >= prod["min_price"], "VIOLATION: Counter fell below min_price!"
print(f"VERIFIED: Counter price {r2_resp['data']['counter_price']} >= min_price {prod['min_price']}")

# 6. Round 3: Offer 470
r3_req = {"session_id": sess_id, "offer_price": 470.0}
r3_resp = post("/bargain/offer", r3_req, token=token)
print("\n--- ROUND 3 (FINAL ROUND) ---")
print("Request:", json.dumps(r3_req))
print("Response:", json.dumps(r3_resp, indent=2))
assert r3_resp["data"]["counter_price"] >= prod["min_price"]

# 7. Accept deal
accept_req = {"session_id": sess_id}
accept_resp = post("/bargain/accept", accept_req, token=token)
print("\n--- ACCEPT DEAL ---")
print("Request:", json.dumps(accept_req))
print("Response:", json.dumps(accept_resp, indent=2))
assert accept_resp["data"]["is_bargained"] is True
print("VERIFIED: Cart updated with is_bargained=True and agreed_price!")
