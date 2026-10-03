# Architecture & Implementation Decisions — SkyB Design v2

This document records architectural, design token, data modeling, and frontend decisions made during the SkyB frontend redesign from Stitch v2.

---

## 1. Design Tokens & DESIGN.md Selection (Decision 1.1)

### Token Comparison Across DESIGN.md Files
In `stitch_skyb_v2`, four `DESIGN.md` spec files were present:
1. `stitch_skyb_v2/skyb_candy_toy_system/DESIGN.md` (System Name: `skyB Candy Toy System`)
2. `stitch_skyb_v2/tactile_candy_play/DESIGN.md` (System Name: `Tactile Candy Play`)
3. `stitch_skyb_v2/tactile_candy_play_1/DESIGN.md` (System Name: `Tactile Candy Play`, identical to 2)
4. `stitch_skyb_v2/tactile_candy_play_2/DESIGN.md` (System Name: `Tactile Candy Play`, identical to 2)

**Key Differences Identified:**
- **Surface Palette:**
  - `skyb_candy_toy_system`: `surface`: `#f9f9ff`, `surface-dim`: `#cfdaf2`, `surface-container-low`: `#f0f3ff`, `on-surface`: `#111c2d`, `inverse-surface`: `#263143`.
  - `tactile_candy_play`: `surface`: `#f8f9ff`, `surface-dim`: `#ccdbf4`, `surface-container-low`: `#eff4ff`, `on-surface`: `#0d1c2e`, `inverse-surface`: `#233144`.
- **Locked System Decision:**
  Per the explicit project specification, the **locked candy system** is enforced as the single source of truth:
  - **Add to Cart / Checkout Action:** `#fe7488` (white text, chunky extruded shadow `0 5px 0 #730425`, mobile `0 3px 0 #730425`).
  - **Bargain Action:** `#e1a800` (white text, chunky extruded shadow `0 5px 0 #795900`, mobile `0 3px 0 #795900`).
  - **Primary Actions:** `#00668a` (white text, chunky extruded shadow `0 5px 0 #004965`, mobile `0 3px 0 #004965`).
  - **Cards:** White `rounded-xl` with rotating chunky bottom shadows (`#c4e7ff`, `#ffdadc`, `#ffdf9f`).
  - **Background:** `#f8f9ff`.
  - **Typography:** `Quicksand` (headings/display 600/700), `Nunito Sans` (body/labels 400/700/800).
  - **Icons:** Google `Material Symbols Outlined` (rendered via SVG/font ligature with zero text flash fallback).

---

## 2. Category Structure & Slug Mapping (Decision 1.2)

- **Legacy Categories Preserved:**
  The database retains the 5 legacy categories with untouched IDs and product foreign keys:
  - `1`: Clothing
  - `2`: Toys
  - `3`: Footwear
  - `4`: Baby Care
  - `5`: School Accessories
- **Additive Store Categories Added:**
  9 new categories were added via additive idempotent migration:
  - `6`: Boys Fashion
  - `7`: Girls Fashion
  - `8`: Diapering
  - `9`: Gear
  - `10`: Feeding
  - `11`: Bath & Skincare
  - `12`: Nursery
  - `13`: Health & Safety
  - `14`: School Essentials
- **Navigation Category Mapping:**
  Frontend route slugs resolve dynamically to category IDs:
  - `boys-fashion` -> Boys Fashion + Clothing (gender = boys / unisex)
  - `girls-fashion` -> Girls Fashion + Clothing (gender = girls / unisex)
  - `footwear` -> Footwear
  - `toys` -> Toys
  - `diapering` -> Diapering
  - `gear` -> Gear
  - `feeding` -> Feeding
  - `bath-skincare` -> Bath & Skincare + Baby Care
  - `nursery` -> Nursery
  - `health-safety` -> Health & Safety
  - `school-essentials` -> School Essentials + School Accessories
  - `deals` -> Virtual deals view (products with discount >= 15%)
  - `/category/all` -> All catalog categories

---

## 3. Additive Schema Migration & Demo Data (Decision 1.3)

- **New Columns on `products`:**
  - `subcategory` (`VARCHAR(100)`, indexed)
  - `gender` (`VARCHAR(20)`, indexed; values: `boys`, `girls`, `unisex`)
  - `mrp` (`NUMERIC(10, 2)`)
  - `age_min_months` (`INTEGER`)
  - `age_max_months` (`INTEGER`)
  - Composite Index: `idx_products_age_range` on `(age_min_months, age_max_months)`.
