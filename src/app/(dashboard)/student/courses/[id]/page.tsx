"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  User,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Lock,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentCourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    courses,
    currentStudent,
    getStudentAttendanceStats,
    getCourseAssessmentScheme,
    getCourseMarks,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<"attendance" | "marks">("attendance");

  const course = courses.find((c) => c.id === params.id) || courses[0];
  const allStats = getStudentAttendanceStats(currentStudent.id);
  const courseStat =
    allStats.courseStats.find((s) => s.course.id === course.id) ||
    allStats.courseStats[0];

  const scheme = getCourseAssessmentScheme(course.id, currentStudent.batchId, currentStudent.section);
  const allMarks = getCourseMarks(course.id, currentStudent.batchId, currentStudent.section);
  const myMark = allMarks.find((m) => m.studentId === currentStudent.id);

  const isMarksPublished = myMark?.status === "PUBLISHED";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/student/courses">
          <button className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-container text-on-surface-variant transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2 py-0.5 rounded">
              {course.code}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {course.credits} Credits • {course.program} • {currentStudent.batchName} ({currentStudent.section})
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            {course.name}
          </h1>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "attendance"
              ? "bg-primary text-white shadow-sm"
              : "text-on-surface-variant hover:bg-surface-low"
          }`}
        >
          Attendance Performance
        </button>
        <button
          onClick={() => setActiveTab("marks")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "marks"
              ? "bg-primary text-white shadow-sm"
              : "text-on-surface-variant hover:bg-surface-low"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Internal Assessment Marks
          {isMarksPublished && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {activeTab === "attendance" && (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overall Attendance"
              value={`${courseStat.percentage.toFixed(1)}%`}
              subtitle={`${courseStat.attended} / ${courseStat.conducted} Total Units`}
              statusVariant={courseStat.status}
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
              badge={
                <Badge
                  variant={
                    courseStat.status === "good"
                      ? "present"
                      : courseStat.status === "warning"
                      ? "late"
                      : "absent"
                  }
                >
                  {courseStat.status === "good"
                    ? "Good Standing"
                    : courseStat.status === "warning"
                    ? "Warning"
                    : "Critical"}
                </Badge>
              }
            />
            <StatCard
              title="Theory Attendance"
              value={`${courseStat.theoryPercentage.toFixed(1)}%`}
              subtitle={`${courseStat.theoryAttended} / ${courseStat.theoryConducted} lecture units (1-2 Hrs)`}
              statusVariant={courseStat.theoryPercentage >= 75 ? "good" : "warning"}
              icon={<BookOpen className="w-5 h-5 text-primary-container" />}
            />
            <StatCard
              title="Lab / Practical Attendance"
              value={courseStat.labConducted > 0 ? `${courseStat.labPercentage.toFixed(1)}%` : "N/A"}
              subtitle={
                courseStat.labConducted > 0
                  ? `${courseStat.labAttended} / ${courseStat.labConducted} lab sessions (1 Mark each)`
                  : "No lab sessions scheduled"
              }
              statusVariant={courseStat.labPercentage >= 75 ? "good" : "warning"}
              icon={<CheckCircle2 className="w-5 h-5 text-tertiary-teal" />}
            />
            <StatCard
              title="Statutory Buffer"
              value={
                courseStat.canBunkFor75 > 0
                  ? `+${courseStat.canBunkFor75} Classes`
                  : `-${courseStat.classesNeededFor75} Classes`
              }
              subtitle={
                courseStat.canBunkFor75 > 0
                  ? "Can miss without falling below 75%"
                  : "Needed to regain 75% eligibility"
              }
              icon={<Sparkles className="w-5 h-5 text-tertiary-teal" />}
            />
          </div>

          {/* Theory vs Lab Detailed Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theory Breakdown Card */}
            <Card className="p-6 space-y-4 bg-surface-lowest border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary-fixed/40 text-primary">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Theory Lecture Sessions</h3>
                    <p className="text-[11px] text-on-surface-variant">
                      Multi-hour lectures award 2 attendance; 1-hour lectures award 1 attendance.
                    </p>
                  </div>
                </div>
                <Badge variant={courseStat.theoryPercentage >= 75 ? "present" : "late"}>
                  {courseStat.theoryPercentage.toFixed(1)}%
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-surface-low/80 border border-surface-container">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Conducted</span>
                  <span className="text-lg font-bold text-on-surface font-mono">{courseStat.theoryConducted}</span>
                  <span className="text-[10px] text-on-surface-variant block">Units</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Attended</span>
                  <span className="text-lg font-bold text-emerald-950 font-mono">{courseStat.theoryAttended}</span>
                  <span className="text-[10px] text-emerald-700 block">Units</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-800 block">Absent</span>
                  <span className="text-lg font-bold text-rose-950 font-mono">{courseStat.theoryAbsent}</span>
                  <span className="text-[10px] text-rose-700 block">Units</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Theory Attendance Progress</span>
                  <span className="font-bold text-on-surface">{courseStat.theoryPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, courseStat.theoryPercentage)}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Practical / Lab Breakdown Card */}
            <Card className="p-6 space-y-4 bg-surface-lowest border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-tertiary-fixed/40 text-tertiary-teal">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Practical / Laboratory Sessions</h3>
                    <p className="text-[11px] text-on-surface-variant">
                      Tracked per lab session (1 attendance counted, no hour multiplier).
                    </p>
                  </div>
                </div>
                <Badge variant={courseStat.labPercentage >= 75 ? "present" : "late"}>
                  {courseStat.labConducted > 0 ? `${courseStat.labPercentage.toFixed(1)}%` : "N/A"}
                </Badge>
              </div>

              {courseStat.labConducted > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-surface-low/80 border border-surface-container">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Conducted</span>
                      <span className="text-lg font-bold text-on-surface font-mono">{courseStat.labConducted}</span>
                      <span className="text-[10px] text-on-surface-variant block">Labs (1 Attendance)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">Attended</span>
                      <span className="text-lg font-bold text-emerald-950 font-mono">{courseStat.labAttended}</span>
                      <span className="text-[10px] text-emerald-700 block">Labs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                      <span className="text-[10px] uppercase font-bold text-rose-800 block">Absent</span>
                      <span className="text-lg font-bold text-rose-950 font-mono">{courseStat.labAbsent}</span>
                      <span className="text-[10px] text-rose-700 block">Labs</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Lab Attendance Progress</span>
                      <span className="font-bold text-on-surface">{courseStat.labPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-tertiary-teal rounded-full transition-all"
                        style={{ width: `${Math.min(100, courseStat.labPercentage)}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-on-surface-variant bg-surface-low/30 rounded-xl border border-dashed border-border">
                  No laboratory practical sessions scheduled for this course.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "marks" && (
        <div className="space-y-6">
          {isMarksPublished && myMark ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Published Marks Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 text-center space-y-1 bg-emerald-50/50 border border-emerald-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Total Score Obtained
                  </span>
                  <p className="text-3xl font-extrabold font-mono text-emerald-950">
                    {myMark.totalScore} <span className="text-sm font-normal text-emerald-700">/ {scheme.totalMaxMarks}</span>
                  </p>
                  <span className="text-xs font-bold text-emerald-700">
                    {myMark.percentage}% Score
                  </span>
                </Card>

                <Card className="p-5 text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">
                    Passing Threshold
                  </span>
                  <p className="text-3xl font-extrabold font-mono text-primary">
                    {scheme.passingMarks || 12} <span className="text-sm font-normal text-on-surface-variant">Marks</span>
                  </p>
                  <span className="text-xs font-bold text-emerald-700">
                    Status: Qualified
                  </span>
                </Card>

                <Card className="p-5 text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">
                    Published By
                  </span>
                  <p className="text-sm font-bold text-on-surface pt-1">
                    {course.professorName}
                  </p>
                  <span className="text-[11px] text-on-surface-variant">
                    Verified Institutional Copy
                  </span>
                </Card>
              </div>

              {/* Component Score Breakdown Table */}
              <Card className="p-0 overflow-hidden border border-border">
                <div className="p-4 border-b border-surface-container flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">
                    Assessment Component Breakdown
                  </h3>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Official Published Record
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <th className="px-6 py-3.5">Component</th>
                        <th className="px-6 py-3.5 text-center">Maximum Marks</th>
                        <th className="px-6 py-3.5 text-center">Score Obtained</th>
                        <th className="px-6 py-3.5 text-right">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {scheme.components.map((comp) => {
                        const score = myMark.componentScores[comp.id] ?? 0;
                        const pct = ((score / comp.maxMarks) * 100).toFixed(0);
                        return (
                          <tr key={comp.id} className="h-12 hover:bg-surface-low/30 transition-colors">
                            <td className="px-6 py-3 font-semibold text-on-surface">
                              {comp.name}
                            </td>
                            <td className="px-6 py-3 text-center font-mono text-on-surface-variant">
                              {comp.maxMarks}
                            </td>
                            <td className="px-6 py-3 text-center font-mono font-bold text-primary text-sm">
                              {score}
                            </td>
                            <td className="px-6 py-3 text-right font-mono font-semibold text-emerald-700">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center space-y-3 bg-surface-low/50 border-dashed border-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface">
                Internal Assessment Marks Under Evaluation
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Marks for {course.code} are currently being evaluated and finalized by {course.professorName}. They will become visible here as soon as the department publishes the official marksheet.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Course Info Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
          Course & Faculty Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" />
            <span>Course Instructor: <strong className="text-on-surface">{course.professorName}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <span>Lecture Hours: <strong className="text-on-surface">{course.scheduleTime}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>Classroom: <strong className="text-on-surface">{course.room}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>Days: <strong className="text-on-surface">{course.scheduleDays.join(", ")}</strong></span>
          </div>
        </div>
      </Card>
    </div>
  );
}
