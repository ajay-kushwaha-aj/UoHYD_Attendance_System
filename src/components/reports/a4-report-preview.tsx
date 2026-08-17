"use client";

import React, { useRef } from "react";
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck, GraduationCap } from "lucide-react";
import {
  Course,
  Batch,
  AssessmentScheme,
  StudentInternalMark,
  StudentProfile,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type ReportType = "INTERNAL_MARKS" | "ATTENDANCE" | "COMBINED_SUMMARY";

interface A4ReportPreviewProps {
  reportType: ReportType;
  course: Course;
  batch: Batch;
  section: string;
  scheme: AssessmentScheme;
  marks: StudentInternalMark[];
  students: StudentProfile[];
  professorName: string;
  dateRange?: string;
  onBack?: () => void;
}

export function A4ReportPreview({
  reportType,
  course,
  batch,
  section,
  scheme,
  marks,
  students,
  professorName,
  dateRange = "Semester II (Jan 2026 – Aug 2026)",
  onBack,
}: A4ReportPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const getDocTitle = () => {
    switch (reportType) {
      case "INTERNAL_MARKS":
        return "INTERNAL ASSESSMENT MARKS SHEET";
      case "ATTENDANCE":
        return "COURSE ATTENDANCE TRANSCRIPT";
      case "COMBINED_SUMMARY":
        return "ACADEMIC ASSESSMENT SUMMARY (ATTENDANCE + INTERNAL MARKS)";
    }
  };

  const getFilename = () => {
    const code = course.code.replace(/\s+/g, "_");
    const bName = batch.name.replace(/\s+/g, "-");
    const sec = `Section-${section}`;
    switch (reportType) {
      case "INTERNAL_MARKS":
        return `${code}_Internal_Marks_${bName}_${sec}.pdf`;
      case "ATTENDANCE":
        return `${code}_Attendance_${bName}_${sec}.pdf`;
      case "COMBINED_SUMMARY":
        return `${code}_Academic_Summary_${bName}_${sec}.pdf`;
    }
  };

  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = getFilename().replace(".pdf", "");
    window.print();
    document.title = oldTitle;
  };

  const handleExportCSV = () => {
    let csvContent = "";
    if (reportType === "INTERNAL_MARKS") {
      const compHeaders = scheme.components.map((c) => `"${c.name} (${c.maxMarks})"`).join(",");
      csvContent = `S.No,Roll Number,Student Name,${compHeaders},Total (${scheme.totalMaxMarks}),Percentage,Status\n`;
      marks.forEach((m, idx) => {
        const compScores = scheme.components.map((c) => m.componentScores[c.id] ?? 0).join(",");
        csvContent += `${idx + 1},${m.studentRollNumber},"${m.studentName}",${compScores},${m.totalScore},${m.percentage}%,${m.status}\n`;
      });
    } else if (reportType === "ATTENDANCE") {
      csvContent = "S.No,Roll Number,Student Name,Conducted Classes,Attended Classes,Attendance %,Standing\n";
      students.forEach((std, idx) => {
        const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
        const pct = ((attended / 26) * 100).toFixed(1);
        const standing = parseFloat(pct) >= 75 ? "Eligible" : "Attendance Shortage (<75%)";
        csvContent += `${idx + 1},${std.rollNumber},"${std.fullName}",26,${attended},${pct}%,${standing}\n`;
      });
    } else {
      csvContent = "S.No,Roll Number,Student Name,Attendance %,Internal Marks,Max Marks,Academic Standing\n";
      students.forEach((std, idx) => {
        const mark = marks.find((m) => m.studentId === std.id);
        const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
        const attPct = ((attended / 26) * 100).toFixed(1);
        const intScore = mark ? mark.totalScore : 24;
        csvContent += `${idx + 1},${std.rollNumber},"${std.fullName}",${attPct}%,${intScore},${scheme.totalMaxMarks},Good Standing\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", getFilename().replace(".pdf", ".csv"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Controls (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-lowest p-4 rounded-xl border border-border print:hidden">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-container transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
                A4 Document Print Engine
              </span>
              <span className="text-xs text-outline font-mono">• Portrait</span>
            </div>
            <h2 className="text-sm font-bold text-on-surface">
              {getDocTitle()} Preview
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="text-xs gap-1.5 bg-primary-container font-bold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Official A4 PDF
          </Button>
        </div>
      </div>

      {/* Printable A4 Container */}
      <div
        ref={printRef}
        className="w-full max-w-[210mm] mx-auto bg-white p-8 sm:p-12 shadow-elevation-2 border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-sans"
        style={{ minHeight: "297mm" }}
      >
        {/* University Official Academic Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-900">
            <span>UNIVERSITY OF HYDERABAD</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
            DEPARTMENT OF SYSTEMS & COMPUTATIONAL BIOLOGY
          </h1>
          <p className="text-xs font-semibold text-slate-700 tracking-wide">
            School of Life Sciences • P.O. Central University, Hyderabad – 500046
          </p>

          <div className="pt-2">
            <div className="inline-block border border-slate-800 bg-slate-100 px-4 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-900">
              {getDocTitle()}
            </div>
          </div>
        </div>

        {/* Course & Batch Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 py-4 text-xs border-b border-slate-300">
          <div>
            <span className="text-slate-500 font-medium">Course Code & Title:</span>
            <p className="font-bold text-slate-900">
              {course.code} — {course.name}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Academic Session & Semester:</span>
            <p className="font-bold text-slate-900">
              {batch.name} • Semester {course.semester} ({section})
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Course Instructor:</span>
            <p className="font-bold text-slate-900">{professorName}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Credits & Date:</span>
            <p className="font-bold text-slate-900">
              {course.credits} Credits • {dateRange}
            </p>
          </div>
        </div>

        {/* Main Document Table */}
        <div className="pt-4 overflow-x-auto">
          {reportType === "INTERNAL_MARKS" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="px-3 py-2 text-center w-10">S.No</th>
                  <th className="px-3 py-2 w-24">Roll No</th>
                  <th className="px-3 py-2">Student Name</th>
                  {scheme.components.map((comp) => (
                    <th key={comp.id} className="px-2 py-2 text-center">
                      <div>{comp.shortCode || comp.name}</div>
                      <div className="text-[9px] font-normal text-slate-600">({comp.maxMarks})</div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center font-bold">Total ({scheme.totalMaxMarks})</th>
                  <th className="px-3 py-2 text-center font-bold">%</th>
                  <th className="px-3 py-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {marks.map((row, idx) => {
                  const isPass = row.totalScore >= (scheme.passingMarks || 12);
                  return (
                    <tr key={row.id} className="h-9 break-inside-avoid">
                      <td className="px-3 py-1.5 text-center font-mono text-slate-600">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-slate-900">{row.studentRollNumber}</td>
                      <td className="px-3 py-1.5 font-medium text-slate-900">{row.studentName}</td>
                      {scheme.components.map((comp) => (
                        <td key={comp.id} className="px-2 py-1.5 text-center font-mono font-semibold">
                          {row.componentScores[comp.id] ?? "—"}
                        </td>
                      ))}
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{row.totalScore}</td>
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{row.percentage}%</td>
                      <td className="px-3 py-1.5 text-right font-bold text-[10px] uppercase">
                        {isPass ? "PASS" : "FAIL"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === "ATTENDANCE" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="px-3 py-2 text-center w-10">S.No</th>
                  <th className="px-3 py-2 w-24">Roll No</th>
                  <th className="px-3 py-2">Student Name</th>
                  <th className="px-3 py-2 text-center">Conducted</th>
                  <th className="px-3 py-2 text-center">Attended</th>
                  <th className="px-3 py-2 text-center font-bold">Attendance %</th>
                  <th className="px-3 py-2 text-right">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {students.map((std, idx) => {
                  const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
                  const pct = ((attended / 26) * 100).toFixed(1);
                  const isEligible = parseFloat(pct) >= 75.0;

                  return (
                    <tr key={std.id} className="h-9 break-inside-avoid">
                      <td className="px-3 py-1.5 text-center font-mono text-slate-600">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-slate-900">{std.rollNumber}</td>
                      <td className="px-3 py-1.5 font-medium text-slate-900">{std.fullName}</td>
                      <td className="px-3 py-1.5 text-center font-mono">26</td>
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{attended}</td>
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{pct}%</td>
                      <td className="px-3 py-1.5 text-right font-bold text-[10px] uppercase">
                        {isEligible ? "Eligible (≥75%)" : "Shortage (<75%)"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === "COMBINED_SUMMARY" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="px-3 py-2 text-center w-10">S.No</th>
                  <th className="px-3 py-2 w-24">Roll No</th>
                  <th className="px-3 py-2">Student Name</th>
                  <th className="px-3 py-2 text-center">Attendance %</th>
                  <th className="px-3 py-2 text-center">Internal Score</th>
                  <th className="px-3 py-2 text-center font-bold">Max Marks</th>
                  <th className="px-3 py-2 text-right">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {students.map((std, idx) => {
                  const mark = marks.find((m) => m.studentId === std.id);
                  const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
                  const attPct = ((attended / 26) * 100).toFixed(1);
                  const intScore = mark ? mark.totalScore : 24;
                  const isGood = parseFloat(attPct) >= 75 && intScore >= 12;

                  return (
                    <tr key={std.id} className="h-9 break-inside-avoid">
                      <td className="px-3 py-1.5 text-center font-mono text-slate-600">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-slate-900">{std.rollNumber}</td>
                      <td className="px-3 py-1.5 font-medium text-slate-900">{std.fullName}</td>
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{attPct}%</td>
                      <td className="px-3 py-1.5 text-center font-mono font-bold text-slate-900">{intScore}</td>
                      <td className="px-3 py-1.5 text-center font-mono">{scheme.totalMaxMarks}</td>
                      <td className="px-3 py-1.5 text-right font-bold text-[10px] uppercase">
                        {isGood ? "Satisfactory" : "At Risk"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Statistical Footer Summary */}
        <div className="mt-6 pt-3 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Total Enrolled Cohort: <strong>{students.length} Students</strong>
          </span>
          <span>
            Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Official Physical Signature Section (Bottom of Page) */}
        <div className="mt-16 pt-8 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-xs break-inside-avoid">
          {/* Prepared By / Course Instructor */}
          <div className="space-y-12">
            <div className="h-12 flex items-end justify-center">
              <span className="text-[10px] text-slate-400 font-serif italic">
                (Sign above)
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1.5">
              <p className="font-bold text-slate-900">{professorName}</p>
              <p className="text-[10px] text-slate-600">Course Instructor / Professor</p>
              <p className="text-[10px] text-slate-600">Date: ____________________</p>
            </div>
          </div>

          {/* Department Seal Stamp Box */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-lg border-2 border-dashed border-slate-400 flex flex-col items-center justify-center p-2 text-[10px] text-slate-500 font-semibold uppercase text-center">
              <ShieldCheck className="w-5 h-5 text-slate-400 mb-1" />
              <span>Department Official Seal</span>
            </div>
          </div>

          {/* Verified By / Head of Department */}
          <div className="space-y-12">
            <div className="h-12 flex items-end justify-center">
              <span className="text-[10px] text-slate-400 font-serif italic">
                (Sign above)
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1.5">
              <p className="font-bold text-slate-900">Head of Department</p>
              <p className="text-[10px] text-slate-600">Dept. of Systems & Comp. Biology</p>
              <p className="text-[10px] text-slate-600">Date: ____________________</p>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-8 pt-3 border-t border-slate-300 text-center text-[10px] text-slate-500">
          Department of Systems & Computational Biology • University of Hyderabad • Page 1 of 1
        </div>
      </div>
    </div>
  );
}
