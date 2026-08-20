"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { AttendanceStatus } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StudentHistoryPage() {
  const { currentStudent, courses } = useAttendance();

  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AttendanceStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Realistic mock history records for Ajay Kumar
  const mockHistoryData = [
    {
      id: "h-01",
      date: "2026-08-17",
      courseCode: "SCB-501",
      courseName: "Molecular Biology & Structural Bioinformatics",
      time: "10:02 AM",
      hours: 1,
      status: "PRESENT" as AttendanceStatus,
      method: "QR",
      room: "LH-204",
      remarks: "Verified via dynamic QR code",
    },
    {
      id: "h-02",
      date: "2026-08-15",
      courseCode: "SCB-502",
      courseName: "Computational Genomics & Transcriptomics",
      time: "11:34 AM",
      hours: 1,
      status: "PRESENT" as AttendanceStatus,
      method: "CODE",
      room: "Bioinformatics Lab-1",
      remarks: "Entered 5-digit session code",
    },
    {
      id: "h-03",
      date: "2026-08-14",
      courseCode: "SCB-501",
      courseName: "Molecular Biology & Structural Bioinformatics",
      time: "10:14 AM",
      hours: 2,
      status: "PRESENT" as AttendanceStatus,
      method: "MANUAL",
      room: "LH-204",
      remarks: "Attendance override approved by faculty with medical slip (2 attendance)",
    },
    {
      id: "h-04",
      date: "2026-08-12",
      courseCode: "SCB-503",
      courseName: "Systems Biology & Metabolic Modeling",
      time: "02:18 PM",
      hours: 2,
      status: "PRESENT" as AttendanceStatus,
      method: "MANUAL",
      room: "LH-205",
      remarks: "2-hour lecture session (2 attendance)",
    },
    {
      id: "h-05",
      date: "2026-08-10",
      courseCode: "SCB-504",
      courseName: "Algorithms in Computational Biology",
      time: "03:30 PM",
      hours: 2,
      status: "PRESENT" as AttendanceStatus,
      method: "QR",
      room: "Computing Facility 2",
      remarks: "2-hour laboratory practical session",
    },
    {
      id: "h-06",
      date: "2026-08-08",
      courseCode: "SCB-502",
      courseName: "Computational Genomics & Transcriptomics",
      time: "—",
      hours: 1,
      status: "ABSENT" as AttendanceStatus,
      method: "SYSTEM",
      room: "Bioinformatics Lab-1",
      remarks: "Unexcused absence (1 attendance missed)",
    },
  ];

  const filteredHistory = mockHistoryData.filter((item) => {
    const matchSearch =
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCourse =
      selectedCourse === "ALL" || item.courseCode === selectedCourse;
    const matchStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    return matchSearch && matchCourse && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
          <History className="w-6 h-6 text-primary shrink-0" />
          <span>Academic Attendance History</span>
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Complete verifiable ledger of your attendance records, multi-hour lecture blocks, and verification timestamps.
        </p>
      </div>

      {/* Filter / Search Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by course, room or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 text-on-surface"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Course Select */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-medium"
            >
              <option value="ALL">All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name.slice(0, 24)}...
                </option>
              ))}
            </select>

            {/* Status Segment Filters */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs">
              {(["ALL", "PRESENT", "ABSENT"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1 rounded text-[11px] font-semibold transition-colors",
                    statusFilter === st
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* History Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-low/80 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Course Code & Name</th>
                <th className="px-6 py-3.5">Duration / Attendance</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Faculty Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-low/50 transition-colors h-16"
                >
                  <td className="px-6 py-3">
                    <div className="font-semibold text-on-surface">{item.date}</div>
                    <div className="text-[11px] text-on-surface-variant font-mono">
                      {item.time}
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <div className="font-bold text-primary font-mono text-[11px]">
                      {item.courseCode}
                    </div>
                    <div className="font-medium text-on-surface line-clamp-1">
                      {item.courseName}
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold border",
                        item.room.toLowerCase().includes("lab") || item.method === "QR" && item.courseCode === "SCB-504"
                          ? "bg-teal-50 text-teal-800 border-teal-200"
                          : item.hours === 2
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : "bg-surface-container text-on-surface-variant border-border"
                      )}
                    >
                      {item.room.toLowerCase().includes("lab") || item.courseCode === "SCB-504"
                        ? "Lab (1 Attendance)"
                        : `${item.hours || 1} Hr (${item.hours === 2 ? "2 Attendance" : "1 Attendance"})`}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-on-surface-variant">
                    {item.room}
                  </td>

                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded bg-surface-container px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant font-mono">
                      {item.method}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    <Badge
                      variant={item.status === "PRESENT" ? "present" : "absent"}
                      withDot
                    >
                      {item.status}
                    </Badge>
                  </td>

                  <td className="px-6 py-3 text-right text-on-surface-variant text-[11px]">
                    {item.remarks || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="p-8 text-center text-xs text-on-surface-variant">
            No attendance records match your active search and filter criteria.
          </div>
        )}
      </Card>
    </div>
  );
}