- **Demo Data Backfill for Legacy Products (IDs 1–5):**
  - `mrp` set to `round(price * 1.25)` to provide authentic MRP strike-through and discount calculation without fabricating arbitrary discounts.
  - `gender` set to `'unisex'`.
  - `age_min_months` and `age_max_months` parsed from `age_group`:
    - Product 1 (`0-3m`): 0 to 3 months
    - Product 2 (`6-12m`): 6 to 12 months
    - Product 3 (`1-2y`): 12 to 24 months
    - Product 4 (`0-12m`): 0 to 12 months
    - Product 5 (`3-5y`): 36 to 60 months

---

## 4. Product Filtering & Safety Querying (Decision 1.4)

- **Safety Filter Implementation:**
  The `safety` query parameter receives comma-separated tags (e.g. `bpa-free,non-toxic,organic cotton`). It checks against the stored `safety_tags` JSON field using case-insensitive substring matching (`cast(Product.safety_tags, String).ilike('%<flag>%')`), perfectly aligning with the values generated and read by `backend/services/safety_badge_service.py`.
- **Top-Level Metadata (`meta`):**
  `GET /products` returns uniform payload with pagination metadata:
  ```json
  {
    "data": [...],
    "meta": {
      "total": 6,
      "skip": 0,
      "limit": 24
    },
    "error": null
  }
  ```
- **Historical Revenue Chart (`GET /admin/chart-data`):**
  Admin-only endpoint aggregating actual completed orders (`placed`, `confirmed`, `shipped`, `delivered`) into daily revenue and count totals over the requested date range (1 to 30 days, default 14), with zero-filled records for days without qualifying sales.

---

## 5. App Shell & Responsive Navigation (Decision 1.5)

- **Pure SVG Icon System (`Icon.tsx`):**
  Google Material Symbols webfonts can experience font ligature text flashes (FOUT) on slow 3G connections (displaying literal strings like `shopping_cart` or `search` before the webfont loads). Replaced all dynamic icon instances with inline SVG vectors containing locked geometric paths and CSS sizing (`w-5 h-5`, etc.).
- **Global SkyBot Assistant (`SkyBotSheet.tsx` & `SkyBotContext.tsx`):**
  SkyBot is rendered as a global provider:
  - Desktop: Slide-over right panel with backdrop overlay, ESC key listener, and click-outside dismissal.
  - Mobile (390px): Bottom drawer sheet with touch-friendly top handle bar.
  - Server-Enforced Rules: Chat pricing strictly defers to backend bargaining engine (`/bargain/message`); no client-side price deduction or fake coupon code distribution.
- **Unified Navigation Header (`Navbar.tsx`):**
  - Desktop: Category navigation with mega-menu dropdown (150ms debounce hover, full ESC and Tab keyboard trap management).
  - Search: Controlled input form with auto-suggestions submitting to `/category/all?q=...`.
  - Pincode: Client-persisted 6-digit delivery pincode modal default `400001 (Mumbai)`.
  - Real Cart/Wishlist Badges: Dynamically reads `cart.items.length` and `wishlist.length` without hardcoded dummy numbers.
- **Mobile Navigation Drawer & Bottom Bar:**
  - Drawer (`CategoryDrawer.tsx`): Full category & age taxonomy drawer with smooth slide animation.
  - Bottom Navigation (`BottomNav.tsx`): Sticky mobile navigation with 5 key destinations (Home, Categories, SkyBot, Wishlist, Profile). Automatically hidden on sticky full-screen flows (`/product/*`, `/cart`, `/checkout`, `/reorder`, `/newborn-checklist`) and `/admin/*`.
- **Footer Architecture (`Footer.tsx`):**
  Complete link tree covering all store categories, customer care, legal/safety policies, with zero `href="#"` dead links.
- **Playwright QA Verification Suite (`backend/scripts/run_design_qa.js`):**
  7-part automated headless browser test suite running against Next.js production build:
  1. Desktop 1440px rendering & ESC key modal closing.
  2. Mobile 390px rendering and touch drawers.
  3. Header consistency across routes (`/`, `/product/1`, `/cart`, `/login`, `/admin`).
  4. Brand logo click return to `/`.
  5. Guest click redirects (`Add to Cart`, `Wishlist`, `Cart`, `Orders`, `Bargain` -> `/login?next=...`).
  6. Zero horizontal overflow at 390px viewport width (`document.documentElement.scrollWidth === clientWidth`).
  7. Slow 3G network simulation verifying zero raw icon text leakage.

