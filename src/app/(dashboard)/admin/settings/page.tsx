"use client";

import React, { useState, useEffect } from "react";
import { Sliders, ShieldCheck, Check, Save, Database, CheckCircle2 } from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { systemSettings, updateSystemSettings } = useAttendance();

  const [minThreshold, setMinThreshold] = useState(systemSettings?.minThreshold || "75");
  const [criticalThreshold, setCriticalThreshold] = useState(systemSettings?.criticalThreshold || "60");
  const [qrExpiryMinutes, setQrExpiryMinutes] = useState(systemSettings?.qrExpiryMinutes || "5");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      if (systemSettings.minThreshold) setMinThreshold(systemSettings.minThreshold);
      if (systemSettings.criticalThreshold) setCriticalThreshold(systemSettings.criticalThreshold);
      if (systemSettings.qrExpiryMinutes) setQrExpiryMinutes(systemSettings.qrExpiryMinutes);
    }
  }, [systemSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSystemSettings({
        minThreshold: String(minThreshold),
        criticalThreshold: String(criticalThreshold),
        qrExpiryMinutes: String(qrExpiryMinutes),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Failed to save system settings to database:", err);
    } finally {
      setIsSaving(false);
    }
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
          Configure statutory attendance percentages, token timeouts, and database policies
        </p>
      </div>

      <Card className="p-6 md:p-8 border border-border shadow-elevation-1">
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
                  required
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
                  required
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
                  required
                />
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Active lifetime of temporary QR tokens before refresh.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Database Sync Active (Turso libSQL)
            </span>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Persisted to Database!
                </span>
              )}
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={isSaving}
                className="bg-primary-container font-bold gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving to Database..." : "Save Configurations"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
