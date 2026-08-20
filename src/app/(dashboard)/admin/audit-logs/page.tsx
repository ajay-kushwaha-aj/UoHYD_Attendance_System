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
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const filteredLogs = auditLogs.filter((l) => {
    const matchesFilter =
      filterAction === "ALL" || l.action === filterAction;
    const matchesSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.targetStudentName &&
        l.targetStudentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Regulatory Compliance & Transparency
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Security & Academic Audit Trails
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Immutable log of all attendance overrides, faculty class cancellations with official reasons, session lockings, and permissions.
          </p>
        </div>

        <Button variant="secondary" size="sm" className="font-semibold gap-1.5 shadow-2xs">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Audit Trail (CSV)
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="p-4 bg-surface-lowest space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Action Filter Segment Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: "All Audit Trails", value: "ALL" },
              { label: "Class Cancellations", value: "CLASS_CANCELLED" },
              { label: "Status Overrides", value: "STATUS_OVERRIDE" },
              { label: "Session Locks", value: "SESSION_LOCK" },
              { label: "Session Reopens", value: "SESSION_REOPEN" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterAction(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterAction === tab.value
                    ? tab.value === "CLASS_CANCELLED"
                      ? "bg-rose-700 text-white font-bold shadow-xs"
                      : "bg-primary text-white font-bold shadow-xs"
                    : "bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredLogs.length} audit entries
          </span>
        </div>

        <div className="pt-2 border-t border-surface-container">
          <Input
            placeholder="Search by action, instructor, student, or reason..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 text-xs"
          />
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
                <th className="px-6 py-3.5">Subject / Course</th>
                <th className="px-6 py-3.5">State Change</th>
                <th className="px-6 py-3.5">Faculty / Actor</th>
                <th className="px-6 py-3.5 text-right">Official Justification / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-surface-low/50 transition-colors h-16 ${
                      log.action === "CLASS_CANCELLED" ? "bg-rose-50/20" : ""
                    }`}
                  >
                    <td className="px-6 py-3 font-mono text-[11px] text-on-surface-variant">
                      {log.timestamp.includes("T")
                        ? `${log.timestamp.split("T")[0]} ${log.timestamp.split("T")[1]?.slice(0, 5)}`
                        : log.timestamp}
                    </td>
                    <td className="px-6 py-3">
                      {log.action === "CLASS_CANCELLED" ? (
                        <Badge variant="absent" withDot className="font-bold">
                          CLASS CANCELLED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                      )}
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
                      {log.action === "CLASS_CANCELLED" ? (
                        <span className="text-rose-700 font-bold bg-rose-100/70 px-2 py-0.5 rounded text-[10.5px]">
                          SCHEDULED → CANCELLED
                        </span>
                      ) : log.oldValue && log.newValue ? (
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
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-on-surface">
                        {log.actorName}
                      </div>
                      <div className="text-[10px] text-on-surface-variant uppercase font-medium">
                        {log.actorRole}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right text-on-surface text-[11px] max-w-sm">
                      <span className={log.action === "CLASS_CANCELLED" ? "font-semibold text-rose-950" : "text-on-surface-variant"}>
                        {log.reason}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-on-surface-variant">
                    No matching audit trail entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
