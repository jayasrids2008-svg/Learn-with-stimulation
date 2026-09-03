'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { getLocalDateString } from '@/lib/streak-engine';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react';

export function ActivityHeatmap() {
  const { sessions, streakStats } = useApp();

  // Aggregate sessions by date (YYYY-MM-DD)
  const activityMap: { [date: string]: { minutes: number; count: number } } = {};
  sessions.forEach(s => {
    const d = getLocalDateString(new Date(s.completed_at));
    if (!activityMap[d]) {
      activityMap[d] = { minutes: 0, count: 0 };
    }
    activityMap[d].minutes += s.duration_minutes;
    activityMap[d].count += 1;
  });

  // Generate past 84 days (12 weeks of 7 days)
  const today = new Date();
  const days: { date: string; dayOfWeek: number; minutes: number; count: number; level: number }[] = [];

  // Find the ending day (nearest upcoming Saturday or today)
  const endDate = new Date(today);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (12 * 7 - 1));

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateString(new Date(d));
    const data = activityMap[dateStr] || { minutes: 0, count: 0 };
    
    // Level calculation
    let level = 0;
    if (data.minutes > 0) {
      if (data.minutes < 30) level = 1;
      else if (data.minutes < 60) level = 2;
      else if (data.minutes < 90) level = 3;
      else level = 4;
    }

    days.push({
      date: dateStr,
      dayOfWeek: d.getDay(),
      minutes: data.minutes,
      count: data.count,
      level,
    });
  }

  // Color mappings for levels
  const levelColors = [
    'bg-slate-100 border-slate-200/60', // Level 0: 0 min
    'bg-amber-200 border-amber-300',    // Level 1: 1-29 min
    'bg-amber-400 border-amber-500',    // Level 2: 30-59 min
    'bg-orange-500 border-orange-600',  // Level 3: 60-89 min
    'bg-amber-600 border-amber-700',    // Level 4: 90+ min
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Learning Consistency Heatmap</span>
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            Your habit tracking grid across the past 12 weeks
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
          <span>Less</span>
          {levelColors.map((colorClass, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-sm border ${colorClass}`}
              title={`Level ${idx}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {days.map((day, idx) => {
              const formattedDate = new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer relative group ${levelColors[day.level]}`}
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 whitespace-nowrap bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl">
                    <p className="font-bold">{formattedDate}</p>
                    <p className="text-slate-300">
                      {day.minutes > 0
                        ? `${day.minutes} mins studied (${day.count} sessions)`
                        : 'No study recorded'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-3 px-1">
            <span>12 weeks ago</span>
            <span>6 weeks ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
