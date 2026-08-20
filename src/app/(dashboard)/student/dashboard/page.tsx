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
  const { currentStudent, getStudentAttendanceStats, activeSession, cancelledClasses } = useAttendance();

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

      {/* Cancelled Classes Faculty Notice Banner */}
      {cancelledClasses && cancelledClasses.length > 0 && (
        <Card className="border-2 border-rose-300/80 bg-rose-50/60 p-4 sm:p-5 space-y-3 shadow-2xs overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-rose-200/60">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Faculty Class Cancellation Notice
              </h3>
            </div>
            <Link href="/student/calendar" className="text-xs font-bold text-rose-800 hover:text-rose-950 hover:underline flex items-center gap-1">
              View Schedule →
            </Link>
          </div>

          <div className="space-y-3">
            {cancelledClasses.map((cancel) => (
              <div
                key={cancel.id}
                className="p-4 rounded-xl bg-surface-lowest border border-rose-200/80 shadow-2xs text-xs space-y-2.5 transition-all"
              >
                {/* Title & Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                      {cancel.courseCode}
                    </span>
                    <span className="font-bold text-sm text-on-surface leading-tight">
                      {cancel.courseName}
                    </span>
                  </div>
                  <Badge variant="absent" withDot className="shrink-0 font-bold px-2.5 py-0.5">
                    Class Cancelled
                  </Badge>
                </div>

                {/* Metadata Row */}
                <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-1 leading-normal">
                  <span>Instructor: <strong className="text-on-surface font-semibold">{cancel.professorName}</strong></span>
                  <span className="text-rose-300">•</span>
                  <span>{cancel.day} • <strong className="font-mono text-on-surface font-medium">{cancel.time}</strong></span>
                  <span className="text-rose-300">•</span>
                  <span className="font-medium text-on-surface">{cancel.room}</span>
                </div>

                {/* Reason Details Box */}
                <div className="p-3 rounded-lg bg-rose-50/90 border border-rose-200/80 text-xs text-rose-950 space-y-1.5 leading-relaxed break-words">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-950 shrink-0">Faculty Reason:</span>
                    <span className="text-rose-900 font-medium">{cancel.reason}</span>
                  </div>
                  {cancel.additionalRemarks && (
                    <div className="pt-1 border-t border-rose-200/60 text-[11.5px] text-rose-800 italic">
                      <span className="font-semibold not-italic">Note: </span>
                      {cancel.additionalRemarks}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={formatAttendancePercentage(stats.overallPercentage)}
          subtitle={`${stats.totalAttended} / ${stats.totalConducted} Total Units • Req: ≥ 75%`}
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
          title="Theory Lectures"
          value={formatAttendancePercentage(stats.theoryPercentage)}
          subtitle={`${stats.theoryAttended} / ${stats.theoryConducted} lecture units (1-2 Hrs)`}
          statusVariant={stats.theoryPercentage >= 75 ? "good" : "warning"}
          icon={<BookOpen className="w-5 h-5 text-primary-container" />}
        />
        <StatCard
          title="Practical / Lab Classes"
          value={formatAttendancePercentage(stats.labPercentage)}
          subtitle={`${stats.labAttended} / ${stats.labConducted} lab sessions (1 attendance each)`}
          statusVariant={stats.labPercentage >= 75 ? "good" : "warning"}
          icon={<CheckCircle2 className="w-5 h-5 text-tertiary-teal" />}
        />
        <StatCard
          title="Curriculum Standing"
          value={`${stats.courseStats.length} Subjects`}
          subtitle="15 Credits • Semester II"
          statusVariant="good"
          icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Attendance Goal & Projection Simulator Card */}
      <Card className="p-6 bg-gradient-to-br from-surface-lowest via-surface-lowest to-surface-low border border-border">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="w-4 h-4 text-tertiary-teal" />
          Attendance Intelligence & Combined Multi-Track Metrics
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-base font-bold text-on-surface">
              You are in Excellent Academic Standing (
              {formatAttendancePercentage(stats.overallPercentage)})
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Theory classes follow standard hour units (1 hr = 1 attendance, 2 hrs = 2 attendance), while laboratory practicals are tracked per session (1 attendance). Your attendance safely fulfills the university statutory 75% requirement across both tracks.
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
            Course-Wise Attendance Breakdown (Theory vs Lab)
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
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-on-surface">
                      Overall: {item.percentage.toFixed(1)}%
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
                      {item.attended} / {item.conducted}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-on-surface line-clamp-1">
                  {item.course.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Instructor: {item.course.professorName}
                </p>

                {/* Theory vs Lab Pills Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-low/70 border border-surface-container space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-primary">Theory Lectures</span>
                      <span className="font-bold text-primary">{item.theoryPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.theoryAttended} / {item.theoryConducted} units
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-low/70 border border-surface-container space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-tertiary-teal">Lab Sessions</span>
                      <span className="font-bold text-tertiary-teal">
                        {item.labConducted > 0 ? `${item.labPercentage.toFixed(1)}%` : "N/A"}
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.labConducted > 0 ? `${item.labAttended} / ${item.labConducted} labs (1 attendance)` : "No Lab"}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                    <span>Overall Attendance Progress</span>
                    <span>{item.attended} / {item.conducted} units ({item.percentage.toFixed(1)}%)</span>
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
