# SkyB Build Specification & Historical Prompts

This document contains the complete, verbatim user specifications for the SkyB frontend redesign (Stitch v2) on branch \design-v2\.
Per project instructions, Antigravity MUST re-read this document (\docs/BUILD_SPEC.md\) and \docs/DECISIONS.md\ at the start of every phase and confirm doing so.

---

## 1. Prompt 1: Initial Rebuild Specification (Phases 1-4, Rules, Verification)

TASK: Rebuild the SkyB frontend from the new Stitch design in the folder `stitch_skyb_v2` (design v2). First create and switch to a git branch `design-v2`. Commit after each phase.

SOURCE OF TRUTH
- DESIGN.md = palette, button rules, shadows, fonts. Use it exactly. Locked tokens: Add/Checkout #fe7488 (white text, shadow #730425), Bargain #e1a800 (white text, shadow #795900), primary actions #00668a (white text, shadow #004965), cards white rounded-xl with rotating chunky bottom shadows (#c4e7ff, #ffdadc, #ffdf9f), background #f8f9ff, Quicksand headings, Nunito Sans body, Material Symbols icons.
- For every screen, open its code.html and screen.png and match layout, spacing and copy. Desktop and mobile (390px) versions both exist; build ONE responsive component per screen that matches both.

STEP 0: STUDY AND REPORT (no code yet)
1. List every screen found in the folder and map it to the route below. Report anything missing, and any screen whose data the backend does not support yet.
2. Report how many products exist per category in the current database. Do NOT generate or invent catalog data in this task.
3. List any backend change you believe is needed (new endpoint, field or table), with a one-line reason. Wait for my "go" only if a change touches existing tables or endpoints. Additive read-only endpoints and seed data for categories are fine to proceed.

ROUTES (Next.js App Router, one page per tab; no single long page)
/ Home | /category/[slug] | /age/[group] | /deals | /product/[id] | /skybot | /wishlist | /cart | /checkout | /orders/[id]/confirmation | /orders | /orders/[id] | /reorder | /recently-viewed | /newborn-checklist | /account/child | /login | /register | /admin | /admin/products | /admin/orders | /admin/coupons | /privacy | /terms | not-found
Overlays (no route): Category Drawer (mobile), Filter Sheet (mobile), SkyBot Slide-over (desktop) / SkyBot Bottom Sheet (mobile).

PHASE 1: APP SHELL (commit when done)
- Global Header exactly as designed: skyB logo links to "/" from every page; "Deliver to" pincode block (stores pincode in localStorage, validates 6 digits); search bar with All Categories dropdown (calls existing product search, results page = category listing with ?q=); Bargain Bot button; Wishlist with real count; Orders; Cart pill with real count and total; Account menu (login/register when logged out, name, child profile, orders, logout when logged in).
- Category tab row with desktop mega-menu on hover/focus (Shop by Category, Shop by Age, Shop by Price, Collections, promo tile; NO brand lists) and keyboard support. Active tab = #00668a pill.
- Mobile: compact header (hamburger or back arrow, centered logo, search icon, Bargain Bot icon, cart icon with count), scrolling category chips, full-height Category Drawer with accordions, fixed 5-tab bottom navigation (Home, Categories, Wishlist, Cart, Account).
- Footer as designed. Remove the old StageBar and the old full-width BargainArcade section completely.
- Navigation data (categories, subcategories, age groups, price bands, collections) lives in ONE config/data file used by the header, drawer, footer and home. Categories: Boys Fashion, Girls Fashion, Footwear, Toys, Diapering, Gear, Feeding, Bath & Skincare, Nursery, Health & Safety, School Essentials, Deals. Age groups: New Born, 0-3 M, 3-6 M, 6-9 M, 9-12 M, 12-18 M, 18-24 M, 2-4 Y, 4-6 Y, 6-8 Y, 8+ Y. Price bands: Under ₹199, 299, 399, 499, 999.
- Global SkyBot provider: one context that opens the SkyBot panel from the header button, product cards and product page (preloaded with the product). Desktop = right slide-over; mobile = bottom sheet with drag handle. Uses the existing /bargain endpoints. The min_price floor stays server-side; the UI only shows offers returned by the backend, with no client-side price logic. Remove all fake coupon codes and scripted replies.

