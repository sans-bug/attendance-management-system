from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routes import auth_routes, attendance_routes, report_routes, user_routes, system_routes

app = FastAPI(
    title="Om Automatic Attendance API",
    description="A complete production-ready REST API for automatic attendance management.",
    version="1.0.0"
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"VALIDATION ERROR: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.on_event("startup")
def startup_event():
    # Create database tables on startup
    models.Base.metadata.create_all(bind=engine)

import os

# Allow CORS for frontend integration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", "http://localhost:5173")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_routes.router, prefix="/api")
app.include_router(attendance_routes.router, prefix="/api")
app.include_router(report_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/api")
app.include_router(system_routes.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Attendance Management API. Visit /docs for the API Reference."}
