/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  targetHours: number; // target study hours per week
  color: string; // Tailwind color class or hex for custom subject theme
}

export interface StudySession {
  id: string;
  subjectId: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  note: string;
}
