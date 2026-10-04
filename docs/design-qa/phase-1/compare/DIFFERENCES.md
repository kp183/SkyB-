# Phase 1D Visual Difference Audit — Built Application vs. Stitch Specification

This document provides a written analysis of visible differences (colors, spacing, copy, icons, and layout) between the built SkyB application and the Stitch design-v2 reference mockups across all 8 required screens.

Visual comparison artifacts are stored in [`docs/design-qa/phase-1/compare/`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/).

---

## 1. Home Desktop (`home_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_restyled_locked_candy/screen.png`
- **Built Screen:** `docs/design-qa/phase-1/home_full_desktop_1440px.png` (1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/home_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/home_desktop_compare.png)

### Visible Differences & Audit Checks:
1. **Pincode Delivery Selector:**
   - *Stitch reference:* Showed mock "Deliver to: Mumbai 400001".
   - *Built:* Starts empty displaying "Enter pincode" placeholder per user requirement 2. Grep scan confirms 0 occurrences of 400001 or Mumbai. Once 6 digits are saved, updates dynamically to "Deliver to: [PIN]".
2. **Product Data:**
   - *Stitch reference:* Rendered static placeholder toys (e.g. "Wooden Montessori Cubes").
   - *Built:* Dynamically loaded from SQLite database containing 412 seeded items (5 original + 407 generated across 14 categories).
3. **Discount Distribution:**
   - *Stitch reference:* Showed arbitrary mock discount badges.
   - *Built:* Strictly follows the 4-tier distribution: 35.9% zero discount (MRP=Price), 23.3% 5-14% discount, 22.3% 15-24% discount, 18.4% 25-35% discount.
4. **Header Height & Spacing:**
   - *Stitch reference:* 68px top bar height.
   - *Built:* 64px top bar height with 44px sub-header category navigation bar. Spacing and alignment match within 4px grid.
5. **Action Buttons:**
   - *Stitch reference:* Tactile buttons with hard drop shadows.
   - *Built:* Verified exact color tokens: Bargain golden `#e1a800` (shadow `#795900`), Add to Cart coral `#fe7488` (shadow `#730425`), Cards with rotating chunky bottom shadows (`#c4e7ff`, `#ffdadc`, `#ffdf9f`).

---

## 2. Home Mobile (`home_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_hub_skyb_india_mobile/screen.png`
- **Built Screen:** `docs/design-qa/phase-1/home_mobile_390px.png` (390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/home_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/home_mobile_compare.png)

### Visible Differences & Audit Checks:
1. **Bottom Navigation Items:**
   - *Stitch reference:* Showed Home, Categories, SkyBot, Wishlist, Profile.
   - *Built:* Fixed in Phase 1D to exactly 5 items: **Home, Categories, Wishlist (badge), Cart (badge), Account**. SkyBot removed from bottom nav and retained in header and product cards per user requirement 1.
2. **Top Header & Stage Bar:**
   - *Stitch reference:* Dense top mobile header with search icon.
   - *Built:* Hamburger drawer trigger, centered skyB cloud logo, search input, and Deliver to pincode chip. Scrollable age stage bar below header.
3. **Product Card Grid:**
   - *Stitch reference:* 2-column grid layout with 12px gutter.
   - *Built:* 2-column mobile grid matching 12px gutter, with responsive `PriceBlock` and touch-friendly action buttons.

---

## 3. Category Navigation Drawer (`category_drawer_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/category_drawer_category/screen.png`
- **Built Screen:** `docs/design-qa/phase-1/mobile_drawer_390px.png` (390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/category_drawer_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/category_drawer_compare.png)

### Visible Differences & Audit Checks:
1. **Drawer Dimensions:**
   - *Stitch reference:* Full slide-over drawer with 85% width.
   - *Built:* 86% width (`w-[86%] max-w-[360px]`) leaving a 30px dimmed backdrop strip for thumb click dismissal on 390px viewport.
2. **Category Hierarchy & Icons:**
   - *Stitch reference:* Rendered standard icon set.
   - *Built:* 11 accordion categories with pure SVG icons from `ICON_REGISTRY` (boy, girl, steps, smart_toy, baby_changing_station, child_care, restaurant, soap, crib, medical_services, backpack).
3. **Utility Section:**
   - *Stitch reference:* Static links.
   - *Built:* Fully functional navigation to Quick Re-order (`/reorder`), Newborn Checklist (`/newborn-checklist`), Child Profile (`/account/child`), and Order History (`/orders`).

---

