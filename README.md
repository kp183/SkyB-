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

### 1. Environment Configuration
Copy the template `.env.example` at the repository root:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

### 2. Backend Setup
> **Important:** Always execute backend commands from the **repository root** so Python resolves the `backend` package cleanly without `ModuleNotFoundError`.

```bash
# 1. Create and activate virtual environment
python -m venv venv

# Activate (Windows PowerShell):
.\venv\Scripts\Activate.ps1
# Or Activate (Windows Command Prompt):
.\venv\Scripts\activate.bat
# Or Activate (macOS/Linux):
source venv/bin/activate

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Seed the database (creates SQLite/Postgres tables & loads demo records)
python -m backend.seed

# 4. Start the FastAPI development server
python -m uvicorn backend.main:app --reload
```
- API root: http://localhost:8000
- Interactive Swagger UI: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 3. Frontend Setup
From the repository root:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: http://localhost:3000

## Deployment
- Frontend → Vercel (connect GitHub repo, auto-deploys on push)
- Backend → Render (connect GitHub repo, set env vars in Render dashboard)
- Database → Render Postgres or Supabase (set DATABASE_URL accordingly)

## Team
Bhavika Mandora · Yadnesh Channa · Kunal Ghanchi · Goswami Sheetalgiri
