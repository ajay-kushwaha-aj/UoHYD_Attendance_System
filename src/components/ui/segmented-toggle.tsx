"use client";

import React from "react";
import { AttendanceStatus } from "@/types";
import { cn } from "@/lib/utils";

interface SegmentedToggleProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
  size?: "sm" | "default";
}

export function AttendanceSegmentedToggle({
  value,
  onChange,
  disabled = false,
  size = "default",
}: SegmentedToggleProps) {
  const options: { status: AttendanceStatus; label: string; keyLetter: string; activeClass: string }[] = [
    {
      status: "PRESENT",
      label: "Present",
      keyLetter: "P",
      activeClass: "bg-attendance-present-badge text-attendance-present-text shadow-sm border-attendance-present-border font-bold",
    },
    {
      status: "ABSENT",
      label: "Absent",
      keyLetter: "A",
      activeClass: "bg-attendance-absent-badge text-attendance-absent-text shadow-sm border-attendance-absent-border font-bold",
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg bg-surface-container p-1 border border-outline-variant/40 select-none",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.status;
        return (
          <button
            key={opt.status}
            type="button"
            onClick={() => onChange(opt.status)}
            className={cn(
              "relative flex items-center justify-center rounded-md text-xs transition-tactile border border-transparent font-medium",
              size === "sm" ? "px-2 py-1 min-w-[54px] gap-1" : "px-3 py-1.5 min-w-[68px] gap-1.5",
              isSelected
                ? opt.activeClass
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
            )}
            title={`Mark ${opt.label} (Press ${opt.keyLetter})`}
          >
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
