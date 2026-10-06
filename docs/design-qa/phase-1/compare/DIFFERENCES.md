# Phase 1F Visual Difference Audit — Built Production vs. Stitch Specification

This document provides an honest, empirical analysis of visible differences (colors, spacing, copy, icons, and layout) between the built SkyB application and the Stitch design-v2 reference mockups across all 8 required screens. 

All comparisons were produced using **Playwright headless Chrome** capturing side-by-side equal-dimension crops at **100% unscaled resolution** (1440x900 desktop, 390x844 mobile). The built application was served from `next build && next start` (production mode on port 3005) with **zero dev overlays** (no Next.js "N" badge).

Artifacts are located in [`docs/design-qa/phase-1/compare/`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/).

---

## Retraction of Previous Erroneous Claim

> [!WARNING]
> **Retraction Regarding Footer Color in Previous QA Reports:**
> An earlier version of `DIFFERENCES.md` incorrectly claimed that Stitch's footer background was dark slate `#001e2c`. Pixel sampling and DOM computed-style measurements from `code.html` prove that claim was **completely false**.
> - **Stitch reference footer background:** `rgb(240, 243, 255)` (`#f0f3ff` — light surface-container-low).
> - **Built application footer background:** `rgb(239, 244, 255)` (`#eff4ff` — light surface-container-low).
> Both reference and built footers are light blue; there is no dark `#001e2c` footer in Stitch.

---

## Sampled Color & Geometry Metrics

Measurements sampled directly from DOM computed styles (`docs/design-qa/phase-1/compare/sampled_metrics.json`):

| Element | Stitch Reference | Built Application | Status / Classification |
|---|---|---|---|
| **Footer Background** | `rgb(240, 243, 255)` (`#f0f3ff`) | `rgb(239, 244, 255)` (`#eff4ff`) | `[intentional (matches light surface-container-low within 1 delta E)]` |
| **Bargain Bot Button** | `rgb(255, 222, 160)` (`#ffdea0` pale peach), text `rgb(38, 26, 0)`, shadow `0 3px 0 #795900` | `rgb(225, 168, 0)` (`#e1a800` locked gold), text `rgb(255, 255, 255)` (pure white), shadow `0 5px 0 #795900` | `[intentional (locked brand gold per DECISIONS.md item 10)]` |
| **Cart Button / Pill** | Pale blue pill `#c4e7ff` with dark blue text | Ocean primary `#00668a`, pure white text, shadow `0 4px 0 #004965` | `[intentional (locked tactile styling per DECISIONS.md item 10)]` |
| **Sign In Button** | Pale blue pill `#c4e7ff` with dark blue text | Ocean primary `#00668a`, pure white text, shadow `0 4px 0 #004965` | `[intentional (locked tactile styling per DECISIONS.md item 10)]` |
| **Card Shadow** | `rgba(0, 30, 44, 0.06) 0px 4px 16px 0px` (soft blur) | `rgb(196, 231, 255) 0px 8px 0px 0px` (tactile solid candy shadow) | `[intentional (locked tactile candy drop-shadow design language)]` |

---

## 1. Header Desktop (`header_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_restyled_locked_candy/code.html` (Header crop at 1440x900)
- **Built Production:** `http://localhost:3005` (Header crop at 1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/header_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/header_desktop_compare.png) (2880x156)

### Visible Differences & Audit Checks:
1. **Bargain Bot Button Color:** `[intentional (locked design)]`
   - *Stitch reference:* Pale peach `#ffdea0` with dark brown text.
   - *Built:* Locked brand gold `#e1a800` with pure white text/icon and `0 5px 0 #795900` hard shadow. The pink notification ping dot has been completely removed.
2. **Cart Pill & Sign In Styling:** `[intentional (locked design)]`
   - *Stitch reference:* Pale sky blue `#c4e7ff` with dark text.
   - *Built:* Ocean primary `#00668a` with white text and `0 4px 0 #004965` shadow. For guests, displays "Cart" only (no "Cart Cart" or mock item count).
3. **Pincode Delivery Selector:** `[fixed]`
   - *Stitch reference:* Hardcoded "Deliver to: Mumbai 400001".
   - *Built:* Starts empty with "Enter pincode" placeholder. Validates 6-digit Indian PIN codes client-side.
4. **Sub-header Category Navigation:** `[fixed]`
   - *Stitch reference:* 11 category tabs with icons.
   - *Built:* 11 category tabs with distinct SVG icons matching the design registry. Mega-menu price chips filter out any chip with zero items (`VALID_PRICE_BANDS_BY_SLUG`).

---

## 2. Home Desktop Hero & Body (`home_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_restyled_locked_candy/code.html` (Hero & grid crop at 1440x900)
- **Built Production:** `http://localhost:3005` (Hero & grid crop at 1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/home_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/home_desktop_compare.png) (2880x676)

