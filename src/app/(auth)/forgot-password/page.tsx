"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("dr.rao@uohyd.ac.in");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
      setOtp("849201");
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/reset-password");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <KeyRound className="w-7 h-7 text-tertiary-fixed" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-primary">
            Password Recovery
          </h1>
          <p className="text-xs text-on-surface-variant">
            University of Hyderabad Single-Sign-On Recovery
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-elevation-2 space-y-6 border border-border">
          {step === "request" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-on-surface">
                  Forgot your credentials?
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Enter your registered institutional email address. We will send a secure verification code to reset your password.
                </p>
              </div>

              <FormField
                label="Institutional Email Address"
                required
                hint="Your active @uohyd.ac.in account"
              >
                <Input
                  type="email"
                  placeholder="username@uohyd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-primary-container font-bold shadow-sm"
                isLoading={isLoading}
              >
                Send Recovery OTP →
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-on-surface-variant hover:text-on-surface font-semibold flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> OTP Sent Successfully
                </div>
                <h2 className="text-base font-bold text-on-surface">
                  Enter 6-Digit OTP
                </h2>
                <p className="text-xs text-on-surface-variant">
                  We sent a 6-digit one-time code to <strong>{email}</strong>.
                </p>
              </div>

              <FormField
                label="6-Digit Verification Code"
                required
                hint="Auto-filled for demonstration"
              >
                <Input
                  placeholder="849201"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-xl font-mono tracking-widest font-bold h-12"
                  maxLength={6}
                  required
                  autoFocus
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-primary-container font-bold"
                isLoading={isLoading}
              >
                Verify & Set New Password →
              </Button>

              <div className="flex items-center justify-between text-xs pt-2 text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                </button>
                <button
                  type="button"
                  className="text-tertiary-teal font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
