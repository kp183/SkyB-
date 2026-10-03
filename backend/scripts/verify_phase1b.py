import os
import sys
import sqlite3

db_path = "skyb.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

print("=== 1. COUNTS PER CATEGORY ===")
cur.execute("""
    SELECT c.id, c.name, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.id;
""")
for r in cur.fetchall():
    print(f"  Category {r[0]} ({r[1]}): {r[2]} products")

print("\n=== 2. COUNTS PER SUBCATEGORY (SAMPLE ACROSS CATEGORIES) ===")
cur.execute("""
    SELECT subcategory, COUNT(*) 
    FROM products 
    WHERE subcategory IS NOT NULL
    GROUP BY subcategory 
    ORDER BY subcategory;
""")
subcats = cur.fetchall()
print(f"Total unique subcategories populated: {len(subcats)}")
for sc in subcats[:15]:
    print(f"  - {sc[0]}: {sc[1]} products")
print(f"  ... and {len(subcats) - 15} more subcategories.")

print("\n=== 3. COUNTS PER AGE BAND (OVERLAPPING QUERY) ===")
age_bands = {
    "new-born": (0, 3),
    "0-3-months": (0, 3),
    "3-6-months": (3, 6),
    "6-9-months": (6, 9),
    "9-12-months": (9, 12),
    "12-18-months": (12, 18),
    "18-24-months": (18, 24),
    "2-4-years": (24, 48),
    "4-6-years": (48, 72),
    "6-8-years": (72, 96),
    "8-plus-years": (96, 144),
}
for slug, (b_min, b_max) in age_bands.items():
    cur.execute("""
        SELECT COUNT(*) FROM products
        WHERE age_min_months <= ? AND age_max_months >= ?;
    """, (b_max, b_min))
    cnt = cur.fetchone()[0]
    print(f"  - {slug} ({b_min}-{b_max}m): {cnt} products (Target: >=12)")

print("\n=== 4. ORIGINAL 5 PRODUCTS (IDS 1-5) STATUS ===")
cur.execute("""
    SELECT id, name, price, min_price, max_price, mrp, gender, age_group
    FROM products
    WHERE id BETWEEN 1 AND 5
    ORDER BY id;
""")
for p in cur.fetchall():
    print(f"  ID {p[0]}: '{p[1]}' | Price: Rs.{p[2]} | Min: Rs.{p[3]} | Max: Rs.{p[4]} | MRP: Rs.{p[5]} | Gender: {p[6]} | Age: {p[7]}")

print("\n=== 5. SAMPLE 5 PRODUCTS WITH STORED SAFETY FIELDS ===")
cur.execute("""
    SELECT id, name, category_id, safety_score, safety_tags, safety_summary
    FROM products
    WHERE id IN (1, 2, 7, 15, 25)
    ORDER BY id;
""")
for p in cur.fetchall():
    print(f"  ID {p[0]}: '{p[1]}'")
    print(f"    Score:   {p[3]}")
    print(f"    Tags:    {p[4]}")
    print(f"    Summary: {p[5]}")

conn.close()
