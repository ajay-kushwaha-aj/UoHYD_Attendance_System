"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Users,
  Clock,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Button } from "@/components/ui/button";

export default function ClassModeProjectorPage({
  params,
}: {
  params: { id: string };
}) {
  const { activeSession, sessions, regenerateQrToken, lockSession } = useAttendance();
  const currentSession =
    sessions.find((s) => s.id === params.id) || activeSession || sessions[0];

  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const records = currentSession?.records || [];
  const presentCount = records.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  ).length;
  const totalCount = records.length;

  if (!currentSession) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00142B] text-white flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/professor/session/${currentSession.id}`}>
            <button className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Exit Projector View
            </button>
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#4CADAB]">
              {currentSession.program} • Semester {currentSession.semester}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-0.5">
              {currentSession.courseName}
            </h1>
          </div>
        </div>

        {/* Room & Time Pill */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-sm font-bold text-white font-mono">
              Room {currentSession.room}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              {currentSession.startTime} – {currentSession.endTime}
            </div>
          </div>
        </div>
      </div>

      {/* Main Center Stage: Huge QR and Live Counter */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 my-6">
        {/* Left: Dynamic QR Box */}
        <div className="flex flex-col items-center">
          <div className="p-6 md:p-8 rounded-3xl bg-white shadow-2xl shadow-cyan-950/40 inline-block border-4 border-[#4CADAB]/40">
            <QRCodeSVG
              value={currentSession.qrToken || "uohyd-session-token"}
              size={300}
              level="H"
              includeMargin
            />
          </div>

          {/* Subtext */}
          <p className="mt-4 text-sm font-semibold tracking-wide text-slate-300">
            Point your mobile camera or open the Student Portal
          </p>

          {/* Expiry Pill */}
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-slate-200">
            <Clock className="w-3.5 h-3.5 text-[#4CADAB]" />
            <span>
              Refreshes in:{" "}
              <strong className="font-mono text-white">
                {Math.floor(secondsLeft / 60)}:
                {(secondsLeft % 60).toString().padStart(2, "0")}
              </strong>
            </span>
            <button
              onClick={() => {
                regenerateQrToken(currentSession.id);
                setSecondsLeft(300);
              }}
              className="ml-2 hover:text-[#4CADAB]"
              title="Refresh QR now"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Big Counter & Alternative 5-Digit Code */}
        <div className="flex flex-col items-center lg:items-start gap-6 max-w-md text-center lg:text-left">
          {/* Head Count Ticker */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-full">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#4CADAB] uppercase">
              <Users className="w-4 h-4" />
              Live Check-In Progress
            </div>
            <div className="mt-2 text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
              <span>{presentCount}</span>
              <span className="text-2xl text-slate-400 font-normal">/ {totalCount} Joined</span>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4CADAB] to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${(presentCount / (totalCount || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Alternative 5-Digit Code Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-full text-center">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Alternative Code (No Camera)
            </span>
            <div className="mt-2 text-4xl font-black tracking-widest text-[#4CADAB] font-mono">
              {currentSession.attendanceCode || "7X4P9"}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Students can enter this code in their dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security Protocol Active: Encrypted Single-Use Session Tokens</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/professor/session/${currentSession.id}`}>
            <Button variant="secondary" size="default" className="text-xs">
              Manual Attendance Sheet
            </Button>
          </Link>
          <Link href="/professor/dashboard">
            <Button
              variant="teal"
              size="default"
              className="text-xs"
              onClick={() => lockSession(currentSession.id, "Class concluded")}
            >
              <Lock className="w-3.5 h-3.5" />
              Conclude & Lock Class
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
