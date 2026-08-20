"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  QrCode,
  History,
  Calendar,
  User,
  Users,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  GraduationCap,
  Building2,
  Sliders,
  CheckCircle2,
  Award,
  Activity,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole: storeRole } = useAttendance();
  const { role: authRole } = useAuth();
  const currentRole = authRole || storeRole || "professor";

  const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Scan Attendance", href: "/student/scan", icon: QrCode, highlight: true },
    { label: "My Courses", href: "/student/courses", icon: BookOpen },
    { label: "Attendance History", href: "/student/history", icon: History },
    { label: "Calendar & Schedule", href: "/student/calendar", icon: Calendar },
    { label: "Queries & Grievances", href: "/student/grievances", icon: MessageSquareText },
    { label: "My Profile", href: "/student/profile", icon: User },
  ];

  const professorNav: NavItem[] = [
    { label: "Dashboard", href: "/professor/dashboard", icon: LayoutDashboard },
    { label: "Active Class Mode", href: "/professor/session/sess-today-01", icon: QrCode, highlight: true },
    { label: "Course Workspaces", href: "/professor/courses", icon: BookOpen },
    { label: "Internal Marks", href: "/professor/courses/course-scb-501", icon: Award },
    { label: "Student Inquiries", href: "/professor/grievances", icon: MessageSquareText },
    { label: "Course Analytics", href: "/professor/analytics", icon: BarChart3 },
    { label: "Export Reports", href: "/professor/reports", icon: FileSpreadsheet },
    { label: "Class Calendar", href: "/professor/calendar", icon: Calendar },
    { label: "Faculty Profile", href: "/professor/profile", icon: User },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
  ];

  const adminNav: NavItem[] = [
    { label: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students Directory", href: "/admin/students", icon: Users },
    { label: "Faculty Directory", href: "/admin/professors", icon: GraduationCap },
    { label: "Courses & Curricula", href: "/admin/courses", icon: BookOpen },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Security & Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "System Diagnostics & Errors", href: "/admin/system-diagnostics", icon: Activity },
    { label: "Admin Profile", href: "/admin/profile", icon: User },
    { label: "System Settings", href: "/admin/settings", icon: Sliders },
  ];

  const navItems =
    currentRole === "student"
      ? studentNav
      : currentRole === "professor"
      ? professorNav
      : adminNav;

  return (
    <aside className="hidden md:flex h-screen w-72 flex-col border-r border-border bg-surface-lowest sticky top-0 shrink-0 select-none">
      {/* Brand Header with Frameless Logo and Enhanced Trilingual Typography */}
      <div className="flex h-20 items-center gap-3.5 px-4 border-b border-surface-container bg-surface-lowest">
        <div className="relative shrink-0 flex items-center justify-center w-13 h-13">
          <Image
            src="/uohyd-logo.png"
            alt="University of Hyderabad Logo"
            width={52}
            height={52}
            className="object-contain w-full h-full drop-shadow-xs"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[11px] font-telugu font-bold text-[#8B1D1D] leading-tight truncate">
            హైదరాబాదు విశ్వవిద్యాలయం
          </p>
          <p className="text-[12px] font-hindi font-bold text-[#8B1D1D] leading-tight truncate">
            हैदराबाद विश्वविद्यालय
          </p>
          <h1 className="text-[12.5px] font-sans font-extrabold text-[#8B1D1D] leading-tight tracking-tight truncate">
            University of Hyderabad
          </h1>
          <p className="text-[9.5px] text-on-surface-variant font-semibold tracking-wider uppercase">
            Attendance Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-outline">
          {currentRole} Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : item.highlight
                  ? "bg-tertiary-fixed text-tertiary-on-fixed hover:bg-tertiary-fixed-dim"
                  : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                  isActive
                    ? "text-white"
                    : item.highlight
                    ? "text-tertiary-on-fixed"
                    : "text-on-surface-variant group-hover:text-on-surface"
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-tertiary-teal animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Institutional Status Badge */}
      <div className="p-4 border-t border-surface-container bg-surface-low/60">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-on-surface text-[11px] truncate">
              Academic Term 2023–25
            </p>
            <p className="text-[10px] text-on-surface-variant truncate">
              Dept. of Systems & Comp. Bio
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
