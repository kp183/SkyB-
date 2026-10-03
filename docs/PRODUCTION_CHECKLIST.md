# SkyB — Production Checklist (scoped for a 60-hour student build)

This is deliberately NOT a full production checklist — it's the subset that gives
real credibility per hour spent, given a 4-person team and a fixed deadline.
Items marked "Namecheck only" should be mentioned in your final report as
"aware of, next step for production scale" — do not spend build hours on them.

## Must-build (folds into existing P0/P1 tracks — see ROADMAP.md)

### Security & Browser Hardening
- [x] Password hashing: direct standard bcrypt ($2b$) in backend/security.py
- [x] JWT access tokens with expiry (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
- [x] Pydantic schema validation on every request body (backend/schemas/)
- [x] Role-based access control enforced server-side via shared `require_admin` dependency
- [x] Parameterized queries only via SQLAlchemy ORM
- [x] CORS restricted via CORS_ORIGINS env variable (defaults to localhost:3000 in dev; production set strictly to HTTPS Vercel domain; no wildcard `*` allowed in production)
- [x] HTTPS enforced by default via Vercel (frontend) and Render (backend) edge routers
- [x] Security headers configured in next.config.ts: Content-Security-Policy (CSP allowing self, Supabase, and Gemini API), X-Content-Type-Options: nosniff, X-Frame-Options: DENY (clickjacking protection), Referrer-Policy, and Permissions-Policy.
- [x] HSTS (Strict-Transport-Security): Automatically terminated and enforced by Vercel and Render edge infrastructure for all custom domains over HTTPS. On default `.vercel.app` and `.onrender.com` shared subdomains, platform-level TLS certificates are managed automatically.
- [x] Basic rate limiting on /auth/login and /auth/register (in-memory 10 req/min per IP sliding window). Note: Third-party bot CAPTCHA (reCAPTCHA/hCaptcha) is deliberately out of scope for this project's academic threat model (mock currency, no public signup monetary incentive).

### Backend robustness & Operations
- [x] Consistent error shape ({ "data": ..., "error": ... }) with proper HTTP status codes
- [x] `GET /health` endpoint implemented in backend/routers/health.py
- [x] Idempotency guard on `/orders/mock-pay` — rejects payment if order status is already placed/failed
- [x] Indexes on foreign keys and on `products.age_group`, `products.category_id`, `wishlist.user_id`
- [x] Deployment History & Rollbacks: Vercel (frontend) and Render (backend) maintain continuous deployment history with zero-downtime, 1-click instant rollbacks to any prior commit build.
- [x] Database Backup Boundary (Documented Constraint): Deployed on Supabase free-tier PostgreSQL, which does not provide automated point-in-time recovery (PITR) on the free tier. Manual pg_dump exports serve as the backup safety net for demo evaluation.
- [x] Application Error Monitoring: All form submissions (checkout, registration, admin CRUD) submit directly to internal FastAPI endpoints. Unhandled exceptions are logged directly to Render's live log viewer, avoiding third-party SaaS instrumentation (Sentry) overhead on free tier.

### "Feels real" layer (highest visual payoff for a demo)
- [x] Order status visibly surfaced on order history page with status badges
- [x] Designed empty states: empty cart, empty orders, no search results
- [x] Client-side form validation with inline feedback on Login, Register, Checkout, and Admin Product creation
- [x] Legal & trust pages: /privacy and /terms linked in Footer; cookie consent omitted as only functional JWT auth is stored in localStorage
- [x] Canonical URLs & Dynamic OpenGraph Metadata: Self-referencing alternates.canonical across all routes with per-product OG titles, descriptions, and dynamic product imagery fallbacks.
- [x] Modern Image Formats: Next.js configured to serve AVIF and WebP modern image formats.

## Nice-to-have if time allows (P2, after all P0/P1 features work)
- [ ] A flagged/moderated boolean on reviews, admin-togglable
- [ ] A minimal GitHub Action running lint on push

## Explicitly Out of Scope / Namecheck only — mention in report, do NOT build
- Transactional Email Deliverability (SPF/DKIM/DMARC): SkyB executes simulated mock transactions; order receipts and bargaining statuses are delivered in-app in real-time. Full mail server DNS records are only applicable post-academic launch if real transactional email is provisioned.
- Third-Party Error Tracking / APM (Sentry, Datadog): In-process logging and Render stdout console stream provide sufficient visibility for demo evaluation without external SaaS dependencies.
- Automated Database Snapshots: Documented free-tier Supabase constraint.
- Penetration testing, enterprise WAF, SOC2-style compliance
- Third-party CAPTCHA (covered adequately by in-memory rate limiting for academic demo)
- Refresh-token rotation / token revocation lists
- Elasticsearch/Algolia-grade search (ILIKE + filters is enough for this scope)

## Why this scope
Faculty and interviewers notice the difference between "tutorial CRUD app" and
"understands real systems" mostly from the Security and Backend Robustness
sections above — that's where the effort should go. The Ops/DevOps and
Legal/Business items from a full production checklist cost real hours for very
little demo-visible payoff at this project's scale, so they're intentionally
left out of the build plan and only namechecked in the report.
