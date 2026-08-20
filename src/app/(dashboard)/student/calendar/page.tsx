"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentCalendarPage() {
  const { courses, cancelledClasses } = useAttendance();

  // Dynamically compute weekly schedule from active course timetable slots
  const days = WEEKDAYS.map((dayName) => {
    const dayClasses: Array<{
      course: (typeof courses)[0];
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
            Academic Schedule
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Weekly Timetable & Lecture Schedule
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            MSc Systems & Computational Biology • Semester 2 • Multi-hour lecture blocks count proportionally toward attendance marks.
          </p>
        </div>

        <Link href="/student/scan">
          <Button variant="teal" size="sm" className="gap-1.5 font-bold">
            <QrCode className="w-3.5 h-3.5" />
            Check-In to Current Lecture
          </Button>
        </Link>
      </div>

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
                    className={`p-3.5 space-y-2 transition-colors text-xs border ${
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

                    {cls.isCancelled && (
                      <div className="pt-2 border-t border-rose-200 text-[10.5px] text-rose-900 space-y-0.5 bg-rose-100/60 p-2 rounded-lg border border-rose-200">
                        <p className="font-bold text-rose-800">Cancelled by Instructor:</p>
                        <p className="italic">{cls.cancellationRecord?.reason || "Official Faculty Duty / Notice"}</p>
                        {cls.cancellationRecord?.additionalRemarks && (
                          <p className="text-[10px] text-rose-800 font-medium">
                            Note: {cls.cancellationRecord.additionalRemarks}
                          </p>
                        )}
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
    </div>
  );
}
