'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Flame, PlayCircle, X, Sparkles, Quote as QuoteIcon, HelpCircle, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ReminderBanner() {
  const { activeAlarm, dismissAlarm, snoozeAlarm } = useApp();

  if (!activeAlarm) return null;

  const { schedule, quote } = activeAlarm;
  const topic = schedule.topic || 'Core Focus';

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-[460px] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl shadow-2xl p-5 relative overflow-hidden text-white">
        
        {/* Top Accent Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 animate-bounce" /> Study Alarm Ringing!
            </span>
          </div>
          <button
            onClick={dismissAlarm}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-3 space-y-3">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{schedule.subject}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {schedule.duration_minutes} min
              </span>
            </h4>
            <p className="text-xs font-semibold text-amber-300/90 mt-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Topic: {topic}</span>
            </p>
          </div>

          {/* Motivational Quote Block */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 relative">
            <QuoteIcon className="w-4 h-4 text-amber-400 absolute top-2.5 right-2.5 opacity-40" />
            <p className="text-xs italic font-medium text-slate-100 leading-relaxed pr-5">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="text-[11px] font-semibold text-amber-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>— {quote.author}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/practice?subject=${encodeURIComponent(schedule.subject)}&topic=${encodeURIComponent(topic)}&scheduleId=${schedule.id}`}
              onClick={dismissAlarm}
              className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-2.5 px-3 rounded-xl shadow transition-transform hover:scale-[1.02]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Practice Exercises</span>
            </Link>

            <Link
              href={`/study?subject=${encodeURIComponent(schedule.subject)}&topic=${encodeURIComponent(topic)}&duration=${schedule.duration_minutes}&scheduleId=${schedule.id}`}
              onClick={dismissAlarm}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-700 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Focus Timer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
