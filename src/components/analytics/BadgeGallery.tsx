'use client';

import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Sun, 
  Moon, 
  Award,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BADGE_DEFINITIONS } from '@/lib/quotes-data';
import { BadgeId } from '@/types';

// Map icon string to Lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Zap,
  ShieldCheck,
  Trophy,
  Clock,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  Award,
};

export function BadgeGallery() {
  const { badges } = useApp();

  const unlockedBadgeMap = new Map(badges.map(b => [b.badge_type, b]));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Habit & Consistency Badges</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unlock achievements by maintaining unbroken study streaks and focus hours
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            {badges.length} / {BADGE_DEFINITIONS.length} Unlocked
          </span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map(badge => {
          const unlocked = unlockedBadgeMap.get(badge.id);
          const Icon = ICON_MAP[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                unlocked
                  ? 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border-amber-300 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    unlocked
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{badge.title}</h4>
                    {unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {badge.description}
                  </p>

                  {unlocked ? (
                    <div className="text-[10px] font-semibold text-amber-800 pt-1">
                      Unlocked on {new Date(unlocked.unlocked_at).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="text-[10px] font-medium text-slate-400 pt-1">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
