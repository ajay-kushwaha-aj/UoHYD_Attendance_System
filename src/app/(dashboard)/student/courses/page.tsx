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

              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                  <span>Attendance: {item.attended} / {item.conducted} lectures</span>
                  <span>{item.percentage.toFixed(1)}%</span>
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
                href="/student/history"
                className="font-semibold text-tertiary-teal hover:underline flex items-center gap-1"
              >
                View Attendance Logs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
