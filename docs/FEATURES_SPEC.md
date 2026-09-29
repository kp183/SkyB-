# SkyB — AI Feature Specifications

Each feature below: what it does, the algorithm, inputs/outputs, and where it lives.

---
## 1. Bargain Assistant
**Logic:** Rule-based bounds check + LLM for natural conversation phrasing only.
**Inputs:** product_id, customer offer_price, session_id (created on first offer)
**What counts as a round:** every call to `POST /bargain/offer` is one round,
including the very first offer. A round ends when the system responds with a
counter (or acceptance). The session ends immediately if the customer accepts,
or after round 3 with the system accepting the customer's offer (if >= min_price)
or holding firm at min_price (if < min_price).
**Algorithm:**
1. Fetch product.min_price and product.max_price.
2. Each offer is stored as a new row in `bargain_offers` with an incrementing
   round_number, linked to the parent `bargain_sessions` row. The LLM-phrased
   response for that round is stored in the same row's `message` column.
3. If offer_price >= min_price:
   - Round 1: Counter slightly above offer (concede ~15% of gap from listed price).
   - Round 2: Step down closer to offer (concede ~40% of remaining gap from last counter).
   - Round 3: Accept customer's offer (is_accepted = True, counter_price = offer_price).
4. If offer_price < min_price:
   - Round 1: Concede 30% from listed price toward min_price floor.
   - Round 2: Concede 65% from listed price toward min_price floor.
   - Round 3: Hold firm at min_price floor (counter_price = min_price).
5. On round_number 3: mark the session as needing a final accept/reject decision from the customer.
**Cart handoff:** Bargaining can start on a product NOT yet in the cart. On
`POST /bargain/accept`: if the product has no existing cart_items row for this
user, insert one with agreed_price = final_price and is_bargained = true; if it
already exists, update agreed_price and set is_bargained = true on that row.
**Interaction with coupons:** items with is_bargained = true are excluded from
Smart Savings Agent discounting at checkout (see #3) — this is what keeps the
`min_price` floor rule intact end-to-end.
**Output:** counter_price, message, round_number, session status.
**File:** `services/bargain_service.py`

## 2. Safety-First Product Badge
**Logic:** NLP keyword extraction, optionally enhanced by an LLM summary call.
**Inputs:** product.description, product.category
**Algorithm:**
1. Scan description for keywords: "small parts", "choking", "BPA", "non-toxic", "flammable", etc.
2. If an LLM is used: prompt it to summarize safety-relevant info from the description in
   1–2 lines, and to flag an age-appropriateness minimum.
3. Cache the result on `products.safety_score` and `products.safety_summary` so
   it's computed once, not recomputed every page view. `GET /products/{id}/safety-badge`
   generates and caches on first request if these columns are still null.
**Output:** safety_score (Low/Medium/Good) + safety_summary text + safety_tags.
**File:** `services/safety_badge_service.py`

## 3. Smart Savings Agent (deal-stacking)
**Logic:** Pick the single best-value coupon — no stacking multiple coupons.
**Inputs:** cart total (non-bargained items only), list of active coupons, user eligibility
**P0/P1 note:** `POST /checkout` must work standalone with `discount_applied = 0`
before this service exists — checkout is P0, this service is P1. Once built, it
plugs into the same checkout hook without changing the checkout endpoint's shape.
**Algorithm:**
1. Compute the cart subtotal EXCLUDING any cart_items where is_bargained = true.
2. Filter coupons where that subtotal >= min_order_value and coupon is active.
3. Compute the discount each eligible coupon would give; pick the single coupon
   with the highest discount value.
4. Store the winning coupon's code in `orders.applied_coupon_code` for audit.
**Output:** total_discount, applied_coupon_code.
**File:** `services/savings_service.py`

## 4. Price-Drop Watcher
**Logic:** Threshold comparison via scheduled job. No external notification
service (email/SMS) — surfaced as an in-app flag only.
**Inputs:** wishlist_items with watch_price set and notified = false
**Algorithm:** Background job runs every N hours → for each watched item,
if product.price <= watch_price → set notified = true, notified_at = now().
Frontend checks this flag on next login/visit and shows an in-app banner.
**File:** `services/price_watch_service.py` + `jobs/price_watch_job.py`

## 5. Size & Age Auto-Progression
**Logic:** Rule-based lookup table, with height/weight as a secondary tiebreaker.
**Inputs:** child.birth_date (primary signal) + optional height_cm/weight_kg;
product.size and order_items.size_at_purchase for detecting outgrown items.
**Algorithm:**
1. Compute age_in_months = (today - birth_date).
2. Look up age_in_months in a predefined age-to-size mapping table
   (e.g., 0-3m → NB, 3-6m → S, 6-12m → M, ...) — this is the baseline suggestion.
3. If height_cm or weight_kg is provided and is notably above/below the typical
   range for that age bracket, nudge the suggestion one bracket up or down.
4. Compare the recommended size against `size_at_purchase` on the customer's
   past order_items (for clothing/footwear categories) — if the past purchase
   size is smaller than the current recommendation, flag "time to size up".
**Output:** recommended_size, upgrade_flag (boolean).
**File:** `services/size_progression_service.py`

## 6. Smart Substitution
**Logic:** Similarity/nearest-neighbor matching on structured attributes.
**Inputs:** out-of-stock product_id
**Algorithm:**
1. Query other in-stock products in the same category and same/adjacent age_group.
2. Score candidates by: same category (+2), same age_group (+2), price within 20% (+1),
   rating >= original (+1).
3. Return top-scoring candidate(s) with a one-line explanation of the trade-off.
**Output:** list of {product, reason}.
**File:** `services/substitution_service.py`

## 7. Grows-With-Them Bundle Suggestions
**Logic:** Predefined association table (or hardcoded dict) keyed by age_group progression.
**Inputs:** purchased product's age_group, category
**Algorithm:** Look up the "next age bracket" mapping (e.g., 6-9m items commonly
followed by 9-12m items in the same category) and surface 2–3 matching products.
**File:** `services/bundle_service.py`

## 8. Recurring Essentials Predictor
**Logic:** Average interval prediction from order history.
**Inputs:** user's past orders for repeat-purchase categories (diapers, wipes, formula)
**Algorithm:**
1. Get timestamps of past orders for the same product/category.
2. Compute average interval between orders (in days).
3. predicted_next_order_date = last_order_date + average_interval.
4. If today is within 2 days of predicted_next_order_date, surface a reorder prompt.
**Output:** predicted_date, suggested reorder items.
**File:** `services/reorder_predictor_service.py`

---
## Note on "is this real AI?"
Most features above are deterministic, rule-based algorithms — this is the correct
and defensible approach for a semester project (explainable, fast, no training data
needed). The LLM is used only for two things: phrasing the Bargain Assistant's
responses naturally, and summarizing safety text — never for the actual pricing or
safety decision itself.
