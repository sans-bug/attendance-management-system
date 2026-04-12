from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
# Removed RoleEnum import

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str
    # Depending on role, we might need these
    department: Optional[str] = None
    year: Optional[int] = None
    subject: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    year: Optional[int] = None
    subject: Optional[str] = None

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

# Student Schemas
class StudentOut(BaseModel):
    id: int
    department: str
    year: int
    user: UserOut
    attendance_status: Optional[str] = None
    present_count: int = 0
    absent_count: int = 0
    excused_count: int = 0

    class Config:
        orm_mode = True

# Teacher Schemas
class TeacherOut(BaseModel):
    id: int
    subject: str
    user: UserOut

    class Config:
        orm_mode = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Attendance Schemas
class AttendanceBase(BaseModel):
    student_id: int
    subject: str
    status: str

class AttendanceCreate(AttendanceBase):
    date: Optional[date] = None

class AttendanceOut(AttendanceBase):
    id: int
    date: date
    timestamp: datetime

    class Config:
        orm_mode = True

class AttendanceReport(BaseModel):
    student_name: str
    subject: str
    total_classes: int
    attended_classes: int
    percentage: float

# Class Schemas
class ClassBase(BaseModel):
    subject: str

class ClassCreate(ClassBase):
    pass

class ClassOut(ClassBase):
    id: int
    teacher_id: int

    class Config:
        orm_mode = True

# Enrollment Schemas
class EnrollmentBase(BaseModel):
    student_id: int
    class_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentOut(EnrollmentBase):
    id: int
    enrollment_date: datetime

    class Config:
        orm_mode = True
