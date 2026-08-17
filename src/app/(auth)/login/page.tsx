"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login, quickDemoLogin, isLoading } = useAuth();

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>("professor");
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS.professor.email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS.professor.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRoleTab(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword(DEMO_ACCOUNTS[role].password);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter your institutional email and password.");
      return;
    }

    const res = await login(email, password, activeRoleTab);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const roleTabItems: { role: UserRole; label: string; icon: typeof GraduationCap; desc: string }[] = [
    {
      role: "student",
      label: "Student",
      icon: GraduationCap,
      desc: "QR Attendance & Course Analytics",
    },
    {
      role: "professor",
      label: "Faculty / Professor",
      icon: Briefcase,
      desc: "Live Sessions, QR & Reports",
    },
    {
      role: "admin",
      label: "Administrator",
      icon: ShieldCheck,
      desc: "Audits & Department Controls",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Accent Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d6e3ff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* University Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-elevation-1 border border-primary-container">
            <GraduationCap className="w-9 h-9 text-tertiary-fixed" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary-teal">
              University of Hyderabad • School of Life Sciences
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary mt-0.5">
              Attendance & Academic Portal
            </h1>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Role-Based Authentication for Students, Teaching Faculty, and Department Administrators.
            </p>
          </div>
        </div>

        {/* Main Authentication Card */}
        <Card className="p-6 sm:p-8 shadow-elevation-2 border border-border bg-surface-lowest">
          {/* Role Switcher Tabs */}
          <div className="space-y-2 mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Select Your Institutional Role
            </label>
            <div className="grid grid-cols-3 gap-2 bg-surface-container p-1.5 rounded-xl border border-border/60">
              {roleTabItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeRoleTab === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleTabChange(item.role)}
                    className={cn(
                      "flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 gap-1",
                      isSelected
                        ? "bg-primary text-white shadow-sm font-bold scale-[1.02]"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Institutional Email Address"
              required
              hint="Use your verified @uohyd.ac.in university ID"
            >
              <Input
                type="email"
                placeholder="username@uohyd.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
                className="bg-surface text-xs"
              />
            </FormField>

            <FormField
              label="Authentication Password"
              required
              badge={
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-semibold text-primary hover:underline"
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
                icon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                required
                className="bg-surface text-xs"
              />
            </FormField>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="font-medium">Remember terminal session</span>
              </label>

              <span className="text-[11px] text-on-surface-variant">
                Workspace: <strong className="capitalize text-primary font-bold">{activeRoleTab}</strong>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md bg-primary-container mt-2 font-bold h-11 text-xs tracking-wide"
              isLoading={isLoading}
            >
              Sign In to {activeRoleTab.toUpperCase()} Workspace
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo 1-Click Access Section */}
          <div className="mt-8 pt-6 border-t border-surface-container space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-tertiary-teal" />
                Quick 1-Click Demo Logins
              </span>
              <span className="text-[11px] text-outline">No typing needed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin("student")}
                className="p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-container text-left text-xs transition-all hover:border-primary group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Student</span>
                  <GraduationCap className="w-3.5 h-3.5 text-primary-container" />
                </div>
                <div className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
                  Ajay Kumar
                </div>
                <div className="text-[10px] text-outline font-mono">23MCMS01</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin("professor")}
                className="p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-container text-left text-xs transition-all hover:border-primary group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Professor</span>
                  <Briefcase className="w-3.5 h-3.5 text-primary-container" />
                </div>
                <div className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
                  Prof. K. V. Rao
                </div>
                <div className="text-[10px] text-outline font-mono">HOD Life Sci</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin("admin")}
                className="p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-container text-left text-xs transition-all hover:border-primary group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Admin</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-container" />
                </div>
                <div className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
                  Dr. S. R. Murthy
                </div>
                <div className="text-[10px] text-outline font-mono">Dean Academic</div>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <div className="text-center text-xs text-on-surface-variant space-y-1">
          <p>University of Hyderabad Digital Classroom Infrastructure</p>
          <p className="text-[11px] text-outline">
            Protected by Institutional Row-Level Security & Role-Based Access Control
          </p>
        </div>
      </div>
    </div>
  );
}
