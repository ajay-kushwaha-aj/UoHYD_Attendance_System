"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  GraduationCap,
  Phone,
  Building2,
  Save,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField, FormSection } from "@/components/ui/form-field";

export default function AdminStudentsPage() {
  const { students, enrollStudent, batches } = useAttendance();
  const [search, setSearch] = useState("");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState("ALL");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Form State for new student enrollment
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [batchId, setBatchId] = useState("batch-2025-27");
  const [section, setSection] = useState("A");
  const [semester, setSemester] = useState(2);
  const [program, setProgram] = useState("MSc Systems & Computational Biology");

  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchBatch = selectedBatchFilter === "ALL" || s.batchId === selectedBatchFilter;
    return matchSearch && matchBatch;
  });

  const handleOpenModal = () => {
    // Suggest next roll number
    const nextNum = String(students.length + 1).padStart(2, "0");
    setRollNumber(`25MCMS${nextNum}`);
    setFullName("");
    setEmail(`student${nextNum}@uohyd.ac.in`);
    setPhone("+91 98765 432" + nextNum);
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !rollNumber || !email) return;

    const chosenBatch = batches.find((b) => b.id === batchId);

    const enrolled = enrollStudent({
      fullName,
      rollNumber: rollNumber.toUpperCase(),
      email,
      phone,
      batchId,
      batchName: chosenBatch?.name || "MSc SCB 2025–27",
      section,
      semester: Number(semester),
      program,
      department: "Department of Systems & Computational Biology",
      enrollmentNumber: `UOH/SLS/2025/0${String(students.length + 114)}`,
      role: "student",
    });

    setIsEnrollModalOpen(false);
    setSuccessToast(`Student ${enrolled.fullName} (${enrolled.rollNumber}) enrolled successfully!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const handleExportCsv = () => {
    const headers = "Roll Number,Full Name,Email,Program,Batch,Section,Semester,Status\n";
    const rows = filtered
      .map(
        (s) =>
          `"${s.rollNumber}","${s.fullName}","${s.email}","${s.program}","${s.batchName || s.batchId}","${s.section}","Sem ${s.semester}","Active"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UoHyd_Student_Cohort_Registry_${selectedBatchFilter}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
            Directory & Enrollments
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Student Cohort Registry
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Department of Systems & Computational Biology • School of Life Sciences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExportCsv} className="gap-1.5 font-semibold">
            <Download className="w-3.5 h-3.5" />
            Export Roll List (CSV)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenModal}
            className="bg-primary-container font-bold gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll Student
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Filters & Search */}
      <Card className="p-4 bg-surface-lowest">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3 max-w-xl">
            <div className="flex-1">
              <Input
                placeholder="Search student by name, roll number, email..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-on-surface-variant font-semibold">
            Showing <strong className="text-on-surface">{filtered.length}</strong> of {students.length} Enrolled Students
          </span>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Full Name</th>
                <th className="px-6 py-3.5">Institutional Email</th>
                <th className="px-6 py-3.5">Batch & Section</th>
                <th className="px-6 py-3.5 text-center">Semester</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-low/50 transition-colors h-14">
                  <td className="px-6 py-3 font-mono font-bold text-primary">
                    {s.rollNumber}
                  </td>
                  <td className="px-6 py-3 font-semibold text-on-surface">
                    {s.fullName}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant font-mono">
                    {s.email}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    <span className="font-medium text-on-surface">{s.batchName || s.batchId}</span>
                    <span className="ml-1.5 text-[10px] bg-surface-container px-1.5 py-0.5 rounded font-bold text-on-surface-variant">
                      Sec {s.section}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center font-mono text-on-surface font-semibold">
                    Sem {s.semester}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Badge variant="present" withDot>
                      Active
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Card className="w-full max-w-lg p-6 space-y-6 shadow-elevation-3 bg-surface-lowest border border-border">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    Enroll New Student
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Register student into academic cohort & institutional roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <FormSection title="Student Identity & Contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField label="Full Name" required>
                    <Input
                      type="text"
                      placeholder="e.g. Rohit Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!email && e.target.value) {
                          const clean = e.target.value.toLowerCase().replace(/\s+/g, ".");
                          setEmail(`${clean}@uohyd.ac.in`);
                        }
                      }}
                      required
                    />
                  </FormField>

                  <FormField label="Roll Number" required badge="Uppercase">
                    <Input
                      type="text"
                      placeholder="e.g. 25MCMS17"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                      className="font-mono font-bold uppercase"
                    />
                  </FormField>

                  <FormField label="Institutional Email" required>
                    <Input
                      type="email"
                      placeholder="e.g. rohit.sharma@uohyd.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Mobile Phone">
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Academic Cohort Placement">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <FormField label="Batch" required>
                    <select
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-on-surface shadow-xs hover:border-outline focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Section" required>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-on-surface shadow-xs hover:border-outline focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 transition-all"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </FormField>

                  <FormField label="Semester" required>
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

                <FormField label="Degree Program">
                  <Input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                  />
                </FormField>
              </FormSection>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  onClick={() => setIsEnrollModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  className="bg-primary-container font-bold gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Enroll Student
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
