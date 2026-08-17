import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded font-medium text-sm transition-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-container text-white hover:bg-primary shadow-sm active:bg-primary-container",
        secondary:
          "bg-surface-lowest text-on-surface border border-outline-variant hover:bg-surface-low active:bg-surface-container",
        ghost:
          "text-primary-container hover:bg-surface-low active:bg-surface-container",
        teal:
          "bg-tertiary-teal text-white hover:bg-tertiary-container shadow-sm active:bg-tertiary",
        danger:
          "bg-error text-on-error hover:bg-red-800 shadow-sm active:bg-red-900",
        outline:
          "border border-primary-container text-primary-container hover:bg-primary-fixed/30 active:bg-primary-fixed/50",
        subtle:
          "bg-primary-fixed text-primary-on-fixed hover:bg-primary-fixed-dim active:bg-primary-fixed",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
        default: "h-10 px-4 py-2 text-sm gap-2 rounded-md",
        lg: "h-12 px-6 text-base gap-2.5 rounded-lg font-semibold",
        icon: "h-10 w-10 p-0 rounded-md",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
