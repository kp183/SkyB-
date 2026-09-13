# SkyB — Architecture

## 1. High-Level Diagram (described)
```
[Next.js Frontend] <---> [FastAPI Backend] <---> [PostgreSQL DB]
                              |
                              ---> [LLM API] (Bargain Assistant, Safety Badges)
                              |
                              ---> [Scheduled Jobs] (Price-Drop Watcher, Reorder Predictor)
```

## 2. Folder Structure
```
skyb/
├── frontend/                  # Next.js app
│   ├── app/                   # pages: /, /product/[id], /cart, /checkout, /admin/*
│   ├── components/            # ProductCard, BargainChatModal, SafetyBadge, etc.
│   ├── lib/                   # API client functions
│   └── styles/
├── backend/                   # FastAPI app
│   ├── main.py
│   ├── models/                # SQLAlchemy models (see DATABASE_SCHEMA.md)
│   ├── routers/                # one file per resource: products.py, cart.py, orders.py,
│   │                           # auth.py, admin.py, bargain.py, ai_features.py
│   ├── services/               # business logic per feature (see FEATURES_SPEC.md)
│   │   ├── bargain_service.py
│   │   ├── savings_service.py
│   │   ├── price_watch_service.py
│   │   ├── size_progression_service.py
│   │   ├── safety_badge_service.py
│   │   ├── substitution_service.py
│   │   ├── bundle_service.py
│   │   └── reorder_predictor_service.py
│   ├── jobs/                   # scheduled background jobs
│   └── db.py
├── docs/                        # PRD, ARCHITECTURE, DATABASE_SCHEMA, API_ENDPOINTS,
│                                 # FEATURES_SPEC, ROADMAP (this set of files)
├── AGENTS.md
├── .env.example
└── README.md
```

## 3. Why this split
- **routers/** only handle HTTP request/response — no business logic. Keeps API layer thin.
- **services/** hold the actual algorithm for each AI feature, independently testable.
- Each AI feature is its own service file so team members can work in parallel without
  merge conflicts.

## 4. Data Flow Example (Bargain Assistant)
1. Frontend opens chat modal, calls `POST /bargain/start` with `{product_id}`,
   receives back a `session_id`.
2. Frontend sends the customer's offer to `POST /bargain/offer` with
   `{session_id, offer_price}`.
3. `routers/bargain.py` calls `services/bargain_service.py`.
4. Service fetches product's `min_price`/`max_price` from DB, records this round
   in `bargain_offers` (see DATABASE_SCHEMA.md), and decides accept/counter.
5. Service calls LLM API only to phrase the response naturally — the actual price
   decision is rule-based, not left to the LLM.
6. Response returned to frontend, chat updates. Repeat steps 2–6 up to round 3.
7. On accept, frontend calls `POST /bargain/accept` with `{session_id}`.

## 5. Environments
- **Local dev:** Postgres via Docker or local install; both frontend/backend run locally.
- **Production:** Frontend on Vercel, backend on Render, DB on Render/Supabase Postgres.

## 6. Repo Layout Note
All spec docs (PRD, ARCHITECTURE, DATABASE_SCHEMA, API_ENDPOINTS, FEATURES_SPEC,
ROADMAP) live under `/docs` at the repo root. `AGENTS.md`, `README.md`, and
`.env.example` stay at the repo root itself, not inside `/docs`.
