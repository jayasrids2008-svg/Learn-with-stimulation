'use client';

import React, { useState } from 'react';
import { X, Clock, Calendar, BookOpen, FileText } from 'lucide-react';
import { DayOfWeek, StudySchedule } from '@/types';
import { useApp } from '@/context/AppContext';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSchedule?: StudySchedule | null;
}

const DAY_LABELS: { label: string; value: DayOfWeek }[] = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

const DURATION_PRESETS = [15, 25, 30, 45, 60, 90, 120];

export function ScheduleFormModal({ isOpen, onClose, editingSchedule }: ScheduleFormModalProps) {
  const { addSchedule, updateSchedule } = useApp();

  const [subject, setSubject] = useState(editingSchedule?.subject || '');
  const [startTime, setStartTime] = useState(editingSchedule?.start_time || '18:00');
  const [duration, setDuration] = useState(editingSchedule?.duration_minutes || 45);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    editingSchedule?.days_of_week || [1, 2, 3, 4, 5]
  );
  const [notes, setNotes] = useState(editingSchedule?.notes || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        setError('Select at least one day for your reminder schedule.');
        return;
      }
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
      setError('');
    }
  };

  const handleSelectAllWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
    setError('');
  };

  const handleSelectEveryday = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please enter a subject or topic name.');
      return;
    }
    if (selectedDays.length === 0) {
      setError('Please select at least one day of the week.');
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, {
          subject: subject.trim(),
          start_time: startTime,
          duration_minutes: duration,
          days_of_week: selectedDays,
          notes: notes.trim(),
        });
      } else {
        await addSchedule({
          subject: subject.trim(),
          start_time: startTime,
          duration_minutes: duration,
          days_of_week: selectedDays,
          is_active: true,
          notes: notes.trim(),
        });
      }
      onClose();
    } catch (err) {
      setError('Failed to save study schedule.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingSchedule ? 'Edit Study Reminder' : 'New Study Reminder'}
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Set an allotted time for your daily focus habit
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Subject / Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Subject or Topic *</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry, Full-Stack Web Dev, Spanish"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Time & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Allotted Start Time *</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Duration ({duration} min)</span>
              </label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {DURATION_PRESETS.map(preset => (
                  <option key={preset} value={preset}>
                    {preset} Minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Days of Week Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Repeat Days *</span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAllWeekdays}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  Weekdays
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={handleSelectEveryday}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  Everyday
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {DAY_LABELS.map(day => {
                const isSelected = selectedDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning Notes / Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Notes & Objectives (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Chapter 4 problems 1-10, practice active recall"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              {editingSchedule ? 'Save Changes' : 'Create Reminder'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
