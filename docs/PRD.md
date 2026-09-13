# SkyB — Product Requirements Document (PRD)

## 1. Overview
SkyB is a niche e-commerce platform for kids' and baby products (clothing, toys,
footwear, baby-care, school accessories), inspired by FirstCry, differentiated by
a set of AI-assisted shopping features. Built as a T.Y. B.Sc. CS Field Project.

## 2. Problem Statement
Parents shopping on general e-commerce platforms struggle to find age-appropriate,
safe products quickly, can't negotiate on price, don't get proactive reminders as
their child grows, and have to manually track recurring purchases (diapers, wipes).

## 3. Target Users
- **Primary:** Parents/guardians of children aged 0–12 years, shopping online in India.
- **Secondary (admin):** Store administrators managing catalog, pricing, and orders.

## 4. Goals
- Deliver a fully working, demoable e-commerce site (catalog → cart → checkout → order).
- Differentiate with 8 AI-assisted features that solve real parent pain points.
- Keep everything buildable and deployable for free within a college project timeline.

## 5. Non-Goals (out of scope for this version)
- Real payment processing (mock/simulated payment only).
- Resale/hand-me-down marketplace (parked as a future stretch feature).
- Real agent-to-agent negotiation between multiple sellers (single-seller catalog only).

## 6. Core User Flows
1. **Browse & Buy:** Register → browse/filter by age → view product (with safety badge)
   → add to cart → checkout → mock payment → order confirmation.
2. **Bargain:** On a product page, click "Bargain" → chat with AI → AI counters within
   admin-set min/max → deal settles → price applied to cart.
3. **Admin:** Login → dashboard → manage products (incl. min/max bargain price, age-group,
   safety info) → manage orders/stock/customers → view reports.

## 7. Feature List (see FEATURES_SPEC.md for full logic detail)
| # | Feature | Priority |
|---|---|---|
| 1 | Catalog, cart, checkout, mock payment | P0 (must-have) |
| 2 | User auth (register/login) | P0 |
| 3 | Admin dashboard (CRUD on products/orders) | P0 |
| 4 | Product reviews (seeded demo data; real user-submitted reviews are P2) | P0 |
| 5 | Bargain Assistant | P0 (headline feature) |
| 6 | Safety-First Product Badge | P0 |
| 7 | Smart Savings Agent (deal-stacking) | P1 |
| 8 | Size & Age Auto-Progression | P1 |
| 9 | Smart Substitution | P1 |
| 10 | Price-Drop Watcher | P2 |
| 11 | Grows-With-Them Bundle Suggestions | P2 |
| 12 | Recurring Essentials Predictor | P2 |

P0 = required for Mid Demo. P1/P2 = added for Final Demo, in that order, as time allows.

## 8. Success Criteria
- A parent can complete a full purchase end-to-end without errors.
- The Bargain Assistant produces a believable negotiation and never goes below the
  admin-set floor price.
- Safety badges appear on every product page.
- The site is deployed and reachable via a public URL for demo day.

## 9. Team & Roles
- Bhavika Mandora
- Yadnesh Channa
- Kunal Ghanchi
- Goswami Sheetalgiri
(Role assignment in ROADMAP.md)

## 10. Tech Stack Summary
Frontend: Next.js + Tailwind · Backend: Python (FastAPI) · DB: PostgreSQL ·
AI: LLM API (Gemini) + rule-based Python logic · Hosting: Vercel + Render + Supabase ·
Dev tool: Google Antigravity · Version control: GitHub
