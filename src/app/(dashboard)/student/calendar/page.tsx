"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentCalendarPage() {
  const { courses } = useAttendance();

  // Dynamically compute weekly schedule from active course timetable slots
  const days = WEEKDAYS.map((dayName) => {
    const dayClasses: Array<{
      course: (typeof courses)[0];
      time: string;
      room: string;
      sessionType?: string;
    }> = [];

    courses.forEach((course) => {
      if (course.timeTableSlots && course.timeTableSlots.length > 0) {
        const matchingSlots = course.timeTableSlots.filter(
          (s) => s.day.toLowerCase() === dayName.toLowerCase()
        );
        matchingSlots.forEach((slot) => {
          dayClasses.push({
            course,
            time: `${slot.startTime} – ${slot.endTime}`,
            room: slot.room || course.room,
            sessionType: slot.sessionType || "LECTURE",
          });
        });
      } else if (
        course.scheduleDays.some((d) => d.toLowerCase() === dayName.toLowerCase())
      ) {
        dayClasses.push({
          course,
          time: course.scheduleTime,
          room: course.room,
          sessionType: "LECTURE",
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
            MSc Systems & Computational Biology • Semester 2
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
                  <Card key={idx} className="p-3.5 space-y-2 hover:border-outline transition-colors text-xs border border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] text-primary-container bg-surface-container px-1.5 py-0.5 rounded">
                        {cls.course.code}
                      </span>
                      {cls.sessionType && (
                        <span className="text-[9px] uppercase font-bold text-outline">
                          {cls.sessionType}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-on-surface line-clamp-2">
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
