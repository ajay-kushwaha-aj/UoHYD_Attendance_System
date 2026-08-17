"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Save,
  GraduationCap,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Course } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScheduleTimetableModal } from "@/components/courses/schedule-timetable-modal";
import { FormField, FormSection } from "@/components/ui/form-field";

export default function AdminCoursesPage() {
  const { courses, createCourse, updateCourseSchedule, professors } = useAttendance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableEditingCourse, setTimetableEditingCourse] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState("");

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(4);
  const [semester, setSemester] = useState(2);
  const [program, setProgram] = useState("MSc Systems & Computational Biology");
  const [department, setDepartment] = useState("Department of Systems & Computational Biology");
  const [professorId, setProfessorId] = useState(professors[0]?.id || "prof-01");
  const [room, setRoom] = useState("LH-204");
  const [scheduleTime, setScheduleTime] = useState("11:30 AM – 01:00 PM");
  const [scheduleDays, setScheduleDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);

  const handleOpenModal = () => {
    const nextCode = `SCB-50${courses.length + 1}`;
    setCode(nextCode);
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

    const assignedProf = professors.find((p) => p.id === professorId) || professors[0];

    const created = createCourse({
      code: code.toUpperCase(),
      name,
      credits: Number(credits),
      semester: Number(semester),
      program,
      department,
      professorId: assignedProf.id,
      professorName: assignedProf.fullName,
      room,
      scheduleTime,
      scheduleDays: scheduleDays.length > 0 ? scheduleDays : ["Monday", "Wednesday"],
    });

    setIsModalOpen(false);
    setSuccessToast(`Course ${created.code}: ${created.name} created successfully!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Curriculum Architecture
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Course & Syllabus Directory
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
          Create New Course
        </Button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c) => {
          const slots = c.timeTableSlots && c.timeTableSlots.length > 0
            ? c.timeTableSlots
            : c.scheduleDays.map((d, i) => ({
                id: `slot-preview-${i}`,
                day: d,
                startTime: c.scheduleTime.split("–")[0]?.trim() || "10:00 AM",
                endTime: c.scheduleTime.split("–")[1]?.trim() || "11:30 AM",
                room: c.room,
                sessionType: "LECTURE" as const,
              }));

          return (
            <Card key={c.id} className="p-6 space-y-4 hover:shadow-elevation-1 transition-shadow border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2.5 py-1 rounded">
                  {c.code}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {c.credits} Credits • Sem {c.semester}
                </span>
              </div>

              <h2 className="text-base font-bold text-on-surface">{c.name}</h2>

              <div className="space-y-2 text-xs text-on-surface-variant">
                <div>
                  Faculty: <strong className="text-on-surface">{c.professorName}</strong>
                </div>

                {/* Timetable slots preview */}
                <div className="p-2.5 rounded-lg bg-surface-low border border-border space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" /> Timetable Slots ({slots.length} Days)
                    </span>
                    <button
                      onClick={() => setTimetableEditingCourse(c)}
                      className="text-primary hover:underline font-bold"
                    >
                      Edit Timetable
                    </button>
                  </div>
                  <div className="space-y-1 pt-1">
                    {slots.map((s, idx) => (
                      <div key={s.id || idx} className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-on-surface">
                          {s.day} ({s.sessionType || "LECTURE"})
                        </span>
                        <span className="font-mono text-on-surface-variant">
                          {s.startTime} – {s.endTime} • {s.room || c.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">{c.totalStudents} Students Enrolled</span>
                <div className="flex items-center gap-2">
                  <Badge variant="present" withDot>
                    Active Term
                  </Badge>
                  <Link
                    href={`/professor/courses/${c.id}`}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Workspace →
                  </Link>
                </div>
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
                    Create New Course
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Add new course curriculum & assign course faculty
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
                      placeholder="e.g. Systems Immunology"
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

              <FormSection title="Faculty & Venue Allocation">
                <FormField label="Assigned Course Instructor" required>
                  <select
                    value={professorId}
                    onChange={(e) => setProfessorId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-on-surface shadow-xs hover:border-outline focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                  >
                    {professors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.designation})
                      </option>
                    ))}
                  </select>
                </FormField>

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
                      placeholder="e.g. 10:00 AM – 11:30 AM"
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
                  <Save className="w-4 h-4" /> Create Course
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
