"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Play,
  FileSpreadsheet,
  Layers,
  GraduationCap,
  Award,
  CheckCircle2,
  Lock,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarksEntryTable } from "@/components/assessment/marks-entry-table";
import { A4ReportPreview, ReportType } from "@/components/reports/a4-report-preview";
import { ScheduleTimetableModal } from "@/components/courses/schedule-timetable-modal";
import { cn } from "@/lib/utils";

type WorkspaceTab =
  | "overview"
  | "attendance"
  | "internal-marks"
  | "students"
  | "analytics"
  | "reports";

export default function ProfessorCourseWorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const {
    courses,
    batches,
    selectedBatchId,
    selectedSection,
    setSelectedBatchId,
    setSelectedSection,
    currentProfessor,
    getScopedStudents,
    getCourseAssessmentScheme,
    getCourseMarks,
    getMarksAnalytics,
    updateAssessmentScheme,
    updateStudentMarkScore,
    saveDraftMarks,
    finalizeMarks,
    publishMarks,
    updateCourseSchedule,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("INTERNAL_MARKS");
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);

  const course = courses.find((c) => c.id === params.id) || courses[0];
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const scopedStudents = getScopedStudents(selectedBatchId, selectedSection);
  const scheme = getCourseAssessmentScheme(course.id, selectedBatchId, selectedSection);
  const marks = getCourseMarks(course.id, selectedBatchId, selectedSection);
  const marksAnalytics = getMarksAnalytics(course.id, selectedBatchId, selectedSection);

  const tabs: { id: WorkspaceTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "internal-marks", label: "Internal Marks", icon: Award },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports & Exports", icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header with Batch & Section Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-lowest p-6 rounded-2xl border border-border shadow-elevation-1">
        <div className="flex items-start gap-4">
          <Link href="/professor/courses">
            <button className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-container text-on-surface-variant transition-colors mt-1">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
                {course.code}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {course.program} • Semester {course.semester} • {course.credits} Credits
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
              {course.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary-container" /> {course.room}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary-container" /> {course.scheduleTime}
              </span>
            </div>
          </div>
        </div>

        {/* Batch & Section Scoping Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-surface-container">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="h-9 rounded-lg border border-outline-variant bg-surface px-3 text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="h-9 rounded-lg border border-outline-variant bg-surface px-3 text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div className="pt-4 lg:pt-4">
            <Link href="/professor/session/sess-today-01">
              <Button variant="primary" size="default" className="shadow-sm font-bold gap-1.5">
                <Play className="w-4 h-4 fill-white" />
                Start Attendance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Attendance"
          value="87.5%"
          subtitle="Across 26 conducted classes"
          statusVariant="good"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Internal Assessment"
          value={`${marksAnalytics.average} / ${marksAnalytics.maxMarks}`}
          subtitle={`${marksAnalytics.status} • Passing: ${marksAnalytics.passingThreshold}`}
          statusVariant={marksAnalytics.average >= marksAnalytics.passingThreshold ? "good" : "warning"}
          icon={<Award className="w-5 h-5 text-primary-container" />}
        />
        <StatCard
          title="Scoped Cohort"
          value={`${scopedStudents.length} Students`}
          subtitle={`${activeBatch.name} (${selectedSection})`}
          icon={<Users className="w-5 h-5 text-tertiary-teal" />}
        />
        <StatCard
          title="Students At Risk"
          value={`${marksAnalytics.studentsBelowPassing} Flagged`}
          subtitle="Below passing score"
          statusVariant={marksAnalytics.studentsBelowPassing > 0 ? "warning" : "good"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="border-b border-border bg-surface-lowest rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150",
                isActive
                  ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === "internal-marks" && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full uppercase font-mono font-bold",
                    marksAnalytics.status === "PUBLISHED"
                      ? "bg-emerald-200 text-emerald-900"
                      : marksAnalytics.status === "FINALIZED"
                      ? "bg-blue-200 text-blue-900"
                      : "bg-amber-200 text-amber-900"
                  )}
                >
                  {marksAnalytics.status}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-on-surface">Course Curriculum & Learning Objectives</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Covers fundamental molecular structures, biological macromolecules, sequence alignment algorithms, protein structure prediction, molecular docking simulations, and computational structural biology frameworks tailored for University of Hyderabad MSc Systems & Computational Biology candidates.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-surface-low text-xs">
                  <span className="text-outline text-[11px] block">Course Type</span>
                  <strong className="text-on-surface">Core Theory + Lab</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface-low text-xs">
                  <span className="text-outline text-[11px] block">Academic Term</span>
                  <strong className="text-on-surface">{activeBatch.name}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface-low text-xs">
                  <span className="text-outline text-[11px] block">Total Sessions</span>
                  <strong className="text-on-surface">{course.totalConductedSessions} Conducted</strong>
                </div>
              </div>
            </Card>

            {/* Subject Timetable & Schedule Card */}
            <Card className="p-6 space-y-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Subject Timetable & Varying Schedule
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Configured day-by-day lecture & lab sessions with specific classrooms
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsTimetableModalOpen(true)}
                  className="bg-primary-container font-bold text-xs gap-1.5 shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" /> Edit Subject Timetable
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(course.timeTableSlots && course.timeTableSlots.length > 0
                  ? course.timeTableSlots
                  : course.scheduleDays.map((d, i) => ({
                      id: `slot-fallback-${i}`,
                      day: d,
                      startTime: course.scheduleTime.split("–")[0]?.trim() || "10:00 AM",
                      endTime: course.scheduleTime.split("–")[1]?.trim() || "11:30 AM",
                      room: course.room,
                      sessionType: "LECTURE" as const,
                    }))
                ).map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-low/50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{slot.day}</span>
                      <span
                        className={cn(
                          "text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded",
                          slot.sessionType === "LAB"
                            ? "bg-purple-100 text-purple-800"
                            : slot.sessionType === "TUTORIAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        )}
                      >
                        {slot.sessionType || "LECTURE"}
                      </span>
                    </div>

                    <p className="text-xs font-mono font-bold text-primary">
                      {slot.startTime} – {slot.endTime}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                      <MapPin className="w-3 h-3 text-secondary shrink-0" />
                      <span className="truncate">{slot.room || course.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-on-surface">Internal Assessment Scheme Summary</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("internal-marks")}
                  className="text-xs"
                >
                  Manage Marks →
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {scheme.components.map((comp) => (
                  <div key={comp.id} className="p-3 rounded-xl border border-border bg-surface text-center space-y-1">
                    <span className="text-[11px] text-on-surface-variant font-medium truncate block">
                      {comp.name}
                    </span>
                    <p className="text-base font-bold font-mono text-primary">{comp.maxMarks} M</p>
                    <span className="text-[10px] text-outline uppercase font-mono font-bold">
                      {comp.shortCode}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link href="/professor/session/sess-today-01" className="block w-full">
                  <Button variant="primary" size="sm" className="w-full bg-primary-container font-bold">
                    <Play className="w-3.5 h-3.5 fill-white mr-1.5" /> Start Live Class
                  </Button>
                </Link>
                <Link href="/professor/session/sess-today-01/projector" target="_blank" className="block w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    Auditorium Projector View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab("reports");
                    setSelectedReportType("INTERNAL_MARKS");
                  }}
                  className="w-full text-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Generate Official PDF
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Batch & Section Scope
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Batch:</span>
                  <span className="font-semibold text-on-surface">{activeBatch.name}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Section:</span>
                  <span className="font-semibold text-on-surface">Section {selectedSection}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Enrolled:</span>
                  <span className="font-semibold text-primary">{scopedStudents.length} Students</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-surface-container flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  Batch Attendance Summary — {activeBatch.name} ({selectedSection})
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Conducted Lectures: <strong>26</strong> • Minimum Statutory Requirement: <strong>75%</strong>
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveTab("reports");
                  setSelectedReportType("ATTENDANCE");
                }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export Attendance PDF
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="px-6 py-3.5">Roll Number</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Held</th>
                    <th className="px-6 py-3.5">Attended</th>
                    <th className="px-6 py-3.5">Percentage</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {scopedStudents.map((std, idx) => {
                    const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
                    const pct = ((attended / 26) * 100).toFixed(1);
                    const isShortage = parseFloat(pct) < 75.0;

                    return (
                      <tr key={std.id} className="hover:bg-surface-low/50 transition-colors h-14">
                        <td className="px-6 py-3 font-mono font-bold text-primary">{std.rollNumber}</td>
                        <td className="px-6 py-3 font-semibold text-on-surface">{std.fullName}</td>
                        <td className="px-6 py-3 font-mono">26</td>
                        <td className="px-6 py-3 font-mono font-semibold">{attended}</td>
                        <td className="px-6 py-3 font-mono font-bold">
                          <span className={isShortage ? "text-rose-700" : "text-emerald-700"}>
                            {pct}%
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Badge variant={isShortage ? "absent" : "present"} withDot>
                            {isShortage ? "Shortage (<75%)" : "Eligible"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Internal Marks Entry & Management */}
      {activeTab === "internal-marks" && (
        <div className="space-y-6 animate-in fade-in">
          <MarksEntryTable
            courseId={course.id}
            batchId={selectedBatchId}
            section={selectedSection}
            scheme={scheme}
            marks={marks}
            students={scopedStudents}
            onSaveDraft={(updated) => saveDraftMarks(course.id, selectedBatchId, selectedSection, updated)}
            onFinalize={() => finalizeMarks(course.id, selectedBatchId, selectedSection)}
            onPublish={() => publishMarks(course.id, selectedBatchId, selectedSection)}
            onUpdateScheme={updateAssessmentScheme}
            onUpdateMarkScore={updateStudentMarkScore}
          />
        </div>
      )}

      {/* Tab 4: Students Roster */}
      {activeTab === "students" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">
                Enrolled Cohort Roster ({scopedStudents.length} Students)
              </h3>
              <span className="text-xs text-on-surface-variant font-mono">
                {activeBatch.name} • Section {selectedSection}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="px-6 py-3.5">Roll Number</th>
                    <th className="px-6 py-3.5">Enrollment No</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Institutional Email</th>
                    <th className="px-6 py-3.5 text-right">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {scopedStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-surface-low/50 transition-colors h-14">
                      <td className="px-6 py-3 font-mono font-bold text-primary">{std.rollNumber}</td>
                      <td className="px-6 py-3 font-mono text-outline">{std.enrollmentNumber || "—"}</td>
                      <td className="px-6 py-3 font-semibold text-on-surface">{std.fullName}</td>
                      <td className="px-6 py-3 font-mono text-on-surface-variant">{std.email}</td>
                      <td className="px-6 py-3 text-right font-mono text-outline">{std.phone || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">Class Average</span>
              <p className="text-2xl font-bold font-mono text-primary">
                {marksAnalytics.average} / {marksAnalytics.maxMarks}
              </p>
              <span className="text-[10px] text-emerald-700 font-bold">
                {((marksAnalytics.average / marksAnalytics.maxMarks) * 100).toFixed(1)}% Score
              </span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">Highest Score</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">
                {marksAnalytics.highest} / {marksAnalytics.maxMarks}
              </p>
              <span className="text-[10px] text-outline">Top in Cohort</span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">Lowest Score</span>
              <p className="text-2xl font-bold font-mono text-rose-700">
                {marksAnalytics.lowest} / {marksAnalytics.maxMarks}
              </p>
              <span className="text-[10px] text-outline">Needs Intervention</span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <span className="text-xs text-on-surface-variant font-semibold">Below Passing Threshold</span>
              <p className="text-2xl font-bold font-mono text-amber-700">
                {marksAnalytics.studentsBelowPassing} Students
              </p>
              <span className="text-[10px] text-amber-800 font-semibold">Passing: {marksAnalytics.passingThreshold}</span>
            </Card>
          </div>

          {/* Distribution Histogram */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-on-surface">Score Distribution Brackets</h3>
            <div className="space-y-3">
              {marksAnalytics.distribution.map((item) => {
                const pct =
                  marksAnalytics.totalStudents > 0
                    ? (item.count / marksAnalytics.totalStudents) * 100
                    : 0;
                return (
                  <div key={item.range} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-on-surface">
                      <span>{item.range}</span>
                      <span>
                        {item.count} Students ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 6: Official A4 Reports & Exports */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Report Type Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container rounded-xl border border-border print:hidden">
            <button
              onClick={() => setSelectedReportType("INTERNAL_MARKS")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                selectedReportType === "INTERNAL_MARKS"
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
              )}
            >
              1. Internal Assessment Marks Sheet
            </button>
            <button
              onClick={() => setSelectedReportType("ATTENDANCE")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                selectedReportType === "ATTENDANCE"
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
              )}
            >
              2. Attendance Transcript
            </button>
            <button
              onClick={() => setSelectedReportType("COMBINED_SUMMARY")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                selectedReportType === "COMBINED_SUMMARY"
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
              )}
            >
              3. Combined Academic Summary
            </button>
          </div>

          <A4ReportPreview
            reportType={selectedReportType}
            course={course}
            batch={activeBatch}
            section={selectedSection}
            scheme={scheme}
            marks={marks}
            students={scopedStudents}
            professorName={currentProfessor.fullName}
          />
        </div>
      )}

      {/* Schedule & Timetable Config Modal */}
      <ScheduleTimetableModal
        course={course}
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        onSave={updateCourseSchedule}
      />
    </div>
  );
}