PHASE 2: CORE COMMERCE
- Home: hub layout (hero carousel, Shop by Age, category mosaic cards, product rows: Bestsellers, New Arrivals, Deals of the Day, Under ₹499, Safety-First picks, SkyBot promo tile, New Born Checklist banner). Personalised rows (Recently Viewed, Buy Again, Grows With [child name]) show ONLY for logged-in users with data; guests see generic rows.
- Category Listing (/category/[slug]): breadcrumb, filters (subcategory, age, price slider, rating, discount, safety badges, availability), sort, grid, pagination on desktop, "Load more" on mobile, filter bottom sheet on mobile. Filters and sort sync with URL query params. Add pagination, sorting and filter params to GET /products if missing (additive only).
- Age Landing (/age/[group]), Deals (/deals with tabs Deals, New Arrivals, Combo Packs), Product Detail (gallery, price block, size/age selector, safety summary card from the product's safety fields, pincode check, tabs/accordions, Smart Substitutes, Grows With Them, Recently Viewed, sticky mobile action bar with heart + Bargain + Add to Cart).
- SkyBot Hub (/skybot): how-it-works, working sandbox that calls the real endpoint with a sample product, FAQ.
- Wishlist (heart toggle, price-drop notify toggle with target price using existing wishlist notified fields), Cart (bargain chip, coupon box, price summary, sticky mobile bar), Checkout (3-step stepper, mock payment with the "Simulate failure (demo)" option), Order Confirmation.
- Recently Viewed: track viewed product ids per browser in localStorage (max 20), sync to account if an endpoint exists.

PHASE 3: ACCOUNT AND RETENTION
- My Orders and Track Order: statuses shown as Placed, Confirmed, Shipped, Delivered, Cancelled, Payment Failed. Backend also has pending_payment: show it as "Payment Pending" using the same chip style. Timeline has 4 steps (Placed, Confirmed, Shipped, Delivered). No courier or live-tracking UI.
- Quick Re-Order: use the existing Recurring Essentials Predictor service for "Running low" tags and Reorder / Reorder all.
- Child Profile: use the existing child/size-progression endpoints. Any sizing or growth figure shows "approximate, based on standard growth charts".
- New Born Checklist: static checklist data in a config file (items link to real products by category where possible); progress and "Add all to cart" use the real cart API.
- Login / Register: existing JWT flow, inline validation, error state, and the rate-limit message shown when the API returns 429.

PHASE 4: ADMIN AND STATIC
- Admin layout with sidebar (Dashboard, Products, Orders, Coupons), RBAC guard unchanged. Dashboard cards and chart use real aggregate data (add read-only aggregate endpoints if missing). Products: table plus add/edit form including min_price and max_price (labeled "used by the Bargain Bot, hidden from customers") and safety fields. Orders: status dropdown using the existing status enum. Coupons: list and create form; show usage count only if the backend tracks it.
- Privacy, Terms, not-found pages as designed.

RULES (apply to every phase)
- Replace ALL placeholder content from the designs with real API data or remove it: admin figures, "Ananya/Aarav", "Mumbai 400001", cart counts, checklist progress, coupon usage, "(rating count)", sale countdowns (use real deal end times from data or hide the timer). Never invent customer totals, review counts, certifications or "verified/lab" wording.
- Prices in ₹ with Indian number formatting (₹2,48,920).
- Do not modify existing backend logic, business rules (min_price floor, coupon rules, idempotent mock-pay, RBAC, rate limiting), models or existing endpoints. New code may add read-only endpoints, query params and category/age seed data only; list each one in your report.
- Images: local files in /public or product image URLs from the database, never hotlinked design-tool URLs. Use a category fallback image when a product has none.
- Mobile: touch targets 44px+, no horizontal page scroll, safe-area padding, sticky bars never overlap content.
- Accessibility basics: alt text, labelled buttons/inputs, visible focus, keyboard-operable menus and sheets.
- Empty states and loading skeletons for every list page. Guest prompts ("Log in to see your orders") on account pages.

VERIFY (after each phase)
- `npm run build` with 0 TypeScript and lint errors.
- Open each new page in a browser at 1440px and 390px and compare with the screen.png files. List any differences you could not match.
- Click-test: logo returns Home from every page; every header, mega-menu, drawer, footer and bottom-nav link leads to a working page; bargain flow never goes below min_price; cart to checkout to failed payment to retry to success to order history; admin login and status update.
- FINAL REPORT: routes built, components created, backend additions (list), placeholders replaced, and anything left unverified or empty because of missing data.

---

## 2. Prompt 2: Phase 1 Approval & Decisions 1.1-1.9

GO for Phase 1. Your Step 0 report is approved with the decisions below. Follow them exactly. Where this message conflicts with my earlier prompt, this message wins. Everything else in the earlier prompt (Phases 2-4, RULES, VERIFY) stays in force.

PROCESS RULES (apply to everything)
- Work in this order: 1A backend foundation, 1B catalog seed, 1C app shell. Commit after each (messages: "phase-1a ...", etc.), then STOP and send the report. Do not start Phase 2 until I reply.
- Every claim in your report needs evidence: command output, a screenshot, or a request/response. If something was not verified, write "NOT VERIFIED". If a design cannot be matched exactly, say so and why. Do not summarize from memory.
- Do not guess. If a decision below does not cover a case, choose the simplest option consistent with this message, and log it in docs/DECISIONS.md (what, why). Ask me only if work is blocked.
- Do not touch the git remote, do not deploy, do not add libraries without listing them.
- Back up skyb.db (copy to skyb.db.bak-<date>) before any migration.

SECTION 1: DECISIONS

1.1 Source screens. Several routes have 2 Stitch folders. Pick the folder whose screen.png shows the locked look (coral #fe7488 Add buttons with white text, golden #e1a800 Bargain buttons with white text, cards with colored bottom shadows). Treat the other as superseded. Of the 4 DESIGN.md files, use the one for the locked candy system, and list any token that differs between them. Locked tokens in my earlier prompt override any screen that deviates.

1.2 Categories. The DB has 5 legacy categories: Clothing, Toys, Footwear, Baby Care, School Accessories. Do not rename, delete or re-ID them or their 5 products. Add new categories: Boys Fashion, Girls Fashion, Diapering, Gear, Feeding, Bath & Skincare, Nursery, Health & Safety, School Essentials. The frontend navigation config maps each tab slug to DB category names:
boys-fashion = Boys Fashion + Clothing (legacy, shown when gender is boys, unisex or null)
girls-fashion = Girls Fashion + Clothing (legacy, shown when gender is girls, unisex or null)
footwear = Footwear | toys = Toys | diapering = Diapering | gear = Gear | feeding = Feeding
bath-skincare = Bath & Skincare + Baby Care (legacy) | nursery = Nursery | health-safety = Health & Safety
school-essentials = School Essentials + School Accessories (legacy)
deals = virtual page, no category.
Also make /category/all valid (all products; used for search results and global price/collection links).
The frontend resolves slug -> category names -> ids via GET /categories and passes category_ids to the API.

1.3 Additive schema changes (nullable, no changes to existing columns, constraints or endpoint behavior). First inspect models/product.py and add ONLY the columns that do not already exist on products: subcategory (string), gender (boys|girls|unisex), mrp (numeric, must be greater than price when set), age_min_months (int), age_max_months (int). Add an index on (age_min_months, age_max_months). Write one idempotent script backend/scripts/migrate_additive.py that checks for each column before adding it and works on both SQLite and PostgreSQL. Update models and Pydantic schemas (new fields optional). Backfill age_min_months/age_max_months for all existing rows by parsing age_group (formats like "0-3m", "6-12m", "1-2y", "3-5y"; y = x12 months). For the 5 legacy products set mrp = round(price x 1.25) and gender = unisex, and record this in DECISIONS.md as demo data.

1.4 GET /products. Keep the response shape: "data" stays the array. Add top-level "meta": {total, skip, limit}. Query params: skip (default 0), limit (default 24, max 100), category_ids (csv), gender (boys|girls; also returns unisex and null), subcategory (csv), age_min_months and age_max_months (return products whose range overlaps), min_price, max_price (on selling price), min_rating (average of reviews; excludes products with no reviews when set), min_discount (percent, uses mrp and price; excludes products with null mrp), safety (csv of flags; filter using the same stored data the Safety Badge reads; document how in DECISIONS.md), in_stock (bool), q (case-insensitive match on name or description), sort = popular | price_asc | price_desc | newest | discount. popular = units sold (order_items count) descending, then id ascending. newest = id descending. Add GET /categories (id, name) if missing. Add GET /admin/chart-data (admin only, existing RBAC dependency): query days (default 14, max 30); returns one row per day with date, revenue and order count, zero-filled, counting only orders with status placed, confirmed, shipped or delivered (exclude cancelled, payment_failed, pending_payment). Add pytest tests for pagination, each filter, sort, meta.total and chart-data; run the existing tests too.

1.5 Deals. Deals = products with discount >= 15% (from mrp and price), sorted by discount descending. No countdown timers or "ends in" text anywhere. Rename the Home section "Deals of the Day" to "Top Deals". New Arrivals = sort=newest. Combo Packs = products whose subcategory is "Combo Packs".

1.6 Ratings. Show stars and count only when a product has real reviews. Never show the text "(rating count)" or any placeholder. Cards keep equal height with a fixed-height slot for the rating row. Do not generate any reviews for the catalog.

1.7 Bargain. The backend prices bargains through bargain_offers and the cart, not coupon codes. Do not show coupon codes for bargains. The panel shows "Bargain price ₹X (you save ₹Y)" returned by the API. "Apply to Cart" calls the existing endpoint. The Cart "bargain discount" chip shows original price minus bargained price per item, from the API.

1.8 Guests. Guests can browse. Cart, wishlist, orders, re-order, child profile, bargain and Add to Cart require login: redirect to /login?next=<current path> and return there after login. Recently Viewed works for guests via localStorage.

1.9 Pincode. Client-side only: validate 6 digits, store in localStorage, and show the constant "Standard delivery in 3-5 business days". No computed dates.

SECTION 2: PHASE 1A (backend foundation)
Implement 1.3 and 1.4, add the categories, update seed.py to be idempotent (upsert categories by name), run migrate_additive.py. Evidence: migration output, table schema before and after, pytest output, and curl responses for: no params; category_ids; gender=girls; age overlap; q search; sort=discount; meta.total correct.

SECTION 3: PHASE 1B (catalog seed)
Create backend/scripts/generate_catalog.py: deterministic (random seed 42), template-based, NO AI or API calls. Output backend/data/catalog.json; seed.py loads it idempotently (upsert by name + category; running seed twice must not duplicate). The 5 original products stay untouched.
Targets: at least 30 products in each of the 11 categories (400+ total). Every age band slug (new-born, 0-3-months, 3-6-months, 6-9-months, 9-12-months, 12-18-months, 18-24-months, 2-4-years, 4-6-years, 6-8-years, 8-plus-years) must have at least 12 products. Each subcategory below has at least 4 products:
Boys Fashion: Sets & Suits, T-Shirts, Shirts, Jeans & Trousers, Shorts, Nightwear, Ethnic Wear, Sweatshirts & Jackets, Combo Packs
Girls Fashion: Dresses & Frocks, Tops & Tees, Leggings & Pants, Skirts & Shorts, Nightwear, Ethnic Wear, Sweaters & Jackets, Hair Accessories, Combo Packs
Footwear: Sandals, Sneakers, Casual Shoes, School Shoes, Booties, Sliders & Flip-Flops, Rain Boots
Toys: Soft Toys, Learning & Educational, Blocks & Construction, Stacking & Sorting, Musical Toys, Puzzles, Role Play, Ride-Ons
Diapering: Diaper Pants, Taped Diapers, Baby Wipes, Rash Creams, Changing Mats, Diaper Bags, Combo Packs
Gear: Strollers & Prams, Car Seats, Baby Carriers, High Chairs, Walkers, Bouncers & Swings
Feeding: Feeding Bottles, Sippers & Cups, Bibs & Burp Cloths, Teethers & Pacifiers, Bowls & Cutlery, Sterilizers & Warmers, Combo Packs
Bath & Skincare: Baby Lotions, Soaps & Body Wash, Shampoos, Oils & Powders, Bath Tubs & Accessories, Towels & Robes, Bath Toys, Combo Packs
Nursery: Cots & Cribs, Mattresses & Pillows, Blankets & Swaddles, Bedding Sets, Mosquito Nets, Room Decor
Health & Safety: Safety Gates & Guards, Thermometers, Grooming Kits, Oral Care, Healthcare Accessories, Mosquito Care, Cleansers & Detergents
School Essentials: Backpacks, Lunch Boxes & Bottles, Stationery, Geometry & Art Kits, Raincoats & Umbrellas
Rules for generated data:
- Generic names only, e.g. "Soft Organic Cotton Romper". No brand names, no licensed characters, no certification or "verified/tested" wording.
- Realistic ₹ price ranges per subcategory. mrp = price x (1.10 to 1.60) rounded to whole rupees. About 35% of products must have a discount of 15% or more. min_price = 80-90% of price rounded; max_price = mrp.
- Stock: about 5% at 0, about 8% at 5 or fewer, the rest 10-120. age_group strings in the existing format, with plausible ranges per subcategory. Fill age_min_months, age_max_months, gender, subcategory.
- Descriptions must state material, age range and any small-parts warning so the existing Safety Badge generator produces accurate results. Read services/safety_service.py first and make sure the data matches how it reads. Toys with small parts for under 36 months must produce a choking hazard warning. Never claim BPA-free or non-toxic unless the material justifies it.
- Images: create frontend/public/catalog/<subcategory-slug>.svg, simple on-brand pastel tiles (locked palette) with a clear icon for each subcategory; set image_url to that path. If env PEXELS_API_KEY is set, an optional resumable script backend/scripts/fetch_images.py replaces image_url with Pexels photo URLs by subcategory search (respect rate limits, store URLs only); add images.pexels.com to next.config remotePatterns and show "Photos: Pexels" in the footer only when used. The image component falls back to the subcategory SVG on error.
Evidence: counts per category, per subcategory and per age band (SQL output); seed run twice with identical counts; the 5 original products unchanged (ids 1-5, same values); 5 sample products with their stored safety fields.

SECTION 4: PHASE 1C (app shell)
Build the Phase 1 App Shell from my earlier prompt, plus these exact requirements:
- Tokens from DESIGN.md go into globals.css (@theme). Create shared button classes/components (add, bargain, primary) with the locked shadows (5px desktop, 3px mobile) and the pressed state. No page may hand-write button shadows.
- Shared components: Button, ProductCard, Badge, Chip, SectionHeader, EmptyState, Skeleton, PriceBlock (₹ with en-IN formatting, MRP strike-through, Save % only when mrp exists), RatingStars (hidden without reviews), SafetyBadges (neutral wording only).
- Fonts via next/font (Quicksand 600/700, Nunito Sans 400/700/800). Material Symbols must never show as raw text (such as "shopping_cart") at any moment. Prove it with network throttled to Slow 3G.
- The header is ONE component used on every page, same on desktop and the same on mobile as in the designs. The logo links to "/" everywhere. Search submits to /category/all?q=<text>.
- Mega-menu: opens on hover (150 ms intent delay) and on keyboard focus, closes on Esc, outside click and route change. Links: Shop by Age -> /age/<slug>; Shop by Price -> /category/<current-slug>?max_price=<n> (or /category/all when opened from All Categories); Collections: New Arrivals -> /deals?tab=new, Bestsellers -> /category/all?sort=popular, Combo Packs -> /deals?tab=combos. No brand lists.
- Navigation data is one config file (categories with subcategories and DB name mapping, age groups with min/max months, price bands, collections). Age slugs: new-born, 0-3-months, 3-6-months, 6-9-months, 9-12-months, 12-18-months, 18-24-months, 2-4-years, 4-6-years, 6-8-years, 8-plus-years.
- Mobile bottom nav (Home, Categories, Wishlist, Cart, Account) is hidden on pages that have a sticky action bar in the design (product detail, cart, checkout, reorder, newborn-checklist) and on admin pages. Add bottom padding so sticky bars never cover content.
- Counts for cart and wishlist come from the existing APIs when logged in and update immediately after add/remove. Guests see no counts.
- Footer: every link must go to a real route. No href="#" anywhere in the project (grep and report zero). Footer sections: Shop (categories), Help (Track Order -> /orders, Returns and Delivery -> /terms), Account (Orders, Wishlist, Quick Re-Order, Child Profile), About (Privacy, Terms).
- Remove the old StageBar and BargainArcade completely.
- SkyBot provider: one context, opened from the header button, product cards and the product page, preloaded with the product. Desktop = right slide-over; mobile = bottom sheet with drag handle, input above the keyboard. Uses the existing bargain endpoints; the UI shows only backend values. No fake coupon codes or scripted replies.
- Routes not yet rebuilt render inside the new shell with a clearly marked temporary EmptyState ("// TODO-PHASE-N" comment). All of these must be gone by the final phase. Existing pages and flows (login, cart, checkout, orders, admin) must keep working with the new header and footer around them.

PHASE 1 ACCEPTANCE (report as a PASS/FAIL table with evidence)
1. npm run build: 0 TypeScript and lint errors. pytest and /health pass. Seed run twice.
2. Screenshots at 1440px and 390px, saved in docs/design-qa/phase-1/, each beside the matching Stitch screen.png: header, mega-menu open for 3 different tabs, mobile drawer open, bottom nav, footer, SkyBot slide-over and bottom sheet with a real product.
3. Headers identical: screenshots of the header on /, /product/1, /cart, /login, /admin.
4. Logo returns to "/" from /cart, /product/1, /login, /admin.
5. Every header tab, mega-menu link, drawer link, footer link and bottom-nav link: list each URL tested and its result (no 404, and the page shows the shell).
6. Keyboard: Tab reaches every menu item, Esc closes the mega-menu and SkyBot panel.
7. Guest redirect: Add to Cart, heart, Cart and Orders redirect to /login?next=... and return after login.
8. No horizontal scroll at 390px on the pages tested.
9. Bargain: show request and response for 3 offers, one of them below min_price. The backend must refuse or counter at or above min_price, and the UI must show only backend values.
10. Icons never appear as raw text on Slow 3G (screenshot).
11. docs/DECISIONS.md, and a list of every backend addition (files and endpoints).

Then STOP and wait for my reply.

---

## 3. Prompt 3: Phase 1D Audit Findings & Execution Instructions

Phase 1 is mostly solid. The report shows a lot of evidence: a passing build, tests, an idempotent seed, a bargain floor check, and a QA suite. But I found 6 places where it deviates from what I specified, and several things I asked it to prove that it didn't. I have not seen the screenshots, only Antigravity's own report, so treat every "PASS" as its claim.

What deviates from the spec
#	Finding	Why it matters
1	Mobile bottom nav is Home, Categories, SkyBot, Wishlist, Profile. The design and my spec say Home, Categories, Wishlist, Cart, Account.	Cart is missing and the Bargain Bot is in the wrong place
2	Pincode defaults to 400001 (Mumbai).	Leftover design placeholder. It should start empty.
3	GET /products is missing min_rating, min_discount, in_stock and sort=popular. It added sort=rating instead. The tests also don't cover subcategory, safety or price filters.	"Bestsellers" links to sort=popular and the filter sidebar needs the rest
4	Discounts are skewed. 35.9% of products have 30% or more off.	With my 1.10-1.60 rule, about 85% of products have 15% or more off, so "Deals" would be almost everything. That's partly my spec's fault, because its two rules contradicted each other.
5	Seeding runs through seed_catalog.py, not seed.py.	A deployed setup running seed.py would get 5 products
6	DECISIONS.md covers different items than my 1.1 to 1.9.	Category mapping, guest redirects and pincode rules may not be recorded
What it didn't prove
The side-by-side comparison with the Stitch screenshots and the list of differences
The URL list for every header, mega-menu, drawer, footer and bottom-nav link
Tab-key navigation (only Esc was tested)
Returning to the original page after login
Cart and wishlist counts updating immediately
The bargain flow in the real browser (only a backend script was run)

One more thing to confirm. In the bargain test the counter went from ₹546.85 to ₹569 after you lowered your offer to ₹350. That may be existing behavior, where lowballing raises the counter, but we need to confirm the bargain service wasn't changed.

The pause around 2:21 AM was a context compaction. That can make Antigravity forget rules in later phases, so the prompt below also makes it write the full spec to a file.

Prompt for Antigravity (Phase 1D)
Phase 1 is NOT approved yet. Do Phase 1D below on branch design-v2. Commit as "phase-1d ...". Do NOT start Phase 2. Every claim needs evidence (command output, screenshot, request/response). Unverified = "NOT VERIFIED". Anything you cannot match = say so.

0. COMPACTION SAFEGUARD (do first)
Create docs/BUILD_SPEC.md containing, verbatim and complete: (a) my first prompt (SOURCE OF TRUTH, routes, Phases 1-4, RULES, VERIFY), (b) my second prompt (decisions 1.1-1.9, Phase 1A/1B/1C requirements, acceptance list), (c) this Phase 1D message. Rewrite docs/DECISIONS.md so it has one entry per decision 1.1-1.9 using my numbering, each with: what was implemented, which files, any deviation. Include the category slug->DB category mapping table, the safety filter mechanism, and the icon decision. At the start of every future phase, re-read docs/BUILD_SPEC.md and docs/DECISIONS.md and state that you did.

1. MOBILE BOTTOM NAV
Exactly 5 items: Home, Categories (opens the Category Drawer), Wishlist (count badge), Cart (count badge), Account. Remove SkyBot from the bottom nav (SkyBot stays in the header and on product cards/pages). Keep the existing hide rules (product detail, cart, checkout, reorder, newborn-checklist, admin). Guests tapping Wishlist/Cart/Account go to /login?next=...

2. PINCODE
No default. Empty state shows "Enter pincode". After the user saves a valid 6-digit pincode, the header shows "Deliver to: <pincode>" and the pincode modal shows "Standard delivery in 3-5 business days". Remove every "Mumbai" or 400001 default. grep the repo and report zero matches.

3. GET /products COMPLETION (additive only)
Add: min_rating (average review rating; excludes products with no reviews), min_discount (percent from mrp and price; excludes null mrp), in_stock (bool), sort=popular (units sold from order_items, descending, then id ascending). Keep sort=rating as an extra. subcategory accepts a comma list. gender=boys also returns unisex and null; gender=girls the same. Document how `safety` maps to stored data in DECISIONS.md.
Tests: for EVERY filter and sort, assert correctness, not just 200. Examples: all returned items satisfy the filter; meta.total equals an independent SQL count; popular order matches an independent query; filters combine correctly (e.g. category_ids + max_price + age overlap + sort=price_asc). Cover boundaries (price exactly equal to max_price, age ranges that touch). Run the full test suite and report the counts.

4. DISCOUNT DISTRIBUTION (fix generator and data)
Rewrite the mrp logic in generate_catalog.py, still deterministic (seed 42):
- ~40% of products: mrp = price (no discount shown)
- ~25%: discount 5-14%
- ~35%: discount 15-35%
mrp stays a whole rupee amount. min_price stays 80-90% of price. Make the seed UPDATE mrp for existing rows (upsert by name + category, not insert-only), keep ids stable, leave products 1-5 untouched. Report the discount histogram by SQL (counts of 0%, 5-14%, 15-24%, 25-35%) and the number of products Deals will list.

5. ONE SEED COMMAND
`python seed.py` (or the existing entry point used for deployment) must produce the full catalog: categories, 5 originals, 407 generated. Make seed.py call the catalog seeding, idempotent, and document it in the README. Evidence: run on a fresh copy of the DB, show counts, run again, show identical counts.

6. ICONS
Keep the SVG icon system. grep all Material Symbols names used in stitch_skyb_v2/**/code.html and list every distinct name. For each, confirm an SVG exists in Icon.tsx; add the missing ones now so Phase 2 does not hit gaps. Compare 10 icons against the Stitch screen.png at 2x zoom and report any that look noticeably different.

7. MISSING EVIDENCE (produce all of these)
a) Side-by-side screenshots in docs/design-qa/phase-1/compare/: built vs Stitch screen.png for Home desktop, Home mobile, Category Drawer, SkyBot desktop slide-over, SkyBot mobile sheet, header desktop, bottom nav mobile, footer. For each, a written list of every visible difference (colors, spacing, copy, icons, missing elements). Do not write "matches" without listing what you checked.
b) docs/design-qa/phase-1/link-audit.md: a table of EVERY link in the header, category tabs, mega-menu for All Categories + Boys Fashion + Toys + Diapering, mobile drawer, footer and bottom nav: label, href, HTTP status, and whether the destination shows the right content (e.g. /category/toys?max_price=499 returns only products at or under ₹499, the count matches meta.total; /age/6-9-months shows only products whose age range overlaps 6-9 months; /category/all?sort=popular loads).
c) Keyboard: record the Tab order through the header, open mega-menu, and SkyBot panel. The SkyBot panel must trap focus while open and return focus to the trigger on close. Report PASS/FAIL per check.
d) Login return: as a guest, click Add to Cart on /category/toys, log in, and confirm you land back on /category/toys (not Home).
e) Counts: logged in, add and remove items in cart and wishlist; the header and bottom-nav badges update immediately without a page reload. Show before/after screenshots.
f) Bargain end-to-end in the browser (Playwright): open SkyBot from a product card on /category/all, send 3 offers (one below min_price), accept, confirm the cart shows the bargained price and the bargain chip data, and confirm the UI shows only backend values. Screenshots at each step, and the request/response of each call. Verify the floor holds when the same offers are replayed through curl.
g) Bargain service integrity: run `git diff <commit before phase-1a>..HEAD --stat -- backend/services backend/routers backend/models` and paste the output. List every changed file in those folders with a one-line reason. Confirm the bargain/pricing/coupon/cart logic has no changes. Then explain why the counter rose from ₹546.85 to ₹569.00 after the user lowered the offer to ₹350 (cite the exact code path and whether this behavior existed before my work).
h) Run the full verify_routes script again and attach the URL list it tested.

8. FINAL REPORT FORMAT
PASS/FAIL table for items 1-7 with evidence links, a list of files changed, and a section "Known gaps / NOT VERIFIED". Then STOP.
Before you send it (3 minutes)

Open docs/design-qa/phase-1/ and look at the screenshots yourself. Then send me these four and I'll check them against the Stitch designs:

header_desktop_1440px.png
megamenu_toys_1440px.png
mobile_drawer_390px.png and bottom_nav_390px.png
skybot_mobile_bottom_sheet_390px.png
After the Phase 1D report

Send me the report. If it passes, reply to Antigravity with:

Phase 1D approved. Begin Phase 2 per docs/BUILD_SPEC.md. Re-read docs/BUILD_SPEC.md and docs/DECISIONS.md first and confirm you did. Same evidence rules. Stop after Phase 2 and report.
