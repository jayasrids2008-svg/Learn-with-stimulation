'use client';

import React, { useState } from 'react';
import { 
  Quote as QuoteIcon, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  Filter, 
  BookOpen, 
  X,
  Flame
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MotivationalQuote, QuoteCategory } from '@/types';

const CATEGORIES: ('All' | QuoteCategory)[] = [
  'All',
  'Consistency',
  'Discipline',
  'Focus',
  'Perseverance',
  'Procrastination',
  'Mindset',
];

export default function QuotesPage() {
  const { quotes, addCustomQuote, getRandomQuote } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | QuoteCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal for adding custom quote
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newAuthorText, setNewAuthorText] = useState('');
  const [newCategory, setNewCategory] = useState<QuoteCategory>('Consistency');
  const [formError, setFormError] = useState('');

  // Spotlight Quote
  const [spotlightQuote] = useState<MotivationalQuote>(() => getRandomQuote());

  const filteredQuotes = quotes.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = 
      q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (quoteObj: MotivationalQuote) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`"${quoteObj.quote}" — ${quoteObj.author}`);
      setCopiedId(quoteObj.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) {
      setFormError('Quote text cannot be empty.');
      return;
    }

    try {
      await addCustomQuote(newQuoteText, newAuthorText, newCategory);
      setNewQuoteText('');
      setNewAuthorText('');
      setFormError('');
      setIsModalOpen(false);
    } catch (err) {
      setFormError('Failed to add custom quote.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <QuoteIcon className="w-7 h-7 text-amber-500" />
            <span>Motivational Wisdom Hub</span>
          </h1>
          <p className="text-sm text-slate-700 mt-1 max-w-xl">
            Curated wisdom on grit, habit-building, discipline, and scientific learning principles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Custom Quote</span>
        </button>
      </div>

      {/* Spotlight Quote Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Spotlight Inspiration
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
              {spotlightQuote.category}
            </span>
          </div>

          <blockquote className="pt-1">
            <p className="text-lg sm:text-xl font-serif italic text-slate-200 leading-relaxed">
              &ldquo;{spotlightQuote.quote}&rdquo;
            </p>
            <cite className="block mt-2 text-sm font-bold text-amber-400 not-italic">
              — {spotlightQuote.author}
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by quote keywords or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map(quoteObj => (
          <div
            key={quoteObj.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  {quoteObj.category}
                </span>

                {quoteObj.is_system ? (
                  <span className="text-[10px] text-slate-600 font-medium">Curated</span>
                ) : (
                  <span className="text-[10px] text-indigo-600 font-bold">Custom</span>
                )}
              </div>

              <blockquote className="mt-2">
                <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
                  &ldquo;{quoteObj.quote}&rdquo;
                </p>
                <cite className="block mt-2.5 text-xs font-bold text-slate-900 not-italic">
                  — {quoteObj.author}
                </cite>
              </blockquote>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleCopy(quoteObj)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors p-1"
                title="Copy quote"
              >
                {copiedId === quoteObj.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Add Your Personal Motivational Quote</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddQuote} className="mt-4 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quote *
                </label>
                <textarea
                  value={newQuoteText}
                  onChange={e => setNewQuoteText(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter the motivational words that inspire you to study..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author / Source
                  </label>
                  <input
                    type="text"
                    value={newAuthorText}
                    onChange={e => setNewAuthorText(e.target.value)}
                    placeholder="e.g. Richard Feynman, Anonymous"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as QuoteCategory)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Quote
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
