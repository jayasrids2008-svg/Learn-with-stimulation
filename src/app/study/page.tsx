'use client';

import React, { Suspense } from 'react';
import { FocusTimer } from '@/components/study/FocusTimer';
import { Sparkles, Clock } from 'lucide-react';

export default function StudyPage() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Clock className="w-7 h-7 text-amber-500" />
          <span>Deep Focus Study Room</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-700">
          Eliminate distractions, build uninterrupted learning habits, and secure today&apos;s streak.
        </p>
      </div>

      <Suspense fallback={
        <div className="p-12 text-center text-slate-400 font-medium">
          Loading focus chamber...
        </div>
      }>
        <FocusTimer />
      </Suspense>
    </div>
  );
}
