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
  Smartphone,
  Calendar,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormSection } from "@/components/ui/form-field";

type ProfileTab = "academic" | "contact" | "security" | "smartcard";

export default function StudentProfilePage() {
  const { currentStudent } = useAttendance();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileTab>("academic");

  // Editable Contact State
  const [phone, setPhone] = useState(currentStudent.phone || "+91 98765 43210");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 94401 23456");
  const [emergencyContactName, setEmergencyContactName] = useState("K. Ramesh Kumar (Father)");
  const [hostelAddress, setHostelAddress] = useState("Room 214, Men's Hostel-J (MH-J), University Campus");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Security Form State
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
          Student Portal
        </span>
        <h1 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mt-0.5">
          Student Profile & Institutional Identity
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          University of Hyderabad Verified Student Academic Record & Smart Card
        </p>
      </div>

      {/* Main Student Header Card */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-surface-lowest to-surface-low border border-border shadow-elevation-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white text-2xl font-bold flex items-center justify-center shadow-md border-2 border-primary-container">
              {currentStudent.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                  {currentStudent.fullName}
                </h2>
                <Badge variant="present" withDot>
                  Active Student
                </Badge>
              </div>
              <p className="text-xs font-mono text-primary font-bold">
                Roll No: {currentStudent.rollNumber} • Enrollment: {currentStudent.enrollmentNumber || "UOH/SLS/2025/0114"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {currentStudent.program} • {currentStudent.batchName} ({currentStudent.section})
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs">
            <div className="bg-primary-fixed/40 px-3 py-1.5 rounded-lg text-primary-container font-bold text-center">
              <span className="text-[10px] block font-normal text-on-surface-variant uppercase">Current Term</span>
              Semester {currentStudent.semester}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              ✓ Good Standing (91.3% Attendance)
            </span>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-surface-container/60 p-1.5 rounded-xl border border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("academic")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "academic"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic & Program Details</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "contact"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Residence</span>
        </button>

        <button
          onClick={() => setActiveTab("smartcard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "smartcard"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Digital Student ID Card</span>
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

      {/* Tab 1: Academic & Program Details */}
      {activeTab === "academic" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              Academic Registry Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Degree & Program
                </span>
                <p className="font-semibold text-on-surface">{currentStudent.program}</p>
                <span className="text-[11px] text-outline">Master of Science (M.Sc.)</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Department & School
                </span>
                <p className="font-semibold text-on-surface">{currentStudent.department}</p>
                <span className="text-[11px] text-outline">School of Life Sciences</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Batch & Section Assignment
                </span>
                <p className="font-semibold text-on-surface">
                  {currentStudent.batchName} • Section {currentStudent.section}
                </p>
                <span className="text-[11px] text-outline">Academic Cycle: 2025 – 2027</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Academic Faculty Advisor
                </span>
                <p className="font-semibold text-on-surface">Prof. K. Venkatesh Rao</p>
                <span className="text-[11px] text-outline">Head of Department (HOD)</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Cumulative GPA / Credits
                </span>
                <p className="font-semibold text-on-surface">8.84 CGPA • 24 / 64 Credits Earned</p>
                <span className="text-[11px] text-emerald-700 font-semibold">First Class with Distinction</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Statutory Attendance Compliance
                </span>
                <p className="font-semibold text-on-surface">91.3% Overall Attendance</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Eligible for End-Sem Examinations</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary-fixed/30 text-xs text-primary-on-fixed-variant flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-primary" />
              <span>Institutional Single-Sign-On Identity verified through Dean's Academic Office.</span>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Contact & Residence Details */}
      {activeTab === "contact" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Contact & Residential Information
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Update your active contact numbers and emergency campus details.
              </p>
            </div>

            {isSavedToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contact details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-5">
              <FormSection title="Direct Student Contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Institutional Email Address"
                    required
                    badge="Locked"
                    hint="Managed by university administration."
                  >
                    <Input
                      type="email"
                      value={currentStudent.email}
                      disabled
                      icon={<Mail className="w-4 h-4" />}
                      className="bg-surface-low text-xs opacity-80 cursor-not-allowed"
                    />
                  </FormField>

                  <FormField label="Primary Mobile Contact" required>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                      required
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Emergency & Campus Residence">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Emergency Contact Name & Relation" required>
                    <Input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      icon={<User className="w-4 h-4" />}
                      required
                      className="text-xs"
                    />
                  </FormField>

                  <FormField label="Emergency Phone Number" required>
                    <Input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                      required
                      className="text-xs"
                    />
                  </FormField>
                </div>

                <FormField label="Hostel / Campus Residential Address" required>
                  <Input
                    type="text"
                    value={hostelAddress}
                    onChange={(e) => setHostelAddress(e.target.value)}
                    icon={<MapPin className="w-4 h-4" />}
                    required
                    className="text-xs"
                  />
                </FormField>
              </FormSection>

              <div className="pt-2 flex justify-end border-t border-surface-container">
                <Button type="submit" variant="primary" size="default" className="bg-primary-container font-bold gap-1.5 shadow-sm">
                  <Save className="w-4 h-4" /> Save Contact Details
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tab 3: Digital Student ID Card */}
      {activeTab === "smartcard" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="max-w-md mx-auto">
            {/* Front of Smart ID Card */}
            <div className="rounded-2xl border-2 border-primary-container/30 bg-gradient-to-br from-primary via-primary-container to-slate-900 text-white p-6 shadow-elevation-2 space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-36 h-36 bg-tertiary-teal/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center font-bold text-sm">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold tracking-widest uppercase">
                      UNIVERSITY OF HYDERABAD
                    </h3>
                    <p className="text-[9px] text-white/80 uppercase">
                      School of Life Sciences
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                  STUDENT
                </span>
              </div>

              {/* Photo & Identity */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-16 h-20 rounded-lg bg-white/10 border border-white/30 flex flex-col items-center justify-center text-white font-bold text-xl shrink-0 shadow-inner">
                  AK
                  <span className="text-[8px] text-white/70 font-normal uppercase mt-1">Photo</span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-base font-bold truncate">{currentStudent.fullName}</h4>
                  <p className="text-xs font-mono text-tertiary-fixed font-bold">
                    {currentStudent.rollNumber}
                  </p>
                  <p className="text-[11px] text-white/80 truncate">
                    {currentStudent.program}
                  </p>
                  <p className="text-[10px] text-white/60">
                    Batch: {currentStudent.batchName} ({currentStudent.section})
                  </p>
                </div>
              </div>

              {/* Card Footer with QR verification */}
              <div className="border-t border-white/20 pt-3 flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-white/60 block">Valid Thru</span>
                  <strong className="font-mono">JULY 2027</strong>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md">
                  <QrCode className="w-4 h-4 text-tertiary-fixed" />
                  <span className="font-mono text-[9px]">UOH-25MCMS01</span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-on-surface-variant mt-3">
              Official institutional digital ID badge for classroom and laboratory verification.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Account Security & Password Management
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Update your account password and manage authenticated terminal sessions.
              </p>
            </div>

            {passwordToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <FormField label="Current Account Password" required>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </FormField>

              <FormField label="New Account Password" required hint="Must be at least 8 characters long with alphanumeric complexity.">
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
