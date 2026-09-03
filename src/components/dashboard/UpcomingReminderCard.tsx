'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, PlayCircle, Plus, ChevronRight, BellRing } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DayOfWeek, StudySchedule } from '@/types';

export function UpcomingReminderCard() {
  const { schedules } = useApp();

  const now = new Date();
  const currentDay = now.getDay() as DayOfWeek;
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentMinutesTotal = currentHour * 60 + currentMin;

  // Filter schedules that run today
  const todaySchedules = schedules.filter(s => s.is_active && s.days_of_week.includes(currentDay));

  // Find next upcoming schedule today
  let nextSchedule: StudySchedule | null = null;
  let minDiff = Infinity;

  todaySchedules.forEach(sch => {
    const [h, m] = sch.start_time.split(':').map(Number);
    const schMinutesTotal = h * 60 + m;
    const diff = schMinutesTotal - currentMinutesTotal;

    if (diff >= 0 && diff < minDiff) {
      minDiff = diff;
      nextSchedule = sch;
    }
  });

  // If none remaining today, take the first active schedule
  const displayedSchedule = nextSchedule || schedules.find(s => s.is_active) || null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <BellRing className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Next Scheduled Study
            </span>
          </div>

          <Link
            href="/schedule"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>All Schedules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayedSchedule ? (
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {displayedSchedule.subject}
                  </h4>
                  {displayedSchedule.notes && (
                    <p className="text-xs text-slate-700 mt-1 line-clamp-1">
                      {displayedSchedule.notes}
                    </p>
                  )}
                </div>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg shrink-0">
                  {displayedSchedule.start_time}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>{displayedSchedule.duration_minutes} Minutes</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>
                    {displayedSchedule.days_of_week.length === 7
                      ? 'Every Day'
                      : displayedSchedule.days_of_week.length === 5 && !displayedSchedule.days_of_week.includes(0) && !displayedSchedule.days_of_week.includes(6)
                      ? 'Mon – Fri'
                      : `${displayedSchedule.days_of_week.length} days/wk`}
                  </span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              When this allotted time strikes, you will receive an automatic chime alert and motivational quote!
            </p>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active study slots</p>
            <p className="text-xs text-slate-700 mt-1 max-w-xs mx-auto">
              Create a scheduled study slot to receive automated motivational reminders.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Schedule</span>
            </Link>
          </div>
        )}
      </div>

      {displayedSchedule && (
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            href={`/study?subject=${encodeURIComponent(displayedSchedule.subject)}&duration=${displayedSchedule.duration_minutes}&scheduleId=${displayedSchedule.id}`}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>Launch Study Session Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}
