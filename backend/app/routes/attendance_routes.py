from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from .. import models, schemas, auth, database

router = APIRouter(tags=["Attendance"])

@router.post("/classes", response_model=schemas.ClassOut)
def create_class(
    class_data: schemas.ClassCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["teacher", "admin"]))
):
    teacher = db.query(models.Teacher).filter(models.Teacher.user_id == current_user.id).first()
    if not teacher and current_user.role != "admin":
        raise HTTPException(status_code=400, detail="Teacher profile not found")
    
    # Allow admin to create classes later, but primarily teacher feature
    teacher_id = teacher.id if teacher else 1 # default if admin and no profile
    
    new_class = models.Class(subject=class_data.subject, teacher_id=teacher_id)
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.post("/mark-attendance", response_model=List[schemas.AttendanceOut])
def mark_attendance(
    attendance_data: List[schemas.AttendanceCreate],
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["teacher", "admin"]))
):
    records = []
    for data in attendance_data:
        record_date = data.date if data.date else date.today()
        # Check if record already exists
        existing = db.query(models.Attendance).filter(
            models.Attendance.student_id == data.student_id,
            models.Attendance.subject == data.subject,
            models.Attendance.date == record_date
        ).first()

        if existing:
            existing.status = data.status
            records.append(existing)
        else:
            new_record = models.Attendance(
                student_id=data.student_id,
                subject=data.subject,
                date=record_date,
                status=data.status
            )
            db.add(new_record)
            records.append(new_record)
            
    db.commit()
    
    for record in records:
        db.refresh(record)
        
    return records

@router.get("/get-attendance", response_model=List[schemas.AttendanceOut])
def get_attendance(
    student_id: int = None,
    subject: str = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.Attendance)

    if current_user.role == "student":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        query = query.filter(models.Attendance.student_id == student.id)
    elif student_id:
        query = query.filter(models.Attendance.student_id == student_id)
        
    if subject:
        query = query.filter(models.Attendance.subject == subject)
        
    return query.all()

@router.get("/students", response_model=List[schemas.StudentOut])
def get_students(
    department: str = None,
    year: int = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["teacher", "admin"]))
):
    query = db.query(models.Student)
    if department:
        query = query.filter(models.Student.department == department)
    if year:
        query = query.filter(models.Student.year == year)
    return query.all()

@router.get("/stats")
def get_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["admin", "teacher"]))
):
    total_students = db.query(models.Student).count()
    
    # Simple daily stats for today
    today = date.today()
    total_attendance = db.query(models.Attendance).filter(models.Attendance.date == today).count()
    present_count = db.query(models.Attendance).filter(
        models.Attendance.date == today, 
        models.Attendance.status == "Present"
    ).count()
    
    present_pct = (present_count / total_attendance * 100) if total_attendance > 0 else 0
    
    return {
        "total_students": total_students,
        "present_pct": round(present_pct, 1),
        "absent_pct": round(100 - present_pct, 1) if total_attendance > 0 else 0,
        "status": "OPTIMAL" if present_pct > 75 else "ATTENTION REQUIRED"
    }