### Visible Differences & Audit Checks:
1. **Hero Headline & Copy:** `[won't fix (Phase 2 task)]`
   - *Stitch reference:* "Where Smart Parenting Meets Serious Play".
   - *Built:* Retains "Play, Snuggle & Score Big Discounts!" until Phase 2 Home redesign as specified by user instructions.
2. **Banned Words Removal:** `[fixed]`
   - *Stitch reference:* Showed "Certified Baby-Safe", "Tested Materials", "Safety Verified".
   - *Built:* Cleaned all 13 banned words. Home perks bar displays "Safety info on every product" instead of "100% Baby-Safe". Hero pill tags removed.
3. **Product Catalog Cards:** `[won't fix (dynamic data vs static mockup)]`
   - *Stitch reference:* Static placeholder toys with mock ratings (e.g. 4.9 stars across all cards).
   - *Built:* Live database products. Generated products (IDs > 5) show no stars or review count unless backed by rows in the `reviews` table.

---

## 3. Footer Desktop (`footer_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_restyled_locked_candy/code.html` (Footer crop at 1440x900)
- **Built Production:** `http://localhost:3005` (Footer crop at 1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/footer_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/footer_compare.png) (2880x478)

### Visible Differences & Audit Checks:
1. **Footer Background Color:** `[fixed]`
   - *Stitch reference:* `rgb(240, 243, 255)` (`#f0f3ff`).
   - *Built:* `rgb(239, 244, 255)` (`#eff4ff`). Matches light container tokens.
2. **Copyright Year & Attribution:** `[fixed]`
   - *Stitch reference:* "© 2024 SkyB Inc." or "© 2025".
   - *Built:* Dynamically computes `new Date().getFullYear()` (2026) and states: `"© 2026 skyB, academic project. Built for demo purposes only."`.
3. **Photo Attribution:** `[fixed]`
   - *Stitch reference:* None.
   - *Built:* Explicit attribution added: `"Photos: Unsplash & Pexels (demo catalog)"`.
4. **Policy Links & Anchor Routing:** `[fixed]`
   - *Stitch reference:* Dead links (`#`).
   - *Built:* Zero dead links. All links point to live routes or valid `/terms` anchor sections:
     - Track Order -> `/orders`
     - Saved Wishlist -> `/wishlist`
     - My Orders -> `/orders`
     - Quick Re-Order -> `/reorder`
     - Child Profile -> `/account/child`
     - Privacy Policy -> `/privacy`
     - Terms of Service -> `/terms`
     - Returns & Exchanges -> `/terms#returns`
     - Shipping & Delivery -> `/terms#shipping`
     - Help Center & FAQs -> `/terms#faq`
     - Safety Standards & Promise -> `/terms#safety`
     - Academic Project Info -> `/terms#about`
5. **Marketing Wording:** `[fixed]`
   - *Stitch reference:* "Top Daily Deals".
   - *Built:* Rewritten to "Top Deals".

---

## 4. Home Mobile (`home_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_hub_skyb_india_mobile/code.html` (Mobile crop at 390x844)
- **Built Production:** `http://localhost:3005` (Mobile crop at 390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/home_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/home_mobile_compare.png) (780x636)

### Visible Differences & Audit Checks:
1. **Mobile Header Composition (Item 18):** `[fixed]`
   - *Stitch reference:* Hamburger, centered logo, search, bot, cart, avatar.
   - *Built:* Exactly conforms to Item 18: Hamburger (left), centered skyB logo, search toggle button (opens full-width input overlay), Bargain Bot button (`#e1a800`, white icon, shadow `0 3px 0 #795900`), cart icon with count badge, and account avatar. Wishlist heart removed from mobile header.
2. **Next.js Dev Overlay Badge:** `[fixed]`
   - *Built:* Captured from production build on port 3005. Black "N" dev badge is 100% absent.

---

## 5. Mobile Bottom Navigation (`bottom_nav_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/home_hub_skyb_india_mobile/code.html` (Bottom nav crop at 390x844)
- **Built Production:** `http://localhost:3005` (Bottom nav crop at 390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/bottom_nav_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/bottom_nav_mobile_compare.png) (780x101)

### Visible Differences & Audit Checks:
1. **Navigation Slots:** `[fixed]`
   - *Stitch reference:* 5 slots: Home, Categories, SkyBot, Wishlist, Profile.
   - *Built:* Fixed to 5 slots: **Home, Categories, Wishlist (badge), Cart (badge), Account**. SkyBot is accessed via the header and product cards.
2. **Label Visibility:** `[fixed]`
   - *Built:* All 5 labels are crisp and fully visible. No dev badge obscuring the "Home" label.

---

