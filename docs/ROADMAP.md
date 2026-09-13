# SkyB — Roadmap & Team Split

Mapped to the 60-hour work plan from the synopsis (Phase-1 to Phase-4).

## Phase-1 (10 hrs) — Setup [already largely done]
- [x] Topic finalized, synopsis submitted
- [ ] Create GitHub repo; move PRD/ARCHITECTURE/DATABASE_SCHEMA/API_ENDPOINTS/
      FEATURES_SPEC/ROADMAP into /docs; keep AGENTS.md, README.md, .env.example at root
- [ ] Set up Next.js frontend skeleton + FastAPI backend skeleton
- [ ] Set up Postgres DB (local + Render/Supabase), run initial schema migration
- [ ] Write and run seed.py — default categories, sample products (with min/max
      price, safety_tags, size), seeded demo reviews, and one admin account
- [ ] Set up Vercel + Render projects, confirm empty deploy works end-to-end

## Phase-2 (20 hrs) — Field Visit + Core Build (parallel tracks)
Field work (all team members): interviews/questionnaires with ~30 parents, 5 shops.
Parallel dev tracks:
- **Track A — Core Store (Owner: TBD):** product/category models, catalog + search/filter
  API and UI, product detail page, cart, wishlist
- **Track B — Auth + Checkout (Owner: TBD):** register/login, JWT auth, checkout flow,
  mock payment, order confirmation, order history
- **Track C — Bargain Assistant (Owner: TBD):** bargain_service.py, bargain endpoints,
  chat UI modal, admin min/max price fields
- **Track D — Safety Badge + Admin (Owner: TBD):** safety_badge_service.py, admin
  dashboard shell, product CRUD for admin

## Phase-3 (20 hrs) — Integration, AI features, Testing
- Wire all frontend screens to real backend APIs (replace any mock data)
- Add P1 features: Smart Savings Agent, Size & Age Auto-Progression, Smart Substitution
- Add P2 features if time allows: Price-Drop Watcher, Bundle Suggestions, Reorder Predictor
- Full end-to-end test: register → browse → bargain → cart → checkout → mock pay → order
- Deploy final build to Vercel + Render, verify public URL works

## Phase-4 (10 hrs) — Report + Demo Prep
- Project documentation file (per college format)
- Final PPT
- Rehearse demo script (use the presentation scripts already prepared)
- Field Visit Report with photos + permission letter

## Suggested Team Ownership (assign names)
| Track | Owns | Suggested Person |
|---|---|---|
| A — Core Store | Catalog, cart, wishlist | |
| B — Auth + Checkout | Login, checkout, mock payment | |
| C — Bargain Assistant | Chat feature, pricing logic | |
| D — Safety + Admin | Safety badges, admin dashboard | |

Fill in names once the team divides work — update this file as the source of truth.
