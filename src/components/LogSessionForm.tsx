/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Subject, StudySession } from "../types";
import { formatDate } from "../data";
import { Clock, Calendar, FileText, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface LogSessionFormProps {
  subjects: Subject[];
  onLogSession: (session: Omit<StudySession, "id">) => void;
  onClose: () => void;
}

export const LogSessionForm: React.FC<LogSessionFormProps> = ({
  subjects,
  onLogSession,
  onClose,
}) => {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [durationStr, setDurationStr] = useState("60");
  const [date, setDate] = useState(formatDate(new Date()));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subjectId) {
      setError("Please select a subject. If none are available, create one first!");
      return;
    }

    const durationMinutes = parseInt(durationStr);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      setError("Duration must be a valid number of minutes greater than 0");
      return;
    }

    if (durationMinutes > 1440) {
      setError("Duration cannot exceed 24 hours (1440 minutes) for a single session");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    onLogSession({
      subjectId,
      durationMinutes,
      date,
      note: note.trim(),
    });

    // Reset
    setDurationStr("60");
    setNote("");
    onClose();
  };

  const selectQuickDuration = (mins: number) => {
    setDurationStr(String(mins));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Clock className="text-indigo-500 animate-pulse" size={18} /> Log Study Session
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          id="close-log-session-btn"
        >
          &times;
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
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            required
            id="session-subject-select"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Duration (Minutes)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={durationStr}
              onChange={(e) => setDurationStr(e.target.value)}
              className="w-32 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              required
              id="session-duration-input"
            />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({Math.round((parseInt(durationStr) || 0) / 60 * 10) / 10} hours)
            </span>
          </div>

          {/* Quick selectors */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[30, 45, 60, 90, 120, 180].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => selectQuickDuration(mins)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                id={`quick-duration-${mins}`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              required
              id="session-date-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
            <span>Covered Material / Notes</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 lowercase">optional</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What topics did you study? (e.g., reviewed dynamic programming, practiced spelling)"
            rows={3}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
            id="session-note-input"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
            id="cancel-log-session-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
            id="submit-log-session-btn"
          >
            <CheckCircle size={16} /> Log Session
          </button>
        </div>
      </form>
    </div>
  );
};
