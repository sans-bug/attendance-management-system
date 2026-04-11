from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
import enum
import datetime
from .database import Base

# No RoleEnum for maximum flexibility per requirements

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # Dynamic roles like "admin", "teacher", "student", or anything else.

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    department = Column(String)
    year = Column(Integer)

    user = relationship("User", back_populates="student_profile")
    attendance_records = relationship("Attendance", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    subject = Column(String)

    user = relationship("User", back_populates="teacher_profile")
    classes = relationship("Class", back_populates="teacher")

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"))

    teacher = relationship("Teacher", back_populates="classes")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    subject = Column(String, index=True)
    date = Column(Date, default=datetime.date.today)
    status = Column(String) # "Present" or "Absent"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="attendance_records")
