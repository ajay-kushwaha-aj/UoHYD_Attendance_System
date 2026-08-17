"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  User,
  QrCode,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  X,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { MOCK_STUDENTS } from "@/lib/mock-data";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { courses, currentRole } = useAttendance();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      s.fullName.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    {
      title: "Take / Scan Attendance",
      icon: QrCode,
      action: () => {
        router.push(currentRole === "student" ? "/student/scan" : "/professor/session/sess-today-01");
        onClose();
      },
    },
    {
      title: "View Class Schedule & Calendar",
      icon: Calendar,
      action: () => {
        router.push(currentRole === "student" ? "/student/calendar" : "/professor/calendar");
        onClose();
      },
    },
    {
      title: "Course Attendance Analytics",
      icon: BarChart3,
      action: () => {
        router.push("/professor/analytics");
        onClose();
      },
    },
    {
      title: "Export Compliance Report (CSV/PDF)",
      icon: FileSpreadsheet,
      action: () => {
        router.push("/professor/reports");
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-surface-lowest shadow-elevation-2 border border-border z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-surface-container">
          <Search className="w-5 h-5 text-on-surface-variant mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search students, roll numbers, courses, or type an action..."
            className="w-full py-4 text-sm bg-transparent text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Quick Shortcuts
              </div>
              <div className="mt-1 space-y-1">
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.title}
                      onClick={act.action}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-low transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-primary-container" />
                      <span>{act.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Courses
              </div>
              <div className="mt-1 space-y-1">
                {filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      router.push(
                        currentRole === "student"
                          ? `/student/courses/${c.id}`
                          : `/professor/courses/${c.id}`
                      );
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-on-surface hover:bg-surface-low transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-tertiary-teal shrink-0" />
                      <div>
                        <span className="font-semibold text-primary">{c.code}</span> — {c.name}
                      </div>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">{c.room}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students (For Professor/Admin) */}
          {currentRole !== "student" && filteredStudents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Enrolled Students (MSc SCB)
              </div>
              <div className="mt-1 space-y-1">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-on-surface hover:bg-surface-low transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-secondary shrink-0" />
                      <div>
                        <span className="font-semibold">{s.fullName}</span> ({s.rollNumber})
                      </div>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">{s.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-container bg-surface-low px-4 py-2 text-[11px] text-on-surface-variant">
          <span>Navigate with ↑ ↓ and Press Enter</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
