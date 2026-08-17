"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Plus,
  Download,
  Building2,
  CheckCircle2,
  X,
  Save,
  Briefcase,
  Layers,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormField, FormSection } from "@/components/ui/form-field";

export default function AdminProfessorsPage() {
  const { professors, addFacultyMember, courses } = useAttendance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Form State
  const [fullName, setFullName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [designation, setDesignation] = useState("Associate Professor");
  const [department, setDepartment] = useState("Department of Systems & Computational Biology");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 98490 ");
  const [room, setRoom] = useState("Faculty Block-B, Room 304");
  const [specialization, setSpecialization] = useState("Structural Biology & Drug Discovery");

  const handleOpenModal = () => {
    setFullName("");
    setEmployeeCode(`EMP-UOH-${Math.floor(100 + Math.random() * 900)}`);
    setDesignation("Associate Professor");
    setEmail("");
    setPhone("+91 98490 12345");
    setRoom("Faculty Block-B, Room 304");
    setSpecialization("Systems Biology & Computational Genomics");
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const added = addFacultyMember({
      fullName,
      employeeCode,
      designation,
      department,
      role: "professor",
      email,
      phone,
      room,
      specialization,
      assignedCourses: ["course-scb-501"],
    });

    setIsAddModalOpen(false);
    setSuccessToast(`Prof. ${added.fullName} appointed to faculty registry!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Academic Faculty Directory
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Teaching Faculty & Chairs
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
          Add Faculty Member
        </Button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professors.map((p) => {
          const teachingCourses = courses.filter((c) => c.professorId === p.id || c.professorName === p.fullName);

          return (
            <Card key={p.id} className="p-6 space-y-4 hover:shadow-elevation-1 transition-shadow border border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {p.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">{p.fullName}</h2>
                    <span className="text-xs font-medium text-tertiary-teal block">{p.designation}</span>
                    <span className="text-[11px] font-mono text-outline">{p.employeeCode}</span>
                  </div>
                </div>

                <Badge variant="present" withDot>
                  Active Faculty
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-surface-container pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="font-mono">{p.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>{p.room}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-low border border-border text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-on-surface">Specialization:</span>
                  <span className="font-semibold text-primary">{p.specialization}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">Assigned Curricula:</span>
                  <span className="font-bold text-on-surface">{teachingCourses.length} Courses</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Faculty Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Card className="w-full max-w-lg p-6 space-y-6 shadow-elevation-3 bg-surface-lowest border border-border">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    Add Faculty Member
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Appoint professor to departmental faculty directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <FormSection title="Academic Appointment">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField label="Faculty Full Name" required>
                    <Input
                      type="text"
                      placeholder="e.g. Dr. Ananya Sen"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!email && e.target.value) {
                          const clean = e.target.value.toLowerCase().replace(/^(dr|prof)\.?\s*/i, "").replace(/\s+/g, ".");
                          setEmail(`${clean}@uohyd.ac.in`);
                        }
                      }}
                      required
                    />
                  </FormField>

                  <FormField label="Employee Code" required badge="Uppercase">
                    <Input
                      type="text"
                      placeholder="e.g. EMP-UOH-890"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      required
                      className="font-mono font-bold uppercase"
                    />
                  </FormField>

                  <FormField label="Designation" required>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-on-surface shadow-xs hover:border-outline focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                    >
                      <option value="Professor & Chair">Professor & Chair</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Visiting Professor">Visiting Professor</option>
                      <option value="Adjunct Faculty">Adjunct Faculty</option>
                    </select>
                  </FormField>

                  <FormField label="Institutional Email" required>
                    <Input
                      type="email"
                      placeholder="e.g. ananya.sen@uohyd.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Office Location & Domain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField label="Faculty Office / Room">
                    <Input
                      type="text"
                      placeholder="e.g. Faculty Block-B, Room 304"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Contact Phone">
                    <Input
                      type="tel"
                      placeholder="+91 98490 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField label="Research & Teaching Specialization">
                  <Input
                    type="text"
                    placeholder="e.g. Molecular Dynamics & Drug Discovery"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </FormField>
              </FormSection>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  className="bg-primary-container font-bold gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Appoint Faculty
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
