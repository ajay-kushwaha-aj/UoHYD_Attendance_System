"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Save,
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Course, TimeTableSlot } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormSection } from "@/components/ui/form-field";

interface ScheduleTimetableModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    courseId: string,
    scheduleData: {
      scheduleTime: string;
      scheduleDays: string[];
      room: string;
      timeTableSlots: TimeTableSlot[];
    }
  ) => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ScheduleTimetableModal({
  course,
  isOpen,
  onClose,
  onSave,
}: ScheduleTimetableModalProps) {
  // Initialize slots
  const initialSlots: TimeTableSlot[] =
    course.timeTableSlots && course.timeTableSlots.length > 0
      ? course.timeTableSlots
      : course.scheduleDays.map((d, i) => {
          const parts = course.scheduleTime.split("–").map((s) => s.trim());
          return {
            id: `slot-${Date.now()}-${i}`,
            day: d,
            startTime: parts[0] || "10:00 AM",
            endTime: parts[1] || "11:30 AM",
            room: course.room || "LH-204",
            sessionType: "LECTURE" as const,
          };
        });

  const [slots, setSlots] = useState<TimeTableSlot[]>(initialSlots);
  const [primaryRoom, setPrimaryRoom] = useState(course.room || "LH-204");
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleAddSlot = () => {
    const newSlot: TimeTableSlot = {
      id: `slot-${Date.now()}`,
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      room: primaryRoom,
      sessionType: "LECTURE",
    };
    setSlots((prev) => [...prev, newSlot]);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSlot = (id: string, field: keyof TimeTableSlot, value: any) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slots.length === 0) return;

    const uniqueDays = Array.from(new Set(slots.map((s) => s.day)));
    const firstSlot = slots[0];
    const derivedTime = `${firstSlot.startTime} – ${firstSlot.endTime}`;

    onSave(course.id, {
      scheduleTime: derivedTime,
      scheduleDays: uniqueDays,
      room: primaryRoom,
      timeTableSlots: slots,
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <Card className="w-full max-w-2xl p-6 space-y-6 shadow-elevation-3 bg-surface-lowest border border-border max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary-container bg-primary-fixed/40 px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <h2 className="text-base font-bold text-on-surface">
                  Subject Timetable & Schedule Architecture
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {course.name} • {course.program}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-low transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Course timetable updated and synchronized!</span>
          </div>
        )}

        {/* Scrollable Slots Editor */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-1">
          {/* Default Primary Classroom */}
          <div className="p-4 rounded-xl bg-surface-low border border-border">
            <FormField
              label="Primary Lecture Hall / Default Room"
              required
              hint="Fallback room used when timetable slots do not specify a separate wet lab or computing room."
            >
              <Input
                type="text"
                placeholder="e.g. LH-204"
                value={primaryRoom}
                onChange={(e) => setPrimaryRoom(e.target.value)}
                className="text-xs font-mono max-w-sm"
                required
              />
            </FormField>
          </div>

          {/* Timetable Slots Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Day-Wise Timetable Slots ({slots.length} Configured)
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  Configure day-specific timings and venue allocations.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSlot}
                className="gap-1.5 text-xs font-bold shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Day Slot
              </Button>
            </div>

            <div className="space-y-3">
              {slots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-border bg-surface hover:border-outline/50 transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-surface-container pb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Timetable Slot #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot.id)}
                      disabled={slots.length <= 1}
                      className="text-xs text-rose-600 hover:text-rose-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <FormField label="Day of Week" required>
                      <select
                        value={slot.day}
                        onChange={(e) => handleUpdateSlot(slot.id, "day", e.target.value)}
                        className="w-full h-10 rounded-xl border border-border bg-surface-lowest px-3 text-xs font-semibold text-on-surface shadow-xs focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                      >
                        {DAYS_OF_WEEK.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Start Time" required>
                      <Input
                        type="text"
                        placeholder="10:00 AM"
                        value={slot.startTime}
                        onChange={(e) => handleUpdateSlot(slot.id, "startTime", e.target.value)}
                        className="font-mono text-xs"
                        required
                      />
                    </FormField>

                    <FormField label="End Time" required>
                      <Input
                        type="text"
                        placeholder="11:30 AM"
                        value={slot.endTime}
                        onChange={(e) => handleUpdateSlot(slot.id, "endTime", e.target.value)}
                        className="font-mono text-xs"
                        required
                      />
                    </FormField>

                    <FormField label="Session Type">
                      <select
                        value={slot.sessionType || "LECTURE"}
                        onChange={(e) => handleUpdateSlot(slot.id, "sessionType", e.target.value)}
                        className="w-full h-10 rounded-xl border border-border bg-surface-lowest px-3 text-xs font-semibold text-on-surface shadow-xs focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                      >
                        <option value="LECTURE">Lecture (Theory)</option>
                        <option value="LAB">Lab (Practical)</option>
                        <option value="TUTORIAL">Tutorial</option>
                        <option value="SEMINAR">Seminar</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <FormField label="Classroom / Lab Venue">
                      <Input
                        type="text"
                        placeholder={`e.g. ${primaryRoom} or Bioinformatics Lab-1`}
                        value={slot.room || ""}
                        onChange={(e) => handleUpdateSlot(slot.id, "room", e.target.value)}
                        className="text-xs"
                      />
                    </FormField>

                    <FormField label="Class Duration & Attendance Credits">
                      <select
                        value={slot.hours || 1}
                        onChange={(e) => handleUpdateSlot(slot.id, "hours", parseInt(e.target.value, 10))}
                        className="w-full h-10 rounded-xl border border-indigo-300 bg-indigo-50/50 px-3 text-xs font-bold text-indigo-900 shadow-xs focus:outline-none focus:ring-3 focus:ring-indigo-300/30 transition-all"
                      >
                        <option value={1}>1 Hour Session = 1 Attendance Mark</option>
                        <option value={2}>2 Hours Session = 2 Attendance Marks (2 Classes)</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              className="bg-primary-container font-bold gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Timetable Schedule
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
