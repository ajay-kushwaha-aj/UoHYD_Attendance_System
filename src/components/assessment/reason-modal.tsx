"use client";

import React, { useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  studentName: string;
  componentName: string;
  oldScore: number | null;
  newScore: number;
}

export function ReasonModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  componentName,
  oldScore,
  newScore,
}: ReasonModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide an institutional reason for modifying finalized marks.");
      return;
    }
    onConfirm(reason);
    setReason("");
    setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Trail: Modify Finalized Mark"
      description="These marks have already been finalized. Any modifications will be logged with your timestamp and institutional identity."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Mark Modification Audit</span>
          </div>
          <p className="text-amber-800 text-[11px]">
            Student: <strong>{studentName}</strong> • Component: <strong>{componentName}</strong>
          </p>
          <p className="text-amber-800 text-[11px]">
            Score Change: <span className="font-mono">{oldScore ?? 0}</span> ➔{" "}
            <span className="font-mono font-bold text-emerald-800">{newScore}</span>
          </p>
        </div>

        <FormField
          label="Institutional Reason for Revision"
          required
          hint="This explanation will be recorded in the unalterable Departmental Audit Log."
          error={error}
        >
          <Input
            placeholder="e.g. Corrected Mid-Sem re-evaluation calculation / Medical grace"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            required
            className="text-xs"
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="bg-primary-container font-bold">
            Record Audit & Apply
          </Button>
        </div>
      </form>
    </Modal>
  );
}
