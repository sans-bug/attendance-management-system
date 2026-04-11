from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import Integer, func
from typing import List
import csv
from io import StringIO

from .. import models, schemas, auth, database

router = APIRouter(tags=["Reports"])

@router.get("/reports", response_model=List[schemas.AttendanceReport])
def get_reports(
    subject: str = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["teacher", "admin"]))
):
    # Base query for all attendances
    query = db.query(
        models.Student.id.label("student_id"),
        models.User.name.label("student_name"),
        models.Attendance.subject,
        func.count(models.Attendance.id).label("total_classes"),
        func.sum(
            func.cast(models.Attendance.status == 'Present', Integer)
        ).label("attended_classes")
    ).join(models.User, models.Student.user_id == models.User.id)\
     .join(models.Attendance, models.Student.id == models.Attendance.student_id)\
     .group_by(models.Student.id, models.User.name, models.Attendance.subject)

    if subject:
        query = query.filter(models.Attendance.subject == subject)
        
    results = query.all()
    
    reports = []
    for res in results:
        perc = (res.attended_classes / res.total_classes * 100) if res.total_classes > 0 else 0
        reports.append(schemas.AttendanceReport(
            student_name=res.student_name,
            subject=res.subject,
            total_classes=res.total_classes,
            attended_classes=res.attended_classes,
            percentage=round(perc, 2)
        ))
        
    return reports

@router.get("/export/csv")
def export_csv(
    subject: str = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["teacher", "admin"]))
):
    reports = get_reports(subject, db, current_user)
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student Name", "Subject", "Total Classes", "Attended Classes", "Percentage"])
    
    for report in reports:
        writer.writerow([
            report.student_name,
            report.subject,
            report.total_classes,
            report.attended_classes,
            report.percentage
        ])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=attendance_report.csv"
    return response

# PDF generation goes here if desired using fpdf, similar logic to CSV
@router.get("/dashboard-stats")
def dashboard_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_role(["admin", "teacher"]))
):
    total_students = db.query(models.Student).count()
    total_teachers = db.query(models.Teacher).count()
    total_classes = db.query(models.Class).count()
    
    # Calculate overall attendance rate
    all_attendance = db.query(models.Attendance).all()
    total_records = len(all_attendance)
    present_records = sum(1 for a in all_attendance if a.status == "Present")
    
    overall_attendance_rate = (present_records / total_records * 100) if total_records > 0 else 0
    
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_classes": total_classes,
        "overall_attendance_rate": round(overall_attendance_rate, 2)
    }
