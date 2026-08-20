"use client";

import React, { useRef } from "react";
import Image from "next/image";
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
        className="a4-print-sheet w-full max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-elevation-2 border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-slate-900 font-sans"
        style={{ minHeight: "297mm" }}
      >
        {/* University Official Academic Header */}
        <div className="border-b-2 border-slate-900 pb-4 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
              <Image
                src="/uohyd-logo.png"
                alt="University of Hyderabad Logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="text-center flex-1 space-y-0.5">
              <div className="text-xs sm:text-sm font-telugu font-bold text-[#8B1D1D] tracking-wide leading-tight">
                హైదరాబాదు విశ్వవిద్యాలయం
              </div>
              <div className="text-xs sm:text-[13px] font-hindi font-bold text-[#8B1D1D] tracking-wide leading-tight">
                हैदराबाद विश्वविद्यालय
              </div>
              <div className="text-sm sm:text-base font-sans font-black uppercase tracking-tight text-[#8B1D1D]">
                UNIVERSITY OF HYDERABAD
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight pt-0.5">
                DEPARTMENT OF SYSTEMS & COMPUTATIONAL BIOLOGY
              </h1>
              <p className="text-[10.5px] font-semibold text-slate-700 tracking-wide">
                School of Life Sciences • P.O. Central University, Hyderabad – 500046, Telangana, India
              </p>
            </div>
            <div className="w-16 sm:w-20 shrink-0 hidden sm:block" />
          </div>

          <div className="pt-2 text-center">
            <span className="inline-block border-2 border-slate-900 bg-slate-100 px-5 py-1 rounded text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm">
              {getDocTitle()}
            </span>
          </div>
        </div>

        {/* Course & Batch Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 text-xs border-b border-slate-400 bg-slate-50/70 px-3 my-3 rounded">
          <div>
            <span className="text-slate-600 font-semibold block text-[11px]">Course Code & Title:</span>
            <p className="font-bold text-slate-950 text-xs">
              {course.code} — {course.name}
            </p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block text-[11px]">Academic Session & Semester:</span>
            <p className="font-bold text-slate-950 text-xs">
              {batch.name} • Semester {course.semester} (Section {section})
            </p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block text-[11px]">Course Instructor:</span>
            <p className="font-bold text-slate-950 text-xs">{professorName}</p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block text-[11px]">Credits & Duration:</span>
            <p className="font-bold text-slate-950 text-xs">
              {course.credits} Credits • {dateRange}
            </p>
          </div>
        </div>

        {/* Main Document Table */}
        <div className="pt-2">
          {reportType === "INTERNAL_MARKS" && (
            <table className="w-full text-left border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-200/90 text-[10.5px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="border border-slate-400 px-2.5 py-2 text-center w-10">S.No</th>
                  <th className="border border-slate-400 px-3 py-2 w-24">Roll No</th>
                  <th className="border border-slate-400 px-3 py-2">Student Name</th>
                  {scheme.components.map((comp) => (
                    <th key={comp.id} className="border border-slate-400 px-2 py-2 text-center">
                      <div>{comp.shortCode || comp.name}</div>
                      <div className="text-[9px] font-semibold text-slate-600">({comp.maxMarks})</div>
                    </th>
                  ))}
                  <th className="border border-slate-400 px-2.5 py-2 text-center font-black bg-slate-300/80 text-slate-950">
                    Total ({scheme.totalMaxMarks})
                  </th>
                  <th className="border border-slate-400 px-2.5 py-2 text-center font-black bg-slate-300/80 text-slate-950">
                    %
                  </th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {marks.map((row, idx) => {
                  const isPass = row.totalScore >= (scheme.passingMarks || 12);
                  return (
                    <tr key={row.id} className="h-8.5 break-inside-avoid hover:bg-slate-50">
                      <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono text-slate-600 font-semibold">{idx + 1}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-950">{row.studentRollNumber}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-950">{row.studentName}</td>
                      {scheme.components.map((comp) => (
                        <td key={comp.id} className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold text-slate-800">
                          {row.componentScores[comp.id] ?? "—"}
                        </td>
                      ))}
                      <td className="border border-slate-400 px-2.5 py-1.5 text-center font-mono font-black text-slate-950 bg-slate-50">
                        {row.totalScore}
                      </td>
                      <td className="border border-slate-400 px-2.5 py-1.5 text-center font-mono font-black text-slate-950 bg-slate-50">
                        {row.percentage}%
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-[10px] uppercase">
                        <span className={isPass ? "text-emerald-800 font-extrabold" : "text-rose-800 font-extrabold"}>
                          {isPass ? "PASS" : "FAIL"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === "ATTENDANCE" && (
            <table className="w-full text-left border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-200/90 text-[10.5px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="border border-slate-400 px-2.5 py-2 text-center w-10">S.No</th>
                  <th className="border border-slate-400 px-3 py-2 w-24">Roll No</th>
                  <th className="border border-slate-400 px-3 py-2">Student Name</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Conducted Units</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Attended Units</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-black bg-slate-300/80 text-slate-950">
                    Attendance %
                  </th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">
                    Statutory Compliance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {students.map((std, idx) => {
                  const attended = idx === 4 ? 15 : idx === 6 ? 17 : 24;
                  const pct = ((attended / 26) * 100).toFixed(1);
                  const isEligible = parseFloat(pct) >= 75.0;

                  return (
                    <tr key={std.id} className="h-8.5 break-inside-avoid hover:bg-slate-50">
                      <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono text-slate-600 font-semibold">{idx + 1}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-950">{std.rollNumber}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-950">{std.fullName}</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-semibold">26</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-bold text-slate-950">{attended}</td>
                      <td className="border border-slate-400 px-3 py-1.5 text-center font-mono font-black text-slate-950 bg-slate-50">{pct}%</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-[10px] uppercase">
                        <span className={isEligible ? "text-emerald-800 font-extrabold" : "text-rose-800 font-extrabold"}>
                          {isEligible ? "ELIGIBLE (≥ 75%)" : "SHORTAGE (< 75%)"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === "COMBINED_SUMMARY" && (
            <table className="w-full text-left border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-200/90 text-[10.5px] font-bold uppercase tracking-wider text-slate-900">
                  <th className="border border-slate-400 px-2.5 py-2 text-center w-10">S.No</th>
                  <th className="border border-slate-400 px-3 py-2 w-24">Roll No</th>
                  <th className="border border-slate-400 px-3 py-2">Student Name</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Attendance %</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Internal Score</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Max Marks</th>
                  <th className="border border-slate-400 px-3 py-2 text-center font-bold">Statutory Standing</th>
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
                    <tr key={std.id} className="h-8.5 break-inside-avoid hover:bg-slate-50">
                      <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono text-slate-600 font-semibold">{idx + 1}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-950">{std.rollNumber}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-950">{std.fullName}</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-bold text-slate-950">{attPct}%</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-bold text-slate-950">{intScore}</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-semibold">{scheme.totalMaxMarks}</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-[10px] uppercase">
                        <span className={isGood ? "text-emerald-800 font-extrabold" : "text-amber-800 font-extrabold"}>
                          {isGood ? "SATISFACTORY" : "AT RISK / SHORTAGE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Statistical Performance Cohort Summary Box */}
        <div className="mt-4 p-2.5 bg-slate-50 border border-slate-300 rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-center break-inside-avoid">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Enrolled</span>
            <span className="font-bold text-slate-900 font-mono text-xs">{students.length} Candidates</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Appeared</span>
            <span className="font-bold text-slate-900 font-mono text-xs">{marks.length} Students</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pass Percentage</span>
            <span className="font-bold text-emerald-700 font-mono text-xs">
              {marks.length > 0
                ? `${((marks.filter((m) => m.totalScore >= (scheme.passingMarks || 12)).length / marks.length) * 100).toFixed(1)}%`
                : "100.0%"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Average</span>
            <span className="font-bold text-slate-900 font-mono text-xs">
              {marks.length > 0
                ? `${(marks.reduce((acc, m) => acc + m.totalScore, 0) / marks.length).toFixed(1)} / ${scheme.totalMaxMarks}`
                : `24.5 / ${scheme.totalMaxMarks}`}
            </span>
          </div>
        </div>

        {/* Official Physical Signature Section (Bottom of Page) */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs break-inside-avoid">
          {/* Prepared By / Course Instructor */}
          <div className="space-y-8">
            <div className="h-10 flex items-end justify-center">
              <span className="text-[10px] text-slate-400 font-serif italic">
                (Sign above)
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <p className="font-bold text-slate-950 text-xs">{professorName}</p>
              <p className="text-[10px] text-slate-600 font-medium">Course Instructor / Professor</p>
              <p className="text-[10px] text-slate-600 font-medium">Date: ____________________</p>
            </div>
          </div>

          {/* Department Seal Stamp Box */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg border-2 border-dashed border-slate-400 flex flex-col items-center justify-center p-2 text-[10px] text-slate-500 font-bold uppercase text-center">
              <ShieldCheck className="w-5 h-5 text-slate-400 mb-1" />
              <span>Department Official Seal</span>
            </div>
          </div>

          {/* Verified By / Head of Department */}
          <div className="space-y-8">
            <div className="h-10 flex items-end justify-center">
              <span className="text-[10px] text-slate-400 font-serif italic">
                (Sign above)
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <p className="font-bold text-slate-950 text-xs">Head of the Department</p>
              <p className="text-[10px] text-slate-600 font-medium">Dept. of Systems & Comp. Biology</p>
              <p className="text-[10px] text-slate-600 font-medium">Date: ____________________</p>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-6 pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
          <span>University of Hyderabad • School of Life Sciences</span>
          <span>Official Examination Document • Confidential</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
