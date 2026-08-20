"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Lock,
  KeyRound,
  CheckCircle2,
  Save,
  Sliders,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormSection } from "@/components/ui/form-field";

type AdminTab = "credentials" | "permissions" | "security";

export default function AdminProfilePage() {
  const { currentAdmin, auditLogs } = useAttendance();

  const [activeTab, setActiveTab] = useState<AdminTab>("credentials");

  // Editable Contact
  const [phone, setPhone] = useState("+91 40 2313 4001");
  const [officeRoom, setOfficeRoom] = useState("Dean's Office, Administration Block, Ground Floor");
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
          System Administration
        </span>
        <h1 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mt-0.5">
          Administrator Profile & System Authority
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          University of Hyderabad Super-Admin Authority & Security Clearance
        </p>
      </div>

      {/* Main Admin Header Card */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-surface-lowest to-surface-low border border-border shadow-elevation-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white text-2xl font-bold flex items-center justify-center shadow-md border-2 border-primary-container">
              {currentAdmin.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                  {currentAdmin.fullName}
                </h2>
                <Badge variant="present" withDot>
                  System Administrator
                </Badge>
              </div>
              <p className="text-xs font-mono text-primary font-bold">
                Employee ID: ADM-UOH-102 • Dean&apos;s Office
              </p>
              <p className="text-xs text-on-surface-variant">
                {currentAdmin.department}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs">
            <div className="bg-primary-fixed/40 px-3 py-1.5 rounded-lg text-primary-container font-bold text-center">
              <span className="text-[10px] block font-normal text-on-surface-variant uppercase">Clearance</span>
              Super Admin (Level 1)
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              ✓ Full Audit Trail Access
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
          <Building2 className="w-4 h-4" />
          <span>Administrative Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "permissions"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Access Privileges & Roles</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "security"
              ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Master Key</span>
        </button>
      </div>

      {/* Tab 1: Credentials */}
      {activeTab === "credentials" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              Administrative Jurisdiction
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Jurisdiction & Scope
                </span>
                <p className="font-semibold text-on-surface">School of Life Sciences (All Programs)</p>
                <span className="text-[11px] text-outline">Systems & Comp. Bio, Biochemistry, Plant Sciences</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Designation
                </span>
                <p className="font-semibold text-on-surface">Academic Dean & Head Administrator</p>
                <span className="text-[11px] text-outline">Dean&apos;s Academic Affairs Committee</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Office Location
                </span>
                <p className="font-semibold text-on-surface">{officeRoom}</p>
                <span className="text-[11px] text-outline">University Administrative Secretariat</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-low space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Total Audit Logs Monitored
                </span>
                <p className="font-semibold text-on-surface">{auditLogs.length} Security Audit Records</p>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Immutable Trail Active</span>
              </div>
            </div>

            {isSavedToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Office contact details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="pt-2 border-t border-border space-y-4">
              <FormSection title="Official Administrative Office Communications">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Institutional Admin Email"
                    required
                    badge="Locked"
                  >
                    <Input
                      type="email"
                      value={currentAdmin.email}
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

      {/* Tab 2: Permissions & Roles */}
      {activeTab === "permissions" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              System Access Privileges & Super-User Clearances
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Audit Trail Inspector</span>
                  <Badge variant="present" withDot>Granted</Badge>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Full access to review, inspect, and export all attendance overrides and mark revision logs.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Statutory Threshold Manager</span>
                  <Badge variant="present" withDot>Granted</Badge>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Authority to configure university-wide attendance rules (75% minimum, 60% critical).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Student & Faculty Directory Master</span>
                  <Badge variant="present" withDot>Granted</Badge>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Create, enroll, and manage cohort batches, sections, and faculty course assignments.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Grade & Attendance Override Lock</span>
                  <Badge variant="present" withDot>Granted</Badge>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Super-user power to unlock archived attendance sessions upon official committee petition.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Admin Master Password & Security Key
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Update your administrative login credentials and maintain institutional security.
              </p>
            </div>

            {passwordToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admin master password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <FormField label="Current Master Password" required>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </FormField>

              <FormField label="New Master Password" required hint="Must be at least 8 characters with super-admin complexity.">
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
                Update Master Password
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
