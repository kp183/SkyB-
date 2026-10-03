import os
import sys
import json
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.main import app

c = TestClient(app)

endpoints = [
    ("/products", "1. No params"),
    ("/products?category_ids=1,2", "2. category_ids=1,2"),
    ("/products?gender=girls", "3. gender=girls"),
    ("/products?age_min_months=0&age_max_months=6", "4. age overlap: 0-6 months"),
    ("/products?q=romper", "5. q search: romper"),
    ("/products?sort=discount", "6. sort=discount"),
    ("/products?limit=2", "7. meta.total check with limit=2"),
]

for url, label in endpoints:
    print(f"=== {label} ({url}) ===")
    r = c.get(url)
    print(f"HTTP Status: {r.status_code}")
    body = r.json()
    print("Meta:", json.dumps(body.get("meta")))
    items = body.get("data", [])
    print(f"Items returned: {len(items)}")
    for p in items[:2]:
        print(f"  - ID {p['id']}: '{p['name']}' | Rs.{p['price']} (MRP Rs.{p['mrp']}) | Gender: {p['gender']} | Age: {p['age_min_months']}-{p['age_max_months']}m | Cat: {p['category_id']}")
    print()
