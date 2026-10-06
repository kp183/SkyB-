import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.db import engine, SessionLocal
from backend.models import Category

def test_category_id_gap():
    print("=== TESTING CATEGORY ID GAP RESILIENCE ===")
    db = SessionLocal()
    try:
        # Before mapping
        initial_cats = db.query(Category).order_by(Category.id.asc()).all()
        print("\n--- Initial Categories & IDs ---")
        for c in initial_cats:
            print(f"  ID {c.id:2d}: {c.name}")

        # Insert dummy category
        dummy = Category(name="Temporary Dummy Category")
        db.add(dummy)
        db.commit()
        dummy_id = dummy.id
        print(f"\nInserted dummy category with ID: {dummy_id}")

        # Delete dummy category, leaving an ID gap
        db.delete(dummy)
        db.commit()
        print(f"Deleted dummy category (ID: {dummy_id}), creating an autoincrement sequence gap.")

        # Insert a subsequent real/demo category to demonstrate gap
        gap_cat = Category(name="Sensory & Montessori Special")
        db.add(gap_cat)
        db.commit()
        gap_id = gap_cat.id
        print(f"Inserted new category '{gap_cat.name}' -> Assigned ID: {gap_id} (Gap exists: ID {dummy_id} is missing!)")

        # After mapping
        after_cats = db.query(Category).order_by(Category.id.asc()).all()
        print("\n--- After Categories & IDs (with gap) ---")
        for c in after_cats:
            print(f"  ID {c.id:2d}: {c.name}")

        # Clean up the test category
        db.delete(gap_cat)
        db.commit()
        print("\nCleaned up test categories. Database restored to canonical categories.")
    finally:
        db.close()

if __name__ == "__main__":
    test_category_id_gap()
