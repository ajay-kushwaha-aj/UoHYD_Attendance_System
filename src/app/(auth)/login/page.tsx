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
  Sparkles,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [identifier, setIdentifier] = useState<string>("25mcms01");
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS.student.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const roleConfigs = {
    student: {
      label: "Student",
      icon: GraduationCap,
      defaultPrefix: "25mcms01",
      fieldLabel: "Student Roll Number (Format: 25MCMS01)",
      placeholder: "25MCMS01",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      activeTabColor: "bg-blue-600 text-white shadow-xs",
      demoName: "Ajay Kumar (25MCMS01)",
      demoPrefix: "25mcms01",
      demoPassword: DEMO_ACCOUNTS.student.password,
      pills: [
        { icon: QrCode, title: "QR Attendance", desc: "Scan in classroom", color: "blue" },
        { icon: TrendingUp, title: "75% Target", desc: "Live percentage", color: "emerald" },
        { icon: FileText, title: "Grievances", desc: "Track approvals", color: "amber" },
      ],
    },
    professor: {
      label: "Faculty / Professor",
      icon: Briefcase,
      defaultPrefix: "dr.rao",
      fieldLabel: "Faculty Username or Employee Code",
      placeholder: "dr.rao or EMP-UOH-882",
      buttonColor: "bg-emerald-700 hover:bg-emerald-800",
      activeTabColor: "bg-emerald-700 text-white shadow-xs",
      demoName: "Prof. K. V. Rao (HOD)",
      demoPrefix: "dr.rao",
      demoPassword: DEMO_ACCOUNTS.professor.password,
      pills: [
        { icon: QrCode, title: "Launch QR", desc: "Dynamic session", color: "emerald" },
        { icon: Users, title: "Class Rosters", desc: "Batch & section", color: "blue" },
        { icon: Award, title: "Internal Marks", desc: "Grading schemes", color: "purple" },
      ],
    },
    admin: {
      label: "Administrator",
      icon: ShieldCheck,
      defaultPrefix: "academic.admin",
      fieldLabel: "Administrative Username or Email",
      placeholder: "academic.admin",
      buttonColor: "bg-indigo-700 hover:bg-indigo-800",
      activeTabColor: "bg-indigo-700 text-white shadow-xs",
      demoName: "Dr. S. R. Murthy (Dean)",
      demoPrefix: "academic.admin",
      demoPassword: DEMO_ACCOUNTS.admin.password,
      pills: [
        { icon: FileCheck2, title: "Audit Logs", desc: "Tamper-evident", color: "indigo" },
        { icon: Building, title: "Departments", desc: "Configurations", color: "slate" },
        { icon: KeyRound, title: "Permissions", desc: "Role security", color: "amber" },
      ],
    },
  };

  const currentConfig = roleConfigs[activeRole];

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
    setIdentifier(roleConfigs[role].defaultPrefix);
    setPassword(roleConfigs[role].demoPassword);
    setErrorMessage("");
  };

  const handleIdentifierChange = (val: string) => {
    let clean = val.trim();
    if (clean.toLowerCase().endsWith("@uohyd.ac.in")) {
      clean = clean.slice(0, -"@uohyd.ac.in".length);
    }
    setIdentifier(clean);
  };

  const handleFillDemo = () => {
    setIdentifier(currentConfig.demoPrefix);
    setPassword(currentConfig.demoPassword);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const clean = identifier.trim();
    if (!clean || !password.trim()) {
      setErrorMessage("Please enter your institutional ID/username and password.");
      return;
    }

    const fullVal = clean.toUpperCase().startsWith("EMP-")
      ? clean
      : `${clean.toLowerCase()}@uohyd.ac.in`;

    const res = await login(fullVal, password, activeRole);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Subtle Accent Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="w-full max-w-xl space-y-5 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* University Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 flex items-center justify-center">
            <Image
              src="/uohyd-logo.png"
              alt="University of Hyderabad Logo"
              width={112}
              height={112}
              className="object-contain w-full h-full drop-shadow-xs"
              priority
            />
          </div>
          <div className="text-center sm:text-left space-y-1 select-none">
            <div className="text-base sm:text-lg font-telugu font-bold text-[#8B1D1D] leading-tight">
              హైదరాబాదు విశ్వవిద్యాలయం
            </div>
            <div className="text-base sm:text-lg font-hindi font-bold text-[#8B1D1D] leading-tight">
              हैदराबाद विश्वविद्यालय
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-black text-[#8B1D1D] tracking-tight leading-tight">
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

          {/* Dynamic Role Feature Pills */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {currentConfig.pills.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center transition-all hover:bg-slate-100/70"
                >
                  <Icon className="w-4 h-4 text-[#8B1D1D] mb-1" />
                  <span className="text-[11px] font-bold text-slate-900">{pill.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{pill.desc}</span>
                </div>
              );
            })}
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

          {/* Quick 1-Click Demo Fill for the active role */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#8B1D1D]" />
              <span>Testing as {currentConfig.label}?</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Autofill {currentConfig.demoName}
            </button>
          </div>
        </Card>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-600 space-y-1">
          <p className="font-medium">University of Hyderabad • School of Life Sciences</p>
          <p className="text-[11px] text-slate-500">
            Protected by Institutional Row-Level Security & Role-Based Access Control
          </p>
        </div>
      </div>
    </div>
  );
}
