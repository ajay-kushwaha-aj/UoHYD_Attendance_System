import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide select-none transition-colors border",
  {
    variants: {
      variant: {
        present:
          "bg-attendance-present-badge text-attendance-present-text border-attendance-present-border",
        absent:
          "bg-attendance-absent-badge text-attendance-absent-text border-attendance-absent-border",
        late:
          "bg-attendance-late-badge text-attendance-late-text border-attendance-late-border",
        primary:
          "bg-primary-fixed text-primary-on-fixed border-primary-fixed-dim",
        secondary:
          "bg-secondary-container text-secondary-on-container border-outline-variant",
        outline:
          "bg-transparent text-on-surface border-outline-variant",
        active:
          "bg-tertiary-fixed text-tertiary-on-fixed border-tertiary-fixed-dim",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

export function Badge({ className, variant, withDot, children, ...props }: BadgeProps) {
  const dotColorClass =
    variant === "present"
      ? "bg-attendance-present-dot"
      : variant === "absent"
      ? "bg-attendance-absent-dot"
      : variant === "late"
      ? "bg-attendance-late-dot"
      : "bg-current";

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {withDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", dotColorClass)} />
      )}
      {children}
    </span>
  );
}
