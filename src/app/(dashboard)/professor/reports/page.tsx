"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { A4ReportPreview, ReportType } from "@/components/reports/a4-report-preview";
import { cn } from "@/lib/utils";

export default function ProfessorReportsPage() {
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
  } = useAttendance();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("INTERNAL_MARKS");

  const courseObj = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const scopedStudents = getScopedStudents(selectedBatchId, selectedSection);
  const scheme = getCourseAssessmentScheme(courseObj.id, selectedBatchId, selectedSection);
  const marks = getCourseMarks(courseObj.id, selectedBatchId, selectedSection);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Academic Compliance & Department Records
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Official University Academic Reports & A4 PDF Engine
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Generate printable A4 assessment sheets, attendance transcripts, and combined statutory summaries with official signature blocks.
          </p>
        </div>
      </div>

      {/* Filter and Scoping Bar (Hidden in Print) */}
      <Card className="p-4 bg-surface-lowest print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-semibold"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Select Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-semibold"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Select Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-semibold"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
              Document Format
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
              className="w-full h-9 rounded-md border border-outline-variant bg-surface px-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 font-semibold"
            >
              <option value="INTERNAL_MARKS">Internal Assessment Marks Sheet</option>
              <option value="ATTENDANCE">Course Attendance Transcript</option>
              <option value="COMBINED_SUMMARY">Combined Academic Summary</option>
            </select>
          </div>
        </div>
      </Card>

      {/* A4 Report Component */}
      <A4ReportPreview
        reportType={selectedReportType}
        course={courseObj}
        batch={activeBatch}
        section={selectedSection}
        scheme={scheme}
        marks={marks}
        students={scopedStudents}
        professorName={currentProfessor.fullName}
      />
    </div>
  );
}
