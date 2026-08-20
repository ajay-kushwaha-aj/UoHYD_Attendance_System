"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-3">
          <div className="inline-flex h-24 w-24 items-center justify-center">
            <Image
              src="/uohyd-logo.png"
              alt="University of Hyderabad"
              width={96}
              height={96}
              className="object-contain w-full h-full drop-shadow-sm"
              priority
            />
          </div>
          <div className="space-y-0.5 select-none">
            <div className="text-sm font-telugu font-bold text-[#8B1D1D] leading-tight">
              హైదరాబాదు విశ్వవిద్యాలయం
            </div>
            <div className="text-[15px] font-hindi font-bold text-[#8B1D1D] leading-tight">
              हैदराबाद विश्वविद्यालय
            </div>
            <h1 className="text-base font-sans font-extrabold text-[#8B1D1D] tracking-tight">
              University of Hyderabad
            </h1>
            <p className="text-xs text-on-surface-variant font-medium pt-1">
              Set New Institutional Password
            </p>
          </div>
        </div>

        <Card className="p-6 md:p-8 shadow-elevation-2 space-y-6 border border-border">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-on-surface">
                Password Reset Successfully!
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="primary" size="lg" className="w-full bg-primary-container font-bold shadow-sm">
                  Proceed to Sign In <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="New Account Password" required hint="Must be at least 8 characters long.">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter at least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<ShieldCheck className="w-4 h-4" />}
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-primary-container font-bold mt-2"
                disabled={!newPassword || newPassword !== confirmPassword}
                isLoading={isLoading}
              >
                Reset Password →
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
