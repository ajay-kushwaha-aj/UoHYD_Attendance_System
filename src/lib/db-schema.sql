-- ==========================================================
-- UoHYD Attendance System - Database Schema (SQLite / Turso)
-- ==========================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reg_no TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    batch_id TEXT NOT NULL,
    section TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Professors Table
CREATE TABLE IF NOT EXISTS professors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    faculty_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    designation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    credits INTEGER DEFAULT 3,
    professor_id TEXT REFERENCES professors(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Attendance Sessions Table
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id),
    professor_id TEXT NOT NULL REFERENCES professors(id),
    batch_id TEXT NOT NULL,
    section TEXT NOT NULL,
    session_date DATE NOT NULL,
    slot_start TEXT NOT NULL,
    slot_end TEXT NOT NULL,
    topic TEXT,
    qr_code_hash TEXT,
    qr_expiry DATETIME,
    status TEXT DEFAULT 'CLOSED', -- 'ACTIVE' or 'CLOSED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id),
    status TEXT NOT NULL, -- 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_method TEXT DEFAULT 'QR_SCAN', -- 'QR_SCAN', 'MANUAL_OVERRIDE'
    UNIQUE(session_id, student_id)
);

-- 6. Student Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    course_id TEXT NOT NULL REFERENCES courses(id),
    session_id TEXT REFERENCES attendance_sessions(id),
    reason TEXT NOT NULL,
    proof_url TEXT,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    resolved_by TEXT REFERENCES professors(id),
    resolution_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    school TEXT NOT NULL,
    hod_name TEXT NOT NULL,
    hod_email TEXT,
    office_location TEXT,
    contact_phone TEXT,
    established_year INTEGER,
    total_faculty INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

