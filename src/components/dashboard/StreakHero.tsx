'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Target, Trophy, Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function StreakHero() {
  const { streakStats, profile } = useApp();

  const progressPercent = Math.min(
    100,
    Math.round((streakStats.todayCompletedMinutes / streakStats.dailyGoalMinutes) * 100)
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
      
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left / Main Streak Flame & Motivation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Habit Consistency Engine</span>
            </span>

            {streakStats.isTodayCompleted ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Today Secured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <AlertCircle className="w-3.5 h-3.5" /> Action Required Today
              </span>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <div className="flex items-center gap-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                <Flame className={`w-10 h-10 sm:w-12 sm:h-12 ${streakStats.currentStreak > 0 ? 'fill-amber-400 text-amber-500 animate-pulse' : 'text-slate-600'}`} />
                <span>{streakStats.currentStreak}</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-slate-300">
                {streakStats.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
              </span>
            </div>

            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              {streakStats.isTodayCompleted
                ? `Fantastic job, ${profile.full_name.split(' ')[0]}! You have already studied today and kept your momentum blazing!`
                : streakStats.currentStreak > 0
                ? `Your ${streakStats.currentStreak}-day streak is active! Study for ${Math.max(0, streakStats.dailyGoalMinutes - streakStats.todayCompletedMinutes)} more minutes today to keep the fire burning!`
                : `Start your consistency journey today. Complete your first focus session to ignite your 1-day streak!`}
            </p>
          </div>

          {/* Quick CTA to start studying */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/study"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <span>Launch Focus Session</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <span>Manage Schedules</span>
            </Link>
          </div>
        </div>

        {/* Right / Progress & Quick Stats (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 space-y-4">
          
          {/* Daily Goal Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Daily Goal</span>
              </span>
              <span className="text-amber-300">
                {streakStats.todayCompletedMinutes} / {streakStats.dailyGoalMinutes} min ({progressPercent}%)
              </span>
            </div>
            
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{streakStats.longestStreak}d</div>
              <div className="text-[10px] text-slate-400 font-medium">Best Streak</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {(streakStats.totalStudyMinutes / 60).toFixed(1)}h
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Total Hours</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{streakStats.totalSessionsCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Sessions</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
