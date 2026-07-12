/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Subject, StudySession } from "../types";
import { COLOR_MAP } from "../data";
import { BookOpen, Target, Clock, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface SubjectProgressCardProps {
  subjects: Subject[];
  sessions: StudySession[];
  currentWeekMondayStr: string;
}

export const SubjectProgressCard: React.FC<SubjectProgressCardProps> = ({
  subjects,
  sessions,
  currentWeekMondayStr,
}) => {
  // Calculate study hours per subject for this week
  const getWeeklyHoursForSubject = (subjectId: string): number => {
    const minutes = sessions
      .filter((s) => s.subjectId === subjectId && s.date >= currentWeekMondayStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return Math.round((minutes / 60) * 10) / 10; // 1 decimal place
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sage-50 dark:bg-sage-950/30 text-sage-600 dark:text-sage-400 rounded-xl">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Subject Progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450">Track study hours against weekly targets</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <BookOpen size={32} className="mx-auto mb-2 opacity-55 text-sage-400" />
            <p className="text-sm">No subjects added yet. Add your first subject to start tracking!</p>
          </div>
        ) : (
          subjects.map((subject) => {
            const weeklyHours = getWeeklyHoursForSubject(subject.id);
            const progressPercent = Math.min(
              100,
              Math.round((weeklyHours / subject.targetHours) * 100)
            );
            const colors = COLOR_MAP[subject.color] || COLOR_MAP.sage;

            return (
              <div key={subject.id} className="group relative">
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.bar}`} />
                    <span className="font-semibold text-slate-700 dark:text-slate-350">
                      {subject.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {weeklyHours}h
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{subject.targetHours}h target</span>
                  </div>
                </div>

                <div className="w-full bg-sage-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {progressPercent}% Complete
                  </span>
                  {progressPercent >= 100 && (
                    <span className="text-[10px] text-sage-600 dark:text-sage-400 font-semibold flex items-center gap-0.5 animate-pulse">
                      <Trophy size={10} /> Target Reached!
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
