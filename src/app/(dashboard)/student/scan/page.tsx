"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Key,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function StudentScanPage() {
  const { currentStudent, activeSession, submitStudentAttendance } = useAttendance();

  const [activeTab, setActiveTab] = useState<"qr" | "code">("qr");
  const [codeInputValue, setCodeInputValue] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    courseName?: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const token = activeSession?.qrToken || "uohyd-scb-attendance-token";
      const res = submitStudentAttendance(currentStudent.id, token);
      setResult(res);
    }, 1200);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInputValue.trim()) return;
    const res = submitStudentAttendance(currentStudent.id, codeInputValue.trim());
    setResult(res);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link href="/student/dashboard">
          <button className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-container text-on-surface-variant transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
            Class Attendance Check-In
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Mark your attendance via Dynamic QR or 5-Digit Class Code
          </p>
        </div>
      </div>

      {/* Success Modal / Result Banner */}
      {result && (
        <Card
          className={cn(
            "p-6 border-2 animate-in zoom-in-95 duration-200",
            result.success
              ? "border-emerald-500 bg-emerald-50/70"
              : "border-rose-500 bg-rose-50/70"
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "p-3 rounded-full shrink-0",
                result.success
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              )}
            >
              {result.success ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-base font-bold",
                  result.success ? "text-emerald-900" : "text-rose-900"
                )}
              >
                {result.success ? "Attendance Confirmed!" : "Verification Failed"}
              </h3>
              <p
                className={cn(
                  "text-xs mt-1 leading-relaxed",
                  result.success ? "text-emerald-800" : "text-rose-800"
                )}
              >
                {result.message}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant={result.success ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setResult(null)}
                >
                  {result.success ? "Done" : "Try Again"}
                </Button>
                <Link href="/student/dashboard">
                  <Button variant="ghost" size="sm">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Switcher Tabs */}
      <div className="flex border-b border-surface-container gap-2">
        <button
          onClick={() => {
            setActiveTab("qr");
            setResult(null);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors",
            activeTab === "qr"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          <QrCode className="w-4 h-4" />
          Camera QR Scanner
        </button>

        <button
          onClick={() => {
            setActiveTab("code");
            setResult(null);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors",
            activeTab === "code"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Key className="w-4 h-4" />
          Enter 5-Digit Code
        </button>
      </div>

      {/* TAB 1: QR CODE SCANNER */}
      {activeTab === "qr" && (
        <Card className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6">
          {/* Viewfinder simulation */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-slate-900 border-4 border-slate-700 flex flex-col items-center justify-center overflow-hidden shadow-elevation-2">
            {/* Corner guide lines */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-tertiary-teal rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-tertiary-teal rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-tertiary-teal rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-tertiary-teal rounded-br-lg" />

            {/* Laser scanning beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />

            <Camera className="w-12 h-12 text-slate-500 mb-2" />
            <span className="text-xs text-slate-400 font-medium px-4">
              {isScanning
                ? "Decrypting session token..."
                : "Align projector QR code within the frame"}
            </span>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-sm font-bold text-on-surface">
              Camera Viewfinder Active
            </h3>
            <p className="text-xs text-on-surface-variant">
              In test mode, click below to simulate an instant high-resolution scan of the lecturer's active QR code.
            </p>
          </div>

          <Button
            variant="teal"
            size="lg"
            className="w-full shadow-md"
            onClick={handleSimulateQrScan}
            isLoading={isScanning}
          >
            <Sparkles className="w-4 h-4" />
            Simulate Instant QR Check-in
          </Button>
        </Card>
      )}

      {/* TAB 2: 5-DIGIT CODE */}
      {activeTab === "code" && (
        <Card className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
              Manual Code Entry
            </span>
            <h2 className="text-lg font-bold text-on-surface">
              Enter Temporary Classroom Code
            </h2>
            <p className="text-xs text-on-surface-variant">
              Enter the 5-character alphanumeric code provided on the projector screen.
            </p>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-4 max-w-sm mx-auto">
            <Input
              placeholder="e.g. 7X4P9"
              value={codeInputValue}
              onChange={(e) => setCodeInputValue(e.target.value.toUpperCase())}
              className="text-center text-2xl font-mono tracking-widest uppercase h-14 font-black bg-surface-low border-2"
              maxLength={6}
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-primary-container"
              disabled={!codeInputValue.trim()}
            >
              Verify Code & Check In
            </Button>

            {/* Quick Demo Helper */}
            {activeSession?.attendanceCode && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setCodeInputValue(activeSession.attendanceCode || "")}
                  className="text-xs text-tertiary-teal font-semibold hover:underline"
                >
                  ⚡ Autofill Active Class Code ({activeSession.attendanceCode})
                </button>
              </div>
            )}
          </form>
        </Card>
      )}
    </div>
  );
}
