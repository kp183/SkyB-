import os
import sys
import time
import requests
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.db import SessionLocal
from backend.models.product import Product

load_dotenv()

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")


def fetch_pexels_images():
    if not PEXELS_API_KEY or PEXELS_API_KEY in ["your_pexels_key_here", ""]:
        print("[fetch_images] PEXELS_API_KEY is not configured. Retaining high-quality local vector SVG assets.")
        return

    headers = {"Authorization": PEXELS_API_KEY}
    db = SessionLocal()
    try:
        # Find products whose image_url starts with /catalog/ (not yet replaced with photo)
        pending_products = db.query(Product).filter(Product.image_url.like("/catalog/%")).all()
        print(f"[fetch_images] Found {len(pending_products)} products with SVG placeholders.")

        # Cache searches per subcategory to respect Pexels rate limits (200 requests/hour)
        subcat_cache = {}

        for p in pending_products:
            query = f"kids {p.subcategory or p.name}"
            if query not in subcat_cache:
                try:
                    url = f"https://api.pexels.com/v1/search?query={requests.utils.quote(query)}&per_page=10&orientation=square"
                    resp = requests.get(url, headers=headers, timeout=5)
                    if resp.status_code == 200:
                        photos = resp.json().get("photos", [])
                        subcat_cache[query] = [ph["src"]["medium"] for ph in photos if "src" in ph]
                    else:
                        print(f"  Pexels API error {resp.status_code} for query '{query}'")
                        subcat_cache[query] = []
                    time.sleep(0.5)  # Rate limiting
                except Exception as e:
                    print(f"  Error fetching query '{query}': {e}")
                    subcat_cache[query] = []

            available_photos = subcat_cache.get(query, [])
            if available_photos:
                selected_url = available_photos.pop(0)
                p.image_url = selected_url
                print(f"  Updated Product {p.id} ('{p.name}') -> {selected_url}")

        db.commit()
        print("[fetch_images] Photo fetch and sync complete.")
    finally:
        db.close()


if __name__ == "__main__":
    fetch_pexels_images()
