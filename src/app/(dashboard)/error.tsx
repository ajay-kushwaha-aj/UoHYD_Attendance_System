"use client";

import React, { useEffect } from "react";
import { ErrorDisplay } from "@/components/shared/error-display";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Workspace Error]:", error);
  }, [error]);

  return (
    <div className="py-8 px-2 max-w-2xl mx-auto animate-in fade-in duration-200">
      <ErrorDisplay
        type="500"
        title="Workspace Exception"
        message="Unable to load this workspace module due to an unexpected rendering fault. Other dashboard sections remain operational."
        error={error}
        reset={reset}
        showHomeButton={true}
        showBackButton={true}
        showRetryButton={true}
      />
    </div>
  );
}
