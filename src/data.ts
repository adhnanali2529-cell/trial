/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, StudySession } from "./types";

// Helper to get formatted date string (YYYY-MM-DD)
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper to get date string relative to today
export function getRelativeDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
}

// Get Monday of the week containing the given date
export function getStartOfWeekDate(dateString: string): string {
  const d = new Date(dateString + "T00:00:00");
  const day = d.getDay();
  // If Sunday (0), we go back 6 days to Monday. Else we go back (day - 1) days to Monday.
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d.setDate(diff));
  return formatDate(monday);
}

// Helper to check if a date is within the same calendar week as another date
export function isSameCalendarWeek(date1Str: string, date2Str: string): boolean {
  return getStartOfWeekDate(date1Str) === getStartOfWeekDate(date2Str);
}

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    name: "Advanced Mathematics",
    targetHours: 8,
    color: "amber", // Using tailwind color schemes
  },
  {
    id: "sub-2",
    name: "Data Structures & Algorithms",
    targetHours: 10,
    color: "emerald",
  },
  {
    id: "sub-3",
    name: "Human-Computer Interaction",
    targetHours: 4,
    color: "violet",
  },
  {
    id: "sub-4",
    name: "Database Systems",
    targetHours: 6,
    color: "sky",
  },
  {
    id: "sub-5",
    name: "Academic English Writing",
    targetHours: 3,
    color: "rose",
  },
];

export const getSampleSessions = (): StudySession[] => [
  {
    id: "sess-1",
    subjectId: "sub-1",
    durationMinutes: 120,
    date: getRelativeDateString(6), // Monday
    note: "Solved practice problems on Fourier transforms.",
  },
  {
    id: "sess-2",
    subjectId: "sub-2",
    durationMinutes: 90,
    date: getRelativeDateString(6), // Monday
    note: "Implemented red-black trees in C++.",
  },
  {
    id: "sess-3",
    subjectId: "sub-3",
    durationMinutes: 60,
    date: getRelativeDateString(5), // Tuesday
    note: "Read chapter 4 on heuristic evaluations.",
  },
  {
    id: "sess-4",
    subjectId: "sub-4",
    durationMinutes: 120,
    date: getRelativeDateString(5), // Tuesday
    note: "Designed ER diagram for the course project.",
  },
  {
    id: "sess-5",
    subjectId: "sub-2",
    durationMinutes: 180,
    date: getRelativeDateString(4), // Wednesday
    note: "Solved 3 LeetCode hard problems on dynamic programming.",
  },
  {
    id: "sess-6",
    subjectId: "sub-5",
    durationMinutes: 90,
    date: getRelativeDateString(3), // Thursday
    note: "Drafted literature review section of the term paper.",
  },
  {
    id: "sess-7",
    subjectId: "sub-1",
    durationMinutes: 120,
    date: getRelativeDateString(3), // Thursday
    note: "Reviewed lecture notes on complex variables.",
  },
  {
    id: "sess-8",
    subjectId: "sub-4",
    durationMinutes: 150,
    date: getRelativeDateString(2), // Friday
    note: "Wrote SQL queries with multiple joins and CTEs.",
  },
  {
    id: "sess-9",
    subjectId: "sub-2",
    durationMinutes: 120,
    date: getRelativeDateString(1), // Saturday
    note: "Mock technical interview with a study partner.",
  },
  {
    id: "sess-10",
    subjectId: "sub-1",
    durationMinutes: 60,
    date: getRelativeDateString(0), // Sunday (Today)
    note: "Prepared for the upcoming midterm exam.",
  },
];

// Tailwind color configuration map for rendering badges, progress bars, etc.
export const COLOR_MAP: Record<string, { bg: string; text: string; border: string; bar: string; ring: string }> = {
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/50",
    bar: "bg-amber-500",
    ring: "focus:ring-amber-500",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/50",
    bar: "bg-emerald-500",
    ring: "focus:ring-emerald-500",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800/50",
    bar: "bg-violet-500",
    ring: "focus:ring-violet-500",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/20",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800/50",
    bar: "bg-sky-500",
    ring: "focus:ring-sky-500",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/50",
    bar: "bg-rose-500",
    ring: "focus:ring-rose-500",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800/50",
    bar: "bg-indigo-500",
    ring: "focus:ring-indigo-500",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800/50",
    bar: "bg-teal-500",
    ring: "focus:ring-teal-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/20",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
    border: "border-fuchsia-200 dark:border-fuchsia-800/50",
    bar: "bg-fuchsia-500",
    ring: "focus:ring-fuchsia-500",
  },
};

export const AVAILABLE_COLORS = ["amber", "emerald", "violet", "sky", "rose", "indigo", "teal", "fuchsia"];
