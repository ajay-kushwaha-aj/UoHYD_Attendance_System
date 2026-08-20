"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  Home,
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Building2,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { UniversityBrand } from "@/components/shared/university-brand";

export default function NotFound() {
  const router = useRouter();
  const { role } = useAuth();

  const getDashboardHref = () => {
    if (role === "student") return "/student/dashboard";
    if (role === "professor") return "/professor/dashboard";
    return "/admin/dashboard";
  };

  const quickLinks = [
    { label: "My Dashboard", href: getDashboardHref(), icon: LayoutDashboard },
    { label: "Course Curricula", href: role === "student" ? "/student/courses" : "/professor/courses", icon: BookOpen },
    { label: "Academic Reports", href: "/professor/reports", icon: GraduationCap },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Accent Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d6e3ff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* University Brand Header */}
        <div className="text-center">
          <UniversityBrand size="md" layout="vertical" />
        </div>

        {/* 404 Error Card */}
        <Card className="p-6 sm:p-8 text-center space-y-6 border border-border bg-surface-lowest shadow-elevation-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-700 border-2 border-amber-200 flex items-center justify-center shadow-sm">
              <FileQuestion className="w-10 h-10" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mt-2">
              HTTP 404 • PAGE NOT FOUND
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Academic Resource Unavailable
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
              The departmental URL, session registry, or document you requested does not exist or may have been archived.
            </p>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="bg-surface-container/60 p-4 rounded-xl border border-border text-left space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Quick University Navigation:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-lowest hover:bg-surface-low border border-border/80 text-xs font-semibold text-on-surface hover:text-primary transition-colors shadow-2xs"
                  >
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href={getDashboardHref()}>
              <Button className="bg-[#8B1D1D] hover:bg-[#731717] text-white font-bold gap-2">
                <Home className="w-4 h-4" />
                Return to Institutional Portal
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 text-on-surface-variant font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </Card>

        {/* Support Footer */}
        <div className="p-4 rounded-xl bg-surface-lowest border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-primary shrink-0" />
            <span>Need help finding a curriculum or roster?</span>
          </div>
          <a
            href="mailto:helpdesk@uohyd.ac.in"
            className="font-bold text-[#8B1D1D] hover:underline"
          >
            helpdesk@uohyd.ac.in
          </a>
        </div>
      </div>
    </div>
  );
}
