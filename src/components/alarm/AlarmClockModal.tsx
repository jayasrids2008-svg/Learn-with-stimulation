'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BellRing, 
  Sparkles, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/lib/sound';

export function AlarmClockModal() {
  const router = useRouter();
  const { 
    activeAlarm, 
    dismissAlarm, 
    snoozeAlarm, 
    soundEnabled, 
    setSoundEnabled 
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!activeAlarm) return null;

  const { schedule, quote } = activeAlarm;
  const topic = schedule.topic || 'Core Subject Foundations';
  const difficulty = schedule.difficulty || 'Intermediate';

  const handleStartPractice = () => {
    dismissAlarm();
    router.push(`/practice?subject=${encodeURIComponent(schedule.subject)}&topic=${encodeURIComponent(topic)}&scheduleId=${schedule.id}`);
  };

  const handleStartFocusTimer = () => {
    dismissAlarm();
    router.push(`/study?subject=${encodeURIComponent(schedule.subject)}&topic=${encodeURIComponent(topic)}&duration=${schedule.duration_minutes}&scheduleId=${schedule.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Background Pulse Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-amber-500/15 animate-ping duration-1000"></div>
        <div className="w-[380px] h-[380px] rounded-full bg-orange-500/20 animate-pulse duration-700"></div>
      </div>

      {/* Main Alarm Card */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden">
        
        {/* Top Header with Ringing Bell & Digital Clock */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 animate-bounce">
              <BellRing className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30 animate-pulse">
                  ⚡ STUDY ALARM RINGING
                </span>
              </div>
              <p className="text-2xl font-extrabold font-mono text-white tracking-wider mt-0.5">
                {currentTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (soundEnabled) {
                  soundManager.stopAlarm();
                  setSoundEnabled(false);
                } else {
                  setSoundEnabled(true);
                  soundManager.startAlarm();
                }
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={soundEnabled ? "Mute alarm sound" : "Unmute alarm sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
            <button
              onClick={dismissAlarm}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Dismiss alarm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scheduled Subject & Topic Showcase */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Scheduled Subject & Content
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {schedule.subject}
              </h3>
              <p className="text-sm font-semibold text-amber-200/90 mt-0.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Topic: {topic}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {schedule.duration_minutes} min
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-700/60 text-slate-300 text-xs font-bold">
                {difficulty}
              </span>
            </div>
          </div>
          {schedule.notes && (
            <p className="text-xs text-slate-300 mt-2.5 pt-2 border-t border-slate-700/50 italic">
              &quot;{schedule.notes}&quot;
            </p>
          )}
        </div>

        {/* Motivational Stimulation Quote Box */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 relative">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin duration-3000" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Wake-Up & Focus Stimulation Quote
              </p>
              <p className="text-sm italic font-medium text-slate-100 mt-1 leading-relaxed">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="text-xs font-bold text-amber-300 mt-1.5 text-right">
                — {quote.author} ({quote.category})
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 space-y-3">
          
          {/* Practice Exercises Button (Highlighted) */}
          <button
            onClick={handleStartPractice}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.99]"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Practice Exercises on &quot;{topic}&quot;</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleStartFocusTimer}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Start Focus Timer</span>
            </button>

            <button
              onClick={() => snoozeAlarm(5)}
              className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Snooze (5 Min)</span>
            </button>

            <button
              onClick={dismissAlarm}
              className="py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 font-bold text-xs rounded-xl border border-red-900/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Dismiss Alarm</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
