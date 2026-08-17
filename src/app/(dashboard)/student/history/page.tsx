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
      status: "PRESENT" as AttendanceStatus,
      method: "MANUAL",
      room: "LH-204",
      remarks: "Attendance override approved by faculty with medical slip",
    },
    {
      id: "h-04",
      date: "2026-08-12",
      courseCode: "SCB-503",
      courseName: "Systems Biology & Metabolic Modeling",
      time: "02:18 PM",
      status: "LATE" as AttendanceStatus,
      method: "MANUAL",
      room: "LH-205",
      remarks: "Arrived with library clearance note",
    },
    {
      id: "h-05",
      date: "2026-08-10",
      courseCode: "SCB-504",
      courseName: "Algorithms in Computational Biology",
      time: "03:30 PM",
      status: "PRESENT" as AttendanceStatus,
      method: "QR",
      room: "Computing Facility 2",
    },
    {
      id: "h-06",
      date: "2026-08-08",
      courseCode: "SCB-502",
      courseName: "Computational Genomics & Transcriptomics",
      time: "—",
      status: "ABSENT" as AttendanceStatus,
      method: "SYSTEM",
      room: "Bioinformatics Lab-1",
      remarks: "Unexcused absence",
    },
  ];

  const filteredHistory = mockHistoryData.filter((item) => {
    const matchesCourse =
      selectedCourse === "ALL" ? true : item.courseCode === selectedCourse;
    const matchesStatus =
      statusFilter === "ALL" ? true : item.status === statusFilter;
    const matchesSearch =
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.remarks && item.remarks.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Audit-Ready Records
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Attendance Log & History
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Student: <strong className="text-on-surface">{currentStudent.fullName}</strong> ({currentStudent.rollNumber})
          </p>
        </div>

        <Button variant="secondary" size="sm" className="self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          Download Transcript (PDF)
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-surface-lowest">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search lectures, dates, remarks..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Course Dropdown */}
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
              {(["ALL", "PRESENT", "LATE", "ABSENT"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-semibold transition-colors",
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
                      variant={
                        item.status === "PRESENT"
                          ? "present"
                          : item.status === "LATE"
                          ? "late"
                          : "absent"
                      }
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
