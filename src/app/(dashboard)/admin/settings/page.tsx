"use client";

import React, { useState } from "react";
import { Sliders, ShieldCheck, Check, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [minThreshold, setMinThreshold] = useState("75");
  const [criticalThreshold, setCriticalThreshold] = useState("60");
  const [qrExpiryMinutes, setQrExpiryMinutes] = useState("5");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary-teal">
          System Administration
        </span>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
          Academic Rules & Threshold Settings
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Configure statutory attendance percentages, token timeouts, and audit policies
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              Attendance Rules & Warning Limits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Minimum Eligibility Threshold (%)
                </label>
                <Input
                  type="number"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  min={50}
                  max={100}
                />
                <p className="text-[10px] text-on-surface-variant mt-1">
                  University statutory requirement for exam eligibility.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Critical Warning Threshold (%)
                </label>
                <Input
                  type="number"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(e.target.value)}
                  min={30}
                  max={90}
                />
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Triggers automated debarment risk alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-surface-container">
            <h3 className="text-sm font-bold text-on-surface border-b border-surface-container pb-2">
              QR Code & Session Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Dynamic QR Expiry Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={qrExpiryMinutes}
                  onChange={(e) => setQrExpiryMinutes(e.target.value)}
                  min={1}
                  max={60}
                />
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Active lifetime of temporary QR tokens before refresh.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
            {saved && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            )}
            <Button type="submit" variant="primary" size="default">
              <Save className="w-4 h-4" />
              Save Configurations
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
