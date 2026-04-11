from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import models, schemas, auth, database

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    print(f">>> REGISTER START: Email={user.email}, Role={user.role}")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        print(">>> REGISTER ERROR: User already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    print(">>> Hashing password...")
    hashed_password = auth.get_password_hash(user.password)
    
    # Create the base user with normalized role
    role_norm = user.role.lower()
    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=role_norm
    )
    db.add(new_user)
    db.commit()
    print(">>> Base user committed to DB")
    db.refresh(new_user)
    
    # Depending on role string, create associated profile
    # Case-insensitive check for flexibility
    role_lower = user.role.lower()
    if role_lower == "student":
        if not user.department or user.year is None:
            db.delete(new_user)
            db.commit()
            raise HTTPException(status_code=400, detail="Department and Year required for Student")
        student = models.Student(user_id=new_user.id, department=user.department, year=user.year)
        db.add(student)
    elif role_lower == "teacher":
        if not user.subject:
            db.delete(new_user)
            db.commit()
            raise HTTPException(status_code=400, detail="Subject required for Teacher")
        teacher = models.Teacher(user_id=new_user.id, subject=user.subject)
        db.add(teacher)
        
    db.commit()
    print(f">>> REGISTER COMPLETE: User ID={new_user.id}")
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    print(f">>> LOGIN START: Email={form_data.username}")
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user
