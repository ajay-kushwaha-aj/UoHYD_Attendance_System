"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Building2,
  ShieldCheck,
  Award,
  KeyRound,
  QrCode,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  Briefcase,
  Layers,
  FileSignature,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormSection } from "@/components/ui/form-field";

type FacultyTab = "credentials" | "teaching" | "signatures" | "security";

export default function ProfessorProfilePage() {
  const { currentProfessor, courses, batches } = useAttendance();

  const [activeTab, setActiveTab] = useState<FacultyTab>("credentials");

  // Editable Contact
  const [phone, setPhone] = useState("+91 40 2313 4500");
  const [intercom, setIntercom] = useState("Ext 4500");
  const [officeRoom, setOfficeRoom] = useState("Room 302, SLS Complex, North Campus");
  const [officeHours, setOfficeHours] = useState("Mon & Wed • 3:00 PM – 5:00 PM");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setPasswordToast(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
          Faculty Directory & Account
        </span>
        <h1 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mt-0.5">
          Faculty Profile & Institutional Identity
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          University of Hyderabad Verified Faculty Credentials & Authorizations
        </p>
      </div>

      {/* Main Faculty Header Card */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-surface-lowest to-surface-low border border-border shadow-elevation-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white text-2xl font-bold flex items-center justify-center shadow-md border-2 border-primary-container">
              {currentProfessor.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                  {currentProfessor.fullName}
                </h2>
                <Badge variant="present" withDot>
                  Active Faculty
                </Badge>
              </div>
              <p className="text-xs font-mono text-primary font-bold">
                Employee Code: {currentProfessor.employeeCode} • {currentProfessor.designation}
              </p>
              <p className="text-xs text-on-surface-variant">
                {currentProfessor.department} • School of Life Sciences
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs">
            <div className="bg-primary-fixed/40 px-3 py-1.5 rounded-lg text-primary-container font-bold text-center">
              <span className="text-[10px] block font-normal text-on-surface-variant uppercase">Departmental Role</span>
              Head of Department (HOD)
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              ✓ Grade Approver Authority
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container/60 p-1.5 rounded-xl border border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("credentials")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "credentials"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Credentials & Office</span>
        </button>

        <button
          onClick={() => setActiveTab("teaching")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "teaching"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Teaching Load & Courses</span>
        </button>

        <button
          onClick={() => setActiveTab("signatures")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "signatures"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>Official Signature Stamp</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "security"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Tab 1: Academic Credentials */}
      {activeTab === "credentials" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              Faculty Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Academic Qualifications
                </span>
                <p className="font-semibold text-on-surface">Ph.D. in Computational Structural Biology</p>
                <span className="text-[11px] text-outline">Post-Doctoral Fellow (EMBL-EBI, Hinxton)</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Research Specializations
                </span>
                <p className="font-semibold text-on-surface">Macromolecular Structure Prediction & Docking</p>
                <span className="text-[11px] text-outline">Omics Big Data Analysis, Machine Learning</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Office Location
                </span>
                <p className="font-semibold text-on-surface">{officeRoom}</p>
                <span className="text-[11px] text-outline">Department of Systems & Comp. Biology</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Student Consultation Hours
                </span>
                <p className="font-semibold text-on-surface">{officeHours}</p>
                <span className="text-[11px] text-outline">Appointments via Dean&apos;s Office</span>
              </div>
            </div>

            {/* Editable Contact Fields */}
            {isSavedToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Office contact information saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="pt-2 border-t border-border space-y-4">
              <FormSection title="Office Communications & Intercom">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    label="Institutional Email"
                    required
                    badge="Locked"
                  >
                    <Input
                      type="email"
                      value={currentProfessor.email}
                      disabled
                      icon={<Mail className="w-4 h-4" />}
                      className="bg-surface-low text-xs opacity-80 cursor-not-allowed"
                    />
                  </FormField>

                  <FormField label="Direct Office Phone" required>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                      required
                      className="text-xs"
                    />
                  </FormField>

                  <FormField label="Intercom Extension" required>
                    <Input
                      type="text"
                      value={intercom}
                      onChange={(e) => setIntercom(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                      required
                      className="text-xs font-mono"
                    />
                  </FormField>
                </div>
              </FormSection>

              <div className="flex justify-end pt-2 border-t border-surface-container">
                <Button type="submit" variant="primary" size="default" className="bg-primary-container font-bold gap-1.5 shadow-sm">
                  <Save className="w-4 h-4" /> Save Office Details
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tab 2: Teaching Load */}
      {activeTab === "teaching" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-0 overflow-hidden border border-border">
            <div className="p-4 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">
                Assigned Teaching Load & Course Curricula ({courses.length} Courses)
              </h3>
              <span className="text-xs text-on-surface-variant font-mono font-bold">
                Term: Academic Year 2025–26
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-container bg-surface-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="px-6 py-3.5">Course Code</th>
                    <th className="px-6 py-3.5">Course Title</th>
                    <th className="px-6 py-3.5 text-center">Credits</th>
                    <th className="px-6 py-3.5 text-center">Conducted Classes</th>
                    <th className="px-6 py-3.5">Schedule</th>
                    <th className="px-6 py-3.5 text-right">Classroom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-low/30 transition-colors h-14">
                      <td className="px-6 py-3 font-mono font-bold text-primary">{c.code}</td>
                      <td className="px-6 py-3 font-semibold text-on-surface">{c.name}</td>
                      <td className="px-6 py-3 text-center font-mono font-bold">{c.credits}</td>
                      <td className="px-6 py-3 text-center font-mono text-emerald-700 font-bold">
                        {c.totalConductedSessions} Sessions
                      </td>
                      <td className="px-6 py-3 text-on-surface-variant">{c.scheduleTime}</td>
                      <td className="px-6 py-3 text-right font-mono text-outline">{c.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Official Signature Stamp */}
      {activeTab === "signatures" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Official Departmental Signature & Stamp Verification
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Preview the authorized signature template rendered onto university reports and grade sheets.
              </p>
            </div>

            <div className="max-w-md mx-auto p-8 rounded-2xl border-2 border-slate-300 bg-slate-50 text-slate-900 text-center space-y-4 shadow-sm">
              <div className="h-16 flex items-end justify-center">
                <span className="font-serif italic text-lg text-slate-700 tracking-wider">
                  K. Venkatesh Rao
                </span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 space-y-0.5">
                <p className="font-bold text-sm text-slate-900">{currentProfessor.fullName}</p>
                <p className="text-xs text-slate-600">Course Instructor / Head of Department</p>
                <p className="text-[11px] text-slate-500">Department of Systems & Computational Biology</p>
                <p className="text-[10px] text-slate-400 font-mono">Digital ID: UOH-EMP-882-AUTH</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Authorized to sign and approve university attendance reports, internal marks transcripts, and examination rosters.
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Faculty Account Security & Password
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Manage your credentials for accessing examination records and faculty controls.
              </p>
            </div>

            {passwordToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Faculty account password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <FormField label="Current Faculty Password" required>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </FormField>

              <FormField label="New Faculty Password" required hint="Must be at least 8 characters with institutional complexity.">
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<KeyRound className="w-4 h-4" />}
                  required
                  minLength={6}
                />
              </FormField>

              <FormField
                label="Confirm New Password"
                required
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? "Passwords do not match."
                    : undefined
                }
              >
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<KeyRound className="w-4 h-4" />}
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="default"
                className="bg-primary-container font-bold shadow-sm"
                disabled={!newPassword || newPassword !== confirmPassword}
              >
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
