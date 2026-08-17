import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  statusVariant?: "default" | "good" | "warning" | "critical";
  badge?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  statusVariant = "default",
  badge,
}: StatCardProps) {
  const accentBorder = {
    default: "border-border",
    good: "border-l-4 border-l-attendance-present-dot border-border",
    warning: "border-l-4 border-l-attendance-late-dot border-border",
    critical: "border-l-4 border-l-attendance-absent-dot border-border",
  }[statusVariant];

  return (
    <Card className={cn("p-5 flex flex-col justify-between hover:border-outline transition-colors", accentBorder)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-surface-container text-primary-container">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-on-surface tracking-tight">{value}</div>
        {badge && <div>{badge}</div>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "font-semibold flex items-center gap-0.5",
                trend.isPositive ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
