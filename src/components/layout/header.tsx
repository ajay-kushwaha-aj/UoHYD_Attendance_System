"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  Check,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth, AuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const { activeSession, setCurrentRole } = useAttendance();
  const { user, role, switchRole, logout } = useAuth();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const currentRole = role || "professor";
  const currentUser: AuthUser = user || {
    id: "prof-01",
    fullName: "Prof. K. Venkatesh Rao",
    email: "dr.rao@uohyd.ac.in",
    role: "professor",
    department: "Department of Systems & Computational Biology",
    designation: "Professor & Head of Department",
  };

  const roleOptions: { role: UserRole; label: string; icon: typeof User; sub: string }[] = [
    {
      role: "student",
      label: "Student Account",
      icon: GraduationCap,
      sub: "Ajay Kumar (23MCMS01)",
    },
    {
      role: "professor",
      label: "Professor Account",
      icon: Briefcase,
      sub: "Prof. K. Venkatesh Rao (HOD)",
    },
    {
      role: "admin",
      label: "Administrator Account",
      icon: ShieldCheck,
      sub: "Dr. S. R. Murthy (Academic)",
    },
  ];

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setCurrentRole(newRole);
    setRoleMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface-lowest/90 px-4 md:px-8 backdrop-blur-md">
      {/* Left: Quick Search Button / Active Class Badge */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs text-on-surface-variant hover:border-outline hover:text-on-surface transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search courses, students, codes...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant ml-2">
            ⌘K
          </kbd>
        </button>

        {activeSession && activeSession.status === "ACTIVE" && (
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-semibold text-tertiary-on-fixed">
            <span className="h-2 w-2 rounded-full bg-tertiary-teal animate-pulse" />
            <span>Class Active: {activeSession.courseCode} ({activeSession.room})</span>
          </div>
        )}
      </div>

      {/* Right: Role Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-fixed/40 px-3 py-1.5 text-xs font-semibold text-primary-container hover:bg-primary-fixed transition-colors"
          >
            {currentRole === "student" && <GraduationCap className="w-3.5 h-3.5 text-primary-container" />}
            {currentRole === "professor" && <Briefcase className="w-3.5 h-3.5 text-primary-container" />}
            {currentRole === "admin" && <ShieldCheck className="w-3.5 h-3.5 text-primary-container" />}
            <span className="capitalize font-bold">{currentRole} Mode</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface-lowest p-1.5 shadow-elevation-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-surface-container flex items-center justify-between">
                  <span>Switch Active Role</span>
                  <Sparkles className="w-3 h-3 text-tertiary-teal" />
                </div>
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = currentRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      onClick={() => handleRoleSwitch(opt.role)}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors mt-1",
                        isSelected
                          ? "bg-primary-fixed/40 text-primary-container font-semibold"
                          : "text-on-surface hover:bg-surface-low"
                      )}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary-container" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary-container" />}
                        </div>
                        <p className="text-[11px] text-on-surface-variant truncate font-normal">
                          {opt.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-attendance-absent-dot" />
          </button>

          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface-lowest p-3 shadow-elevation-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-surface-container pb-2 mb-2">
                  <span className="text-xs font-bold text-on-surface">Notifications</span>
                  <span className="text-[10px] text-tertiary-teal font-semibold cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-surface-low text-xs">
                    <p className="font-semibold text-on-surface">Attendance Recorded</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Your attendance for Molecular Biology was marked PRESENT at 10:02 AM.
                    </p>
                    <span className="text-[10px] text-outline mt-1 block">15m ago</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-low text-xs">
                    <p className="font-semibold text-on-surface">Upcoming Lecture</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Computational Genomics starts at 11:30 AM in Bioinformatics Lab-1.
                    </p>
                    <span className="text-[10px] text-outline mt-1 block">1h ago</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Identity Pill & Account Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-on-surface leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-on-surface-variant">
                {currentUser.rollNumber || (currentUser as any).designation?.split(" ")[0] || currentUser.email}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-on-surface-variant hidden md:block opacity-60" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface-lowest p-2 shadow-elevation-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-surface-container mb-1">
                  <p className="text-xs font-bold text-on-surface">{currentUser.fullName}</p>
                  <p className="text-[11px] text-on-surface-variant font-mono">{currentUser.email}</p>
                  <div className="mt-1 inline-flex items-center rounded bg-primary-fixed/40 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {currentRole}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href={
                      currentRole === "student"
                        ? "/student/profile"
                        : currentRole === "professor"
                        ? "/professor/profile"
                        : "/admin/profile"
                    }
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-on-surface hover:bg-surface-low transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-on-surface-variant" />
                    <span>My Profile & Institutional Identity</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
