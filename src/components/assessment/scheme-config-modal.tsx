"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Sliders, CheckCircle2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AssessmentScheme, AssessmentComponent } from "@/types";

interface SchemeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: AssessmentScheme;
  onSave: (updatedScheme: AssessmentScheme) => void;
}

export function SchemeConfigModal({
  isOpen,
  onClose,
  scheme,
  onSave,
}: SchemeConfigModalProps) {
  const [totalMaxMarks, setTotalMaxMarks] = useState<number>(scheme.totalMaxMarks || 30);
  const [passingMarks, setPassingMarks] = useState<number>(scheme.passingMarks || 12);
  const [components, setComponents] = useState<AssessmentComponent[]>(scheme.components || []);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTotalMaxMarks(scheme.totalMaxMarks || 30);
      setPassingMarks(scheme.passingMarks || 12);
      setComponents([...scheme.components]);
      setErrorMessage("");
    }
  }, [isOpen, scheme]);

  const currentSum = components.reduce((acc, c) => acc + (Number(c.maxMarks) || 0), 0);
  const isSumMatched = currentSum === totalMaxMarks;

  const handleAddComponent = () => {
    const newComp: AssessmentComponent = {
      id: `comp-custom-${Date.now()}`,
      name: "New Component",
      shortCode: `C${components.length + 1}`,
      maxMarks: 5,
      order: components.length + 1,
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length <= 1) {
      setErrorMessage("At least one assessment component is required.");
      return;
    }
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleUpdateComponent = (
    id: string,
    field: keyof AssessmentComponent,
    value: any
  ) => {
    setComponents(
      components.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSumMatched) {
      setErrorMessage(
        `Component maximum marks sum (${currentSum}) must equal the configured total (${totalMaxMarks}).`
      );
      return;
    }

    onSave({
      ...scheme,
      totalMaxMarks,
      passingMarks,
      components,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Assessment Scheme"
      description="Define the internal assessment components, maximum marks, and weight distribution for this course and batch."
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Top Total Setting */}
        <div className="grid grid-cols-2 gap-4 bg-surface-low p-4 rounded-xl border border-border">
          <FormField label="Total Internal Maximum" required badge="Out of">
            <Input
              type="number"
              min={10}
              max={100}
              value={totalMaxMarks}
              onChange={(e) => setTotalMaxMarks(Number(e.target.value))}
              required
              className="font-bold font-mono text-xs"
            />
          </FormField>

          <FormField label="Passing Marks Threshold" required badge="Min 40%">
            <Input
              type="number"
              min={1}
              max={totalMaxMarks}
              value={passingMarks}
              onChange={(e) => setPassingMarks(Number(e.target.value))}
              required
              className="font-bold font-mono text-xs"
            />
          </FormField>
        </div>

        {/* Dynamic Components List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Assessment Components ({components.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddComponent}
              className="text-xs py-1 h-8 gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Component
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {components.map((comp, idx) => (
              <div
                key={comp.id}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-lowest hover:border-outline-variant transition-colors"
              >
                <div className="w-6 text-center text-xs font-bold text-outline">
                  #{idx + 1}
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="Component Name (e.g. Mid-Sem)"
                    value={comp.name}
                    onChange={(e) =>
                      handleUpdateComponent(comp.id, "name", e.target.value)
                    }
                    required
                    className="text-xs h-8"
                  />
                </div>

                <div className="w-20">
                  <Input
                    placeholder="Code"
                    value={comp.shortCode}
                    onChange={(e) =>
                      handleUpdateComponent(comp.id, "shortCode", e.target.value.toUpperCase())
                    }
                    required
                    className="text-xs h-8 uppercase font-mono font-bold text-center"
                  />
                </div>

                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    max={totalMaxMarks}
                    value={comp.maxMarks}
                    onChange={(e) =>
                      handleUpdateComponent(comp.id, "maxMarks", Number(e.target.value))
                    }
                    required
                    className="text-xs h-8 font-bold font-mono text-center"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveComponent(comp.id)}
                  className="p-1.5 text-on-surface-variant hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  title="Remove Component"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sum Validation Indicator */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            isSumMatched
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {isSumMatched ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>
              Components Total: <strong>{currentSum}</strong> / Configured Max: <strong>{totalMaxMarks}</strong>
            </span>
          </div>
          <span>{isSumMatched ? "Valid Scheme" : "Sum Mismatch"}</span>
        </div>

        {errorMessage && (
          <p className="text-xs font-semibold text-rose-600">{errorMessage}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="bg-primary-container font-bold"
            disabled={!isSumMatched}
          >
            Save Assessment Scheme
          </Button>
        </div>
      </form>
    </Modal>
  );
}
