# SkyB — AI-Powered E-Commerce for Kids' Products

## Docs (read in this order before coding)
All of these live in `/docs`:
1. `docs/PRD.md` — what we're building
2. `docs/ARCHITECTURE.md` — how it's structured
3. `docs/DATABASE_SCHEMA.md` — data model
4. `docs/API_ENDPOINTS.md` — backend routes
5. `docs/FEATURES_SPEC.md` — AI feature algorithms
6. `docs/ROADMAP.md` — who builds what, and in what order

At the repo root (not in /docs):
7. `AGENTS.md` — rules for AI coding agents (Antigravity) working in this repo
8. `.env.example` — required environment variables

## Local Setup
### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # fill in real values
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp ../.env.example .env.local   # fill in real values
npm run dev
```

## Deployment
- Frontend → Vercel (connect GitHub repo, auto-deploys on push)
- Backend → Render (connect GitHub repo, set env vars in Render dashboard)
- Database → Render Postgres or Supabase (set DATABASE_URL accordingly)

## Team
Bhavika Mandora · Yadnesh Channa · Kunal Ghanchi · Goswami Sheetalgiri
