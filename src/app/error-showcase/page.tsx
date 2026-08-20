"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  FileQuestion,
  Lock,
  WifiOff,
  MapPinOff,
  CameraOff,
  QrCode,
  Home,
  ArrowLeft,
  Activity,
  Server,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorDisplay, ErrorType } from "@/components/shared/error-display";
import { UniversityBrand } from "@/components/shared/university-brand";

export default function ErrorShowcasePage() {
  const [selectedType, setSelectedType] = useState<ErrorType>("404");
  const [testCrash, setTestCrash] = useState(false);

  if (testCrash) {
    throw new Error("Triggered Real-Time Error Boundary test in Next.js error.tsx");
  }

  const errors: { type: ErrorType; title: string; subtitle: string; icon: typeof AlertTriangle }[] = [
    { type: "404", title: "404 Not Found", subtitle: "Missing institutional URL or invalid route", icon: FileQuestion },
    { type: "403", title: "403 Forbidden", subtitle: "Restricted clearance or unauthorized role", icon: ShieldAlert },
    { type: "401", title: "401 Session Expired", subtitle: "JWT Single-Sign-On authentication timeout", icon: Lock },
    { type: "500", title: "500 Runtime Crash", subtitle: "Unhandled client exception with stack trace", icon: AlertTriangle },
    { type: "503", title: "503 Server Offline", subtitle: "Scheduled maintenance or database sync", icon: Server },
    { type: "GEOLOCATION_OUT_OF_BOUNDS", title: "GPS Geofence Violation", subtitle: "Device outside lecture hall coordinate zone", icon: MapPinOff },
    { type: "GEOLOCATION_DENIED", title: "Location Permission Blocked", subtitle: "Browser GPS access denied by user", icon: MapPinOff },
    { type: "CAMERA_PERMISSION_DENIED", title: "Optical Camera Blocked", subtitle: "Webcam access denied during QR scanning", icon: CameraOff },
    { type: "QR_EXPIRED", title: "Dynamic QR Expired", subtitle: "15s rotating cryptographic hash refreshed", icon: QrCode },
    { type: "QR_INVALID", title: "Invalid QR Docket", subtitle: "Unrecognized attendance session cryptographic hash", icon: AlertTriangle },
    { type: "NETWORK_OFFLINE", title: "Network Disconnected", subtitle: "Disconnected from eduroam Wi-Fi or data", icon: WifiOff },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Accent Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d6e3ff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-lowest border border-border shadow-elevation-1">
          <UniversityBrand size="sm" layout="compact" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTestCrash(true)}
              className="text-rose-700 border-rose-300 hover:bg-rose-50 text-xs font-bold gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Live Crash Test
            </Button>
            <Link href="/login">
              <Button size="sm" className="bg-[#8B1D1D] hover:bg-[#731717] text-white text-xs font-bold gap-1.5">
                <Home className="w-3.5 h-3.5" />
                Go to Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {errors.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedType(item.type)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-[#8B1D1D] text-white border-[#8B1D1D] shadow-sm font-bold scale-[1.02]"
                    : "bg-surface-lowest hover:bg-surface-low border-border text-on-surface hover:text-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-[9px] uppercase tracking-wider opacity-80">
                    {item.type.slice(0, 7)}
                  </span>
                </div>
                <div className="font-bold text-xs truncate">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Live Active Error View */}
        <Card className="p-4 sm:p-8 bg-surface-lowest border border-border shadow-elevation-2">
          <ErrorDisplay
            type={selectedType}
            reset={() => alert(`[Reset Action]: State for ${selectedType} recovered.`)}
          />
        </Card>
      </div>
    </div>
  );
}
