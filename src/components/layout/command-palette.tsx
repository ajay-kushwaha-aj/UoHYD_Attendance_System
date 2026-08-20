"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
  Settings,
  AlertTriangle,
  History,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  MessageSquareText,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = "all" | "courses" | "students" | "faculty" | "pages";

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { courses, students, professors, cancelledClasses, currentRole } = useAttendance();
  const { role } = useAuth();
  const activeRole = role || currentRole || "professor";

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search and selection on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setActiveCategory("all");
    }
  }, [isOpen]);

  const allNavigationActions = useMemo(() => {
    return [
      {
        id: "nav-dashboard",
        title: "Main Dashboard",
        subtitle: `Overview of attendance, curriculum & analytics for ${activeRole}`,
        category: "pages" as const,
        icon: Layers,
        href:
          activeRole === "student"
            ? "/student/dashboard"
            : activeRole === "professor"
            ? "/professor/dashboard"
            : "/admin/dashboard",
        badge: "Overview",
      },
      {
        id: "nav-scan",
        title: activeRole === "student" ? "Live QR / Code Attendance Scanner" : "Launch Active Live Class Session",
        subtitle: activeRole === "student" ? "Scan professor dynamic QR or enter 5-digit verification code" : "Open QR projector and PIN authentication",
        category: "pages" as const,
        icon: QrCode,
        href: activeRole === "student" ? "/student/scan" : "/professor/session/sess-today-01",
        badge: "Attendance",
      },
      {
        id: "nav-calendar",
        title: "Timetable & Class Calendar",
        subtitle: "Weekly schedule, rooms, hours and cancellations",
        category: "pages" as const,
        icon: Calendar,
        href: activeRole === "student" ? "/student/calendar" : "/professor/calendar",
        badge: "Timetable",
      },
      {
        id: "nav-courses",
        title: "Course Workspaces & Syllabi",
        subtitle: "MSc Systems & Computational Biology curricula and credit registry",
        category: "pages" as const,
        icon: BookOpen,
        href: activeRole === "student" ? "/student/courses" : "/professor/courses",
        badge: "Curriculum",
      },
      {
        id: "nav-history",
        title: "Attendance History & Logs",
        subtitle: "Audit transcripts with hour multipliers & lab single-mark breakdowns",
        category: "pages" as const,
        icon: History,
        href: "/student/history",
        badge: "Student",
      },
      {
        id: "nav-grievances",
        title: activeRole === "student" ? "Academic Queries & Grievance Redressal Cell" : "Student Queries & Grievances Inbox",
        subtitle: activeRole === "student" ? "Submit attendance disputes, mark re-evaluations, or message faculty" : "Review student inquiries tagged to you and provide official resolutions",
        category: "pages" as const,
        icon: MessageSquareText,
        href: activeRole === "student" ? "/student/grievances" : "/professor/grievances",
        badge: "Support/Query",
      },
      {
        id: "nav-reports",
        title: "Internal Assessment Marks & A4 PDF Engine",
        subtitle: "Official printable marks sheets, CSV exports & university seals",
        category: "pages" as const,
        icon: FileSpreadsheet,
        href: "/professor/reports",
        badge: "Faculty",
      },
      {
        id: "nav-analytics",
        title: "Department Attendance Analytics",
        subtitle: "Cohort statistical distributions, risk indicators & trends",
        category: "pages" as const,
        icon: BarChart3,
        href: "/professor/analytics",
        badge: "Analytics",
      },
      {
        id: "nav-diagnostics",
        title: "System Diagnostics & Error Resilience Showcase",
        subtitle: "Interactive tests for camera permission, QR timeout, offline sync & server failover",
        category: "pages" as const,
        icon: AlertTriangle,
        href: "/admin/system-diagnostics",
        badge: "Admin/Resilience",
      },
      {
        id: "nav-profile",
        title: "Institutional Profile & Digital ID Card",
        subtitle: "Student smart card, faculty designation & department records",
        category: "pages" as const,
        icon: User,
        href:
          activeRole === "student"
            ? "/student/profile"
            : activeRole === "professor"
            ? "/professor/profile"
            : "/admin/profile",
        badge: "Identity",
      },
      {
        id: "nav-audit",
        title: "Administrative Audit Logs",
        subtitle: "Complete institutional audit trail for attendance & marks overrides",
        category: "pages" as const,
        icon: ShieldCheck,
        href: "/admin/audit-logs",
        badge: "Admin",
      },
    ];
  }, [activeRole]);

  // Filtered results calculation
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Navigation / Actions
    const matchedActions = allNavigationActions.filter(
      (a) =>
        (!q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.badge.toLowerCase().includes(q)) &&
        (activeCategory === "all" || activeCategory === "pages")
    );

    // 2. Courses
    const matchedCourses = courses
      .filter(
        (c) =>
          (!q ||
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.professorName.toLowerCase().includes(q) ||
            c.room.toLowerCase().includes(q)) &&
          (activeCategory === "all" || activeCategory === "courses")
      )
      .map((c) => ({
        id: `course-${c.id}`,
        title: `${c.code} — ${c.name}`,
        subtitle: `Instructor: ${c.professorName} • ${c.room} • ${c.credits} Credits (${c.scheduleTime})`,
        category: "courses" as const,
        icon: BookOpen,
        href:
          activeRole === "student"
            ? `/student/courses/${c.id}`
            : activeRole === "professor"
            ? `/professor/courses/${c.id}`
            : `/admin/courses`,
        badge: `${c.credits} Credits`,
      }));

    // 3. Students
    const matchedStudents = students
      .filter(
        (s) =>
          (!q ||
            s.fullName.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.program.toLowerCase().includes(q)) &&
          (activeCategory === "all" || activeCategory === "students")
      )
      .map((s) => ({
        id: `student-${s.id}`,
        title: `${s.fullName} (${s.rollNumber})`,
        subtitle: `${s.program} • ${s.batchName} (${s.section}) • ${s.email}`,
        category: "students" as const,
        icon: GraduationCap,
        href: activeRole === "student" ? "/student/profile" : "/admin/students",
        badge: s.rollNumber,
      }));

    // 4. Faculty / Professors
    const matchedFaculty = professors
      .filter(
        (p) =>
          (!q ||
            p.fullName.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.department.toLowerCase().includes(q) ||
            p.designation.toLowerCase().includes(q)) &&
          (activeCategory === "all" || activeCategory === "faculty")
      )
      .map((p) => ({
        id: `prof-${p.id}`,
        title: `${p.fullName}`,
        subtitle: `${p.designation} • ${p.department} • ${p.email}`,
        category: "faculty" as const,
        icon: Briefcase,
        href: activeRole === "admin" ? "/admin/professors" : "/professor/profile",
        badge: "Faculty",
      }));

    return [...matchedActions, ...matchedCourses, ...matchedStudents, ...matchedFaculty];
  }, [query, activeCategory, allNavigationActions, courses, students, professors, activeRole]);

  const handleSelect = React.useCallback(
    (item: (typeof searchResults)[0]) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation up / down / enter
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === "Enter" && searchResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(searchResults[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [isOpen, searchResults, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-3 sm:p-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Search Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-lowest shadow-elevation-2 border border-border z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3 border-b border-surface-container gap-3 bg-surface-low/50">
          <Search className="w-5 h-5 text-tertiary-teal shrink-0" />
          <input
            type="text"
            placeholder="Search courses, students, roll numbers, faculty, schedules, or actions..."
            className="w-full text-sm bg-transparent text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none font-medium"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-surface-container bg-surface-lowest overflow-x-auto">
          {(
            [
              { key: "all", label: "All Results" },
              { key: "courses", label: "Courses" },
              { key: "students", label: "Students" },
              { key: "faculty", label: "Faculty" },
              { key: "pages", label: "Navigation" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
                activeCategory === cat.key
                  ? "bg-primary text-white font-bold"
                  : "bg-surface-container/60 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[10px] text-on-surface-variant ml-auto font-mono shrink-0 pl-2">
            {searchResults.length} {searchResults.length === 1 ? "match" : "matches"}
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-on-surface-variant space-y-2">
              <Search className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
              <p className="font-semibold text-on-surface">No matching records found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-on-surface-variant">
                Try searching with course codes like <strong className="font-mono">SCB-501</strong>, roll numbers like <strong className="font-mono">23MCMS01</strong>, student names, or faculty names.
              </p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all text-left group ${
                    isSelected
                      ? "bg-primary-fixed/40 border border-primary/20 shadow-2xs"
                      : "hover:bg-surface-low border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.category === "courses"
                          ? "bg-primary-fixed text-primary"
                          : item.category === "students"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.category === "faculty"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-teal-100 text-teal-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-on-surface line-clamp-1 flex items-center gap-2">
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hidden sm:inline-block">
                      {item.badge}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-tertiary-teal transition-transform ${
                        isSelected ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:opacity-60"
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="flex items-center justify-between border-t border-surface-container bg-surface-low/80 px-4 py-2 text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-surface-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold">
                ↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold">
                ↵
              </kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold">
              ESC
            </kbd>
            <span>Close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
