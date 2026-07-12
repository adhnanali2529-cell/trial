/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Subject, StudySession } from "../types";
import { COLOR_MAP } from "../data";
import { Search, Calendar, Clock, Trash2, Filter, Notebook, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SessionListProps {
  sessions: StudySession[];
  subjects: Subject[];
  onDeleteSession: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  subjects,
  onDeleteSession,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Find subject details helper
  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId);
  };

  // Filter and search logic
  const filteredSessions = sessions
    .filter((session) => {
      const subject = getSubject(session.subjectId);
      const matchesSearch =
        session.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubjectId === "" || session.subjectId === filterSubjectId;
      return matchesSearch && matchesSubject;
    })
    // Sort from most recent date down to oldest date, and then longer sessions
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.durationMinutes - a.durationMinutes;
    });

  // Pagination logic
  const totalItems = filteredSessions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
            <Notebook className="text-indigo-500" size={20} /> Study Log History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review your past study sessions and notes</p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search notes or subjects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3.5 py-1.5 w-full sm:w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              id="session-search-input"
            />
          </div>

          {/* Subject filter dropdown */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3 text-slate-400 dark:text-slate-500" size={14} />
            <select
              value={filterSubjectId}
              onChange={(e) => {
                setFilterSubjectId(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3.5 py-1.5 w-full sm:w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              id="session-subject-filter"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Grid / List */}
      <div className="space-y-3.5 min-h-[300px]">
        {paginatedSessions.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <Notebook size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No study sessions found matching your criteria.</p>
            {(searchTerm || filterSubjectId) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterSubjectId("");
                  setCurrentPage(1);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-2 cursor-pointer"
                id="clear-filters-btn"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">What was covered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginatedSessions.map((session) => {
                    const subject = getSubject(session.subjectId);
                    const colors = subject ? COLOR_MAP[subject.color] || COLOR_MAP.indigo : COLOR_MAP.indigo;

                    return (
                      <motion.tr
                        key={session.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group border-b border-slate-100/80 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          {subject ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${colors.bar}`} />
                              {subject.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                              Unknown Subject
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{session.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                            <Clock size={14} className="text-slate-400" />
                            <span>{session.durationMinutes} mins</span>
                            <span className="text-slate-400 font-normal text-[10px]">
                              ({Math.round(session.durationMinutes / 6) / 10}h)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-xs md:max-w-md">
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {session.note || <span className="text-slate-400 dark:text-slate-500 italic">No notes written.</span>}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete session record"
                            id={`delete-session-${session.id}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalItems}</span> logged sessions
          </p>

          <div className="flex gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              id="prev-page-btn"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    currentPage === p
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  id={`page-btn-${p}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              id="next-page-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