## 4. SkyBot Desktop Slide-Over (`skybot_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/skybot_hub_skybot/screen.png`
- **Built Screen:** `docs/design-qa/phase-1/skybot_desktop_slideover_1440px.png` (1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/skybot_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/skybot_desktop_compare.png)

### Visible Differences & Audit Checks:
1. **Right Dock Panel Geometry:**
   - *Stitch reference:* 420px right dock with dark backdrop.
   - *Built:* Matches 420px width (`w-[420px]`), full viewport height, with backdrop blur.
2. **Dynamic Negotiation State:**
   - *Stitch reference:* Mock static negotiation bubbles.
   - *Built:* Live interactive negotiation connected to `POST /bargain/offer`. Counter offers computed by `process_offer` service. When an offer drops below `min_price`, the counter rises following the margin fallback formula.
3. **Accessibility & Focus:**
   - *Stitch reference:* Static design.
   - *Built:* Tab keyboard focus is trapped within the slide-over dialog while open and focus is returned to trigger button (`#header-bargain-bot-btn` or card button) on close. Escape key dismisses panel.

---

## 5. SkyBot Mobile Bottom Sheet (`skybot_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/skybot_sheet_skybot_sheet/screen.png`
- **Built Screen:** `docs/design-qa/phase-1/skybot_mobile_bottom_sheet_390px.png` (390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/skybot_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/skybot_mobile_compare.png)

### Visible Differences & Audit Checks:
1. **Sheet Style & Drag Handle:**
   - *Stitch reference:* Rounded top corners with centered drag handle pill.
   - *Built:* Features rounded top corners (`rounded-t-3xl`), drag handle bar (`w-12 h-1.5 rounded-full bg-outline-variant/60`), and 90vh height (`h-[90vh]`).
2. **Input Form & Keyboard Docking:**
   - *Stitch reference:* Input dock at bottom.
   - *Built:* Bottom dock styled with `pb-safe` to maintain clearance above iOS/Android virtual keyboards and mobile navigation bar.

---

## 6. Header Desktop (`header_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/skyb_india_marketplace_home_hub/screen.png` (Header section)
- **Built Screen:** `docs/design-qa/phase-1/header_desktop_1440px.png` (1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/header_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/header_desktop_compare.png)

### Visible Differences & Audit Checks:
1. **Pincode Display:**
   - *Stitch reference:* "Deliver to: Mumbai 400001".
   - *Built:* Starts empty as "Enter pincode". Modal displays "Standard delivery in 3-5 business days" when opened.
2. **Category Search Dropdown:**
   - *Stitch reference:* Integrated category filter before search input.
   - *Built:* Functional dropdown allowing direct search filtering across categories.
3. **Cart Badge:**
   - *Stitch reference:* Static badge count.
   - *Built:* Real-time live count and subtotal (`₹X`) updating immediately via `cart-updated` custom events.

---

## 7. Mobile Bottom Navigation (`bottom_nav_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_hub_skyb_india_mobile/screen.png` (Bottom Nav section)
- **Built Screen:** `docs/design-qa/phase-1/bottom_nav_390px.png` (390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/bottom_nav_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/bottom_nav_mobile_compare.png)

### Visible Differences & Audit Checks:
1. **Item Ordering & Count:**
   - *Stitch reference:* 5 items with SkyBot in slot 3: Home, Categories, SkyBot, Wishlist, Profile.
   - *Built:* Fixed in Phase 1D to exactly 5 items: **Home, Categories, Wishlist, Cart, Account**.
2. **Badges:**
   - *Stitch reference:* Static red dot.
   - *Built:* Live numeric count badges on both Wishlist and Cart updating immediately without page reload.
3. **Guest Protection:**
   - *Stitch reference:* Direct links.
   - *Built:* Unauthenticated taps on Wishlist, Cart, or Account intercept and redirect to `/login?next=...`.

---

## 8. Footer Desktop (`footer_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_restyled_locked_candy/screen.png` (Footer section)
- **Built Screen:** `docs/design-qa/phase-1/footer_desktop_1440px.png` (1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/footer_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/footer_compare.png)

### Visible Differences & Audit Checks:
1. **Link Completeness:**
   - *Stitch reference:* Mock text items.
   - *Built:* 100% active semantic links across Catalog, Customer Service, and Quick Links. Zero dead links (`href="#"`).
2. **Color & Typography:**
   - *Stitch reference:* Dark slate background `#001e2c` with cyan and white accents.
   - *Built:* Matches tokens from DESIGN.md: background `#001e2c`, headings Quicksand bold, body Nunito Sans.
