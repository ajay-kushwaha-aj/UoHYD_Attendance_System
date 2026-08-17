"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Play,
  QrCode,
  ArrowRight,
  BookOpen,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfessorDashboard() {
  const { currentProfessor, courses, sessions, activeSession, batches, selectedBatchId, selectedSection } = useAttendance();

  const todayCourse = courses[0]; // SCB-501
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            FACULTY DASHBOARD
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-0.5">
            Good morning, {currentProfessor.fullName}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            {currentProfessor.designation} • {currentProfessor.department}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/professor/session/sess-today-01">
            <Button variant="primary" size="default" className="shadow-sm font-bold gap-1.5">
              <Play className="w-4 h-4 fill-white" />
              Start Attendance Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/professor/analytics" className="block group">
          <StatCard
            title="Average Attendance"
            value="87.5%"
            subtitle="Across 4 active courses • Click to view"
            statusVariant="good"
            icon={<TrendingUp className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" />}
            trend={{ value: "2.4% vs last week", isPositive: true }}
          />
        </Link>

        <Link href="/professor/courses/course-scb-501" className="block group">
          <StatCard
            title="Active Cohort"
            value="16 Students"
            subtitle={`${activeBatch.name} (Sec ${selectedSection})`}
            icon={<Users className="w-5 h-5 text-primary-container transition-transform group-hover:scale-110" />}
          />
        </Link>

        <Link href="/professor/analytics" className="block group">
          <StatCard
            title="Attendance Risk"
            value="2 Students"
            subtitle="Below 75% threshold • View roster"
            statusVariant="warning"
            icon={<AlertTriangle className="w-5 h-5 text-amber-600 transition-transform group-hover:scale-110" />}
          />
        </Link>

        <Link href="/professor/calendar" className="block group">
          <StatCard
            title="Today's Classes"
            value="2 Lectures"
            subtitle="Next: 10:00 AM in LH-204"
            icon={<Calendar className="w-5 h-5 text-tertiary-teal transition-transform group-hover:scale-110" />}
          />
        </Link>
      </div>

      {/* Today's Highlighted Class Hero Card */}
      <Card className="border-2 border-primary-container/20 bg-gradient-to-br from-surface-lowest to-surface-low overflow-hidden shadow-elevation-1">
        <div className="bg-primary px-6 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CURRENT LECTURE SESSION</span>
          </div>
          <span className="text-xs text-primary-fixed font-mono font-bold">
            {todayCourse.code} • {activeBatch.name} ({selectedSection})
          </span>
        </div>

        <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-tertiary-teal uppercase tracking-wider">
                {todayCourse.program} • Semester {todayCourse.semester}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-on-surface mt-0.5">
                {todayCourse.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-primary-container" />
                <span>{todayCourse.scheduleTime}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary-container" />
                <span>{todayCourse.room}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-primary-container" />
                <span>{todayCourse.totalStudents} Students Enrolled</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/professor/session/sess-today-01/projector" target="_blank">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <QrCode className="w-4 h-4 text-tertiary-teal" />
                Projector Mode
              </Button>
            </Link>
            <Link href="/professor/session/sess-today-01">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md font-bold">
                <Play className="w-4 h-4 fill-white" />
                Open Live Class Session
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Internal Assessment Summary Card */}
      <Card className="p-6 bg-surface-lowest border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-tertiary-teal" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Internal Assessment & Marks Management
              </span>
            </div>
            <h3 className="text-base font-bold text-on-surface">
              Continuous Assessment Progress
            </h3>
            <p className="text-xs text-on-surface-variant">
              Manage marking schemes, enter student scores with spreadsheet validation, and generate signed A4 records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-left md:text-right text-xs">
              <span className="text-on-surface-variant block">SCB-501 Assessment:</span>
              <span className="font-bold text-emerald-700">Marks Published (30 Max)</span>
            </div>
            <Link href="/professor/courses/course-scb-501">
              <Button variant="outline" size="sm" className="font-bold gap-1 text-xs">
                Manage Course Marks <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Courses Taught & Recent Session Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Assigned Courses & Workspaces</h2>
            <Link
              href="/professor/courses"
              className="text-xs font-semibold text-tertiary-teal hover:underline flex items-center gap-1"
            >
              View All Workspaces <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="p-5 hover:border-outline transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-primary-container bg-primary-fixed/40 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-on-surface line-clamp-2">
                    {course.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {course.room}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">
                    {course.totalConductedSessions} Classes Conducted
                  </span>
                  <Link
                    href={`/professor/courses/${course.id}`}
                    className="font-semibold text-tertiary-teal hover:underline"
                  >
                    Open Workspace →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Session Status & Quick Audit Alert */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-on-surface">Live Class Status</h2>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <span className="text-xs font-bold text-on-surface">Active Session Status</span>
              <Badge variant="present" withDot>
                Active
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Course:</span>
                <span className="font-semibold text-on-surface">SCB-501</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Batch / Sec:</span>
                <span className="font-semibold text-on-surface">{activeBatch.name} (A)</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Students Present:</span>
                <span className="font-semibold text-attendance-present-text">6 / 8</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Verification Mode:</span>
                <span className="font-semibold text-on-surface">Dynamic QR / Code</span>
              </div>
            </div>

            <Link href="/professor/session/sess-today-01" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                Manage Live Session
              </Button>
            </Link>
          </Card>

          {/* Quick Notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Low Attendance Warning</span>
            </div>
            <p className="mt-1 text-amber-800 leading-relaxed text-[11px]">
              2 students in MSc SCB are currently below the university 75% statutory requirement.
            </p>
            <Link
              href="/professor/analytics"
              className="mt-2 inline-block font-semibold text-amber-900 underline text-[11px]"
            >
              View At-Risk Intervention List →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
