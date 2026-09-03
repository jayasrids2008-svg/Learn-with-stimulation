'use client';

import React, { useState } from 'react';
import { Quote as QuoteIcon, RefreshCw, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MotivationalQuote } from '@/types';

export function DailyQuoteCard() {
  const { getRandomQuote } = useApp();
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(() => getRandomQuote());
  const [copied, setCopied] = useState(false);

  const handleShuffle = () => {
    setCurrentQuote(getRandomQuote());
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between h-full">
      
      {/* Background Icon */}
      <QuoteIcon className="w-24 h-24 text-amber-500/10 absolute -top-4 -right-4 pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Daily Wisdom & Focus
            </span>
          </div>

          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-200/60 text-amber-900 border border-amber-300/40">
            {currentQuote.category}
          </span>
        </div>

        {/* Quote text */}
        <blockquote className="relative z-10">
          <p className="text-base sm:text-lg font-serif italic text-slate-800 leading-relaxed">
            &ldquo;{currentQuote.quote}&rdquo;
          </p>
          <cite className="block mt-3 text-xs sm:text-sm font-semibold text-amber-950 not-italic">
            — {currentQuote.author}
          </cite>
        </blockquote>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-amber-200/50">
        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-amber-800 transition-colors p-1"
          title="Get another quote"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          <span>New Quote</span>
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-amber-100/60 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
