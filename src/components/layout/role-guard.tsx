"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, role, isAuthenticated, isLoading, switchRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
          <p className="text-xs font-semibold text-on-surface-variant">
            Verifying institutional credentials...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
    return null;
  }

  // Determine required role from URL path
  let requiredRole: "student" | "professor" | "admin" | null = null;
  if (pathname.startsWith("/student")) requiredRole = "student";
  else if (pathname.startsWith("/professor")) requiredRole = "professor";
  else if (pathname.startsWith("/admin")) requiredRole = "admin";

  // If user role doesn't match the route requirement (e.g. Student trying to access /admin or /professor)
  if (requiredRole && role !== requiredRole) {
    // Admin has super-user override permissions across all routes
    if (role === "admin") {
      return <>{children}</>;
    }

    return (
      <div className="max-w-md mx-auto my-12 animate-in fade-in zoom-in-95 duration-200">
        <Card className="p-8 text-center space-y-6 border-2 border-rose-200 bg-rose-50/40 shadow-elevation-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Access Restricted
            </span>
            <h2 className="text-lg font-bold text-on-surface">
              {requiredRole.toUpperCase()} Authorization Required
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              You are currently logged in as <strong>{user.fullName}</strong> ({(role || "GUEST").toUpperCase()} role). You do not have permissions to access <code>{pathname}</code>.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="primary"
              size="default"
              className="w-full"
              onClick={() => {
                if (role === "student") router.push("/student/dashboard");
                else if (role === "professor") router.push("/professor/dashboard");
                else router.push("/admin/dashboard");
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Return to My {(role || "USER").toUpperCase()} Dashboard
            </Button>

            <Button
              variant="secondary"
              size="default"
              className="w-full text-xs"
              onClick={() => switchRole(requiredRole!)}
            >
              ⚡ Switch to {requiredRole.toUpperCase()} Demo Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
