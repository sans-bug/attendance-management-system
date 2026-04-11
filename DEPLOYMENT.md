# 🎓 Operational Curriculum: Going Live

Welcome to the professional phase of your project. This guide will teach you how to move your **Om Automatic Attendance System** from your local machine to the real internet.

---

## 🏗️ Phase 1: The Cloud Database
You've been using a local file (`attendance.db`). For the web, we need a shared database.

### 1. Set up a free Postgres DB
- Create a free account on **[Supabase](https://supabase.com/)** or **[Render](https://render.com/)**.
- Create a new project called "Om Attendance".
- **Copy your Connection String**: It will look like `postgresql://postgres:password@host:port/dbname`.

---

## 🚀 Phase 2: Deploying the Backend (API)
Your FastAPI backend needs a home.

### 1. Prep for Render.com
- Create a free account on **[Render.com](https://render.com/)**.
- Create a **New > Web Service**.
- Link your **GitHub Repository**.
- **Settings**:
  - **Environment**: `Python 3`
  - **Build Command**: `pip install -r backend/requirements.txt`
  - **Start Command**: `cd backend && gunicorn app.main:app -k uvicorn.workers.UvicornWorker`

### 2. Set environment variables on Render:
| KEY | VALUE |
|-----|-------|
| `JWT_SECRET` | (Something random and secure) |
| `DATABASE_URL` | (Paste your Postgres string here) |
| `FRONTEND_URL` | (Your live Vercel URL - come back here after Phase 3) |

---

## 🎨 Phase 3: Deploying the Frontend (UI)
Your React website needs to be served to users.

### 1. Prep for Vercel
- Create a free account on **[Vercel](https://vercel.com/)**.
- **Import** your project from GitHub.
- **Settings**:
  - **Root Directory**: `frontend`
  - **Framework Preset**: `Vite`

### 2. Set Environment Variables on Vercel:
| KEY | VALUE |
|-----|-------|
| `VITE_API_URL` | `https://your-render-url.onrender.com/api` |

---

## 📊 Phase 4: Verification
Once both are live:
1. Open your Vercel URL.
2. Go to the **Cloud Console**.
3. If the "Infrastructure Uplink" is green, your system is officially **Global**.

### 💡 Pro-Tip
Since we use SQLAlchemy, the system will **automatically create your tables** in the Cloud Database the very first time it starts up. You don't need to write any SQL!

---

> [!IMPORTANT]
> **Biometric Security**: Note that in a live web environment, browser security requires **HTTPS** for camera access. Fortunately, both Vercel and Render provide HTTPS by default!
