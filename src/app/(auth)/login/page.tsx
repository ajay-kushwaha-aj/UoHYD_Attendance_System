"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  QrCode,
  TrendingUp,
  FileText,
  Users,
  Award,
  FileCheck2,
  Building,
  KeyRound,
  BadgeCheck,
  Calendar,
  Activity,
  FileSpreadsheet,
  Server,
  Sparkles,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

interface RoleFeature {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  title: string;
  desc: string;
  color: "blue" | "emerald" | "amber" | "purple" | "indigo" | "rose" | "slate";
}

const COLOR_STYLES: Record<string, { bg: string; text: string; badge: string; iconBg: string }> = {
  blue: {
    bg: "bg-blue-50/70 border-blue-100",
    text: "text-blue-900",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100/90 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50/70 border-emerald-100",
    text: "text-emerald-900",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-100/90 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50/70 border-amber-100",
    text: "text-amber-900",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconBg: "bg-amber-100/90 text-amber-700",
  },
  purple: {
    bg: "bg-purple-50/70 border-purple-100",
    text: "text-purple-900",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100/90 text-purple-700",
  },
  indigo: {
    bg: "bg-indigo-50/70 border-indigo-100",
    text: "text-indigo-900",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconBg: "bg-indigo-100/90 text-indigo-700",
  },
  rose: {
    bg: "bg-rose-50/70 border-rose-100",
    text: "text-rose-900",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    iconBg: "bg-rose-100/90 text-rose-700",
  },
  slate: {
    bg: "bg-slate-50/70 border-slate-200",
    text: "text-slate-900",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    iconBg: "bg-slate-100 text-slate-700",
  },
};

