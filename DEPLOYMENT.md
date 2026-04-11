# 🎓 Operational Curriculum: Going Live (100% FREE)

Welcome to the professional phase of your project. This guide will teach you how to move your **Om Automatic Attendance System** from your local machine to the real internet using a **"Zero-Cost" Professional Stack**.

---

## 🏗️ Phase 1: The Cloud Database (Supabase)
Supabase is the best free choice for databases. It stays free forever.

### 1. Set up your Database
- Create a free account on **[Supabase.com](https://supabase.com/)**.
- Create a new project called "Om Attendance".
- **Get your Connection String**:
  - Go to **Project Settings > Database**.
  - Copy the **Connection String** (use the Transaction Mode URL if possible).
  - It will look like: `postgresql://postgres.[ID]:[PASSWORD]@[HOST]:5432/postgres`
  - **IMPORTANT**: Replace `[PASSWORD]` with the password you created when you made the project.

---

## 🚀 Phase 2: Deploying the Backend (API)
We will use **Render** only for the logic (the Python code). This part is free.

### 1. Prep for Render.com
- Create a free account on **[Render.com](https://render.com/)**.
- Create a **New > Web Service**.
- Link your **GitHub Repository** (`sans-bug/attendance-management-system`).
- **Settings**:
  - **Root Directory**: `backend` (Make sure Render points here!)
  - **Environment**: `Python 3`
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `gunicorn app.main:app -k uvicorn.workers.UvicornWorker`
  - **Instance Type**: Select **Free**.

### 2. Set environment variables on Render:
| KEY | VALUE |
|-----|-------|
| `JWT_SECRET` | (Any random long string) |
| `DATABASE_URL` | (Paste your Supabase string here) |
| `FRONTEND_URL` | (Your live Vercel URL - come back here after Phase 3) |

---

## 🎨 Phase 3: Deploying the Frontend (UI)
Vercel hosts your React site for free with incredible speed.

### 1. Prep for Vercel
- Create a free account on **[Vercel.com](https://vercel.com/)**.
- **Import** your GitHub project.
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
