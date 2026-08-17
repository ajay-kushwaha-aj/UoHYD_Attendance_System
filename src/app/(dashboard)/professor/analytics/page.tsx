"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfessorAnalyticsPage() {
  const { courses } = useAttendance();
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);

  // Distribution breakdown
  const cohorts = [
    { label: "≥ 90% (Outstanding)", count: 4, color: "bg-emerald-600", text: "text-emerald-700" },
    { label: "75% – 89% (Satisfactory)", count: 2, color: "bg-teal-600", text: "text-teal-700" },
    { label: "60% – 74% (Warning / At Risk)", count: 1, color: "bg-amber-500", text: "text-amber-700" },
    { label: "< 60% (Critical / Debarred Risk)", count: 1, color: "bg-rose-600", text: "text-rose-700" },
  ];

  const atRiskStudents = [
    {
      name: "Aman Verma",
      rollNumber: "23MCMS05",
      percentage: 58.0,
      attended: 15,
      conducted: 26,
      missed: 11,
      status: "critical",
      neededFor75: 7,
    },
    {
      name: "Vikram Reddy",
      rollNumber: "23MCMS07",
      percentage: 68.0,
      attended: 17,
      conducted: 26,
      missed: 9,
      status: "warning",
      neededFor75: 3,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Cohort Analytics & Insights
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Attendance Distribution & Risk Detection
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            MSc Systems & Computational Biology Cohort (2023–25)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-semibold"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name.slice(0, 28)}...
              </option>
            ))}
          </select>

          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export Analytics
          </Button>
        </div>
      </div>

      {/* Distribution Chart Card */}
      <Card className="p-6">
        <h2 className="text-sm font-bold text-on-surface mb-4">
          Attendance Bracket Distribution
        </h2>
        <div className="space-y-4">
          {cohorts.map((b) => (
            <div key={b.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-on-surface">{b.label}</span>
                <span className={b.text}>
                  <strong>{b.count}</strong> students ({Math.round((b.count / 8) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                <div
                  className={`${b.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(b.count / 8) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* At-Risk Intervention Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Students Requiring Attention (<span className="text-rose-700">2 flagged</span>)
          </h2>
        </div>

        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Attended / Total</th>
                <th className="px-6 py-3.5">Attendance %</th>
                <th className="px-6 py-3.5">Intervention Needed</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              {atRiskStudents.map((std) => (
                <tr
                  key={std.rollNumber}
                  className="hover:bg-surface-low/50 transition-colors h-16"
                >
                  <td className="px-6 py-3 font-mono font-semibold text-primary">
                    {std.rollNumber}
                  </td>
                  <td className="px-6 py-3 font-bold text-on-surface">
                    {std.name}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant font-mono">
                    {std.attended} / {std.conducted} classes ({std.missed} missed)
                  </td>
                  <td className="px-6 py-3 font-bold">
                    <span
                      className={
                        std.status === "critical" ? "text-rose-700" : "text-amber-700"
                      }
                    >
                      {std.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant text-[11px]">
                    Must attend next <strong>{std.neededFor75} consecutive lectures</strong> to clear 75%
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Badge
                      variant={std.status === "critical" ? "absent" : "late"}
                      withDot
                    >
                      {std.status === "critical" ? "Critical Risk" : "Warning"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
