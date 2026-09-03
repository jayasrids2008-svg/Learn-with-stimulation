'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Flame, PlayCircle, X, Sparkles, Quote as QuoteIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ReminderBanner() {
  const { activeAlert, dismissAlert } = useApp();

  if (!activeAlert) return null;

  const { schedule, quote } = activeAlert;

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-[460px] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white border-2 border-amber-500 rounded-2xl shadow-2xl p-5 relative overflow-hidden">
        
        {/* Top Accent Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" /> Allotted Study Time!
            </span>
          </div>
          <button
            onClick={dismissAlert}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-3 space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>{schedule.subject}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                {schedule.duration_minutes} min
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled for today • Time to secure today&apos;s streak!
            </p>
          </div>

          {/* Motivational Quote Block */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 relative">
            <QuoteIcon className="w-4 h-4 text-amber-500 absolute top-2.5 right-2.5 opacity-40" />
            <p className="text-xs italic font-medium text-slate-800 leading-relaxed pr-5">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="text-[11px] font-semibold text-amber-900 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>— {quote.author}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/study?subject=${encodeURIComponent(schedule.subject)}&duration=${schedule.duration_minutes}&scheduleId=${schedule.id}`}
              onClick={dismissAlert}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Focus Session Now</span>
            </Link>

            <button
              onClick={dismissAlert}
              className="px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
