"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  UserRole,
  StudentProfile,
  ProfessorProfile,
  AdminProfile,
  Batch,
  Course,
  TimeTableSlot,
  AssessmentScheme,
  AssessmentComponent,
  StudentInternalMark,
  MarkStatus,
  MarkAuditLog,
  AttendanceSession,
  AttendanceRecord,
  AuditLog,
  AttendanceStatus,
} from "@/types";
import {
  MOCK_BATCHES,
  MOCK_STUDENTS,
  MOCK_PROFESSOR,
  MOCK_PROFESSORS,
  MOCK_ADMIN,
  MOCK_COURSES,
  MOCK_ASSESSMENT_SCHEMES,
  MOCK_INTERNAL_MARKS,
  MOCK_MARK_AUDIT_LOGS,
  MOCK_SESSIONS,
  MOCK_AUDIT_LOGS,
} from "./mock-data";

const STORAGE_KEYS = {
  STUDENTS: "uohyd_students_v1",
  PROFESSORS: "uohyd_professors_v1",
  COURSES: "uohyd_courses_v1",
  SESSIONS: "uohyd_attendance_sessions_v1",
  SCHEMES: "uohyd_assessment_schemes_v1",
  MARKS: "uohyd_internal_marks_v1",
  AUDIT_LOGS: "uohyd_attendance_audit_logs_v1",
  MARK_AUDIT_LOGS: "uohyd_mark_audit_logs_v1",
  SELECTED_BATCH: "uohyd_selected_batch_id",
  SELECTED_SECTION: "uohyd_selected_section",
};

