/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Subject, StudySession } from "./types";
import {
  DEFAULT_SUBJECTS,
  getSampleSessions,
  formatDate,
  getStartOfWeekDate,
} from "./data";
import { calculateStreak } from "./utils";
import { SubjectProgressCard } from "./components/SubjectProgressCard";
import { AddSubjectForm } from "./components/AddSubjectForm";
import { LogSessionForm } from "./components/LogSessionForm";
import { SessionList } from "./components/SessionList";
import {
  Flame,
  Clock,
  Calendar,
  BookOpen,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  Award,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Modals / Panels toggles
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);

  // Today's date references
  const todayStr = formatDate(new Date());
  const currentWeekMondayStr = getStartOfWeekDate(todayStr);

  // Local storage loading
  useEffect(() => {
    const savedSubjects = localStorage.getItem("study_tracker_subjects");
    const savedSessions = localStorage.getItem("study_tracker_sessions");

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(DEFAULT_SUBJECTS);
      localStorage.setItem("study_tracker_subjects", JSON.stringify(DEFAULT_SUBJECTS));
    }

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      const initialSessions = getSampleSessions();
      setSessions(initialSessions);
      localStorage.setItem("study_tracker_sessions", JSON.stringify(initialSessions));
    }
  }, []);

  // Update storage helpers
  const saveSubjectsToStorage = (updatedSubjects: Subject[]) => {
    setSubjects(updatedSubjects);
    localStorage.setItem("study_tracker_subjects", JSON.stringify(updatedSubjects));
  };

  const saveSessionsToStorage = (updatedSessions: StudySession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem("study_tracker_sessions", JSON.stringify(updatedSessions));
  };

  // Handlers
  const handleAddSubject = (newSub: Omit<Subject, "id">) => {
    const subjectWithId: Subject = {
      ...newSub,
      id: `sub-${Date.now()}`,
    };
    const updated = [...subjects, subjectWithId];
    saveSubjectsToStorage(updated);
  };

  const handleLogSession = (newSess: Omit<StudySession, "id">) => {
    const sessionWithId: StudySession = {
      ...newSess,
      id: `sess-${Date.now()}`,
    };
    const updated = [sessionWithId, ...sessions];
    saveSessionsToStorage(updated);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessionsToStorage(updated);
  };

  const handleResetToSampleData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data back to the default 5 subjects and 10 sample sessions?"
      )
    ) {
      setSubjects(DEFAULT_SUBJECTS);
      const initialSessions = getSampleSessions();
      setSessions(initialSessions);
      localStorage.setItem("study_tracker_subjects", JSON.stringify(DEFAULT_SUBJECTS));
      localStorage.setItem("study_tracker_sessions", JSON.stringify(initialSessions));
    }
  };

  // Calculations
  const totalMinutesThisWeek = sessions
    .filter((s) => s.date >= currentWeekMondayStr)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const totalHoursThisWeek = Math.round((totalMinutesThisWeek / 60) * 10) / 10;

  const weeklyTargetSum = subjects.reduce((sum, s) => sum + s.targetHours, 0);

  const overallProgressPercent = weeklyTargetSum
    ? Math.min(100, Math.round((totalHoursThisWeek / weeklyTargetSum) * 100))
    : 0;

  const activeStreak = calculateStreak(sessions);

  // Motivational messages
  const getMotivationalMessage = () => {
    if (activeStreak >= 7) return "Incredible! You have a perfect weekly streak! Keep this fire burning! 🔥";
    if (activeStreak >= 5) return "Spectacular study routine! You're dominating this week. 🌟";
    if (activeStreak >= 3) return "Solid habits forming! Three days and counting. Keep pushing! ⚡";
    if (activeStreak > 0) return "Great job! A streak has started. Make it count tomorrow! 📚";
    return "Ready to lock in? Log your first study session of the day to start a streak! 🚀";
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 pb-12">
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs flex items-center justify-center">
              <Award size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Academic Study Tracker
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">
                University Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              title="Reset all stats to standard student sample data"
              id="reset-sample-data-btn"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Reset Sample Data</span>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Adhnan Ali
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Dubai Campus
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner with Greeting & Streak Announcement */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles size={160} />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-indigo-200 border border-white/5">
              <Calendar size={13} />
              <span>Week of {currentWeekMondayStr} — Today: {todayStr}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Keep building momentum, Adhnan!
            </h2>
            <p className="text-indigo-200/90 text-sm leading-relaxed max-w-2xl">
              {getMotivationalMessage()}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => {
                  setShowLogSession(true);
                  setShowAddSubject(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-semibold text-sm transition-all shadow-md hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                id="header-log-session-btn"
              >
                <PlusCircle size={16} className="text-indigo-600" />
                Log Study Session
              </button>

              <button
                onClick={() => {
                  setShowAddSubject(true);
                  setShowLogSession(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600/55 hover:bg-indigo-600/80 text-white font-semibold text-sm transition-all border border-indigo-400/20 cursor-pointer flex items-center gap-2"
                id="header-add-subject-btn"
              >
                <BookOpen size={16} />
                Add Subject
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid (Analytics cards at top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Study Hours */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Hours Studied
              </span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Clock size={18} />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {totalHoursThisWeek}h
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-sm">this week</span>
              </div>

              {/* Progress bar versus the dynamic target sum of all subjects */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Weekly Goal ({weeklyTargetSum}h)</span>
                  <span className="font-semibold">{overallProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span>Aiming for {weeklyTargetSum} total hours across {subjects.length} subjects</span>
            </div>
          </div>

          {/* Card 2: Current Streak */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Current Streak
              </span>
              <div className="p-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-lg">
                <Flame size={18} className={activeStreak > 0 ? "animate-bounce" : ""} />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {activeStreak} {activeStreak === 1 ? "Day" : "Days"}
                </span>
                {activeStreak > 0 && (
                  <span className="text-orange-500 dark:text-orange-400 text-sm font-semibold flex items-center gap-0.5">
                    Streak Active!
                  </span>
                )}
              </div>

              {/* Day dots tracker for the past 7 days */}
              <div className="flex justify-between mt-4">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const checkDate = new Date();
                  checkDate.setDate(checkDate.getDate() - (6 - idx));
                  const formattedCheck = formatDate(checkDate);
                  const hasSession = sessions.some((s) => s.date === formattedCheck);
                  const dayLetter = checkDate.toLocaleDateString("en-US", { weekday: "narrow" });

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {dayLetter}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                          hasSession
                            ? "bg-orange-500 text-white shadow-xs scale-105"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-450"
                        }`}
                        title={formattedCheck}
                      >
                        {hasSession ? "✓" : "·"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Trophy size={12} className="text-amber-500 shrink-0" />
              <span>Consecutive days with logged sessions. Keep it up!</span>
            </div>
          </div>

          {/* Card 3: Quick Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Logs
              </span>
              <div className="p-2 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-lg">
                <BookOpen size={18} />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {sessions.length}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-sm">sessions</span>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl p-2 border border-slate-100 dark:border-slate-850">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Average Duration</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {sessions.length
                      ? Math.round(
                          sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / sessions.length
                        )
                      : 0}
                    m
                  </p>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl p-2 border border-slate-100 dark:border-slate-850">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Subject Count</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {subjects.length} Active
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sparkles size={12} className="text-indigo-500" />
              <span>Refining discipline one logged session at a time</span>
            </div>
          </div>
        </div>

        {/* Modal-style Forms sliding/fading in if triggered */}
        <AnimatePresence mode="wait">
          {showAddSubject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <AddSubjectForm
                onAddSubject={handleAddSubject}
                onClose={() => setShowAddSubject(false)}
              />
            </motion.div>
          )}

          {showLogSession && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <LogSessionForm
                subjects={subjects}
                onLogSession={handleLogSession}
                onClose={() => setShowLogSession(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two Column Layout below top stats: Left has subject target progress, Right has recent logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <SubjectProgressCard
              subjects={subjects}
              sessions={sessions}
              currentWeekMondayStr={currentWeekMondayStr}
            />
          </div>

          <div className="lg:col-span-8">
            <SessionList
              sessions={sessions}
              subjects={subjects}
              onDeleteSession={handleDeleteSession}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
