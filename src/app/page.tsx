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
  Sparkles,
  HelpCircle,
  Zap,
  BellRing,
  Award
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StreakHero } from '@/components/dashboard/StreakHero';
import { DailyQuoteCard } from '@/components/dashboard/DailyQuoteCard';
import { UpcomingReminderCard } from '@/components/dashboard/UpcomingReminderCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { DayOfWeek } from '@/types';

export default function DashboardPage() {
  const { schedules, sessions, streakStats, practiceResults, triggerTestAlarm } = useApp();

  const now = new Date();
  const currentDay = now.getDay() as DayOfWeek;

  // Schedules configured for today
  const todaySchedules = schedules.filter(s => s.days_of_week.includes(currentDay));

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Streak & Habit Engine */}
      <StreakHero />

      {/* 2. Interactive Alarm & Practice Quick Launcher Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-slate-950 shadow-xl shadow-amber-500/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider">
              NEW FEATURE
            </span>
            <span className="text-xs font-bold text-slate-950/80 uppercase tracking-wider">
              Alarm Clock & Practicable Exercises
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            Study Reminders with Ringing Alarm & Practice Tests
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-950/85 max-w-xl">
            When your scheduled study time arrives, an interactive alarm rings on screen with motivational stimulation and test exercises on your subject topic!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={triggerTestAlarm}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5"
          >
            <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Test Ringing Alarm</span>
          </button>

          <Link
            href="/practice"
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Practice Exercises</span>
          </Link>
        </div>
      </div>

      {/* 3. Next Reminder + Daily Wisdom (2-col grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <UpcomingReminderCard />
        </div>
        <div className="lg:col-span-6">
          <DailyQuoteCard />
        </div>
      </div>

      {/* 4. Recent Practice Results & Encouragement */}
      {practiceResults.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Recent Practice Test Results & Revision Guidance</span>
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Past performance analytics and tailored content mastery recaps
              </p>
            </div>
            <Link
              href="/practice"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Take Another Practice Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {practiceResults.slice(0, 3).map(res => (
              <div
                key={res.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{res.subject}</span>
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {res.topic}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-black rounded-xl ${
                      res.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {res.percentage}%
                    </span>
                  </div>

                  <p className="text-xs italic text-slate-700 mt-2 line-clamp-2">
                    &ldquo;{res.encouragingQuote.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {res.score}/{res.totalQuestions} Questions Correct
                  </span>
                  <Link
                    href={`/practice?subject=${encodeURIComponent(res.subject)}&topic=${encodeURIComponent(res.topic)}`}
                    className="font-bold text-amber-700 hover:underline"
                  >
                    Retake →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Learning Consistency Heatmap */}
      <ActivityHeatmap />

      {/* 6. Today's Scheduled Focus Blocks & Alarms */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Today&apos;s Focus Schedules & Alarms</span>
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
            <span>Manage Study Alarms</span>
          </Link>
        </div>

        {todaySchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {todaySchedules.map(sch => {
              const topicName = sch.topic || 'Core Subject Focus';
              return (
                <div
                  key={sch.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{sch.subject}</span>
                        <p className="text-xs font-semibold text-amber-700 mt-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Topic: {topicName}</span>
                        </p>
                      </div>
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
                        <span className="text-emerald-800 font-medium">● Alarm Active</span>
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

                  <div className="pt-4 mt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                    <Link
                      href={`/practice?subject=${encodeURIComponent(sch.subject)}&topic=${encodeURIComponent(topicName)}&scheduleId=${sch.id}`}
                      className="flex items-center justify-center gap-1 py-2 px-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Practice</span>
                    </Link>

                    <Link
                      href={`/study?subject=${encodeURIComponent(sch.subject)}&topic=${encodeURIComponent(topicName)}&duration=${sch.duration_minutes}&scheduleId=${sch.id}`}
                      className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Start Focus</span>
                    </Link>
                  </div>
                </div>
              );
            })}
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

      {/* 7. Recent Study History */}
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
