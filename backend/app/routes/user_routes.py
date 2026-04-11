from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth, database

router = APIRouter(tags=["Users"])

@router.get("/users", response_model=List[schemas.UserOut])
def get_all_users(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["admin"]))
):
    users = db.query(models.User).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["admin"]))
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.put("/users/me", response_model=schemas.UserOut)
def update_user_me(
    user_data: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Update base user fields
    if user_data.name:
        current_user.name = user_data.name
    if user_data.email:
        current_user.email = user_data.email
        
    # Update related profile based on role
    if current_user.role == "student":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if student:
            if user_data.department:
                student.department = user_data.department
            if user_data.year is not None:
                student.year = user_data.year
                
    elif current_user.role == "teacher":
        teacher = db.query(models.Teacher).filter(models.Teacher.user_id == current_user.id).first()
        if teacher:
            if user_data.subject:
                teacher.subject = user_data.subject
                
    db.commit()
    db.refresh(current_user)
    return current_user
