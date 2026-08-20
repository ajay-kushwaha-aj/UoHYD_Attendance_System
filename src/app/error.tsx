"use client";

import React, { useEffect } from "react";
import { ErrorDisplay } from "@/components/shared/error-display";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to institutional monitoring if available
    console.error("[UoHYD Attendance System] Uncaught Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <ErrorDisplay
        type="500"
        title="Application Runtime Exception"
        message="A client-side operational failure occurred while rendering this interface component. Your institutional session remains secure."
        error={error}
        reset={reset}
        showRetryButton={true}
        showHomeButton={true}
        showBackButton={true}
        showSupportDetails={true}
      />
    </div>
  );
}
