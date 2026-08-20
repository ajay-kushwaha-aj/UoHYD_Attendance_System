"use client";

import { useEffect } from "react";
import Image from "next/image";
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
      <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-200 text-center max-w-sm px-4">
        <div className="w-28 h-28 flex items-center justify-center">
          <Image
            src="/uohyd-logo.png"
            alt="University of Hyderabad Logo"
            width={112}
            height={112}
            className="object-contain w-full h-full drop-shadow-sm"
            priority
          />
        </div>
        <div className="space-y-0.5 select-none">
          <div className="text-sm font-telugu font-bold text-[#8B1D1D] leading-tight">
            హైదరాబాదు విశ్వవిద్యాలయం
          </div>
          <div className="text-[15px] font-hindi font-bold text-[#8B1D1D] leading-tight">
            हैदराबाद विश्वविद्यालय
          </div>
          <h1 className="text-base font-sans font-extrabold text-[#8B1D1D] tracking-tight">
            University of Hyderabad
          </h1>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#8B1D1D] border-t-transparent" />
          <p className="text-xs font-semibold text-on-surface-variant">
            Initializing Attendance Portal...
          </p>
        </div>
      </div>
    </div>
  );
}
