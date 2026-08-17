"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-elevation-2">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-8 h-8 text-tertiary-fixed" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-tertiary-teal">
            Error 404
          </span>
          <h1 className="text-xl font-bold text-on-surface">Page Not Found</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The requested university resource or departmental page does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="default" className="w-full bg-primary-container font-bold gap-1.5">
              <Home className="w-4 h-4" /> Return to University Portal
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
