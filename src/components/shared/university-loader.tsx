"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UniversityLoaderProps {
  fullScreen?: boolean;
  message?: string;
  subMessage?: string;
  className?: string;
}

export function UniversityLoader({
  fullScreen = false,
  message = "Loading Attendance Infrastructure...",
  subMessage = "Synchronizing academic sessions, timetables & internal assessment records",
  className,
}: UniversityLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in zoom-in-95 duration-300">
      {/* Logo Container with Multi-Layer Glow & Spinning Orbit */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Background Glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#8B1D1D]/15 via-rose-200/20 to-teal-200/20 blur-xl animate-pulse" />

        {/* Outer Orbiting Ring */}
        <div className="absolute -inset-3.5 rounded-full border-2 border-dashed border-[#8B1D1D]/30 animate-spin [animation-duration:8s]" />

        {/* Inner Counter-Rotating Ring */}
        <div className="absolute -inset-1.5 rounded-full border border-teal-600/30 animate-spin [animation-duration:4s] [animation-direction:reverse]" />

        {/* Centered Logo Card with Soft Shadow */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-lowest/90 backdrop-blur-md p-2.5 shadow-elevation-2 flex items-center justify-center border border-border/80 group">
          <Image
            src="/uohyd-logo.png"
            alt="University of Hyderabad"
            width={72}
            height={72}
            className="object-contain w-full h-full drop-shadow-sm transition-transform duration-500 hover:scale-105 animate-pulse"
            priority
          />
        </div>

        {/* Small Active Pulse Dot */}
        <div className="absolute -bottom-1 -right-1 z-20 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
        </div>
      </div>

      {/* University Official Multilingual Header */}
      <div className="space-y-0.5 max-w-sm mb-4">
        <p className="text-xs font-telugu font-bold text-[#8B1D1D] tracking-wide">
          హైదరాబాదు విశ్వవిద్యాలయం
        </p>
        <p className="text-xs font-hindi font-bold text-[#8B1D1D] tracking-wide">
          हैदराबाद विश्वविद्यालय
        </p>
        <h2 className="text-sm sm:text-base font-extrabold text-[#8B1D1D] tracking-tight uppercase">
          University of Hyderabad
        </h2>
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold tracking-wider uppercase mt-1">
          Attendance Portal
        </div>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="w-48 sm:w-56 h-1.5 bg-surface-container rounded-full overflow-hidden relative shadow-inner my-2">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B1D1D] to-teal-600 rounded-full animate-indeterminate" />
      </div>

      {/* Dynamic Status Text & Pulsing Dots */}
      <div className="space-y-1 mt-2">
        <p className="text-xs font-bold text-on-surface flex items-center justify-center gap-1.5">
          <span>{message}</span>
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </span>
        </p>
        {subMessage && (
          <p className="text-[11px] text-on-surface-variant max-w-xs leading-normal">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-[400px] w-full flex items-center justify-center rounded-2xl bg-surface-lowest/60 border border-border/60",
        className
      )}
    >
      {content}
    </div>
  );
}
