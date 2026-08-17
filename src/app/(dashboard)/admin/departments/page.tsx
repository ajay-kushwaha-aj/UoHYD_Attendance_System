"use client";

import React from "react";
import { Building2, GraduationCap, Users, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDepartmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
          Academic Structure
        </span>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
          Departments & Programs
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          University of Hyderabad Academic Hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary-fixed/40 text-primary-container">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-base text-on-surface">
                  Department of Systems & Computational Biology
                </h2>
                <p className="text-xs text-on-surface-variant">
                  School of Life Sciences
                </p>
              </div>
            </div>
            <Badge variant="present" withDot>
              Active
            </Badge>
          </div>

          <div className="space-y-2 text-xs text-on-surface-variant pt-2 border-t border-surface-container">
            <div className="flex justify-between">
              <span>Degree Program:</span>
              <strong className="text-on-surface">MSc Systems & Computational Biology</strong>
            </div>
            <div className="flex justify-between">
              <span>Current Batch:</span>
              <strong className="text-on-surface">2023–2025 (8 Students)</strong>
            </div>
            <div className="flex justify-between">
              <span>Head of Department:</span>
              <strong className="text-on-surface">Prof. K. Venkatesh Rao</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
