# Aletheia – Local Development & Render Deployment Guide (Windows & macOS)

> **Project:** Aletheia — Web application that lets users interact with multiple **LLM personality versions** (default, benevolent, authoritarian) and logs study interactions for trust analysis.

This README is cleanly organized for your GitHub repo. It covers **local setup** (Windows/macOS) and **Render deployment**.

---

## Table of Contents
- [Overview](#overview)
- [Repo Layout](#repo-layout)
- [Prerequisites](#prerequisites)
- [Quick Start — Windows](#quick-start--windows)
- [Quick Start — macos](#quick-start--macos)
- [Environment Files (Local)](#environment-files-local)
- [Run Locally](#run-locally)
- [Render Deployment (Production)](#render-deployment-production)
  - [Managed PostgreSQL](#managed-postgresql)
  - [Backend on Render (FastAPI)](#backend-on-render-fastapi)
  - [Frontend on Render (Nextjs)](#frontend-on-render-nextjs)
  - [Custom Domains (Optional)](#custom-domains-optional)
  - [CI/CD & Branch Rules](#cicd--branch-rules)
  - [Logs, Shell, Debugging](#logs-shell-debugging)
  - [Security & Secrets](#security--secrets)
  - [Post-Deployment Smoke Test](#post-deployment-smoke-test)
- [Env Var Matrix (Local vs Render)](#env-var-matrix-local-vs-render)
- [Alembic Notes](#alembic-notes)
- [Troubleshooting](#troubleshooting)
- [License / Attribution](#license--attribution)

---

## Overview
Aletheia is a Next.js + FastAPI + PostgreSQL application designed for an academic study of **LLM trust**. Each user is assigned **one fixed personality** via round-robin. The app logs demographics, chats, Google logo clicks, final answers, and survey responses for analysis.

---

## Repo Layout
```
llm/
  frontend/    # Next.js + Tailwind
  backend/     # FastAPI + PostgreSQL + Alembic
  README.md
```

---

## Prerequisites
- **PostgreSQL** (local for development)
- **Python 3.11** (backend)
- **Node.js 20 LTS** (frontend)
- **Git**
- (Optional) **pgAdmin**

**Default local ports**
- Backend (FastAPI): `http://127.0.0.1:8000`
- Frontend (Next.js): `http://localhost:3000`

---

## Quick Start — Windows
```powershell
# Clone
cd C:\dev
git clone <YOUR_REPO_URL> llm
cd llm

# --- Backend ---
cd backend
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Create backend\.env (see below), then:
alembic upgrade head
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# --- Frontend ---
cd ..\frontend
npm install
npm run dev
```

---

## Quick Start — macOS
```bash
# Clone
mkdir -p ~/dev && cd ~/dev
git clone <YOUR_REPO_URL> llm
cd llm

# --- Backend ---
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create backend/.env (see below), then:
alembic upgrade head
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# --- Frontend ---
cd ../frontend
npm install
npm run dev
```

---

## Environment Files (Local)

> Create these files before running the servers.

**backend/.env**
```
APP_ENV=local
SECRET_KEY=change_me_locally
ALLOW_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql+psycopg2://aletheia_user:aletheia_pass@localhost:5432/aletheia
MODEL_ASSIGNMENT_MODE=round_robin
ENABLE_GOOGLE_CLICK_LOGGING=true
# GEMINI_API_KEY=...
# OPENAI_API_KEY=...
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_GOOGLE_URL=https://www.google.com
NEXT_PUBLIC_SHOW_PERSONALITY=true
```

---

## Run Locally
- Keep both servers running:
  - **Backend**: `uvicorn main:app --reload --host 127.0.0.1 --port 8000`
  - **Frontend**: `npm run dev`
- If you change frontend origin/port, update `ALLOW_ORIGINS` in `backend/.env` and restart the backend.

---

## Render Deployment (Production)

> The steps below deploy **Managed PostgreSQL**, **Backend (FastAPI)**, and **Frontend (Next.js)** to **Render**.

### Managed PostgreSQL
1. In Render, **New → PostgreSQL**.
2. Name it (e.g., `aletheia-db`), pick region and plan.
3. After creation, note the **Internal Database URL** (preferred) and **External URL** (optional).

### Backend on Render (FastAPI)
1. **New → Web Service**, connect GitHub repo, set **Root Directory** to `backend`.
2. **Runtime:** Python  
   **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`  
   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables:**
   - `APP_ENV=production`
   - `SECRET_KEY=<generate a long random string>`
   - `ALLOW_ORIGINS=https://<frontend>.onrender.com,https://<custom-domain>`
   - `DATABASE_URL=<Render Internal DB URL>`
   - (Optional) `GEMINI_API_KEY`, `OPENAI_API_KEY`
   - `MODEL_ASSIGNMENT_MODE=round_robin`
   - `ENABLE_GOOGLE_CLICK_LOGGING=true`
4. **Run DB migrations** via Render **Shell**:
   ```bash
   cd /opt/render/project/src/backend
   alembic upgrade head
   ```
5. Verify API: `https://<backend>.onrender.com/docs`

### Frontend on Render (Next.js)
1. **New → Web Service** (SSR) or **Static Site** (with `next export`). For SSR, set **Root Directory** to `frontend`.
2. **Runtime:** Node 20  
   **Build Command:** `npm ci && npm run build`  
   **Start Command:** `npm start` (ensure `package.json` has `"start": "next start -p $PORT"`)
3. **Environment Variables:**
   - `NEXT_PUBLIC_API_BASE_URL=https://<backend>.onrender.com`
   - `NEXT_PUBLIC_GOOGLE_URL=https://www.google.com`
   - `NEXT_PUBLIC_SHOW_PERSONALITY=true`

### Custom Domains (Optional)
1. Settings → **Custom Domains** → add domain for each service.
2. Create the DNS records shown (typically CNAME).  
3. Update env vars accordingly:
   - Backend `ALLOW_ORIGINS` includes `https://<your-frontend-domain>`
   - Frontend `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`

### CI/CD & Branch Rules
- Enable **Auto-deploy** on `main` or specific branches.
- Use **Preview Environments** to stage PRs.

### Logs, Shell, Debugging
- Service → **Logs** (build/runtime).
- **Shell** for one-off commands (e.g., `alembic upgrade head`).
- Common issues: CORS not whitelisted, missing env vars, migration path.

### Security & Secrets
- Never commit `.env` files.
- Store secrets in Render **Environment**.
- Prefer the **Internal DB URL** and keep services in the same region.

### Post-Deployment Smoke Test
1. Visit frontend → go through signup → demographics → tasks → survey.
2. API docs at `/docs` respond 200.
3. Data writes visible in the managed Postgres.
4. Personality fixed per user; chat/survey/final answer logging works.
5. Google logo click logging works (if enabled).

---

## Env Var Matrix (Local vs Render)

| Variable | Local (backend/.env) | Render (Backend) |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `SECRET_KEY` | any non-empty string | long random secret |
| `ALLOW_ORIGINS` | `http://localhost:3000` | `https://<frontend>.onrender.com,https://<custom-domain>` |
| `DATABASE_URL` | `postgresql+psycopg2://aletheia_user:aletheia_pass@localhost:5432/aletheia` | Render Internal DB URL |
| `MODEL_ASSIGNMENT_MODE` | `round_robin` | `round_robin` |
| `ENABLE_GOOGLE_CLICK_LOGGING` | `true` | `true` |
| `GEMINI_API_KEY` / `OPENAI_API_KEY` | optional | if used |

| Variable | Local (frontend/.env.local) | Render (Frontend) |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000` | `https://<backend>.onrender.com` or custom domain |
| `NEXT_PUBLIC_GOOGLE_URL` | `https://www.google.com` | same |
| `NEXT_PUBLIC_SHOW_PERSONALITY` | `true` | `true` |

---

## Alembic Notes
Create new migration after editing SQLAlchemy models:
```bash
# from backend/ with venv active
alembic revision -m "describe your change" --autogenerate
alembic upgrade head
# downgrade example
alembic downgrade -1
```

---

## Troubleshooting
- **CORS errors:** Add the exact frontend origin to `ALLOW_ORIGINS`, restart backend.
- **`psycopg2` on Windows:** Use `psycopg2-binary` and ensure VC++ build tools installed.
- **Alembic path errors:** Run from `backend/` where `alembic.ini` lives.
- **Port conflicts:** Change ports and update envs accordingly:
  - Backend: `uvicorn ... --port 8001`
  - Frontend: `PORT=3001 npm run dev` (or `next dev -p 3001`)

---

## License / Attribution
- Internal research application — set your preferred license here.
- Maintainers: add your names and contact emails here.
