'use client';

import React, { useState } from 'react';
import { X, Clock, Calendar, BookOpen, FileText, Zap, Sparkles } from 'lucide-react';
import { DayOfWeek, StudySchedule, SubjectDifficulty } from '@/types';
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

const COMMON_SUBJECT_SUGGESTIONS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Economics',
  'Literature',
  'Psychology'
];

export function ScheduleFormModal({ isOpen, onClose, editingSchedule }: ScheduleFormModalProps) {
  const { addSchedule, updateSchedule } = useApp();

  const [subject, setSubject] = useState(editingSchedule?.subject || 'Mathematics');
  const [topic, setTopic] = useState(editingSchedule?.topic || '');
  const [difficulty, setDifficulty] = useState<SubjectDifficulty>(editingSchedule?.difficulty || 'Intermediate');
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
      setError('Please enter a subject name.');
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
          topic: topic.trim() || 'General Subject Focus',
          difficulty,
          start_time: startTime,
          duration_minutes: duration,
          days_of_week: selectedDays,
          notes: notes.trim(),
        });
      } else {
        await addSchedule({
          subject: subject.trim(),
          topic: topic.trim() || 'General Subject Focus',
          difficulty,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>{editingSchedule ? 'Edit Study & Alarm Schedule' : 'Schedule Subject & Study Alarm'}</span>
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Set your subject, content/topic, and ringing alarm time
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
          
          {/* Subject Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Subject *</span>
              </span>
              <span className="text-[10px] text-slate-700 font-normal">Choose or type custom</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Mathematics, Computer Science, Biology"
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_SUBJECT_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    subject === s
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Topic / Specific Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Specific Content / Topic to Study</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Calculus: Integrals & Chain Rule, Binary Search Trees"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-700 mt-1">
              Practicable test exercises and formula revision cards will be generated based on this content.
            </p>
          </div>

          {/* Difficulty & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Level
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as SubjectDifficulty)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Core Application)</option>
                <option value="Advanced">Advanced (Deep Mastery)</option>
              </select>
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

          {/* Allotted Start Time (Alarm Time) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Alarm Ringing Time *</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
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
              <span>Study Objectives & Notes (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Solve 5 practice questions and review formula sheet"
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
              {editingSchedule ? 'Save Changes' : 'Create Study Alarm'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
