"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  Lock,
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import {
  AssessmentScheme,
  StudentInternalMark,
  MarkStatus,
  StudentProfile,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SchemeConfigModal } from "./scheme-config-modal";
import { ReasonModal } from "./reason-modal";

interface MarksEntryTableProps {
  courseId: string;
  batchId: string;
  section: string;
  scheme: AssessmentScheme;
  marks: StudentInternalMark[];
  students: StudentProfile[];
  onSaveDraft: (updatedMarks: StudentInternalMark[]) => void;
  onFinalize: () => void;
  onPublish: () => void;
  onUpdateScheme: (updatedScheme: AssessmentScheme) => void;
  onUpdateMarkScore: (
    markId: string,
    componentId: string,
    score: number | null,
    reason?: string
  ) => void;
}

export function MarksEntryTable({
  courseId,
  batchId,
  section,
  scheme,
  marks,
  students,
  onSaveDraft,
  onFinalize,
  onPublish,
  onUpdateScheme,
  onUpdateMarkScore,
}: MarksEntryTableProps) {
  const [localMarks, setLocalMarks] = useState<StudentInternalMark[]>(marks);
  const [searchQuery, setSearchQuery] = useState("");
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reason Modal for post-finalization edit
  const [auditTarget, setAuditTarget] = useState<{
    markId: string;
    componentId: string;
    studentName: string;
    componentName: string;
    oldScore: number | null;
    newScore: number;
  } | null>(null);

  useEffect(() => {
    setLocalMarks(marks);
    setHasUnsavedChanges(false);
  }, [marks]);

  const currentStatus: MarkStatus = localMarks[0]?.status || "DRAFT";

  const handleScoreChange = (
    markId: string,
    componentId: string,
    compMax: number,
    inputValue: string
  ) => {
    const errorKey = `${markId}-${componentId}`;
    const num = inputValue === "" ? null : parseFloat(inputValue);

    if (num !== null && (isNaN(num) || num < 0 || num > compMax)) {
      setValidationErrors((prev) => ({
        ...prev,
        [errorKey]: `Cannot exceed ${compMax}`,
      }));
      return;
    }

    // Clear error
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });

    const targetMark = localMarks.find((m) => m.id === markId);

    // If status is FINALIZED or PUBLISHED, trigger Reason Audit modal
    if ((currentStatus === "FINALIZED" || currentStatus === "PUBLISHED") && num !== null) {
      const comp = scheme.components.find((c) => c.id === componentId);
      setAuditTarget({
        markId,
        componentId,
        studentName: targetMark?.studentName || "Student",
        componentName: comp?.name || "Component",
        oldScore: targetMark?.componentScores[componentId] ?? null,
        newScore: num,
      });
      return;
    }

    // Update local state directly
    setLocalMarks((prev) =>
      prev.map((item) => {
        if (item.id !== markId) return item;

        const updatedScores = {
          ...item.componentScores,
          [componentId]: num,
        };

        let total = 0;
        Object.values(updatedScores).forEach((v) => {
          if (typeof v === "number") total += v;
        });

        const pct =
          scheme.totalMaxMarks > 0
            ? parseFloat(((total / scheme.totalMaxMarks) * 100).toFixed(1))
            : 0;

        return {
          ...item,
          componentScores: updatedScores,
          totalScore: total,
          percentage: pct,
        };
      })
    );

    setHasUnsavedChanges(true);
  };

  const handleConfirmAuditReason = (reason: string) => {
    if (!auditTarget) return;
    onUpdateMarkScore(
      auditTarget.markId,
      auditTarget.componentId,
      auditTarget.newScore,
      reason
    );
    setAuditTarget(null);
  };

  const filteredMarks = localMarks.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.studentRollNumber.toLowerCase().includes(q) ||
      m.studentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Action Controls & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-lowest p-4 rounded-xl border border-border">
        {/* Left: Status & Total summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface">Marks Status:</span>
            {currentStatus === "DRAFT" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                Draft Mode
              </span>
            )}
            {currentStatus === "FINALIZED" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <Lock className="w-3.5 h-3.5 mr-1" />
                Finalized (Locked)
              </span>
            )}
            {currentStatus === "PUBLISHED" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Published to Students
              </span>
            )}
          </div>

          <div className="hidden sm:block h-4 w-px bg-border" />

          <span className="hidden sm:inline text-xs text-on-surface-variant font-medium">
            Total Max: <strong className="text-primary font-mono">{scheme.totalMaxMarks} Marks</strong> (Passing: {scheme.passingMarks || 12})
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfigModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-tertiary-teal" />
            Configure Scheme
          </Button>

          {currentStatus === "DRAFT" && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onSaveDraft(localMarks)}
                className="text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onFinalize}
                className="text-xs gap-1.5 bg-primary-container font-bold"
              >
                <Lock className="w-3.5 h-3.5" />
                Finalize Marks
              </Button>
            </>
          )}

          {currentStatus === "FINALIZED" && (
            <Button
              type="button"
              variant="teal"
              size="sm"
              onClick={onPublish}
              className="text-xs gap-1.5 font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              Publish Marks to Cohort
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && currentStatus === "DRAFT" && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>You have unsaved changes in marks entry.</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSaveDraft(localMarks)}
            className="text-xs py-1 h-7 bg-amber-200/60 hover:bg-amber-200 text-amber-900 border-amber-300"
          >
            Save Changes Now
          </Button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Input
            placeholder="Search by Roll No or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
            className="text-xs h-9 bg-surface-lowest"
          />
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          Showing <strong>{filteredMarks.length}</strong> of {localMarks.length} Students
        </span>
      </div>

      {/* Desktop Spreadsheet Table */}
      <div className="hidden md:block">
        <Card className="p-0 overflow-hidden border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-4 py-3.5 w-12 text-center">S.No</th>
                  <th className="px-4 py-3.5 w-28">Roll No</th>
                  <th className="px-4 py-3.5 min-w-[160px]">Student Name</th>
                  {scheme.components.map((comp) => (
                    <th key={comp.id} className="px-3 py-3.5 text-center min-w-[90px]">
                      <div>{comp.name}</div>
                      <div className="text-[10px] text-outline font-mono font-normal">
                        Max: {comp.maxMarks}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-center font-bold text-primary min-w-[80px]">
                    Total ({scheme.totalMaxMarks})
                  </th>
                  <th className="px-4 py-3.5 text-center font-bold min-w-[80px]">
                    %
                  </th>
                  <th className="px-4 py-3.5 text-right min-w-[100px]">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container bg-surface-lowest">
                {filteredMarks.map((row, idx) => {
                  const isPass = row.totalScore >= (scheme.passingMarks || 12);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-surface-low/40 transition-colors h-14"
                    >
                      <td className="px-4 py-2 text-center font-mono text-outline">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 font-mono font-bold text-primary">
                        {row.studentRollNumber}
                      </td>
                      <td className="px-4 py-2 font-semibold text-on-surface">
                        {row.studentName}
                      </td>

                      {/* Component Scores Input Cells */}
                      {scheme.components.map((comp) => {
                        const val = row.componentScores[comp.id];
                        const err = validationErrors[`${row.id}-${comp.id}`];

                        return (
                          <td key={comp.id} className="px-2 py-2 text-center relative">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max={comp.maxMarks}
                              value={val === null || val === undefined ? "" : val}
                              onChange={(e) =>
                                handleScoreChange(
                                  row.id,
                                  comp.id,
                                  comp.maxMarks,
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className={`w-16 h-8 text-center text-xs font-mono font-bold rounded border transition-all focus:outline-none focus:ring-2 ${
                                err
                                  ? "border-rose-500 bg-rose-50 text-rose-800 focus:ring-rose-200"
                                  : "border-outline-variant bg-surface hover:border-outline focus:border-primary-container focus:ring-tertiary-teal/20"
                              }`}
                            />
                            {err && (
                              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-rose-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                                {err}
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Column */}
                      <td className="px-4 py-2 text-center font-mono font-bold text-primary text-sm">
                        {row.totalScore}
                      </td>

                      {/* Percentage Column */}
                      <td className="px-4 py-2 text-center font-mono font-bold">
                        <span
                          className={isPass ? "text-emerald-700" : "text-rose-700"}
                        >
                          {row.percentage}%
                        </span>
                      </td>

                      {/* Result Badge */}
                      <td className="px-4 py-2 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isPass
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {isPass ? "Pass" : "At Risk"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Student-by-Student Marks Cards */}
      <div className="block md:hidden space-y-3">
        {filteredMarks.map((row) => (
          <Card key={row.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div>
                <span className="text-xs font-bold text-on-surface">{row.studentName}</span>
                <p className="text-[11px] font-mono text-primary font-bold">{row.studentRollNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-primary">{row.totalScore} / {scheme.totalMaxMarks}</span>
                <p className="text-[10px] font-semibold text-emerald-700">{row.percentage}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {scheme.components.map((comp) => {
                const val = row.componentScores[comp.id];
                return (
                  <div key={comp.id} className="bg-surface-low p-2 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                      <span>{comp.name}</span>
                      <span className="text-outline font-mono">Max: {comp.maxMarks}</span>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={comp.maxMarks}
                      value={val === null || val === undefined ? "" : val}
                      onChange={(e) =>
                        handleScoreChange(
                          row.id,
                          comp.id,
                          comp.maxMarks,
                          e.target.value
                        )
                      }
                      className="w-full h-8 text-center text-xs font-mono font-bold rounded border border-outline-variant bg-white"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Scheme Configuration Modal */}
      <SchemeConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        scheme={scheme}
        onSave={onUpdateScheme}
      />

      {/* Audit Reason Modal for post-finalization edit */}
      {auditTarget && (
        <ReasonModal
          isOpen={!!auditTarget}
          onClose={() => setAuditTarget(null)}
          onConfirm={handleConfirmAuditReason}
          studentName={auditTarget.studentName}
          componentName={auditTarget.componentName}
          oldScore={auditTarget.oldScore}
          newScore={auditTarget.newScore}
        />
      )}
    </div>
  );
}
