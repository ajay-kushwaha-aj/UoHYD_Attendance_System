import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  hint,
  error,
  badge,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          {badge && (
            typeof badge === "string" ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">
                {badge}
              </span>
            ) : (
              <div>{badge}</div>
            )
          )}
        </div>
      )}
      {children}
      {hint && !error && (
        <p className="text-[11px] text-on-surface-variant/70 leading-normal">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 pt-2", className)}>
      <div className="border-b border-surface-container pb-1.5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
          {title}
        </h4>
        {subtitle && <p className="text-[11px] text-on-surface-variant">{subtitle}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
