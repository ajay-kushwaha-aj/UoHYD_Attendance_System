"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  QrCode,
  History,
  User,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { currentRole } = useAttendance();

  const studentLinks = [
    { label: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/student/courses", icon: BookOpen },
    { label: "Scan QR", href: "/student/scan", icon: QrCode, isFab: true },
    { label: "History", href: "/student/history", icon: History },
    { label: "Profile", href: "/student/profile", icon: User },
  ];

  const professorLinks = [
    { label: "Home", href: "/professor/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/professor/courses", icon: BookOpen },
    { label: "Take Class", href: "/professor/session/sess-today-01", icon: QrCode, isFab: true },
    { label: "Analytics", href: "/professor/analytics", icon: History },
    { label: "Reports", href: "/professor/reports", icon: User },
  ];

  const links = currentRole === "student" ? studentLinks : professorLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-lowest/95 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        if (item.isFab) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-6 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-teal text-white shadow-lg shadow-tertiary-teal/30 active:scale-95 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-on-surface mt-1">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors",
              isActive
                ? "text-primary-container font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
