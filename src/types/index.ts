export type UserRole = "student" | "professor" | "admin";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export interface StudentProfile extends Profile {
  role: "student";
  rollNumber: string;
  enrollmentNumber?: string;
  department: string;
  program: string;
  batchId: string;
  batchName: string;
  section: string; // "A" | "B"
  semester: number;
}

export interface ProfessorProfile extends Profile {
  role: "professor";
  employeeCode: string;
  department: string;
  designation: string;
  room?: string;
  specialization?: string;
  assignedCourses?: string[];
}

export interface AdminProfile extends Profile {
  role: "admin";
  department: string;
}

export interface Batch {
  id: string;
  name: string; // e.g. "MSc SCB 2025–27"
  program: string; // e.g. "MSc Systems & Computational Biology"
  department: string;
  startYear: number;
  endYear: number;
  currentSemester: number;
  sections: string[]; // ["Section A", "Section B"]
  isActive: boolean;
  totalStudents: number;
}

export interface TimeTableSlot {
  id: string;
  day: string; // e.g. "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "11:30 AM"
  room: string; // e.g. "LH-204"
  sessionType?: "LECTURE" | "LAB" | "TUTORIAL" | "SEMINAR";
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  program: string;
  semester: number;
  credits: number;
  professorId: string;
  professorName: string;
  room: string;
  scheduleTime: string;
  scheduleDays: string[];
  timeTableSlots?: TimeTableSlot[];
  totalStudents: number;
  totalConductedSessions: number;
  availableBatches?: string[]; // Batch IDs
}

export interface AssessmentComponent {
  id: string;
  name: string; // e.g. "Mid-Sem Exam", "Continuous Quiz", "Assignment", "Class Attendance", "Viva-Voce"
  shortCode: string; // e.g. "MID", "QZ", "ASG", "ATT", "VIVA"
  maxMarks: number; // e.g. 10, 5, 5, 5, 5
  weight?: number;
  order: number;
  isAttendanceDerived?: boolean;
}

export interface AssessmentScheme {
  id: string;
  courseId: string;
  batchId: string;
  section: string;
  totalMaxMarks: number; // e.g. 30 or 40
  components: AssessmentComponent[];
  passingMarks?: number;
}

export type MarkStatus = "DRAFT" | "FINALIZED" | "PUBLISHED";

export interface StudentInternalMark {
  id: string;
  schemeId: string;
  courseId: string;
  courseCode: string;
  batchId: string;
  section: string;
  studentId: string;
  studentRollNumber: string;
  studentName: string;
  componentScores: Record<string, number | null>; // componentId -> score
  totalScore: number;
  percentage: number;
  status: MarkStatus;
  finalizedAt?: string;
  finalizedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
  remarks?: string;
}

export interface MarkAuditLog {
  id: string;
  studentId: string;
  studentRollNumber: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  batchId: string;
  section: string;
  componentName: string;
  oldScore: number | null;
  newScore: number;
  changedBy: string;
  changedByRole: string;
  reason: string;
  timestamp: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentRollNumber: string;
  studentName: string;
  status: AttendanceStatus;
  markedVia: "MANUAL" | "QR" | "CODE";
  markedAt: string;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  batchId: string;
  batchName: string;
  section: string;
  professorId: string;
  professorName: string;
  program: string;
  semester: number;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: "MANUAL" | "QR" | "CODE";
  status: "ACTIVE" | "LOCKED" | "ARCHIVED";
  qrToken?: string;
  attendanceCode?: string;
  expiresAt?: string;
  createdAt: string;
  lockedAt?: string;
  records: AttendanceRecord[];
}

export interface StudentCourseAttendance {
  courseId: string;
  courseCode: string;
  courseName: string;
  professorName: string;
  credits: number;
  conductedClasses: number;
  attendedClasses: number;
  absentClasses: number;
  lateClasses: number;
  percentage: number;
  status: "good" | "warning" | "critical";
  requiredClassesFor75: number;
  canBunkFor75: number;
}

export interface AuditLog {
  id: string;
  sessionId: string;
  courseName: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetStudentName?: string;
  targetStudentRoll?: string;
  oldValue?: string;
  newValue?: string;
  reason: string;
  timestamp: string;
}
