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
  Bug,
  CheckCircle2,
  Sliders,
  Play,
  Flame,
  Activity,
  Server,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorDisplay, ErrorType } from "@/components/shared/error-display";

export default function SystemDiagnosticsPage() {
  const [selectedError, setSelectedError] = useState<ErrorType>("500");
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(
      "Simulated Critical Runtime Exception: Memory overflow in Attendance WebSocket listener at 0x7FFE91A2"
    );
  }

  const errorScenarios: {
    type: ErrorType;
    label: string;
    code: string;
    category: "HTTP" | "Hardware" | "Security" | "Session";
    description: string;
    icon: typeof AlertTriangle;
  }[] = [
    {
      type: "404",
      label: "404 Not Found",
      code: "HTTP 404",
      category: "HTTP",
      description: "Missing course docket, outdated syllabus URL, or non-existent endpoint.",
      icon: FileQuestion,
    },
    {
      type: "403",
      label: "403 Access Denied",
      code: "HTTP 403",
      category: "Security",
      description: "Student attempt to access Dean's security clearance or faculty mark register.",
      icon: ShieldAlert,
    },
    {
      type: "401",
      label: "401 Session Expired",
      code: "HTTP 401",
      category: "Session",
      description: "Institutional Single-Sign-On JWT authentication token lapsed.",
      icon: Lock,
    },
    {
      type: "500",
      label: "500 System Crash",
      code: "HTTP 500",
      category: "HTTP",
      description: "Unexpected client component crash or runtime script execution failure.",
      icon: AlertTriangle,
    },
    {
      type: "503",
      label: "503 Server Maintenance",
      code: "HTTP 503",
      category: "HTTP",
      description: "Central Campus Attendance Server undergoing maintenance or sync.",
      icon: Server,
    },
    {
      type: "GEOLOCATION_OUT_OF_BOUNDS",
      label: "GPS Out of Range",
      code: "GEO-01",
      category: "Security",
      description: "Student mobile GPS coordinates are outside School of Life Sciences boundary.",
      icon: MapPinOff,
    },
    {
      type: "GEOLOCATION_DENIED",
      label: "GPS Permission Denied",
      code: "GEO-02",
      category: "Hardware",
      description: "Browser location tracking permissions blocked by device settings.",
      icon: MapPinOff,
    },
    {
      type: "CAMERA_PERMISSION_DENIED",
      label: "Camera Blocked",
      code: "HW-01",
      category: "Hardware",
      description: "Webcam/camera sensor permissions denied during QR attendance scan.",
      icon: CameraOff,
    },
    {
      type: "QR_EXPIRED",
      label: "QR Hash Expired",
      code: "SEC-QR1",
      category: "Session",
      description: "15-second dynamic rotating cryptographic attendance token expired.",
      icon: QrCode,
    },
    {
      type: "QR_INVALID",
      label: "Invalid QR Payload",
      code: "SEC-QR2",
      category: "Security",
      description: "Scanned QR code does not belong to University of Hyderabad registry.",
      icon: AlertTriangle,
    },
    {
      type: "NETWORK_OFFLINE",
      label: "Network Offline",
      code: "NET-01",
      category: "HTTP",
      description: "Device disconnected from eduroam campus Wi-Fi or mobile data.",
      icon: WifiOff,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B1D1D]">
              Administrative Diagnostics
            </span>
            <Badge variant="present" withDot>
              System Online
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mt-1">
            Error Handling & Resilience Center
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Test and preview all institutional error boundaries, recovery flows, and diagnostic logging.
          </p>
        </div>

        {/* Live Throw Crash Test Button */}
        <Button
          variant="outline"
          onClick={() => setShouldCrash(true)}
          className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold gap-2 text-xs"
        >
          <Flame className="w-4 h-4 text-rose-600" />
          Trigger Live Error.tsx Crash
        </Button>
      </div>

      {/* Grid: Selector & Live Error Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Error Scenarios List (5 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="p-4 bg-surface-lowest border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Select Error Screen ({errorScenarios.length})
              </span>
              <Activity className="w-4 h-4 text-primary" />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {errorScenarios.map((scenario) => {
                const Icon = scenario.icon;
                const isSelected = selectedError === scenario.type;

                return (
                  <button
                    key={scenario.type}
                    type="button"
                    onClick={() => setSelectedError(scenario.type)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#8B1D1D]/10 border-[#8B1D1D] text-[#8B1D1D] font-bold shadow-xs"
                        : "bg-surface-lowest hover:bg-surface-low border-border/80 text-on-surface hover:text-primary"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#8B1D1D] text-white"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold truncate">{scenario.label}</span>
                        <span className="font-mono text-[10px] opacity-75">{scenario.code}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-normal line-clamp-2 mt-0.5">
                        {scenario.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Quick Direct Links to Built-in Error Pages */}
          <Card className="p-4 bg-surface-lowest border border-border space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Test Dedicated Standalone Routes:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/this-page-does-not-exist-test-404"
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-low text-primary font-bold text-center border border-border"
              >
                Test Live 404 Route
              </Link>
              <Link
                href="/error-showcase"
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-low text-primary font-bold text-center border border-border"
              >
                Full Page Error Hub
              </Link>
            </div>
          </Card>
        </div>

        {/* Right: Live Interactive Error Canvas (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-6 bg-surface-lowest border border-border relative overflow-hidden shadow-elevation-1">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="present" withDot>
                  Interactive Render Canvas
                </Badge>
                <span className="text-xs font-mono text-on-surface-variant">
                  Current: {selectedError}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedError("500")}
                className="text-xs font-semibold"
              >
                Reset Canvas
              </Button>
            </div>

            {/* Error Canvas */}
            <div className="bg-background/80 rounded-2xl border border-border p-2 sm:p-4">
              <ErrorDisplay
                type={selectedError}
                reset={() => alert(`[Recovery Executed]: Error state ${selectedError} reset successfully!`)}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
