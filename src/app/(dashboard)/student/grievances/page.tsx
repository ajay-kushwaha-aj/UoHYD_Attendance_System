"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  Plus,
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

export default function StudentGrievancesPage() {
  const {
    grievances,
    courses,
    professors,
    currentStudent,
    submitGrievance,
    respondToGrievance,
  } = useAttendance();
  const { user } = useAuth();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<StudentGrievance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | GrievanceStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | GrievanceCategory>("ALL");

  // Form State
  const [category, setCategory] = useState<GrievanceCategory>("ATTENDANCE_DISCREPANCY");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [priority, setPriority] = useState<GrievancePriority>("NORMAL");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittedToast, setIsSubmittedToast] = useState(false);

  // Student specific tickets
  const myStudentId = currentStudent?.id || user?.id || "std-01";
  const myGrievances = grievances.filter(
    (g) => g.studentId === myStudentId || g.studentRollNo === (currentStudent?.rollNumber || "25MCMS01")
  );

  const filteredGrievances = myGrievances.filter((g) => {
    const matchQuery =
      g.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.targetProfessorName && g.targetProfessorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.courseCode && g.courseCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === "ALL" || g.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || g.category === categoryFilter;

    return matchQuery && matchStatus && matchCategory;
  });

  const pendingCount = myGrievances.filter((g) => g.status === "PENDING" || g.status === "UNDER_REVIEW").length;
  const resolvedCount = myGrievances.filter((g) => g.status === "RESOLVED").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const courseObj = courses.find((c) => c.id === selectedCourseId);
    const profObj = professors.find((p) => p.id === selectedProfessorId);

    const newTicket = submitGrievance({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentRollNo: currentStudent.rollNumber,
      studentEmail: currentStudent.email,
      category,
      subject: subject.trim(),
      description: description.trim(),
      courseId: courseObj?.id,
      courseCode: courseObj?.code,
      courseName: courseObj?.name,
      targetProfessorId: profObj?.id,
      targetProfessorName: profObj?.fullName,
      priority,
    });

    setIsSubmitModalOpen(false);
    setSubject("");
    setDescription("");
    setSelectedCourseId("");
    setSelectedProfessorId("");
    setPriority("NORMAL");
    setIsSubmittedToast(true);
    setSelectedGrievance(newTicket);
    setTimeout(() => setIsSubmittedToast(false), 5000);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !replyMessage.trim()) return;

    respondToGrievance(selectedGrievance.id, replyMessage.trim());
    setReplyMessage("");

    // Update selected grievance in state
    const updated = grievances.find((g) => g.id === selectedGrievance.id);
    if (updated) {
      setSelectedGrievance({
        ...updated,
        responses: [
          ...updated.responses,
          {
            id: `resp-${Date.now()}`,
            authorId: currentStudent.id,
            authorName: currentStudent.fullName,
            authorRole: "student",
            message: replyMessage.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Clock className="w-3 h-3" /> Pending Faculty
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

  const getCategoryLabel = (cat: GrievanceCategory) => {
    switch (cat) {
      case "ATTENDANCE_DISCREPANCY":
        return "Attendance Discrepancy";
      case "INTERNAL_MARKS":
        return "Internal Marks Re-check";
      case "TIMETABLE_CLASH":
        return "Timetable / Slot Conflict";
      case "MEDICAL_LEAVE":
        return "Medical Leave / Slip";
      case "GENERAL_QUERY":
        return "General Academic Inquiry";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-primary shrink-0" />
            <span>Academic Query & Grievance Redressal Cell</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Submit discrepancies in attendance records, internal assessment re-evaluation queries, or timetable issues directly to assigned faculty members.
          </p>
        </div>

        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Query / Grievance</span>
        </Button>
      </div>

      {/* Toast Notification */}
      {isSubmittedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Query Ticket Successfully Dispatched!</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                The mentioned professor has been notified in their dashboard and will review your request.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmittedToast(false)}
            className="p-1 rounded-md hover:bg-emerald-100 text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-on-surface-variant">Total Submissions</span>
            <div className="text-2xl font-black text-on-surface font-mono mt-0.5">{myGrievances.length}</div>
            <span className="text-[11px] text-on-surface-variant">Registered Tickets</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-800">In Active Review</span>
            <div className="text-2xl font-black text-amber-900 font-mono mt-0.5">{pendingCount}</div>
            <span className="text-[11px] text-amber-700">Awaiting Faculty Action</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-surface-lowest border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-800">Resolved Queries</span>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-0.5">{resolvedCount}</div>
            <span className="text-[11px] text-emerald-700">With Official Resolution Notes</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by ticket #, subject, professor, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-tertiary-teal/30 text-on-surface"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs overflow-x-auto">
              {(["ALL", "PENDING", "UNDER_REVIEW", "RESOLVED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap",
                    statusFilter === st
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {st === "ALL" ? "All Tickets" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Ticket List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredGrievances.length === 0 ? (
            <Card className="p-12 text-center text-on-surface-variant space-y-3">
              <MessageSquareText className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
              <p className="font-bold text-sm text-on-surface">No Grievances or Queries Found</p>
              <p className="text-xs">
                You have not filed any tickets matching this filter. Click &ldquo;New Query / Grievance&rdquo; above to ask your professors.
              </p>
            </Card>
          ) : (
            filteredGrievances.map((ticket) => {
              const isSelected = selectedGrievance?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedGrievance(ticket)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 text-xs shadow-2xs relative",
                    isSelected
                      ? "bg-primary-fixed/25 border-primary shadow-sm"
                      : "bg-surface-lowest hover:bg-surface-low border-border"
                  )}
                >
                  {/* Top: Ticket No & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-primary text-[11px]">
                      {ticket.ticketNumber}
                    </span>
                    {getStatusBadge(ticket.status)}
                  </div>

                  {/* Subject */}
                  <h3 className="font-bold text-on-surface line-clamp-2 text-sm leading-snug">
                    {ticket.subject}
                  </h3>

                  {/* Details Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-semibold text-on-surface-variant">
                      {getCategoryLabel(ticket.category)}
                    </span>
                    {ticket.courseCode && (
                      <span className="px-2 py-0.5 rounded bg-primary-fixed/50 font-bold text-primary font-mono">
                        {ticket.courseCode}
                      </span>
                    )}
                  </div>

                  {/* Mentioned Professor Tag */}
                  {ticket.targetProfessorName && (
                    <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant pt-1 border-t border-surface-container/60">
                      <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        Mentioned Faculty: <strong className="text-on-surface">{ticket.targetProfessorName}</strong>
                      </span>
                    </div>
                  )}

                  {/* Footer & Responses Count */}
                  <div className="flex items-center justify-between text-[10.5px] text-outline pt-1">
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-tertiary-teal">
                      {ticket.responses.length} {ticket.responses.length === 1 ? "Response" : "Responses"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Ticket Thread & Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedGrievance ? (
            <Card className="p-6 space-y-6 bg-surface-lowest border border-border shadow-elevation-1">
              {/* Header */}
              <div className="space-y-3 pb-4 border-b border-surface-container">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-extrabold text-sm text-primary">
                    Ticket #{selectedGrievance.ticketNumber}
                  </span>
                  {getStatusBadge(selectedGrievance.status)}
                </div>

                <h2 className="text-lg font-bold text-on-surface tracking-tight">
                  {selectedGrievance.subject}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant pt-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-low">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <span>Course: <strong className="text-on-surface">{selectedGrievance.courseName || selectedGrievance.courseCode || "General Inquiry"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-low">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <span>Assigned Faculty: <strong className="text-on-surface">{selectedGrievance.targetProfessorName || "Department Office"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Student Initial Statement */}
              <div className="p-4 rounded-xl bg-surface-low/80 border border-surface-container space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-2 font-bold text-on-surface">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px]">
                      {selectedGrievance.studentName[0]}
                    </div>
                    <span>{selectedGrievance.studentName} ({selectedGrievance.studentRollNo})</span>
                  </div>
                  <span>{new Date(selectedGrievance.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-on-surface leading-relaxed text-xs pt-1 whitespace-pre-wrap">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Official Resolution Box (if resolved) */}
              {selectedGrievance.resolutionNotes && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Official Resolution Summary</span>
                  </div>
                  <p className="leading-relaxed text-emerald-900">
                    {selectedGrievance.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Conversation Thread / Faculty Responses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Faculty Communication Trail ({selectedGrievance.responses.length})
                </h4>

                {selectedGrievance.responses.length === 0 ? (
                  <div className="p-6 rounded-xl bg-surface-low text-center text-xs text-on-surface-variant">
                    <Clock className="w-5 h-5 mx-auto text-on-surface-variant/50 mb-1" />
                    <p className="font-semibold text-on-surface">Awaiting Professor Response</p>
                    <p className="text-[11px] mt-0.5">
                      Your query has been routed to {selectedGrievance.targetProfessorName || "the faculty member"}. You will receive a notification when they reply.
                    </p>
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
                                {isFaculty ? "Faculty Official" : "Student"}
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

              {/* Follow-up Reply Box */}
              <form onSubmit={handleSendFollowUp} className="pt-3 border-t border-surface-container space-y-2">
                <label className="block text-xs font-bold text-on-surface">
                  Send Follow-up Note / Clarification
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your response to the faculty member..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                  />
                  <Button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-16 text-center text-on-surface-variant space-y-3 bg-surface-lowest border border-border">
              <MessageSquareText className="w-12 h-12 text-on-surface-variant/30 mx-auto" />
              <h3 className="text-base font-bold text-on-surface">Select a Query Ticket</h3>
              <p className="text-xs max-w-sm mx-auto">
                Choose any query from the list on the left to view official faculty responses, status history, and send follow-ups.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL: Submit New Grievance / Query */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Academic Query or Grievance"
        description="Formal grievance redressal channel for University of Hyderabad MSc students."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Row 1: Category & Related Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-on-surface mb-1">
                Grievance Category <span className="text-rose-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                className="w-full h-9.5 px-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium text-xs"
              >
                <option value="ATTENDANCE_DISCREPANCY">Attendance Discrepancy / Missing Hours</option>
                <option value="INTERNAL_MARKS">Internal Assessment Marks Re-check</option>
                <option value="MEDICAL_LEAVE">Medical Exemption / Health Center Slip</option>
                <option value="TIMETABLE_CLASH">Timetable & Schedule Slot Conflict</option>
                <option value="GENERAL_QUERY">General Academic / Curriculum Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">
                Related Subject / Course (Optional)
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-9.5 px-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium text-xs"
              >
                <option value="">-- All Courses / General Inquiry --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Mention Specific Professor (Direct Routing) */}
          <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary/30 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                <label className="font-bold text-primary text-xs">
                  Mention / Route to Specific Professor:
                </label>
              </div>
              <span className="text-[10.5px] font-semibold text-primary/80">
                ⚡ Direct Faculty Dashboard Alert
              </span>
            </div>
            <select
              value={selectedProfessorId}
              onChange={(e) => setSelectedProfessorId(e.target.value)}
              className="w-full h-9.5 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-xs"
            >
              <option value="">-- Select Faculty Member to Direct this Query --</option>
              {professors.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.department.split("of ")[1] || p.department})
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Priority & Subject Line */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
            <div className="md:col-span-4">
              <label className="block font-bold text-on-surface mb-1">Priority Level</label>
              <div className="grid grid-cols-3 gap-1.5 h-9.5">
                {(["NORMAL", "HIGH", "URGENT"] as const).map((pr) => (
                  <button
                    type="button"
                    key={pr}
                    onClick={() => setPriority(pr)}
                    className={cn(
                      "rounded-lg border font-bold text-[11px] transition-all flex items-center justify-center",
                      priority === pr
                        ? pr === "URGENT"
                          ? "bg-rose-100 text-rose-950 border-rose-400 font-extrabold"
                          : "bg-primary text-white border-primary shadow-2xs"
                        : "bg-surface-low text-on-surface-variant border-border hover:bg-surface-container"
                    )}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-8">
              <label className="block font-bold text-on-surface mb-1">
                Subject Line <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Attendance missing for 2-hour lecture session on Aug 14"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-9.5 px-3.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium text-xs"
              />
            </div>
          </div>

          {/* Row 4: Detailed Statement */}
          <div>
            <label className="block font-bold text-on-surface mb-1">
              Detailed Query / Complaint Statement <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Please provide full details, dates, lecture hours, and any reference details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold px-5 shadow-md"
            >
              Submit Ticket to Faculty
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
