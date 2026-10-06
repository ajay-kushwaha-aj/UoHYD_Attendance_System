import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, suffix, prefix, error, ...props }, ref) => {
    // If suffix or prefix is present, render input addon container
    if (suffix || prefix) {
      return (
        <div
          className={cn(
            "relative flex items-center w-full group rounded-xl border border-border bg-surface shadow-xs transition-all duration-150 overflow-hidden",
            "hover:border-outline/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-surface-lowest",
            error && "border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20"
          )}
        >
          {prefix && (
            <div className="pl-3.5 pr-2.5 text-xs font-semibold text-muted-foreground select-none flex items-center border-r border-border/60 bg-muted/40 h-10">
              {prefix}
            </div>
          )}
          {icon && (
            <div className="pl-3.5 text-on-surface-variant/70 group-focus-within:text-primary transition-colors pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full bg-transparent px-3 py-2 text-xs font-medium text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="pr-3 text-on-surface-variant flex items-center justify-center">
              {rightElement}
            </div>
          )}
          {suffix && (
            <div className="px-3.5 h-10 bg-slate-100 border-l border-slate-200 text-xs font-bold text-slate-700 select-none flex items-center justify-center tracking-tight shrink-0">
              {suffix}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative flex items-center w-full group">
        {icon && (
          <div className="absolute left-3.5 text-on-surface-variant/70 group-focus-within:text-primary transition-colors pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-on-surface placeholder:text-on-surface-variant/40 shadow-xs transition-all duration-150",
            "hover:border-outline/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 focus-visible:bg-surface-lowest",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-low",
            icon && "pl-10",
            rightElement && "pr-10",
            error && "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-on-surface-variant flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
