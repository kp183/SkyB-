# AGENTS.md — SkyB Project Context

This file is read by AI coding agents (Antigravity) before working on this repo.
Keep it updated as decisions change.

## Project
SkyB — an e-commerce website for kids' products with AI-assisted shopping features.
Academic Field Project (T.Y. B.Sc. CS). See /docs/PRD.md for full requirements.
Security/robustness scope is defined in /docs/PRODUCTION_CHECKLIST.md — build
only the "Must-build" section as part of normal feature work; do not build the
"Namecheck only" section under any circumstances.

## Tech Stack (do not deviate without updating this file)
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: Python + FastAPI (FastAPI only — do not use Flask/Django)
- Database: PostgreSQL, accessed via SQLAlchemy
- AI: LLM API (Gemini) for natural-language features only; all pricing/safety
  DECISIONS are rule-based Python, not left to the LLM (see /docs/FEATURES_SPEC.md)
- Auth: JWT-based, passwords hashed with bcrypt
- Hosting: frontend → Vercel, backend → Render, DB → Render/Supabase Postgres
- Version control: GitHub, conventional commits (feat:, fix:, chore:)

## Folder Conventions
See /docs/ARCHITECTURE.md for the full folder structure. Key rules:
- `routers/` = HTTP layer only, no business logic
- `services/` = all business logic, one file per feature, independently testable
- Spec docs live in `/docs`. `AGENTS.md`, `README.md`, `.env.example` live at repo root.

## Coding Conventions
- Python: follow PEP8, type hints on function signatures, docstrings on service functions
- API responses: consistent JSON shape `{ "data": ..., "error": null }`
- Never hardcode secrets — always read from environment variables (see .env.example)
- Every new endpoint must be added to /docs/API_ENDPOINTS.md
- Every new table/column must be added to /docs/DATABASE_SCHEMA.md

## Feature Priorities (build in this order)
P0 (Mid Demo): catalog, cart, checkout, mock payment, auth, admin CRUD,
Bargain Assistant, Safety Badge, seeded product reviews.
P1 (Final Demo): Smart Savings Agent, Size & Age Auto-Progression, Smart Substitution.
P2 (if time allows): Price-Drop Watcher, Bundle Suggestions, Reorder Predictor,
real user-submitted reviews.
Do NOT build the resale/hand-me-down marketplace — explicitly out of scope for now.

## Key Business Rules
- The Bargain Assistant must NEVER let the final price go below product.min_price.
- Bargained cart items (is_bargained=true) are EXEMPT from coupon discounts at
  checkout — coupons only apply to non-bargained items' subtotal. This is what
  keeps the min_price floor intact end-to-end.
- Only ONE coupon applies per order (the single best discount) — no stacking.
- No admin self-registration endpoint — the first admin is created via `seed.py`
  using credentials from `.env`, not a UI flow. Don't build an admin-signup screen.
- Guests can browse the catalog without logging in, but must log in before adding
  anything to cart or wishlist. Do not build guest-cart-to-account merge logic.
- `POST /orders/mock-pay` must accept an optional `simulate_failure` flag so both
  payment success and failure paths can be demoed live to faculty.
- Order status must move through: pending_payment → placed (or payment_failed) →
  confirmed → shipped → delivered. An order is created at checkout as
  pending_payment, before mock-pay runs.

## Known Constraints
- This is a student project with a hard deadline — prioritize working end-to-end
  flows over perfect code.
- Payment is a MOCK gateway only — never integrate a real payment provider.
- Free-tier hosting: Render's free backend sleeps after 15 min idle — acceptable,
  no need to "fix" this.

## When Unsure
Check /docs/PRD.md, /docs/FEATURES_SPEC.md, and /docs/DATABASE_SCHEMA.md before
inventing new behavior. If a requirement is genuinely ambiguous, implement the
simplest version that satisfies the PRD and leave a `# TODO:` comment explaining
the assumption made.
