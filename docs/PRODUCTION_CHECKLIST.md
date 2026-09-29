# SkyB — Production Checklist (scoped for a 60-hour student build)

This is deliberately NOT a full production checklist — it's the subset that gives
real credibility per hour spent, given a 4-person team and a fixed deadline.
Items marked "Namecheck only" should be mentioned in your final report as
"aware of, next step for production scale" — do not spend build hours on them.

## Must-build (folds into existing P0/P1 tracks — see ROADMAP.md)

### Security
- [x] Password hashing: direct standard bcrypt ($2b$) in backend/security.py
- [x] JWT access tokens with expiry (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
- [x] Pydantic schema validation on every request body (backend/schemas/)
- [x] Role-based access control enforced server-side via shared `require_admin` dependency
- [x] Parameterized queries only via SQLAlchemy ORM
- [x] CORS restricted via CORS_ORIGINS env variable (defaults to localhost:3000 in dev; production set strictly to HTTPS Vercel domain; no wildcard `*` allowed in production)
- [x] HTTPS enforced by default via Vercel (frontend) and Render (backend) edge routers
- [x] Basic rate limiting on /auth/login and /auth/register (in-memory 10 req/min per IP sliding window). Note: Third-party bot CAPTCHA (reCAPTCHA/hCaptcha) is deliberately out of scope for this project's academic threat model (mock currency, no public signup monetary incentive).

### Backend robustness
- [x] Consistent error shape ({ "data": ..., "error": ... }) with proper HTTP status codes
- [x] `GET /health` endpoint implemented in backend/routers/health.py
- [x] Idempotency guard on `/orders/mock-pay` — rejects payment if order status is already placed/failed
- [x] Indexes on foreign keys and on `products.age_group`, `products.category_id`

### "Feels real" layer (highest visual payoff for a demo)
- [x] Order status visibly surfaced on order history page with status badges
- [x] Designed empty states: empty cart, empty orders, no search results
- [x] Client-side form validation with inline feedback on Login, Register, Checkout, and Admin Product creation
- [x] Legal & trust pages: /privacy and /terms linked in Footer; cookie consent omitted as only functional JWT auth is stored in localStorage

## Nice-to-have if time allows (P2, after all P0/P1 features work)
- [ ] Order confirmation email via a free tier provider (Resend/SendGrid)
- [ ] A flagged/moderated boolean on reviews, admin-togglable
- [ ] A minimal GitHub Action running lint on push

## Namecheck only — mention in your final report, do NOT build
- Penetration testing, enterprise WAF, SOC2-style compliance
- Third-party CAPTCHA (covered adequately by in-memory rate limiting for academic demo)
- Refresh-token rotation / token revocation lists
- Elasticsearch/Algolia-grade search (ILIKE + filters is enough for this scope)
- Full observability/logging stack (structured audit logs of admin actions are a
  nice sentence in your report, not worth building a pipeline for)
- CI beyond basic lint, staging/production environment separation

## Why this scope
Faculty and interviewers notice the difference between "tutorial CRUD app" and
"understands real systems" mostly from the Security and Backend Robustness
sections above — that's where the effort should go. The Ops/DevOps and
Legal/Business items from a full production checklist cost real hours for very
little demo-visible payoff at this project's scale, so they're intentionally
left out of the build plan and only namechecked in the report.
