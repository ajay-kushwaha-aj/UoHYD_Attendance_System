"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  Plus,
  CheckCircle2,
  X,
  Save,
  Award,
  Calendar,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Course } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleTimetableModal } from "@/components/courses/schedule-timetable-modal";
import { FormField, FormSection } from "@/components/ui/form-field";

export default function ProfessorCoursesPage() {
  const { courses, createCourse, updateCourseSchedule, currentProfessor } = useAttendance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableEditingCourse, setTimetableEditingCourse] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState("");

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(4);
  const [semester, setSemester] = useState(2);
  const [room, setRoom] = useState("LH-204");
  const [scheduleTime, setScheduleTime] = useState("02:00 PM – 03:30 PM");
  const [scheduleDays, setScheduleDays] = useState<string[]>(["Tuesday", "Thursday"]);

  const handleOpenModal = () => {
    setCode(`SCB-50${courses.length + 1}`);
    setName("");
    setCredits(4);
    setSemester(2);
    setRoom(`LH-${200 + courses.length + 1}`);
    setIsModalOpen(true);
  };

  const handleDayToggle = (day: string) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const created = createCourse({
      code: code.toUpperCase(),
      name,
      credits: Number(credits),
      semester: Number(semester),
      program: "MSc Systems & Computational Biology",
      department: "Department of Systems & Computational Biology",
      professorId: currentProfessor.id,
      professorName: currentProfessor.fullName,
      room,
      scheduleTime,
      scheduleDays: scheduleDays.length > 0 ? scheduleDays : ["Tuesday", "Thursday"],
    });

    setIsModalOpen(false);
    setSuccessToast(`Course ${created.code}: ${created.name} added to your teaching curricula!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Faculty Teaching Workspaces
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Course Workspaces & Teaching Allocations
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Department of Systems & Computational Biology • School of Life Sciences
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenModal}
          className="bg-primary-container font-bold gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Course Curriculum
        </Button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const slots =
            course.timeTableSlots && course.timeTableSlots.length > 0
              ? course.timeTableSlots
              : course.scheduleDays.map((d, i) => ({
                  id: `slot-prev-${i}`,
                  day: d,
                  startTime: course.scheduleTime.split("–")[0]?.trim() || "10:00 AM",
                  endTime: course.scheduleTime.split("–")[1]?.trim() || "11:30 AM",
                  room: course.room,
                  sessionType: "LECTURE" as const,
                }));

          return (
            <Card
              key={course.id}
              className="p-6 hover:border-outline hover:shadow-elevation-1 transition-all duration-150 flex flex-col justify-between border border-border"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2.5 py-1 rounded">
                    {course.code}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {course.credits} Credits • {course.program}
                  </span>
                </div>

                <h2 className="text-base font-bold text-on-surface">
                  {course.name}
                </h2>

                <div className="mt-4 space-y-2 text-xs text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>{course.totalStudents} Enrolled Students</span>
                    </div>
                    <button
                      onClick={() => setTimetableEditingCourse(course)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Edit Timetable
                    </button>
                  </div>

                  {/* Day slots preview */}
                  <div className="p-2.5 rounded-lg bg-surface-low border border-border space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      <span>Timetable Schedule</span>
                      <span className="text-primary font-mono">{slots.length} Sessions/Week</span>
                    </div>
                    <div className="space-y-0.5 pt-0.5">
                      {slots.map((s, idx) => (
                        <div key={s.id || idx} className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-on-surface">
                            {s.day} <span className="text-[10px] text-outline uppercase font-mono">({s.sessionType || "LECTURE"})</span>
                          </span>
                          <span className="font-mono text-on-surface-variant">
                            {s.startTime} – {s.endTime} • {s.room || course.room}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container text-xs text-on-surface-variant flex items-center justify-between">
                  <span>
                    Conducted Sessions: <strong>{course.totalConductedSessions} classes</strong>
                  </span>
                  <span className="font-semibold text-primary">{course.professorName}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between">
                <Link href={`/professor/courses/${course.id}`}>
                  <Button variant="primary" size="sm" className="gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    Open Workspace
                  </Button>
                </Link>
                <Link
                  href={`/professor/courses/${course.id}?tab=internal-marks`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  Internal Marks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Card className="w-full max-w-lg p-6 space-y-6 shadow-elevation-3 bg-surface-lowest border border-border">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    Create Course Curriculum
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Add new course curriculum & schedule to your faculty workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <FormSection title="Curriculum & Course Identity">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField label="Course Code" required badge="Uppercase">
                    <Input
                      type="text"
                      placeholder="e.g. SCB-505"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="font-mono font-bold uppercase"
                    />
                  </FormField>

                  <FormField label="Course Title" required>
                    <Input
                      type="text"
                      placeholder="e.g. Advanced Drug Design"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Credits (L-T-P)" required>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      value={credits}
                      onChange={(e) => setCredits(Number(e.target.value))}
                      required
                      className="font-mono"
                    />
                  </FormField>

                  <FormField label="Academic Semester" required>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-on-surface shadow-xs hover:border-outline focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                    >
                      <option value={1}>Semester 1</option>
                      <option value={2}>Semester 2</option>
                      <option value={3}>Semester 3</option>
                      <option value={4}>Semester 4</option>
                    </select>
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Classroom & Schedule Timing">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField label="Lecture Room / Lab" required>
                    <Input
                      type="text"
                      placeholder="e.g. LH-204"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      required
                      className="font-mono"
                    />
                  </FormField>

                  <FormField label="Schedule Timing" required>
                    <Input
                      type="text"
                      placeholder="e.g. 02:00 PM – 03:30 PM"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Active Schedule Days" hint="Select lecture and practical recurring days">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          scheduleDays.includes(day)
                            ? "bg-primary text-white border-primary shadow-xs font-bold"
                            : "bg-surface text-on-surface-variant border-border hover:bg-surface-low"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </FormField>
              </FormSection>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  className="bg-primary-container font-bold gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Course
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Timetable Modal */}
      {timetableEditingCourse && (
        <ScheduleTimetableModal
          course={timetableEditingCourse}
          isOpen={!!timetableEditingCourse}
          onClose={() => setTimetableEditingCourse(null)}
          onSave={updateCourseSchedule}
        />
      )}
    </div>
  );
}
