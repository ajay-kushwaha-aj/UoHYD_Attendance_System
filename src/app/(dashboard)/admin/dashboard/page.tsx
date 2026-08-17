"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { currentAdmin, courses, auditLogs } = useAttendance();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Institutional Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
            Department of Systems & Computational Biology
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Administrator: {currentAdmin.fullName} • Academic Session 2023–2025
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/audit-logs">
            <Button variant="secondary" size="default">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Security Audit Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Department Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value="8 Cohort"
          subtitle="MSc SCB Batch"
          icon={<Users className="w-5 h-5 text-primary-container" />}
        />
        <StatCard
          title="Active Department Courses"
          value={`${courses.length} Subjects`}
          subtitle="Semester II"
          icon={<BookOpen className="w-5 h-5 text-secondary" />}
        />
        <StatCard
          title="Department Average"
          value="86.2%"
          subtitle="Overall Attendance Rate"
          statusVariant="good"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Students At Risk"
          value="2 Students"
          subtitle="Below 75% Statutory Limit"
          statusVariant="warning"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* At-Risk Students & Compliance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">
              Statutory Attendance Risk Roster (<span className="text-amber-700">Below 75%</span>)
            </h2>
          </div>

          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Program</th>
                  <th className="px-6 py-3">Attendance %</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                <tr className="hover:bg-surface-low/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-semibold text-primary">
                    23MCMS05
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-on-surface">
                    Aman Verma
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">
                    MSc SCB (Sem 2)
                  </td>
                  <td className="px-6 py-3.5 font-bold text-rose-700">58.0%</td>
                  <td className="px-6 py-3.5 text-right">
                    <Badge variant="absent" withDot>
                      Critical
                    </Badge>
                  </td>
                </tr>

                <tr className="hover:bg-surface-low/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-semibold text-primary">
                    23MCMS07
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-on-surface">
                    Vikram Reddy
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">
                    MSc SCB (Sem 2)
                  </td>
                  <td className="px-6 py-3.5 font-bold text-amber-700">68.0%</td>
                  <td className="px-6 py-3.5 text-right">
                    <Badge variant="late" withDot>
                      Warning
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* Security Audit Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Latest Security Audits</h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-tertiary-teal hover:underline"
            >
              View All →
            </Link>
          </div>

          <Card className="p-4 space-y-3">
            {auditLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-surface-low text-xs border border-border/40"
              >
                <div className="flex items-center justify-between font-bold text-on-surface">
                  <span className="text-[11px] font-mono text-primary">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {log.timestamp.split(" ")[0]}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                  {log.reason}
                </p>
                <div className="mt-1.5 text-[10px] text-primary font-semibold">
                  By: {log.actorName} ({log.actorRole})
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
