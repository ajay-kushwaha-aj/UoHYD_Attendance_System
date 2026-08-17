"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  ArrowLeft,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useAttendance();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.targetStudentName &&
        l.targetStudentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Regulatory Compliance
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Security & Attendance Audit Trails
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Immutable log of all attendance overrides, session lockings, and permissions
          </p>
        </div>

        <Button variant="secondary" size="sm">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Audit Trail (CSV)
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-surface-lowest">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by action, instructor, student, or reason..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredLogs.length} audit entries
          </span>
        </div>
      </Card>

      {/* Audit Trail Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-low/80 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Subject / Target</th>
                <th className="px-6 py-3.5">Old Value → New Value</th>
                <th className="px-6 py-3.5">Actor</th>
                <th className="px-6 py-3.5 text-right">Justification / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-low/50 transition-colors h-16"
                >
                  <td className="px-6 py-3 font-mono text-[11px] text-on-surface-variant">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-semibold text-on-surface">
                      {log.courseName}
                    </div>
                    {log.targetStudentName && (
                      <div className="text-[11px] text-primary font-medium">
                        Student: {log.targetStudentName} ({log.targetStudentRoll})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-mono text-[11px]">
                    {log.oldValue && log.newValue ? (
                      <span className="flex items-center gap-1">
                        <span className="text-rose-700 font-semibold">
                          {log.oldValue}
                        </span>
                        <span>→</span>
                        <span className="text-emerald-700 font-semibold">
                          {log.newValue}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-semibold text-on-surface">
                      {log.actorName}
                    </div>
                    <div className="text-[10px] text-on-surface-variant uppercase">
                      {log.actorRole}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right text-on-surface-variant text-[11px] max-w-xs">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