interface AttendanceContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentStudent: StudentProfile;
  currentProfessor: ProfessorProfile;
  currentAdmin: AdminProfile;
  batches: Batch[];
  students: StudentProfile[];
  professors: ProfessorProfile[];
  courses: Course[];
  selectedBatchId: string;
  selectedSection: string;
  setSelectedBatchId: (id: string) => void;
  setSelectedSection: (sec: string) => void;
  sessions: AttendanceSession[];
  activeSession: AttendanceSession | null;
  auditLogs: AuditLog[];
  assessmentSchemes: AssessmentScheme[];
  internalMarks: StudentInternalMark[];
  markAuditLogs: MarkAuditLog[];
  // Actions
  enrollStudent: (studentData: Omit<StudentProfile, "id">) => StudentProfile;
  addFacultyMember: (facultyData: Omit<ProfessorProfile, "id">) => ProfessorProfile;
  createCourse: (courseData: Omit<Course, "id" | "totalConductedSessions" | "totalStudents">) => Course;
  updateCourseSchedule: (
    courseId: string,
    scheduleData: {
      scheduleTime: string;
      scheduleDays: string[];
      room: string;
      timeTableSlots: TimeTableSlot[];
    }
  ) => void;
  resetToDefaultData: () => void;
  getScopedStudents: (batchId?: string, section?: string) => StudentProfile[];
  getCourseAssessmentScheme: (courseId: string, batchId?: string, section?: string) => AssessmentScheme;
  getCourseMarks: (courseId: string, batchId?: string, section?: string) => StudentInternalMark[];
  updateAssessmentScheme: (scheme: AssessmentScheme) => void;
  updateStudentMarkScore: (
    markId: string,
    componentId: string,
    score: number | null,
    reason?: string
  ) => void;
  saveDraftMarks: (courseId: string, batchId: string, section: string, marks: StudentInternalMark[]) => void;
  finalizeMarks: (courseId: string, batchId: string, section: string) => void;
  publishMarks: (courseId: string, batchId: string, section: string) => void;
  getMarksAnalytics: (courseId: string, batchId?: string, section?: string) => {
    average: number;
    highest: number;
    lowest: number;
    totalStudents: number;
    studentsBelowPassing: number;
    passingThreshold: number;
    maxMarks: number;
    status: MarkStatus;
    distribution: Array<{ range: string; count: number }>;
  };
  startNewSession: (
    courseId: string,
    type: "MANUAL" | "QR" | "CODE",
    batchId?: string,
    section?: string
  ) => AttendanceSession;
  updateStudentRecord: (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    reason?: string
  ) => void;
  markAllPresent: (sessionId: string) => void;
  clearAttendance: (sessionId: string) => void;
  lockSession: (sessionId: string, reason?: string) => void;
  reopenSession: (sessionId: string, reason: string) => void;
  submitStudentAttendance: (
    studentId: string,
    tokenOrCode: string
  ) => { success: boolean; message: string; courseName?: string };
  regenerateQrToken: (sessionId: string) => string;
  regenerateCode: (sessionId: string) => string;
  getStudentAttendanceStats: (studentId: string) => {
    totalConducted: number;
    totalAttended: number;
    overallPercentage: number;
    status: "good" | "warning" | "critical";
    courseStats: Array<{
      course: Course;
      conducted: number;
      attended: number;
      absent: number;
      late: number;
      percentage: number;
      status: "good" | "warning" | "critical";
      classesNeededFor75: number;
      canBunkFor75: number;
    }>;
  };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("professor");
  const [batches] = useState<Batch[]>(MOCK_BATCHES);

  // Mutable entities persisted to LocalStorage
  const [students, setStudents] = useState<StudentProfile[]>(MOCK_STUDENTS);
  const [professors, setProfessors] = useState<ProfessorProfile[]>(MOCK_PROFESSORS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  const [selectedBatchId, setSelectedBatchIdState] = useState<string>("batch-2025-27");
  const [selectedSection, setSelectedSectionState] = useState<string>("A");

  const [sessions, setSessions] = useState<AttendanceSession[]>(MOCK_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [assessmentSchemes, setAssessmentSchemes] = useState<AssessmentScheme[]>(MOCK_ASSESSMENT_SCHEMES);
  const [internalMarks, setInternalMarks] = useState<StudentInternalMark[]>(MOCK_INTERNAL_MARKS);
  const [markAuditLogs, setMarkAuditLogs] = useState<MarkAuditLog[]>(MOCK_MARK_AUDIT_LOGS);

  const isHydrated = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudents) setStudents(JSON.parse(storedStudents));

      const storedProfessors = localStorage.getItem(STORAGE_KEYS.PROFESSORS);
      if (storedProfessors) setProfessors(JSON.parse(storedProfessors));

      const storedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (storedCourses) setCourses(JSON.parse(storedCourses));

      const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (storedSessions) setSessions(JSON.parse(storedSessions));

      const storedSchemes = localStorage.getItem(STORAGE_KEYS.SCHEMES);
      if (storedSchemes) setAssessmentSchemes(JSON.parse(storedSchemes));

      const storedMarks = localStorage.getItem(STORAGE_KEYS.MARKS);
      if (storedMarks) setInternalMarks(JSON.parse(storedMarks));

      const storedAuditLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (storedAuditLogs) setAuditLogs(JSON.parse(storedAuditLogs));

      const storedMarkAuditLogs = localStorage.getItem(STORAGE_KEYS.MARK_AUDIT_LOGS);
      if (storedMarkAuditLogs) setMarkAuditLogs(JSON.parse(storedMarkAuditLogs));

      const storedBatchId = localStorage.getItem(STORAGE_KEYS.SELECTED_BATCH);
      if (storedBatchId) setSelectedBatchIdState(storedBatchId);

      const storedSection = localStorage.getItem(STORAGE_KEYS.SELECTED_SECTION);
      if (storedSection) setSelectedSectionState(storedSection);
    } catch (e) {
      console.warn("Could not load stored data from localStorage", e);
    } finally {
      isHydrated.current = true;
    }
  }, []);

  // Sync state mutations to localStorage
  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
    } catch (e) {}
  }, [professors]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(assessmentSchemes));
    } catch (e) {}
  }, [assessmentSchemes]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(internalMarks));
    } catch (e) {}
  }, [internalMarks]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MARK_AUDIT_LOGS, JSON.stringify(markAuditLogs));
    } catch (e) {}
  }, [markAuditLogs]);

  const setSelectedBatchId = (id: string) => {
    setSelectedBatchIdState(id);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_BATCH, id);
    } catch (e) {}
  };

  const setSelectedSection = (sec: string) => {
    setSelectedSectionState(sec);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SECTION, sec);
    } catch (e) {}
  };

  // Action: Enroll New Student
  const enrollStudent = (studentData: Omit<StudentProfile, "id">): StudentProfile => {
    const newStudent: StudentProfile = {
      ...studentData,
      id: `std-${Date.now()}`,
      role: "student",
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Append to audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      sessionId: "REGISTRY-ENROLL",
      courseName: studentData.program,
      actorId: currentAdmin.id,
      actorName: currentAdmin.fullName,
      actorRole: currentRole,
      action: "STATUS_OVERRIDE",
      targetStudentName: newStudent.fullName,
      targetStudentRoll: newStudent.rollNumber,
      oldValue: "UNENROLLED",
      newValue: "ACTIVE",
      reason: `Enrolled in ${studentData.batchName} (${studentData.section})`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newStudent;
  };

  // Action: Add Faculty Member
  const addFacultyMember = (facultyData: Omit<ProfessorProfile, "id">): ProfessorProfile => {
    const newFaculty: ProfessorProfile = {
      ...facultyData,
      id: `prof-${Date.now()}`,
      role: "professor",
    };

    setProfessors((prev) => [...prev, newFaculty]);
    return newFaculty;
  };

  // Action: Create New Course
  const createCourse = (courseData: Omit<Course, "id" | "totalConductedSessions" | "totalStudents">): Course => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${courseData.code.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
      totalConductedSessions: 0,
      totalStudents: 8,
      availableBatches: [selectedBatchId],
    };

    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  };

  // Action: Update Course Schedule & Timetable
  const updateCourseSchedule = (
    courseId: string,
    scheduleData: {
      scheduleTime: string;
      scheduleDays: string[];
      room: string;
      timeTableSlots: TimeTableSlot[];
    }
  ) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          scheduleTime: scheduleData.scheduleTime,
          scheduleDays: scheduleData.scheduleDays,
          room: scheduleData.room,
          timeTableSlots: scheduleData.timeTableSlots,
        };
      })
    );
  };

  // Reset to initial defaults
  const resetToDefaultData = () => {
    setStudents(MOCK_STUDENTS);
    setProfessors(MOCK_PROFESSORS);
    setCourses(MOCK_COURSES);
    setSessions(MOCK_SESSIONS);
    setAssessmentSchemes(MOCK_ASSESSMENT_SCHEMES);
    setInternalMarks(MOCK_INTERNAL_MARKS);
    setAuditLogs(MOCK_AUDIT_LOGS);
    setMarkAuditLogs(MOCK_MARK_AUDIT_LOGS);
    setSelectedBatchIdState("batch-2025-27");
    setSelectedSectionState("A");

    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(MOCK_PROFESSORS));
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(MOCK_COURSES));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(MOCK_SESSIONS));
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(MOCK_ASSESSMENT_SCHEMES));
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(MOCK_INTERNAL_MARKS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(MOCK_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.MARK_AUDIT_LOGS, JSON.stringify(MOCK_MARK_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.SELECTED_BATCH, "batch-2025-27");
      localStorage.setItem(STORAGE_KEYS.SELECTED_SECTION, "A");
    } catch (e) {}
  };

  const currentStudent = students[0] || MOCK_STUDENTS[0];
  const currentProfessor = professors[0] || MOCK_PROFESSOR;
  const currentAdmin = MOCK_ADMIN;

  const activeSession = sessions.find((s) => s.status === "ACTIVE") || sessions[0] || null;

  // Filter students strictly by batch and section using dynamic students state
  const getScopedStudents = (bId = selectedBatchId, sec = selectedSection): StudentProfile[] => {
    return students.filter((std) => {
      const matchBatch = std.batchId === bId;
      const matchSection = sec === "ALL" || !sec || std.section === sec;
      return matchBatch && matchSection;
    });
  };

  // Get or lazily create an Assessment Scheme for Course + Batch + Section
  const getCourseAssessmentScheme = (courseId: string, bId = selectedBatchId, sec = selectedSection): AssessmentScheme => {
    const existing = assessmentSchemes.find(
      (s) => s.courseId === courseId && s.batchId === bId && s.section === sec
    );
    if (existing) return existing;

    const defaultScheme: AssessmentScheme = {
      id: `scheme-${courseId}-${bId}-${sec}`,
      courseId,
      batchId: bId,
      section: sec,
      totalMaxMarks: 30,
      passingMarks: 12,
      components: [
        { id: `comp-mid-${Date.now()}`, name: "Mid-Sem Exam", shortCode: "MID", maxMarks: 10, order: 1 },
        { id: `comp-asg-${Date.now()}`, name: "Assignment", shortCode: "ASG", maxMarks: 5, order: 2 },
        { id: `comp-qiz-${Date.now()}`, name: "Continuous Quiz", shortCode: "QZ", maxMarks: 5, order: 3 },
        { id: `comp-att-${Date.now()}`, name: "Class Attendance", shortCode: "ATT", maxMarks: 5, order: 4, isAttendanceDerived: true },
        { id: `comp-vva-${Date.now()}`, name: "Viva-Voce", shortCode: "VIVA", maxMarks: 5, order: 5 },
      ],
    };
    return defaultScheme;
  };

  // Get or lazily populate Student Internal Marks for Course + Batch + Section
  const getCourseMarks = (courseId: string, bId = selectedBatchId, sec = selectedSection): StudentInternalMark[] => {
    const existing = internalMarks.filter(
      (m) => m.courseId === courseId && m.batchId === bId && m.section === sec
    );
    if (existing.length > 0) return existing;

    const scopedStudents = getScopedStudents(bId, sec);
    const scheme = getCourseAssessmentScheme(courseId, bId, sec);
    const course = courses.find((c) => c.id === courseId) || courses[0];

    const generated: StudentInternalMark[] = scopedStudents.map((std, idx) => {
      const componentScores: Record<string, number | null> = {};
      let total = 0;
      scheme.components.forEach((comp) => {
        const val = Math.max(0, comp.maxMarks - (idx % 3));
        componentScores[comp.id] = val;
        total += val;
      });

      return {
        id: `mark-${courseId}-${bId}-${sec}-${std.id}`,
        schemeId: scheme.id,
        courseId,
        courseCode: course.code,
        batchId: bId,
        section: sec,
        studentId: std.id,
        studentRollNumber: std.rollNumber,
        studentName: std.fullName,
        componentScores,
        totalScore: total,
        percentage: parseFloat(((total / scheme.totalMaxMarks) * 100).toFixed(1)),
        status: "DRAFT",
      };
    });

    return generated;
  };

  // Update Assessment Scheme
  const updateAssessmentScheme = (newScheme: AssessmentScheme) => {
    setAssessmentSchemes((prev) => {
      const idx = prev.findIndex((s) => s.id === newScheme.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newScheme;
        return next;
      }
      return [...prev, newScheme];
    });
  };

  // Update a single mark score with validation and audit logging
  const updateStudentMarkScore = (
    markId: string,
    componentId: string,
    score: number | null,
    reason?: string
  ) => {
    setInternalMarks((prev) => {
      return prev.map((item) => {
        if (item.id !== markId) return item;

        const scheme = assessmentSchemes.find((s) => s.id === item.schemeId) || getCourseAssessmentScheme(item.courseId, item.batchId, item.section);
        const comp = scheme.components.find((c) => c.id === componentId);
        const oldScore = item.componentScores[componentId] ?? null;

        const updatedScores = {
          ...item.componentScores,
          [componentId]: score,
        };

        let total = 0;
        Object.values(updatedScores).forEach((v) => {
          if (typeof v === "number") total += v;
        });

        const pct = scheme.totalMaxMarks > 0 ? parseFloat(((total / scheme.totalMaxMarks) * 100).toFixed(1)) : 0;

        if ((item.status === "FINALIZED" || item.status === "PUBLISHED") && reason) {
          const newAudit: MarkAuditLog = {
            id: `m-audit-${Date.now()}`,
            studentId: item.studentId,
            studentRollNumber: item.studentRollNumber,
            studentName: item.studentName,
            courseId: item.courseId,
            courseCode: item.courseCode,
            batchId: item.batchId,
            section: item.section,
            componentName: comp?.name || "Assessment Component",
            oldScore,
            newScore: score ?? 0,
            changedBy: currentProfessor.fullName,
            changedByRole: currentRole,
            reason,
            timestamp: new Date().toISOString(),
          };
          setMarkAuditLogs((currLogs) => [newAudit, ...currLogs]);
        }

        return {
          ...item,
          componentScores: updatedScores,
          totalScore: total,
          percentage: pct,
        };
      });
    });
  };

  // Save draft marks
  const saveDraftMarks = (courseId: string, bId: string, sec: string, marksToSave: StudentInternalMark[]) => {
    setInternalMarks((prev) => {
      const filtered = prev.filter(
        (m) => !(m.courseId === courseId && m.batchId === bId && m.section === sec)
      );
      const updatedMarks = marksToSave.map((m) => ({ ...m, status: "DRAFT" as MarkStatus }));
      return [...filtered, ...updatedMarks];
    });
  };

  // Finalize marks
  const finalizeMarks = (courseId: string, bId: string, sec: string) => {
    setInternalMarks((prev) =>
      prev.map((m) => {
        if (m.courseId === courseId && m.batchId === bId && m.section === sec) {
          return {
            ...m,
            status: "FINALIZED",
            finalizedAt: new Date().toISOString(),
            finalizedBy: currentProfessor.fullName,
          };
        }
        return m;
      })
    );
  };

  // Publish marks
  const publishMarks = (courseId: string, bId: string, sec: string) => {
    setInternalMarks((prev) =>
      prev.map((m) => {
        if (m.courseId === courseId && m.batchId === bId && m.section === sec) {
          return {
            ...m,
            status: "PUBLISHED",
            publishedAt: new Date().toISOString(),
            publishedBy: currentProfessor.fullName,
          };
        }
        return m;
      })
    );
  };

  // Marks Analytics
  const getMarksAnalytics = (courseId: string, bId = selectedBatchId, sec = selectedSection) => {
    const marks = getCourseMarks(courseId, bId, sec);
    const scheme = getCourseAssessmentScheme(courseId, bId, sec);
    const maxMarks = scheme.totalMaxMarks || 30;
    const passingThreshold = scheme.passingMarks || 12;

    if (marks.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        totalStudents: 0,
        studentsBelowPassing: 0,
        passingThreshold,
        maxMarks,
        status: "DRAFT" as MarkStatus,
        distribution: [],
      };
    }

    const scores = marks.map((m) => m.totalScore);
    const totalSum = scores.reduce((a, b) => a + b, 0);
    const average = parseFloat((totalSum / marks.length).toFixed(1));
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const studentsBelowPassing = marks.filter((m) => m.totalScore < passingThreshold).length;
    const status = marks[0]?.status || "DRAFT";

    const b1 = marks.filter((m) => m.percentage >= 90).length;
    const b2 = marks.filter((m) => m.percentage >= 75 && m.percentage < 90).length;
    const b3 = marks.filter((m) => m.percentage >= 60 && m.percentage < 75).length;
    const b4 = marks.filter((m) => m.percentage < 60).length;

    return {
      average,
      highest,
      lowest,
      totalStudents: marks.length,
      studentsBelowPassing,
      passingThreshold,
      maxMarks,
      status,
      distribution: [
        { range: "≥ 90% (Distinction)", count: b1 },
        { range: "75% – 89% (Good)", count: b2 },
        { range: "60% – 74% (Average)", count: b3 },
        { range: "< 60% (At Risk)", count: b4 },
      ],
    };
  };

  // Start new session
  const startNewSession = (
    courseId: string,
    type: "MANUAL" | "QR" | "CODE",
    bId = selectedBatchId,
    sec = selectedSection
  ): AttendanceSession => {
    const course = courses.find((c) => c.id === courseId) || courses[0];
    const batch = batches.find((b) => b.id === bId) || batches[0];
    const scopedStudents = getScopedStudents(bId, sec);
    const newSessionId = `sess-${Date.now()}`;
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const qrToken = `uohyd-${course.code.toLowerCase()}-${Date.now()}`;

    const defaultRecords: AttendanceRecord[] = scopedStudents.map((std) => ({
      id: `rec-${newSessionId}-${std.id}`,
      sessionId: newSessionId,
      studentId: std.id,
      studentRollNumber: std.rollNumber,
      studentName: std.fullName,
      status: "ABSENT",
      markedVia: type,
      markedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));

    const newSession: AttendanceSession = {
      id: newSessionId,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      batchId: batch.id,
      batchName: batch.name,
      section: sec,
      professorId: currentProfessor.id,
      professorName: currentProfessor.fullName,
      program: course.program,
      semester: course.semester,
      room: course.room,
      date: new Date().toISOString().split("T")[0],
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: new Date(Date.now() + 90 * 60 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sessionType: type,
      status: "ACTIVE",
      qrToken,
      attendanceCode: code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      records: defaultRecords,
    };

    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  // Update student attendance record
  const updateStudentRecord = (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    reason?: string
  ) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;

        const updatedRecords = session.records.map((rec) => {
          if (rec.studentId !== studentId) return rec;

          if (session.status === "LOCKED" && reason) {
            const newAudit: AuditLog = {
              id: `audit-${Date.now()}`,
              sessionId: session.id,
              courseName: session.courseName,
              actorId: currentProfessor.id,
              actorName: currentProfessor.fullName,
              actorRole: currentRole,
              action: "STATUS_OVERRIDE",
              targetStudentName: rec.studentName,
              targetStudentRoll: rec.studentRollNumber,
              oldValue: rec.status,
              newValue: status,
              reason,
              timestamp: new Date().toISOString(),
            };
            setAuditLogs((currLogs) => [newAudit, ...currLogs]);
          }

          return {
            ...rec,
            status,
            markedVia: "MANUAL" as const,
            markedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            remarks: reason || rec.remarks,
          };
        });

        return {
          ...session,
          records: updatedRecords,
        };
      })
    );
  };

  const markAllPresent = (sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          records: session.records.map((r) => ({
            ...r,
            status: "PRESENT",
            markedVia: "MANUAL",
            markedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        };
      })
    );
  };

  const clearAttendance = (sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          records: session.records.map((r) => ({
            ...r,
            status: "ABSENT",
            markedVia: "MANUAL",
            markedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        };
      })
    );
  };

  const lockSession = (sessionId: string, reason = "Attendance session completed & locked by instructor.") => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          status: "LOCKED",
          lockedAt: new Date().toISOString(),
        };
      })
    );

    const targetSession = sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        sessionId: targetSession.id,
        courseName: targetSession.courseName,
        actorId: currentProfessor.id,
        actorName: currentProfessor.fullName,
        actorRole: currentRole,
        action: "SESSION_LOCK",
        reason,
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const reopenSession = (sessionId: string, reason: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          status: "ACTIVE",
          lockedAt: undefined,
        };
      })
    );

    const targetSession = sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        sessionId: targetSession.id,
        courseName: targetSession.courseName,
        actorId: currentProfessor.id,
        actorName: currentProfessor.fullName,
        actorRole: currentRole,
        action: "SESSION_REOPEN",
        reason,
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const submitStudentAttendance = (studentId: string, tokenOrCode: string) => {
    const active = sessions.find((s) => s.status === "ACTIVE");
    if (!active) {
      return { success: false, message: "No active lecture session found." };
    }

    const cleanInput = tokenOrCode.trim().toUpperCase();
    const isQrMatch = active.qrToken === tokenOrCode.trim();
    const isCodeMatch = active.attendanceCode?.toUpperCase() === cleanInput;

    if (!isQrMatch && !isCodeMatch) {
      return { success: false, message: "Invalid QR code or 5-digit verification code." };
    }

    if (active.expiresAt && new Date(active.expiresAt).getTime() < Date.now()) {
      return { success: false, message: "Attendance window has expired for this session." };
    }

    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== active.id) return session;
        return {
          ...session,
          records: session.records.map((r) => {
            if (r.studentId !== studentId) return r;
            return {
              ...r,
              status: "PRESENT",
              markedVia: isQrMatch ? "QR" : "CODE",
              markedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          }),
        };
      })
    );

    return {
      success: true,
      message: `Verified! Marked PRESENT for ${active.courseCode} in ${active.room}.`,
      courseName: active.courseName,
    };
  };

  const regenerateQrToken = (sessionId: string) => {
    const newToken = `uohyd-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    setSessions((prevSessions) =>
      prevSessions.map((s) => (s.id === sessionId ? { ...s, qrToken: newToken } : s))
    );
    return newToken;
  };

  const regenerateCode = (sessionId: string) => {
    const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSessions((prevSessions) =>
      prevSessions.map((s) => (s.id === sessionId ? { ...s, attendanceCode: newCode } : s))
    );
    return newCode;
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const courseStats = courses.map((course, idx) => {
      const conducted = course.totalConductedSessions;
      const attended = idx === 0 ? 24 : idx === 1 ? 23 : idx === 2 ? 21 : 17;
      const absent = Math.max(0, conducted - attended);
      const late = idx === 0 ? 1 : 0;
      const percentage = conducted > 0 ? parseFloat(((attended / conducted) * 100).toFixed(1)) : 100;

      const requiredClassesFor75 = Math.max(
        0,
        Math.ceil((0.75 * conducted - attended) / 0.25)
      );

      const canBunkFor75 = Math.max(0, Math.floor((attended - 0.75 * conducted) / 0.75));

      let status: "good" | "warning" | "critical" = "good";
      if (percentage < 60) status = "critical";
      else if (percentage < 75) status = "warning";

      return {
        course,
        conducted,
        attended,
        absent,
        late,
        percentage,
        status,
        classesNeededFor75: requiredClassesFor75,
        canBunkFor75,
      };
    });

    const totalConducted = courseStats.reduce((acc, c) => acc + c.conducted, 0);
    const totalAttended = courseStats.reduce((acc, c) => acc + c.attended, 0);
    const overallPercentage =
      totalConducted > 0
        ? parseFloat(((totalAttended / totalConducted) * 100).toFixed(1))
        : 100;

    let status: "good" | "warning" | "critical" = "good";
    if (overallPercentage < 60) status = "critical";
    else if (overallPercentage < 75) status = "warning";

    return {
      totalConducted,
      totalAttended,
      overallPercentage,
      status,
      courseStats,
    };
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentStudent,
        currentProfessor,
        currentAdmin,
        batches,
        students,
        professors,
        courses,
        selectedBatchId,
        selectedSection,
        setSelectedBatchId,
        setSelectedSection,
        sessions,
        activeSession,
        auditLogs,
        assessmentSchemes,
        internalMarks,
        markAuditLogs,
        enrollStudent,
        addFacultyMember,
        createCourse,
        updateCourseSchedule,
        resetToDefaultData,
        getScopedStudents,
        getCourseAssessmentScheme,
        getCourseMarks,
        updateAssessmentScheme,
        updateStudentMarkScore,
        saveDraftMarks,
        finalizeMarks,
        publishMarks,
        getMarksAnalytics,
        startNewSession,
        updateStudentRecord,
        markAllPresent,
        clearAttendance,
        lockSession,
        reopenSession,
        submitStudentAttendance,
        regenerateQrToken,
        regenerateCode,
        getStudentAttendanceStats,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
