/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Subject } from "../types";
import { AVAILABLE_COLORS, COLOR_MAP } from "../data";
import { Plus, X, BookOpen, AlertCircle } from "lucide-react";

interface AddSubjectFormProps {
  onAddSubject: (subject: Omit<Subject, "id">) => void;
  onClose: () => void;
}

export const AddSubjectForm: React.FC<AddSubjectFormProps> = ({
  onAddSubject,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [targetHours, setTargetHours] = useState<number>(4);
  const [color, setColor] = useState("sage");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Subject name is required");
      return;
    }

    if (targetHours <= 0) {
      setError("Target hours must be greater than 0");
      return;
    }

    if (targetHours > 168) {
      setError("Target hours cannot exceed hours in a week (168)");
      return;
    }

    onAddSubject({
      name: name.trim(),
      targetHours,
      color,
    });

    // Reset
    setName("");
    setTargetHours(4);
    setColor("sage");
    onClose();
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BookOpen className="text-sage-500" size={18} /> Add New Subject
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          id="close-add-subject-btn"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Subject Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Chemistry, Algorithms"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-sm"
            required
            id="subject-name-input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Target Study Hours Per Week
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="168"
              step="0.5"
              value={targetHours || ""}
              onChange={(e) => setTargetHours(parseFloat(e.target.value) || 0)}
              className="w-32 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all text-sm"
              required
              id="subject-target-input"
            />
            <span className="text-xs text-slate-400 dark:text-slate-500">hours / week</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Color Theme
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_COLORS.map((col) => {
              const colors = COLOR_MAP[col];
              const isSelected = color === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColor(col)}
                  className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-all ${colors.bar} hover:scale-110 ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-sage-550 dark:ring-offset-slate-950"
                      : "opacity-80"
                  }`}
                  title={col}
                  id={`color-picker-${col}`}
                />
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
            id="cancel-add-subject-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-medium text-sm transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
            id="submit-add-subject-btn"
          >
            <Plus size={16} /> Save Subject
          </button>
        </div>
      </form>
    </div>
  );
};
