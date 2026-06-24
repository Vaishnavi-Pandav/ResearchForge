# ResearchForge — AI-Powered Multi-Agent Research Platform

> A production-grade AI research SaaS combining 5 specialized agents: **Query Planner**, **Web Searcher**, **Credibility Scorer**, **Synthesizer**, and **Citation Formatter**.
> **100% free to run** — uses Google Gemini 1.5 Flash + DuckDuckGo + local sentence-transformers.

---

## ✅ What's Built

| Layer | Stack |
|---|---|
| Frontend | React 18 + Vite + React Query + Framer Motion |
| Backend | FastAPI + SQLAlchemy Async + LangGraph |
| Auth | Firebase Auth (frontend) + Firebase Admin SDK (backend JWT verification) |
| LLM | **Google Gemini 1.5 Flash** — FREE via AI Studio (15 RPM, 1M tokens/day) |
| Web Search | **DuckDuckGo** — completely FREE, no API key needed |
| Embeddings | **sentence-transformers** — runs locally, no API key |
| Database | PostgreSQL (via asyncpg) |
| Migrations | Alembic |

---

## 🚀 Quick Start

### Step 1 — Get Your Free Google AI Studio API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### Step 2 — Configure Environment

```bash
# Root .env
GOOGLE_API_KEY=your-key-here    # from AI Studio (free)
GEMINI_MODEL=gemini-1.5-flash

# Frontend .env (already has Firebase config)
VITE_FIREBASE_API_KEY=...       # from Firebase Console
VITE_FIREBASE_PROJECT_ID=...
```

### Step 3 — Start Everything

**Option A — Automatic (Windows PowerShell)**
```powershell
.\start.ps1
```

**Option B — Manual**

```powershell
# Terminal 1: Backend
cd backend
pip install -r requirements/base.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 🔑 Required Credentials

| Service | Where to Get | Required? |
|---|---|---|
| Google AI Studio API Key | [aistudio.google.com](https://aistudio.google.com/app/apikey) | **YES** (for LLM agents) |
| Firebase Config | Firebase Console → Project Settings → Web App | **YES** (for auth) |
| Firebase Service Account | Firebase Console → Project Settings → Service Accounts | Optional (dev works without it) |
| PostgreSQL | Local install or [Neon.tech](https://neon.tech) (free) | YES |

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project → Enable Authentication → Enable Email/Password and Google providers
3. Get your web app config → paste into `frontend/.env`
4. (Optional) Generate Service Account JSON → place at `backend/firebase-service-account.json`

### Database Setup
```sql
-- Run in your PostgreSQL instance:
CREATE DATABASE researchforge;
```
Then run migrations:
```powershell
cd backend
alembic upgrade head
```

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/research/` | Start research session |
| GET | `/api/v1/research/` | List all sessions |
| GET | `/api/v1/research/{id}` | Get session + agent statuses |
| GET | `/api/v1/research/{id}/sources` | Get session sources |
| GET | `/api/v1/research/analytics` | User analytics stats |
| GET | `/api/v1/reports/` | List reports |
| GET | `/api/v1/reports/{id}` | Get full report + citations |
| DELETE | `/api/v1/reports/{id}` | Delete report |

API docs available at `http://localhost:8000/docs`

---

## 🤖 Agent Pipeline

```
User Input
    │
    ▼
┌─────────────────────┐
│  1. Query Planner   │  Gemini 1.5 Flash → Objectives, Subtopics, Search Queries
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  2. Web Searcher    │  DuckDuckGo (free) → 10-200 sources based on depth
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  3. Credibility     │  Gemini (top 10) + heuristics → credibility_score 0-10
│     Scorer          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  4. Synthesizer     │  Gemini → Full Markdown report (1500-3000 words)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  5. Citation        │  Gemini → APA, MLA, Chicago, Harvard citations
│     Formatter       │
└─────────────────────┘
          │
          ▼
    Report Saved to DB
```

---

## 📁 Project Structure

```
ResearchForge/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── app/
│   │   ├── agents/
│   │   │   ├── planner/           # Query Planner Agent (Gemini)
│   │   │   ├── searcher/          # Web Searcher Agent (DuckDuckGo)
│   │   │   ├── credibility/       # Credibility Scorer Agent
│   │   │   ├── synthesizer/       # Synthesizer Agent (Gemini)
│   │   │   └── citation/          # Citation Formatter Agent (Gemini)
│   │   ├── api/routes/            # FastAPI route handlers
│   │   ├── core/                  # Config, Firebase auth, security
│   │   ├── db/                    # SQLAlchemy engine, base, migrations
│   │   ├── models/                # SQLAlchemy ORM models
│   │   ├── repositories/          # DB CRUD repositories
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── services/              # Business logic services
│   │   └── workflows/             # LangGraph DAG (research_graph.py)
│   └── requirements/base.txt
│
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useResearch.js     # React Query hooks for sessions
│   │   │   └── useReports.js      # React Query hooks for reports
│   │   ├── pages/
│   │   │   ├── Dashboard/         # Main dashboard with real stats
│   │   │   ├── Research/          # NewResearch, Details, History
│   │   │   ├── Reports/           # List + Viewer with markdown
│   │   │   └── Profile/           # User profile + usage
│   │   └── services/apiClient.js  # Axios + Firebase token injection
│   └── .env
│
└── .env                            # Backend environment variables
```

---

## 🛠️ Development Notes

### Dev Mode (No Firebase Service Account)
The backend starts in **dev mode** if `firebase-service-account.json` is missing. Auth verification is disabled and a mock user is returned. This allows local development without Firebase credentials.

### Free Tier Limits
| Service | Free Tier |
|---|---|
| Gemini 1.5 Flash | 15 RPM, 1M tokens/day |
| DuckDuckGo Search | Unlimited |
| sentence-transformers | Local, unlimited |

For standard research (25 sources), each session uses ~3-4 Gemini calls, well within free limits.

### Running Without PostgreSQL
Set `echo=False` in `session.py` and use SQLite by changing `DATABASE_URL` in `.env`:
```
# SQLite (development only)
DATABASE_URL=sqlite+aiosqlite:///./researchforge.db
```
