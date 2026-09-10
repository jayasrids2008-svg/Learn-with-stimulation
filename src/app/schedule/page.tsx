'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Bell, 
  BellRing, 
  Edit3, 
  Trash2, 
  PlayCircle, 
  Check, 
  AlertCircle, 
  Sparkles,
  Volume2,
  HelpCircle,
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ScheduleFormModal } from '@/components/schedule/ScheduleFormModal';
import { StudySchedule, DayOfWeek } from '@/types';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
  const { 
    schedules, 
    deleteSchedule, 
    toggleScheduleActive, 
    triggerTestAlarm, 
    notificationPermission, 
    requestPermission 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<StudySchedule | null>(null);

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (schedule: StudySchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, subject: string) => {
    if (confirm(`Are you sure you want to delete the schedule for "${subject}"?`)) {
      await deleteSchedule(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-amber-500" />
            <span>Subject Schedules & Study Alarms</span>
          </h1>
          <p className="text-sm text-slate-700 mt-1 max-w-xl">
            Schedule your subjects and specific study topics. When the time arrives, an interactive alarm clock will ring on screen with motivational stimulation and instant practice exercises.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors border border-amber-300"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Practice Exercises</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Subject Alarm</span>
          </button>
        </div>
      </div>

      {/* Notification Permissions & Audio Diagnostic Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl shrink-0 mt-0.5 sm:mt-0 shadow-sm">
            <BellRing className="w-5 h-5 text-amber-600 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Study Alarm Clock & Motivational Quotes Engine</span>
              {notificationPermission === 'granted' ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Active
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  Permission Recommended
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-700 mt-0.5">
              Alarms will ring aloud at the exact scheduled time with quotes, followed by direct practice exercise options.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestPermission}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Enable Notifications
            </button>
          )}

          <button
            onClick={triggerTestAlarm}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            title="Fire a test ringing study alarm clock with quote"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Ringing Alarm Clock</span>
          </button>
        </div>
      </div>

      {/* Schedules List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Scheduled Study Slots & Alarms ({schedules.length})
          </h2>
          <span className="text-xs text-slate-700 font-medium">
            {schedules.filter(s => s.is_active).length} Alarms Active
          </span>
        </div>

        {schedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schedules.map(sch => {
              const topicName = sch.topic || 'Core Subject Focus';
              return (
                <div
                  key={sch.id}
                  className={`bg-white border rounded-3xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                    sch.is_active ? 'border-slate-200 hover:shadow-md' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div>
                    {/* Top Bar: Subject + Status toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {sch.difficulty || 'Intermediate'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mt-1">{sch.subject}</h3>
                        <p className="text-xs font-semibold text-amber-700 mt-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Topic: {topicName}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleScheduleActive(sch.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          sch.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                        title="Click to toggle alarm"
                      >
                        {sch.is_active ? 'Alarm ON' : 'Paused'}
                      </button>
                    </div>

                    {sch.notes && (
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                        &quot;{sch.notes}&quot;
                      </p>
                    )}

                    {/* Time & Duration */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{sch.start_time}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md">
                        {sch.duration_minutes} Minutes
                      </span>
                    </div>

                    {/* Day Pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {[0, 1, 2, 3, 4, 5, 6].map(day => {
                        const isIncluded = sch.days_of_week.includes(day as DayOfWeek);
                        return (
                          <span
                            key={day}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isIncluded
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {DAY_SHORT[day]}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-2 pt-4 mt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/practice?subject=${encodeURIComponent(sch.subject)}&topic=${encodeURIComponent(topicName)}&scheduleId=${sch.id}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold rounded-xl border border-amber-200 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Practice Test</span>
                      </Link>

                      <Link
                        href={`/study?subject=${encodeURIComponent(sch.subject)}&topic=${encodeURIComponent(topicName)}&duration=${sch.duration_minutes}&scheduleId=${sch.id}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Focus Timer</span>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleOpenEdit(sch)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 p-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sch.id, sch.subject)}
                        className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No study alarms configured</h3>
            <p className="text-xs text-slate-700 mt-1 max-w-sm mx-auto">
              Schedule your subject and study content to begin receiving motivational ringing alarms and practice sets.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Schedule</span>
            </button>
          </div>
        )}
      </div>

      {/* Schedule Create / Edit Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingSchedule={editingSchedule}
      />

    </div>
  );
}
