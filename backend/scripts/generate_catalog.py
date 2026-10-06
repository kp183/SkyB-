import os
import sys
import json
import random
import re

# Ensure seed 42 for complete determinism
random.seed(42)

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.scripts.migrate_additive import parse_age_group

# Define the 11 categories and their required subcategories
CATEGORIES_SPEC = {
    "Boys Fashion": {
        "gender": "boys",
        "subcategories": {
            "Sets & Suits": {"price": (599, 1499), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
            "T-Shirts": {"price": (299, 799), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Shirts": {"price": (499, 1099), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Jeans & Trousers": {"price": (599, 1299), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Shorts": {"price": (349, 749), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Nightwear": {"price": (399, 899), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y", "6-8y"]},
            "Ethnic Wear": {"price": (799, 1999), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Sweatshirts & Jackets": {"price": (699, 1799), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Combo Packs": {"price": (799, 1899), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
        }
    },
    "Girls Fashion": {
        "gender": "girls",
        "subcategories": {
            "Dresses & Frocks": {"price": (499, 1599), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Tops & Tees": {"price": (299, 799), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Leggings & Pants": {"price": (349, 899), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Skirts & Shorts": {"price": (399, 849), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Nightwear": {"price": (399, 899), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y", "6-8y"]},
            "Ethnic Wear": {"price": (799, 2199), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Sweaters & Jackets": {"price": (699, 1799), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Hair Accessories": {"price": (149, 499), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Combo Packs": {"price": (799, 1899), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
        }
    },
    "Footwear": {
        "gender": "unisex",
        "subcategories": {
            "Sandals": {"price": (499, 1199), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Sneakers": {"price": (699, 1699), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Casual Shoes": {"price": (599, 1399), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "School Shoes": {"price": (499, 1299), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
            "Booties": {"price": (299, 699), "ages": ["0-3m", "3-6m", "6-12m"]},
            "Sliders & Flip-Flops": {"price": (249, 599), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
            "Rain Boots": {"price": (599, 1299), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
        }
    },
    "Toys": {
        "gender": "unisex",
        "subcategories": {
            "Soft Toys": {"price": (399, 1299), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Learning & Educational": {"price": (499, 1799), "ages": ["6-12m", "1-2y", "2-4y", "4-6y", "6-8y"]},
            "Blocks & Construction": {"price": (499, 1999), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Stacking & Sorting": {"price": (349, 999), "ages": ["3-6m", "6-12m", "1-2y", "2-4y"]},
            "Musical Toys": {"price": (499, 1499), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Puzzles": {"price": (299, 899), "ages": ["1-2y", "2-4y", "4-6y", "6-8y", "8+y"]},
            "Role Play": {"price": (599, 1899), "ages": ["2-4y", "4-6y", "6-8y"]},
            "Ride-Ons": {"price": (1299, 3999), "ages": ["1-2y", "2-4y", "4-6y"]},
        }
    },
    "Diapering": {
        "gender": "unisex",
        "subcategories": {
            "Diaper Pants": {"price": (499, 1399), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Taped Diapers": {"price": (399, 1199), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Baby Wipes": {"price": (199, 599), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Rash Creams": {"price": (249, 599), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Changing Mats": {"price": (349, 899), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Diaper Bags": {"price": (899, 2499), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Combo Packs": {"price": (799, 1999), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
        }
    },
    "Gear": {
        "gender": "unisex",
        "subcategories": {
            "Strollers & Prams": {"price": (2999, 8999), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Car Seats": {"price": (3499, 9999), "ages": ["new-born", "0-3m", "6-12m", "1-2y", "2-4y", "4-6y"]},
            "Baby Carriers": {"price": (1199, 3299), "ages": ["0-3m", "3-6m", "6-12m", "1-2y"]},
            "High Chairs": {"price": (1899, 4999), "ages": ["6-12m", "1-2y", "2-4y"]},
            "Walkers": {"price": (1499, 3499), "ages": ["6-12m", "1-2y"]},
            "Bouncers & Swings": {"price": (1699, 4499), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
        }
    },
    "Feeding": {
        "gender": "unisex",
        "subcategories": {
            "Feeding Bottles": {"price": (249, 799), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Sippers & Cups": {"price": (249, 649), "ages": ["6-12m", "1-2y", "2-4y"]},
            "Bibs & Burp Cloths": {"price": (199, 499), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Teethers & Pacifiers": {"price": (179, 499), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Bowls & Cutlery": {"price": (299, 899), "ages": ["6-12m", "1-2y", "2-4y", "4-6y"]},
            "Sterilizers & Warmers": {"price": (1299, 3499), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Combo Packs": {"price": (699, 1799), "ages": ["0-3m", "3-6m", "6-12m", "1-2y"]},
        }
    },
    "Bath & Skincare": {
        "gender": "unisex",
        "subcategories": {
            "Baby Lotions": {"price": (249, 699), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Soaps & Body Wash": {"price": (199, 549), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Shampoos": {"price": (229, 599), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Oils & Powders": {"price": (219, 599), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Bath Tubs & Accessories": {"price": (799, 2199), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Towels & Robes": {"price": (399, 999), "ages": ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
            "Bath Toys": {"price": (249, 699), "ages": ["6-12m", "1-2y", "2-4y"]},
            "Combo Packs": {"price": (699, 1899), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
        }
    },
    "Nursery": {
        "gender": "unisex",
        "subcategories": {
            "Cots & Cribs": {"price": (4999, 14999), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Mattresses & Pillows": {"price": (999, 2999), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Blankets & Swaddles": {"price": (449, 1299), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Bedding Sets": {"price": (1199, 3499), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y"]},
            "Mosquito Nets": {"price": (399, 999), "ages": ["new-born", "0-3m", "3-6m", "6-12m"]},
            "Room Decor": {"price": (499, 1699), "ages": ["0-3m", "1-2y", "2-4y", "4-6y", "6-8y"]},
        }
    },
    "Health & Safety": {
        "gender": "unisex",
        "subcategories": {
            "Safety Gates & Guards": {"price": (999, 2999), "ages": ["6-12m", "1-2y", "2-4y"]},
            "Thermometers": {"price": (399, 1299), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
            "Grooming Kits": {"price": (349, 899), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
            "Oral Care": {"price": (149, 449), "ages": ["3-6m", "6-12m", "1-2y", "2-4y", "4-6y", "6-8y"]},
            "Healthcare Accessories": {"price": (299, 799), "ages": ["new-born", "0-3m", "6-12m", "1-2y", "2-4y"]},
            "Mosquito Care": {"price": (199, 549), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-6y"]},
            "Cleansers & Detergents": {"price": (299, 699), "ages": ["new-born", "0-3m", "3-6m", "6-12m", "1-2y"]},
        }
    },
    "School Essentials": {
        "gender": "unisex",
        "subcategories": {
            "Backpacks": {"price": (699, 1899), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
            "Lunch Boxes & Bottles": {"price": (349, 999), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
            "Stationery": {"price": (199, 599), "ages": ["3-5y", "4-6y", "6-8y", "8+y"]},
            "Geometry & Art Kits": {"price": (299, 899), "ages": ["4-6y", "6-8y", "8+y"]},
            "Raincoats & Umbrellas": {"price": (399, 1099), "ages": ["2-4y", "4-6y", "6-8y", "8+y"]},
        }
    }
}

DESCRIPTIVE_ADJECTIVES = [
    "Soft", "Comfortable", "Breathable", "Pure", "Cozy", "Classic", "Delicate",
    "Gentle", "Premium", "Durable", "Lightweight", "Essential", "Everyday", "Snug"
]

def subcategory_to_slug(name: str) -> str:
    s = name.lower()
    s = s.replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def generate_svg_icon(subcat: str, slug: str, dest_dir: str):
    os.makedirs(dest_dir, exist_ok=True)
    svg_path = os.path.join(dest_dir, f"{slug}.svg")
    
    # Pick a gentle pastel color theme matching locked palette
    colors = [
        ("#f0f7ff", "#c4e7ff", "#00668a"), # Sky blue
        ("#fff0f2", "#ffdadc", "#a93349"), # Coral pink
        ("#fff9e6", "#ffdf9f", "#795900"), # Buttercup gold
        ("#f4f9f4", "#d4ebd4", "#2d6a4f"), # Soft sage
    ]
    bg_color, border_color, accent_color = random.choice(colors)

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_{slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_color}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(#grad_{slug})" stroke="{border_color}" stroke-width="4"/>
  <circle cx="200" cy="180" r="80" fill="{border_color}" opacity="0.4"/>
  <circle cx="200" cy="180" r="50" fill="{accent_color}" opacity="0.85"/>
  <path d="M 175 180 L 195 200 L 225 160" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="200" y="310" font-family="'Quicksand', 'Nunito Sans', sans-serif" font-size="20" font-weight="700" fill="{accent_color}" text-anchor="middle">{subcat}</text>
  <text x="200" y="336" font-family="'Nunito Sans', sans-serif" font-size="13" font-weight="600" fill="#70787e" text-anchor="middle">skyB Kids</text>
</svg>"""
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)


def generate_catalog():
    print("=== GENERATING DETERMINISTIC SKYB CATALOG ===")
    all_products = []
    svg_dir = os.path.abspath("frontend/public/catalog")
    
    # Track distributions
    products_per_category = {cat: 0 for cat in CATEGORIES_SPEC}
    products_per_subcat = {}
    
    # 11 required age bands to track
    age_band_ranges = {
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

    # Generate SVGs for all subcategories
    for cat_name, cat_data in CATEGORIES_SPEC.items():
        for subcat in cat_data["subcategories"]:
            slug = subcategory_to_slug(subcat)
            generate_svg_icon(subcat, slug, svg_dir)

    # Deterministic generation
    prod_counter = 1
    for cat_name, cat_data in CATEGORIES_SPEC.items():
        subcats = cat_data["subcategories"]
        # Generate 5-6 products per subcategory so category easily reaches >=30
        for subcat, sinfo in subcats.items():
            slug = subcategory_to_slug(subcat)
            image_url = f"/catalog/{slug}.svg"
            
            # Yield exactly 407 products across all 11 categories (every subcategory >= 5, every category >= 30)
            if cat_name == "School Essentials":
                num_products = 6
            elif cat_name == "Nursery":
                num_products = 6
            elif cat_name == "Gear" and subcat == "Strollers & Prams":
                num_products = 6
            else:
                num_products = 5
            products_per_subcat[subcat] = 0

            for i in range(num_products):
                adj = random.choice(DESCRIPTIVE_ADJECTIVES)
                p_name = f"{adj} {subcat} #{prod_counter}"
                
                # Singular/tailored name
                clean_sub = subcat[:-1] if subcat.endswith("s") and not subcat.endswith("ss") else subcat
                if "Pack" in subcat:
                    p_name = f"{adj} {subcat} Set of {random.choice([2, 3, 4])}"
                else:
                    variants = ["Essential", "Classic", "Everyday", "Organic", "Comfort", "Active"]
                    p_name = f"{adj} {clean_sub} {random.choice(variants)}"

                # Price range
                p_min, p_max = sinfo["price"]
                price = float(random.randint(p_min, p_max))
                
                # Rewrite MRP logic per Phase 1D spec (seed 42):
                # ~40% of products: mrp = price (no discount shown)
                # ~25%: discount 5-14%
                # ~35%: discount 15-35%
                # mrp stays a whole rupee amount. min_price stays 80-90% of price.
                r_disc = random.random()
                if r_disc < 0.40:
                    mrp = price
                elif r_disc < 0.65:
                    d_pct = random.uniform(0.05, 0.14)
                    mrp = float(int(round(price / (1.0 - d_pct))))
                    if mrp <= price:
                        mrp = price + 20.0
                else:
                    d_pct = random.uniform(0.15, 0.35)
                    mrp = float(int(round(price / (1.0 - d_pct))))
                    if mrp <= price:
                        mrp = float(int(round(price * 1.25)))

                mrp = float(int(round(mrp)))
                min_price = float(int(round(price * random.uniform(0.80, 0.90))))
                max_price = mrp

                # Stock: about 5% at 0, about 8% at 5 or fewer, the rest 10-120
                stock_rand = random.random()
                if stock_rand < 0.05:
                    stock_qty = 0
                elif stock_rand < 0.13:
                    stock_qty = random.randint(1, 5)
                else:
                    stock_qty = random.randint(10, 120)

                # Age
                age_choice = random.choice(sinfo["ages"])
                min_m, max_m = parse_age_group(age_choice)

                # Gender
                if cat_data["gender"] == "boys":
                    gender = "boys"
                elif cat_data["gender"] == "girls":
                    gender = "girls"
                else:
                    gender = "unisex"

                # Size
                if min_m < 12:
                    size = f"{min_m}-{max_m}M"
                elif min_m < 36:
                    size = f"{min_m//12}-{max_m//12}Y"
                else:
                    size = f"{min_m//12}-{max_m//12}Y"

                # Descriptions & Safety Badge integration
                # Read services/safety_badge_service.py keywords:
                # choking, small parts, flammable, bpa-free, non-toxic, hypoallergenic, organic cotton
                if cat_name in ["Boys Fashion", "Girls Fashion"]:
                    material = "pure organic cotton"
                    desc = f"Soft, breathable {subcat.lower()} designed for children aged {age_choice}. Made with {material}."
                    safety_tags = ["Organic Cotton", "Hypoallergenic", "Non-Toxic"]
                    safety_score = "Good"
                    safety_summary = "Crafted with pure organic cotton, safe and breathable on child skin."
                elif cat_name == "Toys":
                    if min_m < 36 and subcat in ["Blocks & Construction", "Puzzles", "Role Play"]:
                        material = "natural smooth hardwood with water-based non-toxic lacquer"
                        desc = f"Creative developmental {subcat.lower()} for toddlers. Crafted from {material}. Warning: Contains small parts that may pose a choking hazard for children under 3 years."
                        safety_tags = ["Choking Hazard", "Non-Toxic"]
                        safety_score = "Low"
                        safety_summary = "Warning: Contains small parts that may pose a choking hazard for children under 3 years."
                    else:
                        material = "non-toxic child-safe wood and rounded edge silicone"
                        desc = f"Engaging sensory and motor play {subcat.lower()} suitable for {age_choice}. Built with {material}."
                        safety_tags = ["Non-Toxic", "Smooth Edges"]
                        safety_score = "Good"
                        safety_summary = "Crafted with non-toxic, eco-friendly organic materials."
                elif cat_name == "Feeding":
                    material = "food-grade bpa-free silicone and premium borosilicate glass"
                    desc = f"Infant feeding essential designed for {age_choice}. Made from {material}."
                    safety_tags = ["BPA-Free", "Non-Toxic"]
                    safety_score = "Good"
                    safety_summary = "BPA-free food-grade materials, suitable for infants."
                elif cat_name in ["Diapering", "Bath & Skincare"]:
                    material = "hypoallergenic, plant-based soothing ingredients"
                    desc = f"Gentle baby care formulation for {age_choice}. Free from harsh sulfates and artificial perfumes. Features {material}."
                    safety_tags = ["Hypoallergenic", "Gentle Formula"]
                    safety_score = "Good"
                    safety_summary = "Hypoallergenic and soothing formulation for delicate skin."
                else:
                    material = "durable child-safe tear-resistant canvas with safety reflectors"
                    desc = f"Practical ergonomic {subcat.lower()} built for {age_choice}. Made with {material}."
                    safety_tags = ["Child-Safe", "Ergonomic"]
                    safety_score = "Good"
                    safety_summary = "Meets standard children safety quality guidelines."

                prod = {
                    "name": p_name,
                    "description": desc,
                    "category": cat_name,
                    "subcategory": subcat,
                    "gender": gender,
                    "age_group": age_choice,
                    "age_min_months": min_m,
                    "age_max_months": max_m,
                    "size": size,
                    "price": price,
                    "mrp": mrp,
                    "min_price": min_price,
                    "max_price": max_price,
                    "stock_qty": stock_qty,
                    "image_url": image_url,
                    "safety_tags": safety_tags,
                    "safety_score": safety_score,
                    "safety_summary": safety_summary,
                }
                all_products.append(prod)
                products_per_category[cat_name] += 1
                products_per_subcat[subcat] += 1
                prod_counter += 1

    # Output catalog.json
    out_dir = os.path.abspath("backend/data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "catalog.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2)

    print(f"Generated {len(all_products)} products into {out_path}.")
    print("\nProducts per category:")
    for cat, cnt in products_per_category.items():
        print(f"  - {cat}: {cnt}")

    print("\nVerifying age band overlap counts:")
    for band_slug, (b_min, b_max) in age_band_ranges.items():
        overlap_cnt = sum(
            1 for p in all_products
            if p["age_min_months"] <= b_max and p["age_max_months"] >= b_min
        )
        print(f"  - {band_slug} ({b_min}-{b_max}m): {overlap_cnt} products (Target: >= 12)")
        assert overlap_cnt >= 12, f"Age band {band_slug} fell below target!"

    print("\nVerifying subcategory minimum counts:")
    min_sub_cnt = min(products_per_subcat.values())
    print(f"  Minimum products in any subcategory: {min_sub_cnt} (Target: >= 4)")
    assert min_sub_cnt >= 4, "A subcategory has fewer than 4 products!"

    # Calculate discount distribution histogram
    disc_0 = sum(1 for p in all_products if (p["mrp"] - p["price"]) <= 0)
    disc_5_14 = sum(1 for p in all_products if 0.05 <= (p["mrp"] - p["price"]) / p["mrp"] < 0.15)
    disc_15_24 = sum(1 for p in all_products if 0.15 <= (p["mrp"] - p["price"]) / p["mrp"] < 0.25)
    disc_25_35 = sum(1 for p in all_products if 0.25 <= (p["mrp"] - p["price"]) / p["mrp"] <= 0.36)
    deals_cnt = sum(1 for p in all_products if (p["mrp"] - p["price"]) / p["mrp"] >= 0.15)

    tot = len(all_products)
    print("\nDiscount Distribution Histogram:")
    print(f"  - 0% discount (mrp == price): {disc_0} ({disc_0/tot*100:.1f}%) [Target: ~40%]")
    print(f"  - 5-14% discount: {disc_5_14} ({disc_5_14/tot*100:.1f}%) [Target: ~25%]")
    print(f"  - 15-24% discount: {disc_15_24} ({disc_15_24/tot*100:.1f}%)")
    print(f"  - 25-35% discount: {disc_25_35} ({disc_25_35/tot*100:.1f}%)")
    print(f"  - Total Deals (>= 15% discount): {deals_cnt} ({deals_cnt/tot*100:.1f}%) [Target: ~35%]")

    zero_stock = sum(1 for p in all_products if p["stock_qty"] == 0)
    low_stock = sum(1 for p in all_products if 1 <= p["stock_qty"] <= 5)
    print(f"\nStock breakdown:")
    print(f"  - Zero stock (0): {zero_stock} ({zero_stock/tot*100:.1f}%) (Target: ~5%)")
    print(f"  - Low stock (1-5): {low_stock} ({low_stock/tot*100:.1f}%) (Target: ~8%)")

    print("\n=== CATALOG GENERATION VERIFICATION COMPLETE ===")


if __name__ == "__main__":
    generate_catalog()
