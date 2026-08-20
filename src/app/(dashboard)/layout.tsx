"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { RoleGuard } from "@/components/layout/role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background print:min-h-0 print:bg-white print:block">
      {/* Desktop Sidebar */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 print:block print:w-full">
        <div className="print:hidden">
          <Header onOpenSearch={() => setSearchOpen(true)} />
        </div>
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-container w-full mx-auto print:p-0 print:m-0 print:max-w-none print:w-full print:block">
          <RoleGuard>{children}</RoleGuard>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="print:hidden">
        <MobileNav />
      </div>

      {/* Command Palette Modal */}
      <div className="print:hidden">
        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </div>
  );
}
