'use client';

import React from 'react';
import { 
  Flame, 
  BarChart3, 
  Trophy, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { BadgeGallery } from '@/components/analytics/BadgeGallery';

export default function AnalyticsPage() {
  const { streakStats, sessions, profile } = useApp();

  // Calculate subject breakdown
  const subjectMap: { [subject: string]: { minutes: number; count: number } } = {};
  sessions.forEach(s => {
    if (!subjectMap[s.subject]) {
      subjectMap[s.subject] = { minutes: 0, count: 0 };
    }
    subjectMap[s.subject].minutes += s.duration_minutes;
    subjectMap[s.subject].count += 1;
  });

  const subjectList = Object.entries(subjectMap).sort((a, b) => b[1].minutes - a[1].minutes);
  const totalMinutes = streakStats.totalStudyMinutes || 1;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-amber-500" />
          <span>Streaks & Habit Analytics</span>
        </h1>
        <p className="text-sm text-slate-700 mt-1 max-w-xl">
          Track your learning consistency, study volume, subject distribution, and milestone badge achievements.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Current Streak
            </span>
            <Flame className="w-5 h-5 fill-amber-200 text-white" />
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black">{streakStats.currentStreak}</span>
            <span className="text-sm font-semibold ml-1.5 text-amber-100">Days</span>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            {streakStats.isTodayCompleted ? '✓ Secured for today' : 'Needs a study session today'}
          </p>
        </div>

        {/* Longest Streak */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              All-Time Best Streak
            </span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{streakStats.longestStreak}</span>
            <span className="text-sm font-semibold ml-1.5 text-slate-700">Days</span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Personal consistency record
          </p>
        </div>

        {/* Total Time Studied */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Total Focus Time
            </span>
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {(streakStats.totalStudyMinutes / 60).toFixed(1)}
            </span>
            <span className="text-sm font-semibold ml-1.5 text-slate-700">Hours</span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Across {streakStats.totalSessionsCount} completed sessions
          </p>
        </div>

        {/* Daily Goal Target */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daily Target Goal
            </span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {streakStats.dailyGoalMinutes}
            </span>
            <span className="text-sm font-semibold ml-1.5 text-slate-700">Min/Day</span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Today: {streakStats.todayCompletedMinutes}m studied
          </p>
        </div>

      </div>

      {/* Heatmap Grid */}
      <ActivityHeatmap />

      {/* Subject Distribution & Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Subject Learning Distribution</span>
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            Total focus hours distributed by subject and topic
          </p>
        </div>

        {subjectList.length > 0 ? (
          <div className="space-y-4">
            {subjectList.map(([subj, data]) => {
              const pct = Math.round((data.minutes / totalMinutes) * 100);
              return (
                <div key={subj} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 text-sm">{subj}</span>
                    <span className="font-semibold text-slate-700">
                      {data.minutes} mins ({pct}%) • {data.count} sessions
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-700 italic">No study sessions recorded yet.</p>
        )}
      </div>

      {/* Milestone Badges Gallery */}
      <BadgeGallery />

      {/* Full Session Log History */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Complete Study Session Log</span>
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            Historical ledger of all focus sessions and study notes
          </p>
        </div>

        {sessions.length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-hidden">
            {sessions.map(s => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{s.subject}</h4>
                    {s.rating && (
                      <span className="text-xs text-amber-500 font-bold">
                        {'★'.repeat(s.rating)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {new Date(s.completed_at).toLocaleString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {s.notes && (
                    <p className="text-xs text-slate-700 mt-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {s.notes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg">
                    {s.duration_minutes} Minutes
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-700 italic">No study sessions recorded yet.</p>
        )}
      </div>

    </div>
  );
}
