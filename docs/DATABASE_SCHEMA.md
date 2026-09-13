# SkyB — Database Schema

## users
| Column | Type | Notes |
|---|---|---|
| id | UUID / serial PK | |
| name | varchar | |
| email | varchar, unique | |
| password_hash | varchar | bcrypt |
| role | enum('customer','admin') | |
| created_at | timestamp | |

## children (for Size & Age Auto-Progression)
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK -> users.id | |
| name | varchar | optional |
| birth_date | date | primary signal for age-based sizing |
| current_height_cm | int | optional — secondary tiebreaker |
| current_weight_kg | int | optional — secondary tiebreaker |

## categories
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | e.g. Clothing, Toys, Footwear |

## products
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | |
| description | text | fed to Safety Badge generator |
| category_id | FK -> categories.id | |
| age_group | varchar | e.g. "0-12m", "1-3y" |
| size | varchar | nullable — e.g. "0-3M","S","M","L"; used by Size & Age Auto-Progression |
| price | decimal | listed/display price |
| min_price | decimal | floor for Bargain Assistant (admin-set) |
| max_price | decimal | ceiling, usually = price |
| stock_qty | int | |
| image_url | varchar | |
| safety_tags | text[] / json | choking hazard, BPA-free, etc. (raw keyword flags) |
| safety_score | enum('Low','Medium','Good') | nullable — cached AI-generated result |
| safety_summary | text | nullable — cached AI-generated 1-2 line summary |
| created_at | timestamp | |

## reviews
Seeded with static demo data for Mid/Final Demo (so product cards show ratings
immediately). Real user-submitted reviews via `POST /products/{id}/reviews` is
a P2 stretch — not required for P0/P1.
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| product_id | FK | |
| user_id | FK | nullable if seeded, not tied to a real user |
| rating | int (1-5) | |
| comment | text | |

## cart_items
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK | |
| product_id | FK | |
| quantity | int | |
| agreed_price | decimal | set if bargained, else = product.price |
| is_bargained | boolean | true if agreed_price came from Bargain Assistant — exempts this item from coupon stacking at checkout |

## wishlist_items
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK | |
| product_id | FK | |
| watch_price | decimal | nullable — target price for Price-Drop Watcher |
| notified | boolean | default false — flips true once the watched price is hit |
| notified_at | timestamp | nullable |

## orders
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK | |
| total_amount | decimal | |
| discount_applied | decimal | from Smart Savings Agent, default 0 |
| applied_coupon_code | varchar | nullable — audit trail for which single coupon was used |
| status | enum('pending_payment','placed','confirmed','shipped','delivered','payment_failed','cancelled') | created as pending_payment at checkout |
| delivery_address | text | |
| created_at | timestamp | |

## order_items
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| order_id | FK | |
| product_id | FK | |
| quantity | int | |
| price_at_purchase | decimal | |
| size_at_purchase | varchar | snapshot of product.size at time of order |

## coupons (for Smart Savings Agent)
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| code | varchar | |
| discount_type | enum('flat','percent') | |
| discount_value | decimal | |
| min_order_value | decimal | nullable |
| active | boolean | |
Note: only ONE coupon applies per order (the single best discount) — no stacking.

## bargain_sessions (parent record for a negotiation)
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK | |
| product_id | FK | |
| status | enum('ongoing','accepted','rejected') | |
| final_price | decimal | nullable until settled |
| created_at | timestamp | |

## bargain_offers (one row per round in a negotiation)
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| session_id | FK -> bargain_sessions.id | |
| round_number | int | 1, 2, 3 — capped at 3, see FEATURES_SPEC.md #1 |
| offer_price | decimal | customer's offer this round |
| counter_price | decimal | system's counter this round |
| message | text | LLM-phrased response shown in the chat UI for this round |
| created_at | timestamp | |

## bundle_associations (backs Grows-With-Them Bundle Suggestions)
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| from_age_group | varchar | e.g. "6-9m" |
| to_age_group | varchar | e.g. "9-12m" |
| category_id | FK -> categories.id | |
Note: can start as a hardcoded Python dict in `bundle_service.py` for the P2
build, and be promoted to this table later if time allows.

## Relationships summary
- users 1—N children, cart_items, wishlist_items, orders, reviews, bargain_sessions
- categories 1—N products, bundle_associations
- products 1—N reviews, cart_items, wishlist_items, order_items, bargain_sessions
- bargain_sessions 1—N bargain_offers
- orders 1—N order_items
