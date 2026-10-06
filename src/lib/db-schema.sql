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
    phone TEXT,
    semester INTEGER DEFAULT 2,
    program TEXT,
    batch_name TEXT,
    enrollment_no TEXT,
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
    phone TEXT,
    room TEXT,
    specialization TEXT,
    assigned_courses TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    program TEXT,
    semester INTEGER DEFAULT 2,
    credits INTEGER DEFAULT 3,
    professor_id TEXT REFERENCES professors(id),
    professor_name TEXT,
    room TEXT,
    schedule_time TEXT,
    schedule_days TEXT,
    timetable_slots TEXT,
    total_students INTEGER DEFAULT 0,
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
    programs TEXT,
    total_faculty INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Admin Profile Table
CREATE TABLE IF NOT EXISTS admin_profile (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT,
    phone TEXT,
    office_room TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'admin',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    course_name TEXT,
    actor_id TEXT,
    actor_name TEXT,
    actor_role TEXT,
    action TEXT,
    target_student_name TEXT,
    target_student_roll TEXT,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Authentication Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    identifier TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL,
    full_name TEXT NOT NULL,
    reference_id TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Active Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
