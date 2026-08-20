import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAttendancePercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

export function getAttendanceStatus(percentage: number, thresholds = { min: 75, critical: 60 }): "good" | "warning" | "critical" {
  if (percentage >= thresholds.min) return "good";
  if (percentage >= thresholds.critical) return "warning";
  return "critical";
}

export function getStatusColor(status: "PRESENT" | "ABSENT" | "good" | "warning" | "critical") {
  switch (status) {
    case "PRESENT":
    case "good":
      return {
        bg: "bg-attendance-present-bg",
        badge: "bg-attendance-present-badge text-attendance-present-text border-attendance-present-border",
        text: "text-attendance-present-text",
        dot: "bg-attendance-present-dot",
        border: "border-attendance-present-border",
        label: "Present",
      };
    case "warning":
      return {
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        text: "text-amber-700",
        dot: "bg-amber-500",
        border: "border-amber-300",
        label: "Attention Needed",
      };
    case "ABSENT":
    case "critical":
    default:
      return {
        bg: "bg-attendance-absent-bg",
        badge: "bg-attendance-absent-badge text-attendance-absent-text border-attendance-absent-border",
        text: "text-attendance-absent-text",
        dot: "bg-attendance-absent-dot",
        border: "border-attendance-absent-border",
        label: "Absent",
      };
  }
}