## 6. Category Navigation Drawer (`category_drawer_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/category_drawer_category/code.html` (Rendered with drawer open at 360x786)
- **Built Production:** `http://localhost:3005` (Rendered with drawer open at 360x786)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/category_drawer_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/category_drawer_compare.png) (720x786)

### Visible Differences & Audit Checks:
1. **Reference Screen Truth:** `[fixed]`
   - *Previous issue:* The static `screen.png` for `category_drawer_category` was blank/unrendered.
   - *Resolution:* Rendered directly from `category_drawer_category/code.html` with JavaScript drawer activation at 100% scale.
2. **Category Icons:** `[fixed]`
   - *Built:* Footwear uses a dedicated shoe SVG icon (`steps`/shoe), Diapering uses diaper, Gear uses stroller, Feeding uses bottle, Bath uses drop, Nursery uses crib, Health & Safety uses shield, School uses backpack. No plain dots.
3. **Dead Links Removal:** `[fixed]`
   - *Stitch reference:* Showed mock "Help Desk".
   - *Built:* "Help Desk" removed; footer quick links point to `/terms#faq`, `/account/child`, `/orders`, and `/reorder`.

---

## 7. SkyBot Desktop Slide-Over (`skybot_desktop_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/skybot_sheet_skybot_sheet/code.html` (Rendered at 1440x900 as right slide-over)
- **Built Production:** `http://localhost:3005` (Rendered with SkyBot open at 1440x900)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/skybot_desktop_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/skybot_desktop_compare.png) (2880x936)

### Visible Differences & Audit Checks:
1. **Correct Reference Screen:** `[fixed]`
   - *Previous issue:* Earlier report compared against `skybot_hub` (full page) instead of `skybot_sheet_skybot_sheet` (slide-over).
   - *Resolution:* Rendered from `skybot_sheet_skybot_sheet/code.html` styled as a slide-over at 100% scale.
2. **Suggestion Chips Math:** `[intentional (rule-based)]`
   - *Stitch reference:* Mock static suggestions.
   - *Built:* Suggestion chips are computed purely from the listed price (₹629 / ₹594 / ₹559 = 90%, 85%, 80% of ₹699) and labeled "Suggestions". Never derived from `min_price`.
3. **Product Card Background:** `[fixed]`
   - *Built:* Real catalog cards behind modal backdrop blur. Attributed to Unsplash & Pexels in footer.

---

## 8. SkyBot Mobile Bottom Sheet (`skybot_mobile_compare.png`)
- **Stitch Reference:** `stitch_skyb_v2/skybot_sheet_skybot_sheet/code.html` (Rendered at 390x844 mobile viewport)
- **Built Production:** `http://localhost:3005` (Rendered with SkyBot bottom sheet at 390x844)
- **Side-by-side artifact:** [`docs/design-qa/phase-1/compare/skybot_mobile_compare.png`](file:///c:/Users/kp294/Downloads/files/docs/design-qa/phase-1/compare/skybot_mobile_compare.png) (780x796)

### Visible Differences & Audit Checks:
1. **Geometry & Drag Handle:** `[fixed]`
   - *Stitch reference:* Rounded top sheet with drag handle.
   - *Built:* 90vh bottom sheet with rounded top corners (`rounded-t-3xl`), centered drag bar, and smooth touch-dismiss backdrop.
2. **Keyboard & Mobile Safe Area:** `[fixed]`
   - *Built:* Bottom input area uses `pb-safe` to prevent occlusion by mobile home indicators and virtual keyboards.

---

## Summary of Intentional Deviations

The following differences between the built application and Stitch mockups are deliberate architectural and product decisions:

1. **No Coupon Leaks or Banners:** Stitch mockups showed arbitrary banners with promo codes (e.g. `KIDS20`). In SkyB, coupon codes are never pre-leaked; they are applied at checkout and non-stackable with bargained items.
2. **No Countdown Urgency Timers:** Stitch included fake "Ending in 02:45:10" countdowns. These are omitted to maintain student project honesty and prevent deceptive urgency patterns.
3. **Removal of Unverified Safety Claims:** Banned terms ("Certified", "Tested Materials", "Safety Verified", "100% Baby-Safe") present in Stitch mockups are replaced with neutral statements ("Safety info on every product", "Safety Details").
4. **No Synthetic Review Authors:** Static Stitch mockups showed arbitrary customer names and reviews on every product. In the built application, generated products (IDs > 5) show zero stars and zero review counts until genuine reviews are posted.
5. **Locked Button Colors:** Locked brand tokens (`#e1a800` gold for Bargain Bot, `#00668a` ocean blue for Cart pill and Sign In) override Stitch's pale peach `#ffdea0` and pale blue `#c4e7ff` pills to maintain high contrast and tactile consistency across the application.