const ROLE_FEATURES: Record<UserRole, RoleFeature[]> = {
  student: [
    {
      icon: QrCode,
      badge: "Dynamic Scanning",
      title: "QR Code Attendance",
      desc: "Authenticated single-device scanner with rotating cryptographic tokens to prevent proxy verification.",
      color: "blue",
    },
    {
      icon: TrendingUp,
      badge: "Statutory Mandate",
      title: "75% Target Threshold",
      desc: "Live percentage projection with early warnings before condonation penalty or detention thresholds.",
      color: "emerald",
    },
    {
      icon: FileText,
      badge: "Digital Approvals",
      title: "Academic Grievances",
      desc: "Paperless submission of medical leave certificates and duty slips with transparent verification.",
      color: "amber",
    },
    {
      icon: Calendar,
      badge: "Class Timetable",
      title: "Lecture & Lab Schedules",
      desc: "Real-time timetable synchronization with venue updates, lab batches, and faculty contact slots.",
      color: "purple",
    },
    {
      icon: Award,
      badge: "CBCS / NEP-2020",
      title: "Continuous Assessment",
      desc: "Direct tracking of sessional exam scores, practical assessments, and credit eligibility status.",
      color: "indigo",
    },
    {
      icon: ShieldCheck,
      badge: "Institutional SSO",
      title: "Protected Privacy",
      desc: "Row-level isolated profile access ensuring total confidentiality of personal academic history.",
      color: "slate",
    },
  ],
  professor: [
    {
      icon: QrCode,
      badge: "Classroom Session",
      title: "Instant QR Broadcast",
      desc: "Launch live geo-fenced QR sessions with customizable 15-to-45 second rotating anti-proxy codes.",
      color: "emerald",
    },
    {
      icon: Users,
      badge: "Batch Directory",
      title: "Dynamic Class Rosters",
      desc: "Live course registers with real-time presentee counts, batch filtering, and roll-number lookups.",
      color: "blue",
    },
    {
      icon: FileCheck2,
      badge: "Faculty Desk",
      title: "Grievance Adjudication",
      desc: "One-click approval or audit of student medical leave requests with digital signatures & trail.",
      color: "amber",
    },
    {
      icon: Award,
      badge: "Grading Suite",
      title: "Internal Marks Entry",
      desc: "Continuous assessment gradebook for sessional assignments, practical tests, and moderated scores.",
      color: "purple",
    },
    {
      icon: Activity,
      badge: "Attendance Radar",
      title: "Predictive Analytics",
      desc: "Engagement trend indicators flagging chronic absentees for early academic intervention.",
      color: "rose",
    },
    {
      icon: FileSpreadsheet,
      badge: "NAAC Standard",
      title: "Accredited Registers",
      desc: "One-click export of university-standard PDF and Excel attendance registers for official audits.",
      color: "slate",
    },
  ],
  admin: [
    {
      icon: FileCheck2,
      badge: "Immutable Trail",
      title: "Tamper-Evident Audit",
      desc: "Central cryptographic ledger recording every attendance adjustment, grade edit, and role change.",
      color: "indigo",
    },
    {
      icon: Building,
      badge: "Hierarchy Engine",
      title: "Schools & Departments",
      desc: "Unified configuration of 12+ Schools, 40+ academic departments, semester cycles, and curricula.",
      color: "slate",
    },
    {
      icon: KeyRound,
      badge: "Zero-Trust Security",
      title: "Role-Based Permissions",
      desc: "PBKDF2 salted password hashing, HTTP-only cookie sessions, and privileged escalation gates.",
      color: "amber",
    },
    {
      icon: Server,
      badge: "Telemetry",
      title: "System Diagnostics",
      desc: "Real-time monitoring of database health, server throughput, active user sessions, and API latency.",
      color: "emerald",
    },
    {
      icon: BadgeCheck,
      badge: "NAAC A++ Ready",
      title: "Statutory Compliance",
      desc: "Automated aggregation of university-wide attendance matrices for UGC & NIRF accreditation data.",
      color: "blue",
    },
    {
      icon: Sparkles,
      badge: "Executive Suite",
      title: "Administrative Control",
      desc: "Master settings for term inaugurations, course caps, bulk student enrolments, and system policies.",
      color: "purple",
    },
  ],
};

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const roleConfigs = {
    student: {
      label: "Student",
      icon: GraduationCap,
      fieldLabel: "Student Roll Number",
      placeholder: "e.g. 25MCMS01",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      activeTabColor: "bg-blue-600 text-white shadow-xs",
    },
    professor: {
      label: "Faculty / Professor",
      icon: Briefcase,
      fieldLabel: "Faculty Username or Employee ID",
      placeholder: "e.g. dr.rao or EMP-UOH-882",
      buttonColor: "bg-emerald-700 hover:bg-emerald-800",
      activeTabColor: "bg-emerald-700 text-white shadow-xs",
    },
    admin: {
      label: "Administrator",
      icon: ShieldCheck,
      fieldLabel: "Administrator Username or Email",
      placeholder: "e.g. academic.admin",
      buttonColor: "bg-indigo-700 hover:bg-indigo-800",
      activeTabColor: "bg-indigo-700 text-white shadow-xs",
    },
  };

  const currentConfig = roleConfigs[activeRole];
  const currentFeatures = ROLE_FEATURES[activeRole];

  // Roll Number breakdown for Student role (Format: YY + 4 Alphabets + 2 Digits Serial -> e.g., 25MCMS01)
  const rollBreakdown = useMemo(() => {
    if (activeRole !== "student") return null;
    const trimmed = identifier.trim().toUpperCase();
    const match = trimmed.match(/^(\d{2})([A-Z]{4})(\d{2})$/);
    if (match) {
      return {
        isValid: true,
        year: `20${match[1]}`,
        program: match[2],
        serial: match[3],
        fullRoll: trimmed,
      };
    }
    return null;
  }, [activeRole, identifier]);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setIdentifier("");
    setPassword("");
    setErrorMessage("");
  };

  const handleIdentifierChange = (val: string) => {
    let clean = val.trim();
    if (clean.toLowerCase().endsWith("@uohyd.ac.in")) {
      clean = clean.slice(0, -"@uohyd.ac.in".length);
    }
    setIdentifier(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const clean = identifier.trim();
    if (!clean || !password.trim()) {
      setErrorMessage("Please enter your institutional ID/username and password.");
      return;
    }

    const res = await login(clean, password, activeRole);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Subtle Accent Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="w-full max-w-6xl xl:max-w-7xl relative z-10 py-4 lg:py-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Column: University Branding Header & Clean Authentication Card */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* University Header */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 flex items-center justify-center">
                <Image
                  src="/uohyd-logo.png"
                  alt="University of Hyderabad Logo"
                  width={96}
                  height={96}
                  className="object-contain w-full h-full drop-shadow-xs"
                  priority
                />
              </div>
              <div className="text-center sm:text-left space-y-1 select-none">
                <div className="text-sm sm:text-base font-telugu font-bold text-[#8B1D1D] leading-tight">
                  హైదరాబాదు విశ్వవిద్యాలయం
                </div>
                <div className="text-sm sm:text-base font-hindi font-bold text-[#8B1D1D] leading-tight">
                  हैदराबाद विश्वविद्यालय
                </div>
                <h1 className="text-lg sm:text-2xl font-sans font-black text-[#8B1D1D] tracking-tight leading-tight">
                  University of Hyderabad
                </h1>
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-[#8B1D1D] text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    Attendance & Academic Portal
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    School of Life Sciences
                  </span>
                </div>
              </div>
            </div>

            {/* Main Authentication Card */}
            <Card className="p-6 sm:p-8 shadow-sm border border-slate-200 bg-white rounded-3xl">
              {/* Institutional Role Selector Tabs */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Your Institutional Role
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Active Portal: <strong className="text-slate-800 capitalize">{activeRole}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                  {(["student", "professor", "admin"] as UserRole[]).map((roleKey) => {
                    const conf = roleConfigs[roleKey];
                    const Icon = conf.icon;
                    const isSelected = activeRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => handleRoleChange(roleKey)}
                        className={cn(
                          "flex flex-col sm:flex-row items-center justify-center py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 gap-1.5 cursor-pointer",
                          isSelected
                            ? conf.activeTabColor
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{conf.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-snug font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label={currentConfig.fieldLabel}
                  required
                  hint={
                    activeRole === "student"
                      ? "Enter Roll No. — @uohyd.ac.in is automatically appended"
                      : "Enter institutional prefix — @uohyd.ac.in is automatically appended"
                  }
                >
                  <Input
                    type="text"
                    placeholder={currentConfig.placeholder}
                    value={identifier}
                    onChange={(e) => handleIdentifierChange(e.target.value)}
                    suffix="@uohyd.ac.in"
                    required
                    className={cn(
                      "text-xs font-medium bg-white",
                      activeRole === "student" && "uppercase tracking-wide"
                    )}
                  />
                </FormField>

                {/* Live Roll Format Preview Badge (For Students) */}
                {activeRole === "student" && rollBreakdown && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Valid Roll Format:</span>
                      <span className="font-mono text-blue-700 font-bold">
                        {rollBreakdown.fullRoll}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span>Batch: <strong className="text-slate-800">{rollBreakdown.year}</strong></span>
                      <span>•</span>
                      <span>Dept: <strong className="text-slate-800">{rollBreakdown.program}</strong></span>
                      <span>•</span>
                      <span>No: <strong className="text-slate-800">{rollBreakdown.serial}</strong></span>
                    </div>
                  </div>
                )}

                <FormField
                  label="Authentication Password"
                  required
                  badge={
                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-semibold text-[#8B1D1D] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                    className="text-xs bg-white"
                  />
                </FormField>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#8B1D1D] focus:ring-[#8B1D1D]/20 cursor-pointer"
                    />
                    <span className="font-medium">Stay logged in on this device</span>
                  </label>

                  {identifier.trim() && (
                    <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                      {identifier.trim().toLowerCase()}@uohyd.ac.in
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    "w-full shadow-sm text-white mt-2 font-bold h-11 text-xs tracking-wide transition-all",
                    currentConfig.buttonColor
                  )}
                  isLoading={isLoading}
                >
                  Sign In to {currentConfig.label.toUpperCase()} Workspace
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </Card>

            {/* Footer Institutional Assurance */}
            <div className="text-center text-xs text-slate-600 space-y-1 pt-1">
              <p className="font-medium">University of Hyderabad • School of Life Sciences</p>
              <p className="text-[11px] text-slate-500">
                Protected by Central PBKDF2 Password Hashing & Institutional Session Security
              </p>
            </div>
          </div>

          {/* Lateral Column: Floating Portal Capabilities Showcase */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            {/* Lateral Header */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {currentConfig.label} Portal Capabilities
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  UoH Active
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Integrated statutory features enabled for this institutional workspace.
              </p>
            </div>

            {/* Floating Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {currentFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                const style = COLOR_STYLES[feat.color] || COLOR_STYLES.slate;
                return (
                  <div
                    key={idx}
                    className="group relative bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105",
                          style.iconBg
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                            {feat.title}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded border leading-none mb-1",
                            style.badge
                          )}
                        >
                          {feat.badge}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lateral Infrastructure Trust Card */}
            <div className="p-4 rounded-3xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-sm flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#8B1D1D]/10 text-[#8B1D1D] font-black text-xs flex items-center justify-center shrink-0">
                  UoH
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">School of Life Sciences Cluster</div>
                  <div className="text-[11px] text-slate-500">Statutory 75% Attendance • NAAC A++ Grade</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live Sync
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
