"use client";

import React from "react";
import Link from "next/link";
import {
  QrCode,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAttendancePercentage, cn } from "@/lib/utils";

export default function StudentDashboard() {
  const { currentStudent, getStudentAttendanceStats, activeSession } = useAttendance();

  const stats = getStudentAttendanceStats(currentStudent.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Student Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Student Academic Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
            Good morning, {currentStudent.fullName}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Roll No: <strong className="font-mono text-primary">{currentStudent.rollNumber}</strong> • {currentStudent.program} (Sem {currentStudent.semester})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/student/scan">
            <Button variant="teal" size="default" className="shadow-sm">
              <QrCode className="w-4 h-4" />
              Scan Class Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Session Notification Banner if Class is live */}
      {activeSession && activeSession.status === "ACTIVE" && (
        <Card className="border-2 border-tertiary-teal/40 bg-gradient-to-r from-tertiary-fixed/30 to-surface-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-tertiary-teal text-white shadow-md">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="present" withDot>
                  LIVE NOW
                </Badge>
                <span className="text-xs font-mono font-bold text-primary">
                  {activeSession.courseCode}
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mt-0.5">
                {activeSession.courseName}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Room {activeSession.room} • Instructor: {activeSession.professorName}
              </p>
            </div>
          </div>

          <Link href="/student/scan">
            <Button variant="teal" size="default">
              Mark Attendance Now →
            </Button>
          </Link>
        </Card>
      )}

      {/* Top High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={formatAttendancePercentage(stats.overallPercentage)}
          subtitle="Requirement: ≥ 75.0%"
          statusVariant={stats.status}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          badge={
            <Badge
              variant={
                stats.status === "good"
                  ? "present"
                  : stats.status === "warning"
                  ? "late"
                  : "absent"
              }
            >
              {stats.status === "good"
                ? "Good Standing"
                : stats.status === "warning"
                ? "Warning"
                : "Critical"}
            </Badge>
          }
        />
        <StatCard
          title="Classes Attended"
          value={`${stats.totalAttended} / ${stats.totalConducted}`}
          subtitle="Total lecture sessions"
          icon={<CheckCircle2 className="w-5 h-5 text-primary-container" />}
        />
        <StatCard
          title="Enrolled Courses"
          value={`${stats.courseStats.length} Courses`}
          subtitle="15 Credit Units"
          icon={<BookOpen className="w-5 h-5 text-secondary" />}
        />
        <StatCard
          title="Attendance Risk"
          value="0 Courses"
          subtitle="All above 75% threshold"
          statusVariant="good"
          icon={<ShieldCheck className="w-5 h-5 text-tertiary-teal" />}
        />
      </div>

      {/* Attendance Goal & Projection Simulator Card */}
      <Card className="p-6 bg-gradient-to-br from-surface-lowest via-surface-lowest to-surface-low border border-border">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="w-4 h-4 text-tertiary-teal" />
          Attendance Intelligence & Projection
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-base font-bold text-on-surface">
              You are in Excellent Academic Standing (
              {formatAttendancePercentage(stats.overallPercentage)})
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Based on the university minimum 75% attendance criteria, your attendance is safely above the threshold across all enrolled subjects in MSc Systems & Computational Biology.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-lowest border border-border text-xs space-y-2 text-center md:text-left">
            <div className="text-[11px] text-on-surface-variant uppercase font-semibold">
              Attendance Safety Buffer
            </div>
            <div className="text-xl font-bold text-emerald-700">
              Safe Margin: +{Math.max(0, stats.totalAttended - Math.ceil(stats.totalConducted * 0.75))} Classes
            </div>
            <p className="text-[11px] text-on-surface-variant">
              You can afford scheduled leaves without falling below 75%.
            </p>
          </div>
        </div>
      </Card>

      {/* Enrolled Courses Attendance Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">
            Course-Wise Attendance Breakdown
          </h2>
          <Link
            href="/student/history"
            className="text-xs font-semibold text-tertiary-teal hover:underline flex items-center gap-1"
          >
            View Complete History Log <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.courseStats.map((item) => (
            <Card
              key={item.course.id}
              className="p-5 hover:border-outline transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-primary-container bg-primary-fixed/40 px-2 py-0.5 rounded">
                    {item.course.code}
                  </span>
                  <Badge
                    variant={
                      item.status === "good"
                        ? "present"
                        : item.status === "warning"
                        ? "late"
                        : "absent"
                    }
                  >
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-on-surface line-clamp-1">
                  {item.course.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Instructor: {item.course.professorName}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                    <span>Attended: {item.attended} / {item.conducted} classes</span>
                    <span>{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.percentage >= 75
                          ? "bg-attendance-present-dot"
                          : item.percentage >= 60
                          ? "bg-attendance-late-dot"
                          : "bg-attendance-absent-dot"
                      )}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Projection Tip */}
              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>
                  {item.canBunkFor75 > 0
                    ? `Can miss ${item.canBunkFor75} more class(es) safely`
                    : item.classesNeededFor75 > 0
                    ? `Must attend next ${item.classesNeededFor75} classes to hit 75%`
                    : "On track"}
                </span>
                <Link
                  href={`/student/courses/${item.course.id}`}
                  className="font-semibold text-tertiary-teal hover:underline flex items-center gap-0.5"
                >
                  Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
