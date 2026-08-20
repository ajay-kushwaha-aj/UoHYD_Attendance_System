"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, MapPin, Clock, ArrowRight, User } from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAttendancePercentage } from "@/lib/utils";

export default function StudentCoursesPage() {
  const { currentStudent, getStudentAttendanceStats } = useAttendance();
  const stats = getStudentAttendanceStats(currentStudent.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
          Academic Curriculum
        </span>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
          Enrolled Courses & Syllabi
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          MSc Systems & Computational Biology • Semester 2
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.courseStats.map((item) => (
          <Card
            key={item.course.id}
            className="p-6 hover:border-outline transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2.5 py-1 rounded">
                  {item.course.code}
                </span>
                <Badge
                  variant={
                    item.status === "good"
                      ? "present"
                      : item.status === "warning"
                      ? "late"
                      : "absent"
                  }
                >
                  {formatAttendancePercentage(item.percentage)}
                </Badge>
              </div>

              <h2 className="text-base font-bold text-on-surface">
                {item.course.name}
              </h2>

              <div className="mt-4 space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-secondary" />
                  <span>Instructor: {item.course.professorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>{item.course.scheduleTime} ({item.course.scheduleDays.join(", ")})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>{item.course.room}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-low/80 border border-surface-container space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-primary">Theory Lectures</span>
                    <span className="font-bold text-primary">{item.theoryPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-medium">
                    {item.theoryAttended} / {item.theoryConducted} units
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-low/80 border border-surface-container space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-tertiary-teal">Lab Sessions</span>
                    <span className="font-bold text-tertiary-teal">
                      {item.labConducted > 0 ? `${item.labPercentage.toFixed(1)}%` : "N/A"}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-medium">
                    {item.labConducted > 0 ? `${item.labAttended} / ${item.labConducted} labs (1 attendance)` : "No Lab"}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                  <span>Overall Attendance: {item.attended} / {item.conducted} Total Units</span>
                  <span className="font-bold text-on-surface">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-attendance-present-dot rounded-full"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">
                {item.course.credits} Credits
              </span>
              <Link
                href={`/student/courses/${item.course.id}`}
                className="font-semibold text-tertiary-teal hover:underline flex items-center gap-1"
              >
                Course Details & Breakdown <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
