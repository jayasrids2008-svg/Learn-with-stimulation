'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StreakHero } from '@/components/dashboard/StreakHero';
import { DailyQuoteCard } from '@/components/dashboard/DailyQuoteCard';
import { UpcomingReminderCard } from '@/components/dashboard/UpcomingReminderCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { DayOfWeek } from '@/types';

export default function DashboardPage() {
  const { schedules, sessions, streakStats } = useApp();

  const now = new Date();
  const currentDay = now.getDay() as DayOfWeek;

  // Schedules configured for today
  const todaySchedules = schedules.filter(s => s.days_of_week.includes(currentDay));

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Streak & Habit Engine */}
      <StreakHero />

      {/* 2. Next Reminder + Daily Wisdom (2-col grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <UpcomingReminderCard />
        </div>
        <div className="lg:col-span-6">
          <DailyQuoteCard />
        </div>
      </div>

      {/* 3. Learning Consistency Heatmap */}
      <ActivityHeatmap />

      {/* 4. Today's Scheduled Focus Blocks */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Today&apos;s Focus Schedule</span>
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Study slots set for {now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Study Slot</span>
          </Link>
        </div>

        {todaySchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {todaySchedules.map(sch => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">{sch.subject}</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-md">
                      {sch.start_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{sch.duration_minutes}m</span>
                    </span>
                    {sch.is_active ? (
                      <span className="text-emerald-800 font-medium">● Reminder Active</span>
                    ) : (
                      <span className="text-slate-600">Paused</span>
                    )}
                  </div>

                  {sch.notes && (
                    <p className="text-xs text-slate-700 mt-2 line-clamp-2">
                      {sch.notes}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-200/60">
                  <Link
                    href={`/study?subject=${encodeURIComponent(sch.subject)}&duration=${sch.duration_minutes}&scheduleId=${sch.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Start Session</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No study blocks scheduled for today</p>
            <p className="text-xs text-slate-700 mt-1 max-w-sm mx-auto">
              You can start a focus session at any time or add a recurring reminder slot for today.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Link
                href="/study"
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
              >
                Launch Custom Timer
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 5. Recent Study History */}
      {sessions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Recent Study Sessions</span>
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                History of completed learning sessions credited toward your streaks
              </p>
            </div>

            <Link
              href="/analytics"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {sessions.slice(0, 5).map(sess => (
              <div key={sess.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{sess.subject}</h4>
                    <p className="text-xs text-slate-700">
                      {new Date(sess.completed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {sess.notes ? ` • ${sess.notes}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-lg">
                    {sess.duration_minutes} mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
