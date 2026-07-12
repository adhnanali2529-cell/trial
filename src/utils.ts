/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudySession } from "./types";
import { formatDate } from "./data";

/**
 * Calculates the current consecutive days streak of study sessions.
 * A streak continues if there is at least one session on consecutive days.
 * The streak is active if there is a session today or yesterday.
 */
export function calculateStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;

  // Get unique sorted dates from newest to oldest
  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const todayStr = formatDate(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // If the newest session is older than yesterday, streak is broken (0)
  if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  const checkDate = new Date(); // Start checking from today

  // If today doesn't have a session, but yesterday does, start checking from yesterday
  if (!uniqueDates.includes(todayStr) && uniqueDates.includes(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const formattedCheck = formatDate(checkDate);
    if (uniqueDates.includes(formattedCheck)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1); // Go back 1 day
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates the total study minutes for this calendar week.
 */
export function calculateThisWeeksMinutes(sessions: StudySession[], currentWeekMondayStr: string): number {
  return sessions
    .filter((s) => s.date >= currentWeekMondayStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
}
