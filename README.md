# SkyB – AI-Powered Kids' E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-red)](https://www.sqlalchemy.org/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://www.python.org/)
[![Pytest](https://img.shields.io/badge/Testing-Pytest-yellow?logo=pytest)](https://docs.pytest.org/)

---

### Academic Project Metadata
- **Institution:** Haribhai V. Desai College (Autonomous), Pune
- **Program:** T.Y. B.Sc. Computer Science (Academic Year 2026–2027)
- **Project Group:** Group G41
- **Team Members:**
  - Bhavika Mandora
  - Yadnesh Channa
  - Kunal Ghanchi
  - Goswami Sheetalgiri

---

## 1. System Overview & Key Features

SkyB is a specialized e-commerce web platform engineered for modern parenting. Combining an intuitive storefront with rule-based safety guardrails and AI shopping assistance, SkyB streamlines purchasing children's clothing, footwear, toys, and nursery essentials across calibrated milestones.

### Key Features
1. **Age-Calibrated Milestone Filtering (0-2Y, 2-4Y, 4-6Y, 6-8Y, 8+Y):**
   Multi-dimensional catalog browsing filtered by developmental readiness, standard Indian sizing calibrations, and child age groups.
2. **Safety-First Badge & Material Compliance:**
   Rule-based extraction displaying non-toxic material certifications, BPA-free badges, choking hazard warnings, and minimum age safety tags on every product.
3. **Margin-Floor Bargain Assistant (SkyBot AI):**
   Interactive price negotiator using a strict Python rule engine ensuring negotiated prices NEVER breach product-level `min_price` floors, while preserving coupon isolation at checkout.
4. **Size & Age Auto-Progression:**
   Child profile tracking that maps birthdates to milestones and automatically prompts parents when their child transitions into next-stage apparel and shoe sizes.
5. **Smart Savings & Non-Stacking Coupon Engine:**
   Checkout logic enforcing transparent single-best-discount application (`WELCOME10`, `KIDS20`) exclusively applied to non-bargained items to safeguard store margins.
6. **Predictive Recurring Essentials Restock:**
   Consumption-frequency heuristics predicting when high-turnover diapering, wipes, formula, and bath essentials require timely replenishment.
7. **Mock Payment Gateway & Simulation Sandbox:**
   Full order lifecycle simulation moving from `pending_payment` to `placed` (or `payment_failed`), with live evaluation controls for payment failure branches and instant retry.

---

## 2. Tech Stack Breakdown

| Layer | Technologies & Tools |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Turbopack |
| **Backend** | Python 3.11+, FastAPI (REST API), Pydantic v2 |
| **Database & ORM** | SQLite (Local Dev) / PostgreSQL (Production), SQLAlchemy ORM |
| **Authentication** | JWT (JSON Web Tokens), Password Hashing with Bcrypt |
| **AI Layer** | Google Gemini API (Natural language features; all safety/pricing rules in Python) |
| **Testing** | Pytest, Playwright, HTTPX |
| **Deployment Targets** | Frontend: Vercel · Backend: Render · Database: Render / Supabase Postgres |

---

## 3. Repository Structure Tree

```
SkyB/
├── backend/                        # FastAPI Backend Application
│   ├── data/                       # Initial JSON catalogs & seed specifications
│   │   ├── catalog.json
│   │   └── coupons.json
│   ├── models/                     # SQLAlchemy ORM database models
│   │   ├── bargain.py
│   │   ├── cart.py
│   │   ├── category.py
│   │   ├── child.py
│   │   ├── coupon.py
│   │   ├── order.py
│   │   ├── product.py
│   │   ├── review.py
│   │   ├── user.py
│   │   └── wishlist.py
│   ├── routers/                    # Clean HTTP routing layer (no business logic)
│   │   ├── admin.py
│   │   ├── auth.py
│   │   ├── bargain.py
│   │   ├── cart.py
│   │   ├── categories.py
│   │   ├── children.py
│   │   ├── coupons.py
│   │   ├── orders.py
│   │   ├── products.py
│   │   ├── reviews.py
│   │   └── wishlist.py
│   ├── schemas/                    # Pydantic validation and serialization schemas
│   ├── services/                   # Core business logic services (independently testable)
│   │   ├── bargain_service.py
│   │   ├── order_service.py
│   │   ├── payment_service.py
│   │   ├── price_watch_service.py
│   │   ├── reorder_predictor_service.py
│   │   ├── safety_badge_service.py
│   │   ├── savings_service.py
│   │   └── substitution_service.py
│   ├── tests/                      # Automated test suite (Pytest)
│   │   ├── conftest.py
│   │   ├── test_phase1a.py
│   │   └── test_regression_core.py
│   ├── db.py                       # Database engine and session factory
│   ├── dependencies.py             # FastAPI dependency injection & auth guards
│   ├── main.py                     # Application entry point & middleware
│   ├── requirements.txt            # Python dependencies
│   ├── security.py                 # Bcrypt hashing & JWT utilities
│   ├── seed.py                     # Idempotent catalog & user database seeder
│   └── .env.example                # Backend environment template
├── frontend/                       # Next.js 16 Web Application
│   ├── app/                        # App Router pages and API layouts
│   │   ├── admin/                  # Back-office admin catalog and order fulfillment
│   │   ├── cart/                   # Shopping cart with bargained item segregation
│   │   ├── category/[slug]/        # Category product listing and filters
│   │   ├── checkout/               # Multi-step checkout with mock payment simulator
│   │   ├── orders/                 # Customer order tracking and history
│   │   ├── product/[id]/           # Product details, safety badges, customer reviews
│   │   ├── wishlist/               # Customer wishlist and price watcher
│   │   ├── layout.tsx              # Root HTML layout and providers
│   │   └── page.tsx                # Dynamic homepage with milestone carousels
│   ├── components/                 # Reusable UI components
│   │   ├── home/                   # Homepage milestone and department modules
│   │   ├── ui/                     # Design system atoms (Buttons, Badges, Chips)
│   │   ├── Navbar.tsx              # Navigation header with mega-menu
│   │   ├── ProductCard.tsx         # Product tile with discount and safety chips
│   │   ├── SafetyBadge.tsx         # Safety certification badge component
│   │   └── SkyBotSheet.tsx         # Responsive AI bargaining drawer
│   ├── lib/                        # Client API bindings and storage utilities
│   ├── public/                     # Static SVG icons, illustrations, and assets
│   ├── package.json                # Node.js dependencies
│   ├── tailwind.config.js          # Tailwind CSS design system configuration
│   └── .env.example                # Frontend environment template
├── docs/                           # Architecture, database schemas, and specifications
│   ├── API_ENDPOINTS.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── FEATURES_SPEC.md
│   └── PRD.md
├── .env.example                    # Root environment variable template
├── .gitignore                      # Git exclusion rules
├── AGENTS.md                       # Coding conventions and business rule definitions
└── README.md                       # Project documentation
```

---

## 4. Step-by-Step Local Setup Instructions

### Prerequisites
- **Python 3.11+** installed (`python --version`)
- **Node.js 18.18+ or 20+** installed (`node --version`)
- **Git** installed

### 1. Backend Setup (FastAPI)

1. Open a terminal at the repository root:
   ```bash
   # Navigate to backend directory or remain at root
   python -m venv venv
   ```

2. Activate the virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Configure environment variables:
   ```bash
   # Copy backend environment template
   cp backend/.env.example backend/.env
   # Or copy to root .env
   cp .env.example .env
   ```

5. Seed the database with catalog, categories, admin, and demo users:
   ```bash
   # Executes idempotent seed (populates 438 products, 14 categories, demo users)
   python seed.py
   ```

6. Start the FastAPI development server:
   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```
   - **Swagger Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **OpenAPI Schema:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
   - **Service Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

### 2. Frontend Setup (Next.js)

1. Open a new terminal window and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   - **Storefront Home:** [http://localhost:3000](http://localhost:3000)
   - **Admin Back-Office Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 5. Automated Testing Instructions

The backend test suite verifies core business logic, including authentication, catalog queries, price negotiation floor enforcement, cart segregation, and mock payment order fulfillment.

Run all tests from the repository root:
```bash
# Run pytest with verbose output
pytest backend/tests/ -v
```

To run individual test modules:
```bash
# Run regression tests
pytest backend/tests/test_regression_core.py -v

# Run Phase 1 integration tests
pytest backend/tests/test_phase1a.py -v
```

---

## 6. Demo Personas & Test Credentials

The database seeder pre-populates the following credentials for immediate demonstration:

| Persona | Role | Email | Password | Access / Capabilities |
|---|---|---|---|---|
| **Demo Parent** | Customer | `demoparent@skyb.demo` | `Parent@12345` | Product browsing, child profile (`Demo Child`, 14 mos), SkyBot bargaining, cart, checkout, order tracking, wishlist. |
| **Standard Customer** | Customer | `parent@skyb.com` | `Parent@123` | Default customer account for catalog checkout testing. |
| **SkyB Administrator** | Admin | `admin@skyb.demo` | `Admin@12345` | Operations dashboard (`/admin`), product catalog price floor/ceiling editing (`/admin/products`), customer order fulfillment pipeline (`/admin/orders`). |
| **Root Admin** | Admin | `admin@skyb.com` | `Admin@123` | Master administrator account configured via `.env`. |

---

## 7. Business Logic Guarantees & Constraints

- **Floor Price Guardrail:** The AI Bargain Assistant is constrained by backend logic (`backend/services/bargain_service.py`) and can NEVER counter-offer below `product.min_price`.
- **Checkout Discount Segregation:** Bargained items (`is_bargained=True`) are exempt from coupon discounts at checkout; store coupons (`WELCOME10`, `KIDS20`) calculate savings strictly from the non-bargained subtotal.
- **Single Coupon Rule:** Only one coupon applies per order — the single highest discount is accepted with zero coupon stacking.
- **Payment Sandbox:** All transactions are processed through a mock gateway simulator (`POST /orders/mock-pay`), allowing testers to demonstrate both success (`placed`) and failure (`payment_failed`) branches. Real payment provider APIs are never integrated.

---

## 8. License & Academic Attribution

This project is developed as an academic requirement for Haribhai V. Desai College (Autonomous), Pune. All product imagery and mock specifications are used under educational fair-use principles.
