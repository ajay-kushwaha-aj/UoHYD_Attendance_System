"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !role) {
      router.replace("/login");
    } else if (role === "student") {
      router.replace("/student/dashboard");
    } else if (role === "professor") {
      router.replace("/professor/dashboard");
    } else {
      router.replace("/admin/dashboard");
    }
  }, [role, isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
        <p className="text-xs font-semibold text-on-surface-variant">
          Loading University Attendance System...
        </p>
      </div>
    </div>
  );
}
