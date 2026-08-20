"use client";

import React, { useState } from "react";
import {
  CalendarX,
  AlertTriangle,
  Clock,
  MapPin,
  Info,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Course, TimeTableSlot } from "@/types";

interface CancelClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  slot?: TimeTableSlot | null;
  sessionId?: string;
  onConfirm: (params: {
    courseId: string;
    slotId?: string;
    sessionId?: string;
    reason: string;
    additionalRemarks?: string;
  }) => void;
}

const CANCELLATION_REASONS = [
  "Official Duty / National Research Conference (OD)",
  "Medical Leave / University Health Center Referral",
  "Departmental Academic Council / PhD Viva Committee",
  "University Notice / Administrative Holiday",
  "Examination / Invigilation Duty",
  "Lab Facility Maintenance / Equipment Setup",
  "Personal Emergency / Approved Academic Leave",
  "Other Official Reason",
];

export function CancelClassModal({
  isOpen,
  onClose,
  course,
  slot,
  sessionId,
  onConfirm,
}: CancelClassModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [additionalRemarks, setAdditionalRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!course) return null;

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select an official cancellation reason.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        courseId: course.id,
        slotId: slot?.id,
        sessionId,
        reason: selectedReason,
        additionalRemarks: additionalRemarks.trim() || undefined,
      });
      setIsSubmitting(false);
      setAdditionalRemarks("");
      setError("");
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Scheduled Class"
      description="Record official class cancellation with mandatory reason for enrolled students and administration."
      maxWidth="lg"
    >
      <form onSubmit={handleCancelSubmit} className="space-y-4">
        {/* Class Overview Banner */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0">
              <CalendarX className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-rose-900 bg-rose-200/80 px-1.5 py-0.5 rounded text-[11px]">
                  {course.code}
                </span>
                <span className="font-semibold text-rose-950 truncate">{course.name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-rose-800/90 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {slot ? `${slot.day} • ${slot.startTime} – ${slot.endTime}` : course.scheduleTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {slot?.room || course.room}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reason Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-on-surface">
            Official Reason for Cancellation <span className="text-destructive">*</span>
          </label>
          <select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-border bg-surface-lowest px-3 py-2 text-xs text-on-surface font-medium focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs"
            required
          >
            {CANCELLATION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Remarks / Compensatory Details */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-on-surface">
            Notice for Students & Administrative Record
          </label>
          <textarea
            value={additionalRemarks}
            onChange={(e) => setAdditionalRemarks(e.target.value)}
            placeholder="e.g. Compensatory lecture will be held on Thursday at 3:00 PM in LH-102. Please review reading material for Chapter 4."
            rows={3}
            className="w-full rounded-xl border border-border bg-surface-lowest p-2.5 text-xs text-on-surface focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs"
          />
          <p className="text-[10.5px] text-on-surface-variant">
            Provide compensatory class details or student instructions.
          </p>
        </div>

        {/* Institutional Policy Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>University Regulation:</strong> Canceling a scheduled class automatically notifies students, flags the timetable slot, and creates an audit entry accessible by the Dean & Administrative Office.
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs font-medium text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Keep Class Scheduled
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold gap-1.5 shadow-sm border border-rose-800"
          >
            <CalendarX className="w-4 h-4" />
            {isSubmitting ? "Canceling Class..." : "Confirm Class Cancellation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
