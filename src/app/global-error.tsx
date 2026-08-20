"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home, LifeBuoy } from "lucide-react";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Fatal Root Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 font-sans antialiased">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Brand Header */}
          <div className="flex flex-col items-center gap-2 select-none">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-sm flex items-center justify-center">
              <Image
                src="/uohyd-logo.png"
                alt="University of Hyderabad"
                width={56}
                height={56}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-[#8B1D1D]">
                హైదరాబాదు విశ్వవిద్యాలయం
              </p>
              <p className="text-[10px] font-bold text-[#8B1D1D]">
                हैदराबाद विश्वविद्यालय
              </p>
              <h1 className="text-sm font-extrabold text-[#8B1D1D]">
                University of Hyderabad
              </h1>
            </div>
          </div>

          {/* Fatal Error Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Fatal Application Crash
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Critical Framework Failure
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                An unrecoverable exception occurred in the root institutional layout.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8B1D1D] hover:bg-[#731717] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              <a
                href="/"
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                Restart at Portal Home
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Computer Centre Helpdesk: helpdesk@uohyd.ac.in</span>
          </div>
        </div>
      </body>
    </html>
  );
}
