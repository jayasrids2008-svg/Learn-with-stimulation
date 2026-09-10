'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  Star, 
  BookOpen, 
  Quote as QuoteIcon, 
  ArrowLeft,
  Maximize2,
  Minimize2,
  Award,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MotivationalQuote, UserBadge } from '@/types';
import { soundManager } from '@/lib/sound';

export function FocusTimer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { 
    schedules, 
    quotes, 
    getRandomQuote, 
    recordStudySession, 
    soundEnabled, 
    setSoundEnabled,
    streakStats
  } = useApp();

  // Initial params
  const initialSubject = searchParams.get('subject') || 'Mathematics';
  const initialTopic = searchParams.get('topic') || 'Calculus & Derivatives';
  const initialDuration = Number(searchParams.get('duration')) || 25;
  const initialScheduleId = searchParams.get('scheduleId') || null;

  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [targetMinutes, setTargetMinutes] = useState(initialDuration);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'custom' | 'stopwatch'>('pomodoro');
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Motivational quote that rotates
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(() => getRandomQuote('Focus'));

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(initialDuration);
  const [sessionNotes, setSessionNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyAwardedBadges, setNewlyAwardedBadges] = useState<UserBadge[]>([]);
  const [streakUpdated, setStreakUpdated] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync target duration when selection changes
  const handleDurationChange = (mins: number) => {
    setIsActive(false);
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setStopwatchSeconds(prev => prev + 1);
        } else {
          setSecondsRemaining(prev => {
            if (prev <= 1) {
              // Timer finished!
              clearInterval(interval!);
              setIsActive(false);
              handleTimerFinish();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode]);

  // Periodic quote rotation during active study (every 5 minutes)
  useEffect(() => {
    if (!isActive) return;
    const quoteInterval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 300000);
    return () => clearInterval(quoteInterval);
  }, [isActive, getRandomQuote]);

  const handleTimerFinish = () => {
    if (soundEnabled) {
      soundManager.playCompletionChime();
    }
    setCompletedMinutes(targetMinutes);
    setShowCompletionModal(true);
    triggerCelebration();
  };

  const handleManualComplete = () => {
    setIsActive(false);
    const mins = mode === 'stopwatch'
      ? Math.max(1, Math.round(stopwatchSeconds / 60))
      : Math.max(1, Math.round((targetMinutes * 60 - secondsRemaining) / 60));
    setCompletedMinutes(mins);
    setShowCompletionModal(true);
    triggerCelebration();
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setSecondsRemaining(targetMinutes * 60);
    }
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await recordStudySession({
        subject: subject.trim() || 'Focus Session',
        topic: topic.trim() || undefined,
        duration_minutes: completedMinutes,
        notes: sessionNotes.trim(),
        rating,
        schedule_id: initialScheduleId,
      });

      setNewlyAwardedBadges(result.newBadges);
      setStreakUpdated(result.streakIncremented);

      // Brief delay then return to dashboard or stay on study
      setTimeout(() => {
        setShowCompletionModal(false);
        setIsSubmitting(false);
        handleReset();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const displayTime = mode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(secondsRemaining);
  const totalTargetSecs = targetMinutes * 60;
  const progressPercent = mode === 'stopwatch' ? 100 : Math.min(100, Math.round(((totalTargetSecs - secondsRemaining) / totalTargetSecs) * 100));

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-center max-w-none' : ''}`}>
      
      {/* Top Bar / Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={soundEnabled ? "Audio chimes on" : "Audio muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle fullscreen distraction-free mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Chamber */}
      <div className={`rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden transition-colors ${
        isFullscreen ? 'bg-slate-900 border border-slate-800 text-white shadow-2xl' : 'bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-white border border-slate-800 shadow-xl'
      }`}>
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector */}
        <div className="inline-flex items-center gap-1 bg-slate-800/80 backdrop-blur-md p-1 rounded-2xl border border-slate-700/60 mb-6 relative z-10">
          <button
            onClick={() => { setMode('pomodoro'); handleDurationChange(25); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'pomodoro' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => { setMode('custom'); handleDurationChange(45); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'custom' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Custom Duration
          </button>
          <button
            onClick={() => { setMode('stopwatch'); setIsActive(false); setStopwatchSeconds(0); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'stopwatch' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Open Stopwatch
          </button>
        </div>

        {/* Subject & Topic Selector / Input */}
        <div className="max-w-lg mx-auto mb-6 space-y-2 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-2xl px-3.5 py-2">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Subject..."
                className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-2xl px-3.5 py-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Topic / Chapter..."
                className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push(`/practice?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-xl transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Take Practicable Exercises on &quot;{topic || subject}&quot;</span>
            </button>
          </div>
        </div>

        {/* Custom Duration Presets (if mode === 'custom') */}
        {mode === 'custom' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 relative z-10">
            {[15, 30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  targetMinutes === mins
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Timer Display Display Dial */}
        <div className="relative z-10 my-4 flex flex-col items-center justify-center">
          <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-white select-none drop-shadow-md">
            {displayTime}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-400">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>
              {isActive
                ? 'Deep focus session in progress...'
                : 'Press Start when ready to enter flow state'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-2xl font-extrabold text-base flex items-center gap-2.5 shadow-2xl transition-all transform active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current ml-0.5" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleManualComplete}
            className="p-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
            title="Mark session completed"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Motivational Quote Display */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 max-w-xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-widest mb-1.5">
            <QuoteIcon className="w-3.5 h-3.5" />
            <span>Focus Inspiration</span>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-slate-300">
            &ldquo;{currentQuote.quote}&rdquo;
          </p>
          <p className="text-[11px] font-semibold text-slate-400 mt-1">
            — {currentQuote.author}
          </p>
        </div>

      </div>

      {/* Session Completion & Streak Credit Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/30">
                <Flame className="w-8 h-8 fill-slate-950" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Outstanding Focus Session!
              </h3>
              <p className="text-xs text-slate-500">
                You dedicated <span className="font-bold text-slate-800">{completedMinutes} minutes</span> to {subject}.
              </p>
            </div>

            {/* Streak & Badge Alerts */}
            {newlyAwardedBadges.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">New Achievement Unlocked!</span>
                  <span>You earned the {newlyAwardedBadges.map(b => b.badge_type).join(', ')} badge!</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSession} className="mt-5 space-y-4">
              
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  Session Focus Quality
                </label>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Takeaways or Notes
                </label>
                <textarea
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mastered recursion base conditions, wrote 3 practice questions"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all"
                >
                  {isSubmitting ? 'Recording Session...' : 'Log & Secure Streak'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
