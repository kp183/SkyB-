# SkyB — API Endpoints

Base URL (local): `http://localhost:8000`
Standard response shape: `{ "data": ..., "error": null }`

## Auth
- `POST /auth/register` — {name, email, password} → user + token (always role='customer')
- `POST /auth/login` — {email, password} → token
- `GET /auth/me` — current user (requires auth header)
Note: no admin self-registration endpoint. First admin is created by `seed.py`
using credentials from `.env` (see AGENTS.md).

## Products
- `GET /products` — query params: category, age_group, search, sort, min_price, max_price
- `GET /products/{id}`
- `POST /products` (admin) — create product, incl. min_price, max_price, size, safety_tags
- `PUT /products/{id}` (admin) — update product
- `DELETE /products/{id}` (admin)

## Categories
- `GET /categories`
- `POST /categories` (admin)

## Reviews
- `GET /products/{id}/reviews` — P0, reads seeded demo review data
- `POST /products/{id}/reviews` (auth) — P2 stretch, real user-submitted reviews

## Cart
Requires login — guests can browse products but must log in to use cart/wishlist.
- `GET /cart` (auth)
- `POST /cart/add` — {product_id, quantity}
- `PUT /cart/{item_id}` — update quantity
- `DELETE /cart/{item_id}`

## Wishlist
- `GET /wishlist` (auth)
- `POST /wishlist/add` — {product_id, watch_price (optional)}
- `DELETE /wishlist/{item_id}`

## Bargain Assistant
- `POST /bargain/start` — {product_id} → creates a bargain_sessions row, returns session_id
- `POST /bargain/offer` — {session_id, offer_price} → creates a bargain_offers row
  for this round, returns {counter_price, message, round_number, status}
- `POST /bargain/accept` — {session_id} → sets final_price on the session; inserts
  a cart_items row (is_bargained=true) if the product isn't already in the user's
  cart, otherwise updates agreed_price + is_bargained on the existing row

## Checkout / Orders
- `POST /checkout` — {delivery_address} → creates an order with status='pending_payment'.
  Applies the single best coupon (Smart Savings Agent, P1) to the NON-bargained
  portion of the cart only; bargained (is_bargained=true) items are excluded from
  coupon discounting. Defaults discount_applied=0 until Smart Savings Agent ships.
- `POST /orders/mock-pay` — {order_id, simulate_failure: bool (optional, default false)}
  → on success: status → 'placed', cart cleared. On failure: status → 'payment_failed',
  cart preserved so the customer can retry.
- `GET /orders` (auth) — order history
- `GET /orders/{id}`

## AI Feature Endpoints
- `GET /products/{id}/safety-badge` — returns cached safety_score + safety_summary,
  generating and caching them on first request if not already set
- `GET /products/{id}/substitutes` — returns list of similar in-stock alternatives
- `GET /children/{id}/size-suggestion` — returns current recommended size range
- `GET /users/{id}/reorder-predictions` — returns predicted reorder items + dates
- `GET /products/{id}/bundle-suggestions` — returns "grows with them" next-stage products

## Admin
- `GET /admin/dashboard` — summary stats (orders, revenue, low stock)
- `GET /admin/orders` — all orders, filterable by status
- `PUT /admin/orders/{id}/status`
- `GET /admin/customers`

## Children (for Size & Age feature)
- `POST /children` — {name, birth_date, height_cm, weight_kg}
- `GET /children` (auth)
- `PUT /children/{id}`

## Coupons (admin)
- `GET /coupons`
- `POST /coupons`
- `PUT /coupons/{id}`
