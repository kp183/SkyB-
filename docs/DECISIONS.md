# SkyB Architecture & Implementation Decisions (v2)

This document records the exact implementation status, impacted files, and design choices for user decisions 1.1 through 1.9 on branch `design-v2`.

Per project rules, Antigravity re-reads `docs/BUILD_SPEC.md` and `docs/DECISIONS.md` at the start of every phase and confirms doing so.

---

### Decision 1.1: Source Screens & Locked Design System
- **What was implemented:**
  - Evaluated the 4 `DESIGN.md` files in `stitch_skyb_v2`. Enforced the **locked candy system** tokens across the entire codebase.
  - Buttons:
    - Add to Cart / Checkout Action: Coral `#fe7488` with white text and chunky extruded shadow `0 5px 0 #730425` (mobile `0 3px 0 #730425`), active pressed state `translate-y-[2px]`.
    - Bargain Action: Golden yellow `#e1a800` with white text and chunky shadow `0 5px 0 #795900` (mobile `0 3px 0 #795900`).
    - Primary Action: Deep teal `#00668a` with white text and chunky shadow `0 5px 0 #004965` (mobile `0 3px 0 #004965`).
  - Cards: White `rounded-xl` with alternating chunky extruded bottom shadows: `#c4e7ff`, `#ffdadc`, `#ffdf9f`.
  - Background: `#f8f9ff`.
  - Typography: Google fonts `Quicksand` (headings/display, weights 600/700) and `Nunito Sans` (body/labels, weights 400/700/800).
- **Files:**
  - `frontend/app/globals.css`
  - `frontend/components/ui/Button.tsx`
  - `frontend/app/layout.tsx`
- **Icon Decision:**
  - Standard Google Material Symbols webfonts cause Flash of Unstyled Text (FOUT) on slow 3G connections, displaying raw text strings like `shopping_cart` or `search`.
  - To prevent this, all icons are implemented as pure inline SVG components in `frontend/components/Icon.tsx` with locked viewBox and stroke/fill attributes.
- **Deviations:** None. Locked tokens strictly override any divergent Stitch mockup code.

---

### Decision 1.2: Categories & Slug Mapping
- **What was implemented:**
  - Preserved 5 legacy DB categories (IDs 1–5): `Clothing` (1), `Toys` (2), `Footwear` (3), `Baby Care` (4), `School Accessories` (5).
  - Added 9 new store categories in DB: `Boys Fashion` (6), `Girls Fashion` (7), `Diapering` (8), `Gear` (9), `Feeding` (10), `Bath & Skincare` (11), `Nursery` (12), `Health & Safety` (13), `School Essentials` (14).
  - Configured navigation slug mapping in `frontend/config/navigation.ts`.

#### Category Slug to DB Category Mapping Table:
| Frontend Slug | DB Category Names | DB Category IDs | Gender / Subcategory Filter |
| :--- | :--- | :--- | :--- |
| `boys-fashion` | Boys Fashion, Clothing | 6, 1 | `gender=boys` (returns boys, unisex, null) |
| `girls-fashion` | Girls Fashion, Clothing | 7, 1 | `gender=girls` (returns girls, unisex, null) |
| `footwear` | Footwear | 3 | All genders |
| `toys` | Toys | 2 | All genders |
| `diapering` | Diapering | 8 | All genders |
| `gear` | Gear | 9 | All genders |
| `feeding` | Feeding | 10 | All genders |
| `bath-skincare` | Bath & Skincare, Baby Care | 11, 4 | All genders |
| `nursery` | Nursery | 12 | All genders |
| `health-safety` | Health & Safety | 13 | All genders |
| `school-essentials` | School Essentials, School Accessories | 14, 5 | All genders |
| `deals` | *Virtual View* | All | Products with discount >= 15% |
| `all` | All Categories | 1–14 | None |

- **Files:**
  - `frontend/config/navigation.ts`
  - `backend/scripts/migrate_additive.py`
  - `backend/models/category.py`
- **Deviations:** None.

---

### Decision 1.3: Additive Schema Changes & Demo Data
- **What was implemented:**
  - Inspected `backend/models/product.py` and added additive nullable columns:
    - `subcategory` (`VARCHAR(100)`, indexed)
    - `gender` (`VARCHAR(20)`, indexed; `boys`, `girls`, `unisex`)
    - `mrp` (`NUMERIC(10, 2)`)
    - `age_min_months` (`INTEGER`)
    - `age_max_months` (`INTEGER`)
    - Composite index: `idx_products_age_range` on `(age_min_months, age_max_months)`
  - Backfilled age ranges on all products by parsing `age_group` (e.g. `0-3m` -> 0 to 3, `1-2y` -> 12 to 24).
  - For the 5 legacy products (IDs 1–5):
    - `mrp` set to `round(price * 1.25)` to provide an authentic strike-through without fabricating discounts.
    - `gender` set to `'unisex'`.
    - Original prices and product IDs were left completely untouched.
- **Files:**
  - `backend/models/product.py`
  - `backend/schemas/product.py`
  - `backend/scripts/migrate_additive.py`
- **Deviations:** None.

---

