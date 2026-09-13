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

### 1. Backend (FastAPI + SQLite / PostgreSQL)
From the repository root:
```bash
# 1. Create and activate virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Configure environment variables
# Copy .env.example to .env in the repo root (or backend/.env)
cp .env.example .env

# 4. Seed database with demo catalog, admin & customer accounts
# ALWAYS run seed as a module from repo root:
python -m backend.seed

# 5. Start the FastAPI backend server
python -m uvicorn backend.main:app --reload
```
- **API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Default Seeded Accounts**:
  - Admin: `admin@skyb.com` / `Admin@123`
  - Customer: `parent@skyb.com` / `Parent@123`

### 2. Frontend (Next.js 16 + Tailwind CSS)
In a separate terminal:
```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

## Deployment
- Frontend → Vercel (connect GitHub repo, auto-deploys on push)
- Backend → Render (connect GitHub repo, set env vars in Render dashboard)
- Database → Render Postgres or Supabase (set DATABASE_URL accordingly)

## Team
Bhavika Mandora · Yadnesh Channa · Kunal Ghanchi · Goswami Sheetalgiri
