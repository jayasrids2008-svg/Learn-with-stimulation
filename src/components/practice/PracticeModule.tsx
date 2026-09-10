'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Flame, 
  Zap, 
  Award, 
  ChevronRight, 
  Lightbulb, 
  FileText,
  BookmarkCheck,
  Check,
  PlayCircle
} from 'lucide-react';
import { 
  PracticeQuestion, 
  PracticeExerciseSet, 
  UserAnswerRecord, 
  PracticeResult, 
  SubjectDifficulty 
} from '@/types';
import { generateExerciseSetForSubject, CURATED_PRACTICE_SETS } from '@/lib/exercises-data';
import { generatePracticeResultAnalysis } from '@/lib/revision-engine';
import { useApp } from '@/context/AppContext';
import { soundManager } from '@/lib/sound';

interface PracticeModuleProps {
  initialSubject?: string;
  initialTopic?: string;
  scheduleId?: string | null;
}

export function PracticeModule({ initialSubject, initialTopic, scheduleId }: PracticeModuleProps) {
  const router = useRouter();
  const { soundEnabled, savePracticeResult } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'Calculus & Derivatives');
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const [exerciseSet, setExerciseSet] = useState<PracticeExerciseSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Test State: 'ready' | 'testing' | 'completed'
  const [testState, setTestState] = useState<'ready' | 'testing' | 'completed'>('ready');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [practiceResult, setPracticeResult] = useState<PracticeResult | null>(null);

  // Load exercise set whenever subject / topic changes
  useEffect(() => {
    const set = generateExerciseSetForSubject(selectedSubject, selectedTopic);
    setExerciseSet(set);
  }, [selectedSubject, selectedTopic]);

  // Timer during testing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testState === 'testing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testState]);

  const handleStartTest = () => {
    let effectiveSub = selectedSubject;
    let effectiveTop = selectedTopic;

    if (isCustomMode) {
      if (customSubjectInput.trim()) effectiveSub = customSubjectInput.trim();
      if (customTopicInput.trim()) effectiveTop = customTopicInput.trim();
      setSelectedSubject(effectiveSub);
      setSelectedTopic(effectiveTop);
    }

    const set = generateExerciseSetForSubject(effectiveSub, effectiveTop);
    setExerciseSet(set);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setUserAnswers({});
    setShowHint(false);
    setTimeElapsed(0);
    setTestState('testing');
    setPracticeResult(null);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: index
    }));

    if (soundEnabled) {
      soundManager.playTick();
    }
  };

  const handleNextQuestion = () => {
    if (!exerciseSet) return;
    setShowHint(false);
    if (currentQuestionIndex < exerciseSet.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setSelectedOptionIndex(userAnswers[nextIdx] !== undefined ? userAnswers[nextIdx] : null);
    } else {
      handleFinishTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setSelectedOptionIndex(userAnswers[prevIdx] !== undefined ? userAnswers[prevIdx] : null);
      setShowHint(false);
    }
  };

  const handleFinishTest = async () => {
    if (!exerciseSet) return;

    const answerRecords: UserAnswerRecord[] = exerciseSet.questions.map((q, idx) => {
      const selected = userAnswers[idx] !== undefined ? userAnswers[idx] : -1;
      const isCorrect = selected === q.correctIndex;
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOptionIndex: selected,
        correctOptionIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        conceptTag: q.conceptTag
      };
    });

    const analysis = generatePracticeResultAnalysis({
      subject: exerciseSet.subject,
      topic: exerciseSet.topic,
      answers: answerRecords,
      timeSpentSeconds: timeElapsed,
      scheduleId: scheduleId || null
    });

    setPracticeResult(analysis);
    setTestState('completed');
    await savePracticeResult(analysis);

    if (analysis.percentage >= 70) {
      if (soundEnabled) soundManager.playCompletionChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      if (soundEnabled) soundManager.playReminderChime();
    }
  };

  const currentQ: PracticeQuestion | undefined = exerciseSet?.questions[currentQuestionIndex];
  const progressPercent = exerciseSet ? Math.round(((currentQuestionIndex + 1) / exerciseSet.questions.length) * 100) : 0;

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* State 1: READY / TOPIC SELECTOR */}
      {testState === 'ready' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Practicable Exercise Hub
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Content Mastery & Practice Exercises
              </h1>
              <p className="text-sm text-slate-700 mt-1">
                Select your subject and topic to test your knowledge, master formulas, and receive personalized guidance.
              </p>
            </div>

            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors self-start md:self-auto"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{isCustomMode ? 'Use Curated Subjects' : 'Custom Subject / Topic'}</span>
            </button>
          </div>

          {!isCustomMode ? (
            <div className="mt-6 space-y-6">
              {/* Subject Badges */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Choose Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CURATED_PRACTICE_SETS).map(subj => (
                    <button
                      key={subj}
                      onClick={() => {
                        setSelectedSubject(subj);
                        setSelectedTopic(CURATED_PRACTICE_SETS[subj][0]?.topic || '');
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        selectedSubject === subj
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selector for chosen subject */}
              {CURATED_PRACTICE_SETS[selectedSubject] && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Choose Chapter / Content Topic
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CURATED_PRACTICE_SETS[selectedSubject].map(set => (
                      <button
                        key={set.id}
                        onClick={() => setSelectedTopic(set.topic)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          selectedTopic === set.topic
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{set.topic}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {set.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                          {set.summaryNotes}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-slate-700">
                          <span>{set.questions.length} Questions</span>
                          <span>•</span>
                          <span>Instant Feedback & Explanations</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={customSubjectInput}
                    onChange={e => setCustomSubjectInput(e.target.value)}
                    placeholder="e.g. Economics, World History, Psychology"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Specific Content / Topic *
                  </label>
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={e => setCustomTopicInput(e.target.value)}
                    placeholder="e.g. Supply & Demand Elasticity, Cognitive Biases"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-700 italic">
                Our dynamic question engine will automatically generate tailored conceptual questions, hints, and revision guides for any custom topic entered.
              </p>
            </div>
          )}

          {/* Launch Test Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Target: {selectedSubject} — {selectedTopic}</span>
            </div>
            <button
              onClick={handleStartTest}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm rounded-2xl shadow-md shadow-amber-500/20 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span>Start Practice Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* State 2: TESTING / ACTIVE QUESTION */}
      {testState === 'testing' && exerciseSet && currentQ && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200">
                {exerciseSet.subject} • {exerciseSet.topic}
              </span>
              <span className="text-xs font-bold text-slate-700">
                Question {currentQuestionIndex + 1} of {exerciseSet.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatTimer(timeElapsed)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1 mb-1">
              <BookOpen className="w-3.5 h-3.5" /> Concept: {currentQ.conceptTag}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-center gap-3.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-slate-950 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'bg-white border border-slate-300 text-slate-700'
                  }`}>
                    {optionLetters[idx] || idx + 1}
                  </div>
                  <span className="text-sm leading-relaxed flex-1">
                    {option}
                  </span>
                  {isSelected && (
                    <Check className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Recall Hint Box */}
          <div>
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Need a hint? Click to view concept prompt</span>
              </button>
            ) : (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Hint & Retrieval Cue:</span>
                </div>
                <p className="italic text-slate-700 leading-relaxed pl-5">
                  &quot;{currentQ.hint}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNextQuestion}
                disabled={selectedOptionIndex === null}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
              >
                <span>
                  {currentQuestionIndex === exerciseSet.questions.length - 1 ? 'Submit & View Analysis' : 'Next Question'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* State 3: POST-PRACTICE RESULT & CONTENT COVERAGE ANALYSIS */}
      {testState === 'completed' && practiceResult && (
        <div className="space-y-6">
          
          {/* Top Score Banner & Encouraging Quote */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Score Display */}
              <div className="flex items-center gap-6">
                <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/30">
                  <div className="text-center">
                    <span className="text-3xl block leading-none">{practiceResult.percentage}%</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-950/80 mt-1 block">
                      {practiceResult.score}/{practiceResult.totalQuestions} Correct
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Practice Results & Analysis
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {practiceResult.subject}: {practiceResult.topic}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>⏱️ Time: {formatTimer(practiceResult.timeSpentSeconds)}</span>
                    <span>•</span>
                    <span>🎯 {practiceResult.percentage >= 80 ? 'Mastery Achieved' : 'Active Growth Phase'}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleStartTest}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Practice</span>
                </button>

                <button
                  onClick={() => router.push(`/study?subject=${encodeURIComponent(practiceResult.subject)}&topic=${encodeURIComponent(practiceResult.topic)}&duration=25`)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start 25m Focus Session</span>
                </button>
              </div>

            </div>

            {/* Tailored Encouraging Quote Box */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Encouraging Mindset Quote
                  </p>
                  <p className="text-sm italic font-medium text-slate-100 mt-1 leading-relaxed">
                    &ldquo;{practiceResult.encouragingQuote.quote}&rdquo;
                  </p>
                  <p className="text-xs font-bold text-amber-300 mt-1.5 text-right">
                    — {practiceResult.encouragingQuote.author}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendation & Content Guidance */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Targeted Content Revision & Mastery Guide</span>
              </h3>
              <p className="text-xs text-slate-700 mt-1">
                {practiceResult.actionRecommendation}
              </p>
            </div>

            {/* Revision Notes / Formula Recap */}
            {practiceResult.revisionNotes.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                  <span>Key Concepts & Formulas to Remember</span>
                </h4>
                <ul className="space-y-2">
                  {practiceResult.revisionNotes.map((note, idx) => (
                    <li key={idx} className="text-xs font-medium text-slate-800 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Question by Question Detailed Breakdown */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-slate-900">
                Detailed Question Review & Explanations:
              </h4>

              <div className="space-y-3">
                {practiceResult.answers.map((ans, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      ans.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {ans.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Q{idx + 1}: {ans.questionText}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600 mt-1 inline-block">
                            Concept: {ans.conceptTag}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ans.isCorrect ? 'Correct' : 'Needs Review'}
                      </span>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Explanation & Solution:</span>
                      <p className="leading-relaxed">{ans.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setTestState('ready')}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ← Practice Another Subject
              </button>

              <button
                onClick={() => router.push('/schedule')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                View Study Schedules & Alarms
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
