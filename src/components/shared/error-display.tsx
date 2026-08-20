"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ShieldAlert,
  WifiOff,
  CameraOff,
  MapPinOff,
  QrCode,
  RefreshCw,
  Home,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  LifeBuoy,
  FileQuestion,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export type ErrorType =
  | "404"
  | "403"
  | "401"
  | "500"
  | "503"
  | "GEOLOCATION_DENIED"
  | "GEOLOCATION_OUT_OF_BOUNDS"
  | "CAMERA_PERMISSION_DENIED"
  | "QR_EXPIRED"
  | "QR_INVALID"
  | "NETWORK_OFFLINE"
  | "SYNC_FAILED";

interface ErrorDisplayProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRetryButton?: boolean;
  showSupportDetails?: boolean;
  customAction?: React.ReactNode;
}

export function ErrorDisplay({
  type = "500",
  title,
  message,
  error,
  reset,
  showHomeButton = true,
  showBackButton = true,
  showRetryButton = true,
  showSupportDetails = true,
  customAction,
}: ErrorDisplayProps) {
  const router = useRouter();
  const { role, switchRole } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const incidentId = React.useMemo(
    () => error?.digest || `ERR-${Math.floor(100000 + Math.random() * 900000)}`,
    [error]
  );

  const handleCopyDiagnostics = () => {
    const diagnostics = `=== UNIVERSITY OF HYDERABAD ATTENDANCE PORTAL DIAGNOSTICS ===
Timestamp: ${new Date().toISOString()}
Error Type: ${type}
Incident ID: ${incidentId}
Error Message: ${error?.message || message || "Unspecified client exception"}
Error Stack: ${error?.stack || "N/A"}
User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
Current Path: ${typeof window !== "undefined" ? window.location.pathname : "N/A"}
User Role: ${role || "GUEST"}
=============================================================`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(diagnostics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    if (reset) {
      reset();
    } else {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
    setTimeout(() => setIsRetrying(false), 1200);
  };

  const getErrorConfig = () => {
    switch (type) {
      case "404":
        return {
          badge: "Error 404 • Resource Not Found",
          badgeVariant: "outline" as const,
          icon: FileQuestion,
          iconBg: "bg-amber-100 text-amber-800 border border-amber-300",
          defaultTitle: "Institutional Resource Not Found",
          defaultMessage:
            "The requested attendance session, academic report, or department workspace does not exist or has been relocated.",
          hint: "Check the URL for typographical errors or navigate via your official dashboard.",
        };
      case "403":
        return {
          badge: "Error 403 • Authorization Restricted",
          badgeVariant: "absent" as const,
          icon: ShieldAlert,
          iconBg: "bg-rose-100 text-rose-800 border border-rose-300",
          defaultTitle: "Access Prohibited / Clearance Required",
          defaultMessage:
            "Your institutional account does not possess the requisite security permissions to access this administrative workspace or faculty registry.",
          hint: "If you believe this is an administrative mistake, contact the Dean's Office or System Administrator.",
        };
      case "401":
        return {
          badge: "Error 401 • Session Expired",
          badgeVariant: "late" as const,
          icon: Lock,
          iconBg: "bg-amber-100 text-amber-800 border border-amber-300",
          defaultTitle: "Institutional Session Expired",
          defaultMessage:
            "Your Single-Sign-On authorization token has lapsed. Please re-authenticate to confirm your institutional identity.",
          hint: "Re-authenticate using your @uohyd.ac.in credentials to resume your session.",
        };
      case "503":
        return {
          badge: "Error 503 • Service Unavailable",
          badgeVariant: "secondary" as const,
          icon: WifiOff,
          iconBg: "bg-slate-100 text-slate-800 border border-slate-300",
          defaultTitle: "Central Campus Server Maintenance",
          defaultMessage:
            "University Attendance Infrastructure is temporarily undergoing scheduled maintenance or database synchronization.",
          hint: "Please allow a few moments and try reloading the portal.",
        };
      case "GEOLOCATION_OUT_OF_BOUNDS":
        return {
          badge: "Geofence Violation • Location Out of Range",
          badgeVariant: "absent" as const,
          icon: MapPinOff,
          iconBg: "bg-rose-100 text-rose-800 border border-rose-300",
          defaultTitle: "Outside School of Life Sciences Geofence",
          defaultMessage:
            "Your device GPS indicates coordinates outside the designated lecture hall zone (Department of Systems & Computational Biology).",
          hint: "Ensure you are physically present inside Lecture Hall 102 and enable high-accuracy device location.",
        };
      case "GEOLOCATION_DENIED":
        return {
          badge: "Permission Denied • GPS Required",
          badgeVariant: "secondary" as const,
          icon: MapPinOff,
          iconBg: "bg-amber-100 text-amber-800 border border-amber-300",
          defaultTitle: "Location Access Denied by Browser",
          defaultMessage:
            "University verification protocol requires GPS permission to prevent proxy attendance marking.",
          hint: "Click the lock icon in your browser address bar and enable Location permissions for this site.",
        };
      case "CAMERA_PERMISSION_DENIED":
        return {
          badge: "Hardware Error • Camera Access Blocked",
          badgeVariant: "secondary" as const,
          icon: CameraOff,
          iconBg: "bg-amber-100 text-amber-800 border border-amber-300",
          defaultTitle: "Optical Camera Sensor Blocked",
          defaultMessage:
            "The portal cannot access your device optical camera for dynamic QR code scanning.",
          hint: "Allow camera access in your browser settings to scan attendance codes.",
        };
      case "QR_EXPIRED":
        return {
          badge: "QR Code Invalidation",
          badgeVariant: "secondary" as const,
          icon: QrCode,
          iconBg: "bg-indigo-100 text-indigo-800 border border-indigo-300",
          defaultTitle: "Dynamic QR Code Expired",
          defaultMessage:
            "The 15-second rotating cryptographic hash for this attendance session has refreshed.",
          hint: "Scan the latest live QR code projected on the classroom screen.",
        };
      case "QR_INVALID":
        return {
          badge: "Cryptographic Mismatch",
          badgeVariant: "absent" as const,
          icon: AlertTriangle,
          iconBg: "bg-rose-100 text-rose-800 border border-rose-300",
          defaultTitle: "Unrecognized QR Code Payload",
          defaultMessage:
            "The scanned QR code is not recognized as a valid University of Hyderabad attendance session docket.",
          hint: "Ensure you are scanning the official faculty session broadcast.",
        };
      case "NETWORK_OFFLINE":
        return {
          badge: "Network Connection Lost",
          badgeVariant: "outline" as const,
          icon: WifiOff,
          iconBg: "bg-slate-100 text-slate-800 border border-slate-300",
          defaultTitle: "Disconnected from Campus Network",
          defaultMessage:
            "Unable to reach the central attendance server. Please check your eduroam Wi-Fi or mobile data connection.",
          hint: "Reconnect to campus Wi-Fi or mobile data and retry.",
        };
      case "500":
      default:
        return {
          badge: "Error 500 • Internal System Exception",
          badgeVariant: "absent" as const,
          icon: AlertTriangle,
          iconBg: "bg-rose-100 text-rose-800 border border-rose-300",
          defaultTitle: "Application Runtime Error",
          defaultMessage:
            "An unexpected operational exception occurred while executing your request.",
          hint: "The error has been captured with incident tracking. Try reloading or contacting support.",
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-xl space-y-6">
        {/* University Official Brand Header */}
        <div className="flex items-center justify-center gap-3 select-none">
          <div className="relative h-12 w-12 rounded-xl bg-white border border-border shadow-xs p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src="/uohyd-logo.png"
              alt="University of Hyderabad"
              width={48}
              height={48}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-[10px] font-bold text-[#8B1D1D] leading-none">
              హైదరాబాదు విశ్వవిద్యాలయం
            </p>
            <p className="text-[10px] font-bold text-[#8B1D1D] leading-none">
              हैदराबाद विश्वविद्यालय
            </p>
            <h2 className="text-xs font-extrabold text-[#8B1D1D] tracking-tight leading-none">
              University of Hyderabad
            </h2>
          </div>
        </div>

        {/* Main Error Presentation Card */}
        <Card className="p-6 sm:p-8 text-center space-y-6 border border-border bg-surface-lowest shadow-elevation-2">
          {/* Icon Badge */}
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${config.iconBg}`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <Badge variant={config.badgeVariant} withDot>
              {config.badge}
            </Badge>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-on-surface">
              {title || config.defaultTitle}
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
              {message || config.defaultMessage}
            </p>
            {config.hint && (
              <div className="mt-2 inline-block bg-surface-container/60 border border-border px-3 py-1.5 rounded-lg text-xs text-on-surface-variant font-medium">
                💡 <span className="font-semibold text-on-surface">Recommendation:</span> {config.hint}
              </div>
            )}
          </div>

          {/* Incident ID & Action Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {showRetryButton && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="bg-[#8B1D1D] hover:bg-[#731717] text-white font-bold gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                  {isRetrying ? "Retrying..." : "Try Again"}
                </Button>
              )}

              {showHomeButton && (
                <Link
                  href={
                    role === "student"
                      ? "/student/dashboard"
                      : role === "professor"
                      ? "/professor/dashboard"
                      : "/admin/dashboard"
                  }
                >
                  <Button variant="outline" className="gap-2 font-semibold">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              )}

              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2 text-on-surface-variant"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
              )}

              {customAction}
            </div>

            {/* Quick Demo Switcher if Forbidden */}
            {type === "403" && (
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Switch demo profile:
                </span>
                <button
                  type="button"
                  onClick={() => switchRole("student")}
                  className="text-[11px] font-bold text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("professor")}
                  className="text-[11px] font-bold text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                >
                  Professor
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("admin")}
                  className="text-[11px] font-bold text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                >
                  Admin
                </button>
              </div>
            )}
          </div>

          {/* Expandable Technical Diagnostics */}
          <div className="pt-2 border-t border-border/80 text-left">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-semibold text-on-surface-variant hover:text-on-surface py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded">
                  Incident ID: {incidentId}
                </span>
                <span>Technical Diagnostics</span>
              </span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="mt-3 p-3.5 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs font-mono animate-in fade-in duration-150 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-[11px]">Exception Details</span>
                  <button
                    type="button"
                    onClick={handleCopyDiagnostics}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Log
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto pr-1">
                  <p className="text-rose-400 font-bold">
                    {error?.name || "Exception"}: {error?.message || message || config.defaultMessage}
                  </p>
                  {error?.stack && (
                    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono mt-1">
                      {error.stack}
                    </pre>
                  )}
                  <p className="text-slate-500 text-[10px]">
                    User Context: {role?.toUpperCase() || "UNAUTHENTICATED"} • System Time:{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Institutional IT Helpdesk Contact Footer */}
        {showSupportDetails && (
          <div className="p-4 rounded-xl bg-surface-lowest border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-primary shrink-0" />
              <span>
                Need assistance? Contact <strong>UoHYD Computer Centre Support</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-primary">
              <a href="mailto:helpdesk@uohyd.ac.in" className="hover:underline">
                helpdesk@uohyd.ac.in
              </a>
              <span>•</span>
              <span className="font-mono text-on-surface">Ext. 2100 / 2101</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
