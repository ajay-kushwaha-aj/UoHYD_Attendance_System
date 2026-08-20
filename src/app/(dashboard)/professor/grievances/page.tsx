"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  User,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  AlertTriangle,
  ArrowRight,
  Award,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth } from "@/lib/auth-context";
import {
  GrievanceCategory,
  GrievancePriority,
  GrievanceStatus,
  StudentGrievance,
} from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export default function ProfessorGrievancesPage() {
  const {
    grievances,
    courses,
    currentProfessor,
    respondToGrievance,
    updateGrievanceStatus,
  } = useAttendance();
  const { user } = useAuth();

  const [selectedGrievance, setSelectedGrievance] = useState<StudentGrievance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"MY_ASSIGNED" | "ALL">("MY_ASSIGNED");
  const [statusFilter, setStatusFilter] = useState<"ALL" | GrievanceStatus>("ALL");

  // Reply state
  const [replyMessage, setReplyMessage] = useState("");
  const [newStatus, setNewStatus] = useState<GrievanceStatus>("RESOLVED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isResolutionSaved, setIsResolutionSaved] = useState(false);

  const activeProfId = currentProfessor?.id || user?.id || "prof-01";

  // Filter queries
  const scopedGrievances = grievances.filter((g) => {
    if (scopeFilter === "MY_ASSIGNED") {
      return (
        g.targetProfessorId === activeProfId ||
        (g.courseCode && courses.some((c) => c.code === g.courseCode && c.professorName === currentProfessor.fullName))
      );
    }
    return true;
  });

  const filteredGrievances = scopedGrievances.filter((g) => {
    const matchQuery =
      g.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.courseCode && g.courseCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === "ALL" || g.status === statusFilter;

    return matchQuery && matchStatus;
  });

  const pendingCount = scopedGrievances.filter(
    (g) => g.status === "PENDING" || g.status === "UNDER_REVIEW"
  ).length;
  const resolvedCount = scopedGrievances.filter((g) => g.status === "RESOLVED").length;

  const handleResolveAndReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !replyMessage.trim()) return;

    respondToGrievance(
      selectedGrievance.id,
      replyMessage.trim(),
      newStatus,
      resolutionNotes.trim() || undefined
    );

    setIsResolutionSaved(true);
    setTimeout(() => setIsResolutionSaved(false), 4000);

    // Update in view
    const updated = grievances.find((g) => g.id === selectedGrievance.id);
    if (updated) {
      setSelectedGrievance({
        ...updated,
        status: newStatus,
        resolutionNotes: resolutionNotes.trim() || updated.resolutionNotes,
        responses: [
          ...updated.responses,
          {
            id: `resp-${Date.now()}`,
            authorId: currentProfessor.id,
            authorName: currentProfessor.fullName,
            authorRole: "professor",
            message: replyMessage.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    setReplyMessage("");
    setResolutionNotes("");
  };

  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-900 border border-blue-300 animate-pulse">
            <Clock className="w-3 h-3" /> Action Required
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-primary shrink-0" />
            <span>Student Inquiries & Grievance Inbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Review and resolve student inquiries tagged to you regarding attendance discrepancies, marks verification, and schedule conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">Active Faculty:</span>
          <span className="px-3 py-1 rounded-xl bg-primary-fixed/40 text-primary font-bold text-xs border border-primary/20">
            {currentProfessor.fullName}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-on-surface-variant">Inquiries Received</span>
            <div className="text-2xl font-black text-on-surface font-mono mt-0.5">{scopedGrievances.length}</div>
            <span className="text-[11px] text-on-surface-variant">Student Submissions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-800">Pending Review</span>
            <div className="text-2xl font-black text-amber-900 font-mono mt-0.5">{pendingCount}</div>
            <span className="text-[11px] text-amber-700">Awaiting Your Action</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-800">Resolved Queries</span>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-0.5">{resolvedCount}</div>
            <span className="text-[11px] text-emerald-700">Closed with Verdict</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter / Scope Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search student, roll number, ticket #, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 text-on-surface"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Scope Tabs */}
            <div className="flex items-center gap-1 bg-surface-container/60 p-1 rounded-lg text-xs">
              <button
                onClick={() => setScopeFilter("MY_ASSIGNED")}
                className={cn(
                  "px-3 py-1 rounded text-[11px] font-semibold transition-colors",
                  scopeFilter === "MY_ASSIGNED"
                    ? "bg-primary text-white font-bold"
                    : "text-on-surface-variant hover:bg-surface-low"
                )}
              >
                Assigned to Me ({scopedGrievances.length})
              </button>
              <button
                onClick={() => setScopeFilter("ALL")}
                className={cn(
                  "px-3 py-1 rounded text-[11px] font-semibold transition-colors",
                  scopeFilter === "ALL"
                    ? "bg-primary text-white font-bold"
                    : "text-on-surface-variant hover:bg-surface-low"
                )}
              >
                All Department ({grievances.length})
              </button>
            </div>

            {/* Status Segment */}
            <div className="flex items-center gap-1 bg-surface-container/60 p-1 rounded-lg text-xs">
              {(["ALL", "PENDING", "UNDER_REVIEW", "RESOLVED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-semibold transition-colors",
                    statusFilter === st
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {st === "ALL" ? "All" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Inbox & Response Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Queries List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredGrievances.length === 0 ? (
            <Card className="p-12 text-center text-on-surface-variant space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto opacity-60" />
              <p className="font-bold text-sm text-on-surface">No Pending Inquiries</p>
              <p className="text-xs">
                All student attendance disputes and course queries assigned to you are currently up to date.
              </p>
            </Card>
          ) : (
            filteredGrievances.map((ticket) => {
              const isSelected = selectedGrievance?.id === ticket.id;
              const isPending = ticket.status === "PENDING" || ticket.status === "UNDER_REVIEW";

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedGrievance(ticket)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 text-xs shadow-2xs relative",
                    isSelected
                      ? "bg-primary-fixed/25 border-primary shadow-sm"
                      : isPending
                      ? "bg-surface-lowest hover:bg-surface-low border-amber-300"
                      : "bg-surface-lowest hover:bg-surface-low border-border"
                  )}
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-primary text-[11px] shrink-0">
                        {ticket.ticketNumber}
                      </span>
                      <span className="font-bold text-on-surface truncate">
                        {ticket.studentName} ({ticket.studentRollNo})
                      </span>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>

                  {/* Subject */}
                  <h3 className="font-bold text-on-surface text-sm line-clamp-2 leading-snug">
                    {ticket.subject}
                  </h3>

                  {/* Category & Course Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-semibold text-on-surface-variant">
                      {ticket.category.replace("_", " ")}
                    </span>
                    {ticket.courseCode && (
                      <span className="px-2 py-0.5 rounded bg-primary-fixed/50 font-bold text-primary font-mono">
                        {ticket.courseCode}
                      </span>
                    )}
                    {ticket.priority === "HIGH" || ticket.priority === "URGENT" ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold">
                        {ticket.priority} PRIORITY
                      </span>
                    ) : null}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[10.5px] text-outline pt-1 border-t border-surface-container/60">
                    <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-tertiary-teal">
                      {ticket.responses.length} {ticket.responses.length === 1 ? "Response" : "Responses"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Redressal & Resolution Drawer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedGrievance ? (
            <Card className="p-6 space-y-6 bg-surface-lowest border border-border shadow-elevation-1">
              {/* Header */}
              <div className="space-y-3 pb-4 border-b border-surface-container">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-primary">
                      Ticket #{selectedGrievance.ticketNumber}
                    </span>
                    {selectedGrievance.priority === "URGENT" && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-black text-[10px] uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  {getStatusBadge(selectedGrievance.status)}
                </div>

                <h2 className="text-lg font-bold text-on-surface tracking-tight">
                  {selectedGrievance.subject}
                </h2>

                {/* Student Profile Card */}
                <div className="p-3 rounded-xl bg-surface-low border border-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {selectedGrievance.studentName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{selectedGrievance.studentName}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">
                        {selectedGrievance.studentRollNo} • {selectedGrievance.studentEmail}
                      </div>
                    </div>
                  </div>

                  {selectedGrievance.courseId && (
                    <Link
                      href={`/professor/courses/${selectedGrievance.courseId}`}
                      className="text-xs font-semibold text-tertiary-teal hover:underline flex items-center gap-1"
                    >
                      Open Course Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Student's Problem Statement */}
              <div className="p-4 rounded-xl bg-surface-low/90 border border-surface-container space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="font-bold text-on-surface">Student Submission Description:</span>
                  <span>{new Date(selectedGrievance.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-on-surface leading-relaxed text-xs pt-1 whitespace-pre-wrap">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Communication History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Response History ({selectedGrievance.responses.length})
                </h4>

                {selectedGrievance.responses.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-low text-xs text-on-surface-variant text-center">
                    No faculty response recorded yet. Use the form below to write your official reply.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedGrievance.responses.map((resp) => {
                      const isFaculty = resp.authorRole === "professor" || resp.authorRole === "admin";
                      return (
                        <div
                          key={resp.id}
                          className={cn(
                            "p-4 rounded-xl text-xs space-y-1.5 border",
                            isFaculty
                              ? "bg-primary-fixed/20 border-primary/30"
                              : "bg-surface-low border-surface-container"
                          )}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 font-bold text-on-surface">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                  isFaculty
                                    ? "bg-primary text-white"
                                    : "bg-surface-container text-on-surface-variant"
                                )}
                              >
                                {isFaculty ? "Faculty Verdict" : "Student Reply"}
                              </span>
                              <span>{resp.authorName}</span>
                            </div>
                            <span className="text-outline text-[10.5px]">
                              {new Date(resp.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-on-surface leading-relaxed pt-1">
                            {resp.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Toast */}
              {isResolutionSaved && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Resolution decision & response sent to student successfully!</span>
                </div>
              )}

              {/* Faculty Action & Decision Form */}
              <form
                onSubmit={handleResolveAndReply}
                className="p-5 rounded-2xl bg-surface-low/70 border border-primary/20 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-surface-container pb-2">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>Faculty Redressal Verdict & Reply</span>
                  </h4>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Update Grievance Decision / Status:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "UNDER_REVIEW", label: "Under Review", cls: "hover:border-amber-400" },
                      { key: "RESOLVED", label: "Resolve / Approve", cls: "hover:border-emerald-400" },
                      { key: "REJECTED", label: "Reject / Dismiss", cls: "hover:border-rose-400" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => setNewStatus(opt.key as GrievanceStatus)}
                        className={cn(
                          "py-2 rounded-xl border text-xs font-bold transition-all",
                          newStatus === opt.key
                            ? opt.key === "RESOLVED"
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                              : opt.key === "UNDER_REVIEW"
                              ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                              : "bg-rose-700 text-white border-rose-700 shadow-xs"
                            : "bg-surface-lowest text-on-surface-variant border-border"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Message */}
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Official Message to Student <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Verified with attendance sheet. Your medical slip has been accepted and attendance recorded as PRESENT (2 units)."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs leading-relaxed"
                  />
                </div>

                {/* Resolution Summary (Optional) */}
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Resolution Notes (Institutional Record Summary)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Attendance manually adjusted to PRESENT with Health Center authorization."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-md gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Decision & Notify Student</span>
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-16 text-center text-on-surface-variant space-y-3 bg-surface-lowest border border-border">
              <MessageSquareText className="w-12 h-12 text-on-surface-variant/30 mx-auto" />
              <h3 className="text-base font-bold text-on-surface">Select a Student Inquiry</h3>
              <p className="text-xs max-w-sm mx-auto">
                Choose any student ticket from the inbox on the left to review their statements, inspect course data, and dispatch official resolutions.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