### Decision 1.4: GET /products & Admin Chart Data
- **What was implemented:**
  - Maintained JSON response envelope: `{ "data": [...], "meta": { "total": int, "skip": int, "limit": int }, "error": null }`.
  - Implemented query parameters on `GET /products`:
    - `skip` (default 0), `limit` (default 24, max 100)
    - `category_ids` (comma-separated IDs)
    - `subcategory` (comma-separated subcategories)
    - `gender`: `boys` returns `boys`, `unisex`, and `null`; `girls` returns `girls`, `unisex`, and `null`.
    - `age_min_months` & `age_max_months`: returns products whose `[age_min_months, age_max_months]` overlaps requested bounds.
    - `min_price` & `max_price`: filters on selling `price`.
    - `min_rating`: filters by average review score; excludes products with 0 reviews.
    - `min_discount`: percentage discount `(mrp - price) / mrp * 100 >= min_discount`; excludes null `mrp`.
    - `in_stock`: boolean (stock > 0).
    - `q`: case-insensitive ILIKE search against `name` and `description`.
    - `sort`: `popular` (units sold from `order_items` desc, then `id` asc), `newest` (`id` desc), `price_asc`, `price_desc`, `discount` (`(mrp - price)/mrp` desc), `rating` (average review rating desc).
  - **Safety Filter Mechanism:**
    - Safety tags are stored as JSON in `products.safety_tags` (e.g. `["BPA-Free", "Non-Toxic", "Organic Cotton"]`).
    - The `safety` query parameter receives comma-separated tags (e.g. `bpa-free,non-toxic`).
    - The backend filters products using `cast(Product.safety_tags, String).ilike(f"%{tag}%")` matching the safety badges extracted by `backend/services/safety_badge_service.py`.
  - Added `GET /categories` returning `[ { "id": int, "name": str }, ... ]`.
  - Added `GET /admin/chart-data?days=14`: admin-only endpoint returning zero-filled daily revenue and order counts for completed orders (`placed`, `confirmed`, `shipped`, `delivered`).
- **Files:**
  - `backend/routers/products.py`
  - `backend/routers/admin.py`
  - `backend/dependencies.py`
  - `backend/tests/test_phase1a.py`
- **Deviations:** In Phase 1A, `min_rating`, `min_discount`, `in_stock`, and `sort=popular` were pending completion; implemented in full in Phase 1D.

---

### Decision 1.5: Deals, New Arrivals, and Combo Packs
- **What was implemented:**
  - "Top Deals" section on Home and `/deals` route lists products with discount >= 15% (`(mrp - price) / mrp * 100 >= 15`), sorted by discount descending.
  - Zero countdown timers or fake "ends in" urgency tickers anywhere in the app.
  - "New Arrivals" corresponds to `sort=newest` (`id` descending).
  - "Combo Packs" filters `subcategory=Combo Packs`.
- **Files:**
  - `frontend/components/Hero.tsx`
  - `frontend/app/deals/page.tsx`
  - `backend/routers/products.py`
- **Deviations:** None.

---

### Decision 1.6: Ratings Display Rules
- **What was implemented:**
  - `RatingStars.tsx` renders star rating and review count only when `review_count > 0`.
  - When `review_count == 0`, stars and text are hidden, but a fixed-height layout slot (`min-h-[20px]`) is preserved to prevent layout shift (CLS).
  - No placeholder text or fabricated "(rating count)" strings.
  - 0 fake reviews generated in the seed catalog.
- **Files:**
  - `frontend/components/ui/RatingStars.tsx`
  - `frontend/components/ProductCard.tsx`
- **Deviations:** None.

---

### Decision 1.7: Bargain Integration & Separation from Coupons
- **What was implemented:**
  - Bargain prices are governed strictly server-side by `bargain_sessions` and `bargain_offers`.
  - Bargain Bot does not generate or display coupon codes.
  - Cart shows original price, bargained price, and a "Bargained" chip with savings amount.
  - Checkout rule: Bargained items (`is_bargained=true`) are exempt from coupon discounts to preserve the minimum price floor (`min_price`).
- **Files:**
  - `frontend/components/SkyBotSheet.tsx`
  - `frontend/context/SkyBotContext.tsx`
  - `frontend/components/BargainChatModal.tsx`
  - `backend/routers/bargain.py`
  - `backend/routers/orders.py`
- **Deviations:** None.

---

### Decision 1.8: Guest Access & Login Redirects
- **What was implemented:**
  - Unauthenticated guests can freely browse the catalog, view categories, and search.
  - Protected actions (Cart, Wishlist, Orders, Re-order, Child Profile, Bargaining, Add to Cart) redirect unauthenticated users to `/login?next=<current_path>`.
  - Upon successful login, the user is redirected back to the exact page they came from (`next` parameter).
  - Recently Viewed works client-side via `localStorage`.
- **Files:**
  - `frontend/components/Navbar.tsx`
  - `frontend/components/BottomNav.tsx`
  - `frontend/components/ProductCard.tsx`
  - `frontend/app/login/page.tsx`
- **Deviations:** In Phase 1C, mobile bottom nav had SkyBot instead of Cart, and guest click on BottomNav was incomplete; corrected in Phase 1D.

---

### Decision 1.9: Pincode Delivery Rules
- **What was implemented:**
  - Pincode starts completely empty (no "400001" or "Mumbai" default anywhere in code).
  - Empty state displays "Enter pincode".
  - Accepts and validates 6 numeric digits via client-side modal stored in `localStorage`.
  - Once set, the header shows "Deliver to: <pincode>" and the modal displays the constant text: "Standard delivery in 3-5 business days". No fake computed delivery dates.
- **Files:**
  - `frontend/components/Navbar.tsx`
- **Deviations:** Phase 1C had a hardcoded Mumbai 400001 initial value; eradicated in Phase 1D.
