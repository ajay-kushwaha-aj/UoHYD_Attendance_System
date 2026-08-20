"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Play,
  Calendar as CalendarIcon,
  CalendarX,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CancelClassModal } from "@/components/calendar/cancel-class-modal";
import { Course, TimeTableSlot } from "@/types";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ProfessorCalendarPage() {
  const { courses, cancelledClasses, cancelScheduledClass, uncancelClass } = useAttendance();

  const [selectedCourseForCancel, setSelectedCourseForCancel] = useState<Course | null>(null);
  const [selectedSlotForCancel, setSelectedSlotForCancel] = useState<TimeTableSlot | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const handleOpenCancel = (course: Course, slot?: TimeTableSlot) => {
    setSelectedCourseForCancel(course);
    setSelectedSlotForCancel(slot || null);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = ({
    courseId,
    slotId,
    reason,
    additionalRemarks,
  }: {
    courseId: string;
    slotId?: string;
    reason: string;
    additionalRemarks?: string;
  }) => {
    cancelScheduledClass({
      courseId,
      slotId,
      reason,
      additionalRemarks,
      day: selectedSlotForCancel?.day,
      time: selectedSlotForCancel
        ? `${selectedSlotForCancel.startTime} – ${selectedSlotForCancel.endTime}`
        : undefined,
      room: selectedSlotForCancel?.room,
    });
    setToastMessage("Class has been successfully cancelled and logged for students & admin.");
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Dynamically compute weekly schedule from active course timetable slots
  const days = WEEKDAYS.map((dayName) => {
    const dayClasses: Array<{
      course: (typeof courses)[0];
      slot?: TimeTableSlot;
      time: string;
      room: string;
      sessionType?: string;
      hours: number;
      isCancelled: boolean;
      cancellationRecord?: (typeof cancelledClasses)[0];
    }> = [];

    courses.forEach((course) => {
      if (course.timeTableSlots && course.timeTableSlots.length > 0) {
        const matchingSlots = course.timeTableSlots.filter(
          (s) => s.day.toLowerCase() === dayName.toLowerCase()
        );
        matchingSlots.forEach((slot) => {
          const cancelRecord = cancelledClasses.find(
            (c) =>
              c.courseId === course.id &&
              (c.slotId === slot.id || c.day.toLowerCase() === dayName.toLowerCase())
          );

          dayClasses.push({
            course,
            slot,
            time: `${slot.startTime} – ${slot.endTime}`,
            room: slot.room || course.room,
            sessionType: slot.sessionType || "LECTURE",
            hours: slot.hours || 1,
            isCancelled: Boolean(slot.isCancelled || cancelRecord),
            cancellationRecord: cancelRecord,
          });
        });
      } else if (
        course.scheduleDays.some((d) => d.toLowerCase() === dayName.toLowerCase())
      ) {
        const cancelRecord = cancelledClasses.find(
          (c) =>
            c.courseId === course.id &&
            c.day.toLowerCase() === dayName.toLowerCase()
        );

        dayClasses.push({
          course,
          time: course.scheduleTime,
          room: course.room,
          sessionType: "LECTURE",
          hours: 1,
          isCancelled: Boolean(cancelRecord),
          cancellationRecord: cancelRecord,
        });
      }
    });

    return {
      name: dayName,
      classes: dayClasses,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Faculty Schedule & Attendance Management
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Teaching Timetable & Class Schedules
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Department of Systems & Computational Biology • Mark cancellations with mandatory faculty reasons for university administration and student notice.
          </p>
        </div>

        <Link href="/professor/courses">
          <Button variant="primary" size="sm" className="bg-primary-container font-bold gap-1.5 shadow-sm">
            <CalendarIcon className="w-3.5 h-3.5" />
            Manage Timetables
          </Button>
        </Link>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage("")} className="text-emerald-700 hover:text-emerald-900 font-bold">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((d) => (
          <div key={d.name} className="space-y-3">
            <div className="p-2.5 rounded-lg bg-primary-fixed/40 text-center font-bold text-xs text-primary-container">
              {d.name}
            </div>

            <div className="space-y-2.5">
              {d.classes.length > 0 ? (
                d.classes.map((cls, idx) => (
                  <Card
                    key={idx}
                    className={`p-3.5 space-y-2.5 transition-colors text-xs border ${
                      cls.isCancelled
                        ? "bg-rose-50/40 border-rose-200"
                        : "bg-surface-lowest border-border hover:border-outline"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          cls.isCancelled
                            ? "bg-rose-200/80 text-rose-900"
                            : "bg-surface-container text-primary-container"
                        }`}
                      >
                        {cls.course.code}
                      </span>
                      <div className="flex items-center gap-1">
                        {cls.isCancelled ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            CANCELLED
                          </span>
                        ) : (
                          <>
                            {cls.sessionType && (
                              <span className="text-[9px] uppercase font-bold text-outline">
                                {cls.sessionType}
                              </span>
                            )}
                            {cls.sessionType === "LAB" ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
                                Lab (1 Attendance)
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {cls.hours} {cls.hours === 1 ? "Hr (1 Attendance)" : "Hrs (2 Attendance)"}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <h4
                      className={`font-semibold line-clamp-2 ${
                        cls.isCancelled ? "text-rose-950 line-through opacity-80" : "text-on-surface"
                      }`}
                    >
                      {cls.course.name}
                    </h4>

                    <div className="text-[11px] text-on-surface-variant space-y-1 pt-1 border-t border-surface-container">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-secondary shrink-0" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-secondary shrink-0" />
                        <span className="truncate">{cls.room}</span>
                      </div>
                    </div>

                    {cls.isCancelled ? (
                      <div className="pt-2 border-t border-rose-200 space-y-2">
                        <div className="p-2 rounded-lg bg-rose-100/70 text-[10.5px] text-rose-900 space-y-0.5 border border-rose-200">
                          <div className="flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3 text-rose-700" />
                            <span>Reason for Cancellation:</span>
                          </div>
                          <p className="italic">{cls.cancellationRecord?.reason || "Official Faculty Duty / Notice"}</p>
                          {cls.cancellationRecord?.additionalRemarks && (
                            <p className="text-[10px] text-rose-800 font-medium">
                              Note: {cls.cancellationRecord.additionalRemarks}
                            </p>
                          )}
                        </div>
                        {cls.cancellationRecord && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => uncancelClass(cls.cancellationRecord!.id)}
                            className="w-full text-xs h-7 gap-1 font-semibold text-rose-800 hover:bg-rose-100"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Re-instate Class
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-surface-container flex items-center gap-1.5">
                        <Link href={`/professor/session/sess-today-01`} className="flex-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs h-7 gap-1 font-semibold"
                          >
                            <Play className="w-3 h-3 fill-primary-container text-primary-container" />
                            Launch
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenCancel(cls.course, cls.slot)}
                          className="text-xs h-7 px-2 text-rose-700 hover:bg-rose-50 hover:text-rose-800 border-rose-200"
                          title="Mark class as cancelled with official reason"
                        >
                          <CalendarX className="w-3.5 h-3.5" />
                          <span className="sr-only sm:not-sr-only sm:text-[10px]">Cancel</span>
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-on-surface-variant bg-surface-low/30">
                  No scheduled classes
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Class Modal */}
      <CancelClassModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        course={selectedCourseForCancel}
        slot={selectedSlotForCancel}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

