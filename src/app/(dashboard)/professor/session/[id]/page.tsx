"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Key,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Maximize2,
  ArrowLeft,
  Filter,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { AttendanceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AttendanceSegmentedToggle } from "@/components/ui/segmented-toggle";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export default function ProfessorSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    activeSession,
    sessions,
    updateStudentRecord,
    markAllPresent,
    clearAttendance,
    lockSession,
    reopenSession,
    regenerateQrToken,
    regenerateCode,
  } = useAttendance();

  const currentSession =
    sessions.find((s) => s.id === params.id) || activeSession || sessions[0];

  const [activeTab, setActiveTab] = useState<"manual" | "qr" | "code">("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AttendanceStatus>("ALL");
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [auditReason, setAuditReason] = useState("");
  const [editReasonModal, setEditReasonModal] = useState<{
    isOpen: boolean;
    studentId?: string;
    studentName?: string;
    newStatus?: AttendanceStatus;
  }>({ isOpen: false });
  const [overrideReason, setOverrideReason] = useState("");

  // Countdown timer for QR / Code
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const records = currentSession?.records || [];

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const totalCount = records.length;

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ? true : rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    studentId: string,
    studentName: string,
    newStatus: AttendanceStatus
  ) => {
    if (currentSession.status === "LOCKED") {
      setEditReasonModal({
        isOpen: true,
        studentId,
        studentName,
        newStatus,
      });
    } else {
      updateStudentRecord(currentSession.id, studentId, newStatus);
    }
  };

  const handleConfirmOverride = () => {
    if (
      editReasonModal.studentId &&
      editReasonModal.newStatus &&
      overrideReason.trim()
    ) {
      updateStudentRecord(
        currentSession.id,
        editReasonModal.studentId,
        editReasonModal.newStatus,
        overrideReason.trim()
      );
      setEditReasonModal({ isOpen: false });
      setOverrideReason("");
    }
  };

  const handleLockSession = () => {
    lockSession(currentSession.id, auditReason || "Attendance finalized and locked by instructor");
    setLockModalOpen(false);
    setAuditReason("");
  };

  const handleReopenSession = () => {
    if (!auditReason.trim()) return;
    reopenSession(currentSession.id, auditReason);
    setReopenModalOpen(false);
    setAuditReason("");
  };

  if (!currentSession) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-on-surface-variant">Session not found.</p>
        <Link href="/professor/dashboard">
          <Button variant="primary" size="sm" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/professor/dashboard">
            <button className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-container text-on-surface-variant transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2 py-0.5 rounded">
                {currentSession.courseCode}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {currentSession.program} • Sem {currentSession.semester}
              </span>
              {currentSession.status === "LOCKED" ? (
                <Badge variant="secondary" className="gap-1 bg-surface-container text-on-surface-variant">
                  <Lock className="w-3 h-3 text-secondary" /> Locked
                </Badge>
              ) : (
                <Badge variant="present" withDot>
                  Active Session
                </Badge>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
              {currentSession.courseName}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            href={`/professor/session/${currentSession.id}/projector`}
            target="_blank"
          >
            <Button variant="secondary" size="default" className="shadow-sm">
              <Maximize2 className="w-4 h-4 text-tertiary-teal" />
              <span className="hidden sm:inline">Projector View</span>
            </Button>
          </Link>

          {currentSession.status === "ACTIVE" ? (
            <Button
              variant="primary"
              size="default"
              onClick={() => setLockModalOpen(true)}
              className="shadow-sm bg-primary-container"
            >
              <Lock className="w-4 h-4" />
              Save & Lock
            </Button>
          ) : (
            <Button
              variant="outline"
              size="default"
              onClick={() => setReopenModalOpen(true)}
            >
              <Unlock className="w-4 h-4" />
              Reopen Session
            </Button>
          )}
        </div>
      </div>

      {/* Live Attendance Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-lowest p-4 rounded-xl border border-border shadow-elevation-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary-fixed/40 text-primary-container">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Total Roster
            </div>
            <div className="text-lg font-bold text-on-surface">{totalCount} Students</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-attendance-present-bg text-attendance-present-text">
            <CheckCircle2 className="w-5 h-5 text-attendance-present-dot" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-attendance-present-text">
              Present
            </div>
            <div className="text-lg font-bold text-attendance-present-text">
              {presentCount} ({Math.round((presentCount / (totalCount || 1)) * 100)}%)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-attendance-late-bg text-attendance-late-text">
            <Clock className="w-5 h-5 text-attendance-late-dot" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-attendance-late-text">
              Late
            </div>
            <div className="text-lg font-bold text-attendance-late-text">{lateCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-attendance-absent-bg text-attendance-absent-text">
            <XCircle className="w-5 h-5 text-attendance-absent-dot" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-attendance-absent-text">
              Absent
            </div>
            <div className="text-lg font-bold text-attendance-absent-text">{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-surface-container gap-2">
        <button
          onClick={() => setActiveTab("manual")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors",
            activeTab === "manual"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Users className="w-4 h-4" />
          Manual Roster Table
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors",
            activeTab === "qr"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          <QrCode className="w-4 h-4" />
          Dynamic QR Code
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors",
            activeTab === "code"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Key className="w-4 h-4" />
          5-Digit Class Code
        </button>
      </div>

      {/* TAB 1: MANUAL ATTENDANCE ROSTER */}
      {activeTab === "manual" && (
        <Card className="p-0 overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-low/40">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Input
                placeholder="Search student or roll number..."
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-lowest text-xs h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-border text-xs">
                <span className="text-[10px] font-semibold text-on-surface-variant px-2">
                  Filter:
                </span>
                {(["ALL", "PRESENT", "LATE", "ABSENT"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-semibold transition-colors",
                      statusFilter === st
                        ? "bg-primary text-white"
                        : "text-on-surface-variant hover:bg-surface-container"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {currentSession.status === "ACTIVE" && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => markAllPresent(currentSession.id)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Mark All Present
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearAttendance(currentSession.id)}
                    className="text-xs text-rose-700"
                  >
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Roster List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-low/80 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Marked Via</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-surface-low/50 transition-colors h-16"
                  >
                    <td className="px-6 py-3 font-mono font-semibold text-primary">
                      {record.studentRollNumber}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-on-surface">
                        {record.studentName}
                      </div>
                      {record.remarks && (
                        <div className="text-[10px] text-on-surface-variant italic mt-0.5">
                          Note: {record.remarks}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1 rounded bg-surface-container px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant">
                        {record.markedVia}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant font-mono text-[11px]">
                      {record.markedAt || "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex justify-end">
                        <AttendanceSegmentedToggle
                          value={record.status}
                          onChange={(newStatus) =>
                            handleStatusChange(
                              record.studentId,
                              record.studentName,
                              newStatus
                            )
                          }
                          disabled={false}
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-xs text-on-surface-variant">
              No students match the current search or status filter.
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: DYNAMIC QR CODE DISPLAY */}
      {activeTab === "qr" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-2xl bg-white shadow-elevation-2 border border-border inline-block">
              <QRCodeSVG
                value={currentSession.qrToken || "uohyd-scb-attendance-token"}
                size={220}
                level="H"
                includeMargin
              />
            </div>

            <div className="mt-6 space-y-1">
              <div className="text-sm font-bold text-on-surface">
                Scan with Student App or Camera
              </div>
              <p className="text-xs text-on-surface-variant">
                Token refreshes dynamically to prevent proxy sharing.
              </p>
            </div>

            {/* Countdown and Refresh Bar */}
            <div className="mt-4 flex items-center gap-3 bg-surface-low px-4 py-2 rounded-full border border-border text-xs">
              <Clock className="w-4 h-4 text-tertiary-teal" />
              <span>
                Token expires in:{" "}
                <strong className="font-mono text-primary">
                  {Math.floor(secondsLeft / 60)}:
                  {(secondsLeft % 60).toString().padStart(2, "0")}
                </strong>
              </span>
              <button
                onClick={() => {
                  regenerateQrToken(currentSession.id);
                  setSecondsLeft(300);
                }}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                title="Force refresh token"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Real-time scan feed */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <h3 className="text-sm font-bold text-on-surface">
                  Live Attendance Check-ins
                </h3>
                <Badge variant="present" withDot>
                  {presentCount} of {totalCount} Joined
                </Badge>
              </div>

              <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
                {records
                  .filter((r) => r.status === "PRESENT" || r.status === "LATE")
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-surface-low text-xs animate-in fade-in"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-attendance-present-bg text-attendance-present-text flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface">
                            {rec.studentName}
                          </div>
                          <div className="text-[10px] text-on-surface-variant font-mono">
                            {rec.studentRollNumber}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        {rec.markedAt}
                      </span>
                    </div>
                  ))}
                {presentCount === 0 && (
                  <p className="text-xs text-on-surface-variant text-center py-8">
                    Waiting for students to scan the QR code...
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container flex justify-end">
              <Link
                href={`/professor/session/${currentSession.id}/projector`}
                target="_blank"
              >
                <Button variant="primary" size="sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Open Fullscreen Projector
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: 5-DIGIT ATTENDANCE CODE */}
      {activeTab === "code" && (
        <div className="max-w-xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
                Temporary Classroom Code
              </span>
              <h2 className="text-lg font-bold text-on-surface mt-1">
                Share this 5-digit code with attending students
              </h2>
            </div>

            {/* Code Box */}
            <div className="py-6 px-8 rounded-2xl bg-surface-low border-2 border-dashed border-primary/30 inline-block">
              <div className="text-5xl font-black font-mono tracking-widest text-primary">
                {currentSession.attendanceCode || "7X4P9"}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-on-surface-variant">
              <span>Expires in {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s</span>
              <span>•</span>
              <button
                onClick={() => {
                  regenerateCode(currentSession.id);
                  setSecondsLeft(300);
                }}
                className="text-tertiary-teal font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Generate New Code
              </button>
            </div>

            <div className="p-4 rounded-xl bg-primary-fixed/30 text-xs text-primary-on-fixed-variant text-left leading-relaxed">
              <strong>Tip for Instructors:</strong> Students can enter this code in their mobile portal under the <em>"Enter Code"</em> tab if their device camera is unavailable.
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: Save & Lock Attendance */}
      <Modal
        isOpen={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        title="Finalize & Lock Attendance"
        description="Locking attendance freezes the session records. Future edits will require a mandatory audit explanation."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-low text-xs space-y-1.5">
            <div className="flex justify-between font-semibold text-on-surface">
              <span>Present Students:</span>
              <span className="text-attendance-present-text font-bold">{presentCount}</span>
            </div>
            <div className="flex justify-between font-semibold text-on-surface">
              <span>Late Students:</span>
              <span className="text-attendance-late-text font-bold">{lateCount}</span>
            </div>
            <div className="flex justify-between font-semibold text-on-surface">
              <span>Absent Students:</span>
              <span className="text-attendance-absent-text font-bold">{absentCount}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Locking Remarks (Optional)
            </label>
            <Input
              placeholder="e.g. Verified against lecture room head count"
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLockModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLockSession}
              className="bg-primary-container"
            >
              <Lock className="w-4 h-4" />
              Confirm & Lock
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Reopen Locked Session */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Reopen Locked Session"
        description="To unlock this session, please state the academic or administrative justification. This will be recorded in the security audit trail."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Reason for Reopening <span className="text-rose-600">*</span>
            </label>
            <textarea
              className="w-full rounded-md border border-outline-variant bg-surface p-3 text-xs text-on-surface focus:border-tertiary-teal focus:ring-2 focus:ring-tertiary-teal/30 focus:outline-none min-h-[90px]"
              placeholder="e.g. Correcting mistaken absent entry for Ajay Kumar after verified Dean medical approval..."
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReopenModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReopenSession}
              disabled={!auditReason.trim()}
            >
              <Unlock className="w-4 h-4" />
              Submit & Unlock Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Locked Session Record Override */}
      <Modal
        isOpen={editReasonModal.isOpen}
        onClose={() => setEditReasonModal({ isOpen: false })}
        title="Attendance Override Justification"
        description={`This session is currently locked. Provide the justification to mark ${editReasonModal.studentName} as ${editReasonModal.newStatus}.`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Override Justification <span className="text-rose-600">*</span>
            </label>
            <Input
              placeholder="e.g. Student presented signed lab permission slip"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditReasonModal({ isOpen: false })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmOverride}
              disabled={!overrideReason.trim()}
            >
              Apply & Log Override
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
