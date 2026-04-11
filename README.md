# Cloud-Based Automatic Attendance Management System

This is a production-ready, full-stack cloud-based Automatic Attendance Management System leveraging a modern tech stack (Python/FastAPI, PostgreSQL, React, Tailwind CSS).

## Architecture Diagram
```mermaid
graph TD;
    Client[Web Browser - React] -->|HTTPS REST API| API[FastAPI Backend Server]
    API <-->|SQLAlchemy ORM| DB[(PostgreSQL Database)]

    subgraph "Cloud Hosting"
      API --> Render(Render/AWS EC2)
      DB --> Supabase(Supabase/RDS)
    end
    subgraph "Frontend Hosting"
      Client --> Vercel(Vercel Web Host)
    end
```

## Cloud Computing Concepts Demonstrated
1. **Centralized Cloud Storage:** Relies on cloud-hosted PostgreSQL instances (e.g. Supabase/AWS RDS) for high-availability access.
2. **Scalability:** The backend uses FastAPI, an async server architecture which inherently scales efficiently horizontally for multi-user environments.
3. **Secure Data Handling:** Uses stateless JWTs over HTTPS, moving session scaling complexity explicitly to the client side.

## Local Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server (Defaults to SQLite for instant testing):
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will be available at http://localhost:8000*

### 2. Frontend Setup
1. Open another terminal and navigate to the `frontend` folder.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Deployment Guide (Step-by-Step)

### 1. Database Setup (Supabase / AWS RDS)
- Go to [Supabase](https://supabase.com/). Connect your GitHub account and create a new project.
- Select an appropriate region.
- Once created, go to Project Settings -> Database.
- Copy your `URI connection string` (it looks like `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`).

### 2. Backend Deployment (Render)
- Go to [Render.com](https://render.com) and create a "Web Service".
- Connect your GitHub repo.
- Configure:
  - **Build Command:** `pip install -r backend/requirements.txt`
  - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:** Set configuring:
  - `DATABASE_URL`: Add the `postgresql://` string from Supabase.
  - `SECRET_KEY`: Add a very long random string for JWT hashing.

### 3. Frontend Deployment (Vercel)
- Go to [Vercel](https://vercel.com) and link your GitHub Repo.
- Go to **Project Settings -> Root Directory** and select `frontend`.
- For environment variables, add:
  - `VITE_API_URL`: Add the publicly hoisted Render backend endpoint (e.g., `https://your-api.onrender.com/api`).
- Deploy!

## Usage and Testing
- When you first load the site, Register as an **Admin**, **Teacher**, or **Student**.
- Different roles have access to entirely different dashboards. Provide the specified dummy data during registration.
