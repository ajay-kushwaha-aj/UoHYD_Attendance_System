"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  X,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth, AuthUser } from "@/lib/auth-context";
import { UserRole, AppNotification } from "@/types";
import { cn } from "@/lib/utils";
import { UniversityLoader } from "@/components/shared/university-loader";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const router = useRouter();
  const {
    activeSession,
    setCurrentRole,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
  } = useAttendance();
  const { user, role, switchRole, logout } = useAuth();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread" | "cancellations">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPortal = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

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

  // Filtered notifications based on active role and tab
  const roleScopedNotifications = notifications.filter(
    (n) => n.targetRole === "all" || n.targetRole === currentRole
  );

  const filteredNotifications = roleScopedNotifications.filter((n) => {
    if (notifFilter === "unread") return !n.read;
    if (notifFilter === "cancellations") return n.type === "CANCELLATION";
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      router.push(notif.link);
      setNotificationOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-surface-container bg-surface-lowest/95 px-4 md:px-8 backdrop-blur-md">
      {/* Left: Quick Search Button & Active Session Indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-low/70 px-3.5 py-2 text-xs text-on-surface-variant hover:border-outline hover:text-on-surface hover:bg-surface-low transition-all shadow-2xs group"
        >
          <Search className="w-4 h-4 text-tertiary-teal group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-medium text-on-surface">Search courses, students, faculty, codes...</span>
          <span className="sm:hidden font-medium text-on-surface">Search...</span>
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-border bg-surface-lowest px-1.5 py-0.5 text-[10px] font-mono font-bold text-on-surface-variant ml-2 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {activeSession && activeSession.status === "ACTIVE" && (
          <div className="hidden lg:flex items-center gap-2.5 rounded-full bg-tertiary-fixed/80 border border-tertiary-teal/30 px-3.5 py-1.5 text-xs font-semibold text-tertiary-on-fixed shadow-2xs animate-in fade-in">
            <span className="h-2 w-2 rounded-full bg-tertiary-teal animate-pulse" />
            <span>
              Live Class: <strong className="font-mono text-tertiary">{activeSession.courseCode}</strong> ({activeSession.room})
            </span>
          </div>
        )}
      </div>

      {/* Right: Role Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition-all shadow-2xs"
          >
            {currentRole === "student" && <GraduationCap className="w-4 h-4 text-primary" />}
            {currentRole === "professor" && <Briefcase className="w-4 h-4 text-primary" />}
            {currentRole === "admin" && <ShieldCheck className="w-4 h-4 text-primary" />}
            <span className="capitalize">{currentRole} Mode</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
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

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-attendance-absent-dot text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface-lowest shadow-elevation-2 z-50 animate-in fade-in zoom-in-95 overflow-hidden">
                {/* Header */}
                <div className="p-3.5 border-b border-surface-container bg-surface-low/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Institutional Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-fixed/50 text-primary font-mono text-[10px] font-bold">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="font-semibold text-tertiary-teal hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      {roleScopedNotifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-on-surface-variant/70 hover:text-rose-600 transition-colors"
                          title="Clear all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1">
                    {(
                      [
                        { key: "all", label: `All (${roleScopedNotifications.length})` },
                        { key: "unread", label: `Unread (${unreadNotificationCount})` },
                        {
                          key: "cancellations",
                          label: `Cancellations (${
                            roleScopedNotifications.filter((n) => n.type === "CANCELLATION").length
                          })`,
                        },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setNotifFilter(tab.key)}
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-colors ${
                          notifFilter === tab.key
                            ? "bg-primary text-white font-bold"
                            : "bg-surface-container/60 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-on-surface-variant space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto opacity-60 mb-2" />
                      <p className="font-semibold text-on-surface">You&apos;re all caught up!</p>
                      <p className="text-[11px] text-on-surface-variant">No notifications match this filter.</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={cn(
                          "group relative p-2.5 rounded-xl text-xs transition-all cursor-pointer border flex items-start gap-2.5",
                          notif.read
                            ? "bg-surface-lowest hover:bg-surface-low border-surface-container/60"
                            : "bg-primary-fixed/20 hover:bg-primary-fixed/30 border-primary/20 shadow-2xs"
                        )}
                      >
                        {/* Icon based on notification type */}
                        <div className="mt-0.5 shrink-0">
                          {notif.type === "CANCELLATION" ? (
                            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : notif.type === "ACADEMIC" ? (
                            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                          ) : notif.type === "SUCCESS" ? (
                            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-on-surface line-clamp-1">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-1.5" />
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-outline">
                            <span>{notif.timestamp}</span>
                            {notif.link && (
                              <span className="text-tertiary-teal font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                View <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dismiss / Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-md text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-surface-container bg-surface-low/50 text-center text-[10px] text-on-surface-variant font-medium">
                  University of Hyderabad Real-Time Academic Dispatch
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

        {/* Quick Sync / Refresh Button */}
        <button
          onClick={handleRefreshPortal}
          title="Synchronize and Refresh Portal Data"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-low/70 text-on-surface-variant hover:border-outline hover:text-on-surface hover:bg-surface-low transition-all shadow-2xs group"
        >
          <RefreshCw className={cn("w-4 h-4 text-on-surface-variant group-hover:text-primary transition-transform", isRefreshing && "animate-spin text-primary")} />
        </button>

        {/* Global Loading Overlay when Refreshing */}
        {isRefreshing && (
          <UniversityLoader
            fullScreen
            message="Synchronizing Academic Records..."
            subMessage="Refreshing University of Hyderabad live attendance nodes & timetables"
          />
        )}
      </div>
    </header>
  );
}
