# SkyB — Production Checklist (scoped for a 60-hour student build)

This is deliberately NOT a full production checklist — it's the subset that gives
real credibility per hour spent, given a 4-person team and a fixed deadline.
Items marked "Namecheck only" should be mentioned in your final report as
"aware of, next step for production scale" — do not spend build hours on them.

## Must-build (folds into existing P0/P1 tracks — see ROADMAP.md)

### Security
- [ ] Password hashing: bcrypt via passlib (already in requirements.txt)
- [ ] JWT access tokens with expiry (see AGENTS.md env vars: SECRET_KEY, ALGORITHM,
      ACCESS_TOKEN_EXPIRE_MINUTES) — a single short-lived token is enough; skip
      refresh-token rotation, not worth the complexity at this scale
- [ ] Pydantic schema validation on every request body (backend/schemas/) — reject
      malformed input before it reaches services/
- [ ] Role-based access control enforced server-side via a shared `require_admin`
      dependency (see implementation plan addition #2) — never trust a frontend flag
- [ ] Parameterized queries only — this is automatic if you use SQLAlchemy ORM
      correctly and never build raw SQL strings from user input
- [ ] CORS restricted to your actual Vercel frontend origin, not `*`
- [ ] Basic rate limiting on /auth/login and /auth/register (a simple in-memory
      or slowapi limiter is enough — not a WAF)

### Backend robustness
- [ ] Consistent error shape (already decided: `{data, error}`) with proper HTTP
      status codes; never leak stack traces to the client
- [ ] `GET /health` endpoint (trivial, already in the implementation plan)
- [ ] Idempotency guard on `/orders/mock-pay` — check order status before
      processing, so a double-click can't double-charge/double-place
- [ ] Indexes on foreign keys and on `products.age_group`, `products.category_id`
      (the columns you filter/search on most)

### "Feels real" layer (highest visual payoff for a demo)
- [ ] Order status visibly surfaced on the order history page (you already have
      the full enum — just render it with a simple status badge/stepper)
- [ ] Designed empty states: empty cart, no search results, no orders yet —
      one line of copy + an icon beats a blank white page
- [ ] Loading skeletons on the catalog/product grid instead of a blank screen
- [ ] Basic form validation with inline feedback on login/register/checkout

## Nice-to-have if time allows (P2, after all P0/P1 features work)
- [ ] Order confirmation email via a free tier provider (Resend/SendGrid) — high
      "this feels real" payoff for low effort, but only after checkout itself works
- [ ] A flagged/moderated boolean on reviews, admin-togglable
- [ ] A minimal GitHub Action running lint on push

## Namecheck only — mention in your final report, do NOT build
- Penetration testing, WAF, SOC2-style compliance
- Refresh-token rotation / token revocation lists
- Elasticsearch/Algolia-grade search (ILIKE + filters is enough for this scope)
- Full observability/logging stack (structured audit logs of admin actions are a
  nice sentence in your report, not worth building a pipeline for)
- CI beyond basic lint, staging/production environment separation
- Privacy Policy / Terms / cookie consent pages — reads as polish for a real
  business, but has zero bearing on your grading rubric; skip unless you have
  spare hours at the very end

## Why this scope
Faculty and interviewers notice the difference between "tutorial CRUD app" and
"understands real systems" mostly from the Security and Backend Robustness
sections above — that's where the effort should go. The Ops/DevOps and
Legal/Business items from a full production checklist cost real hours for very
little demo-visible payoff at this project's scale, so they're intentionally
left out of the build plan and only namechecked in the report.
