'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ShieldCheck, 
  Key, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Code,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SQL_SCHEMA = `-- =========================================================
-- StudyPulse: Supabase PostgreSQL Database Schema
-- Includes Tables, Constraints, Indexes, RLS Policies & Triggers
-- =========================================================

-- Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  daily_goal_minutes integer default 45 check (daily_goal_minutes > 0),
  current_streak integer default 0 check (current_streak >= 0),
  longest_streak integer default 0 check (longest_streak >= 0),
  last_study_date date,
  timezone text default 'UTC',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, daily_goal_minutes, current_streak, longest_streak)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    45,
    0,
    0
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. STUDY SCHEDULES TABLE
create table if not exists public.study_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  days_of_week integer[] not null default '{1,2,3,4,5}',
  is_active boolean default true,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_study_schedules_user_id on public.study_schedules(user_id);
alter table public.study_schedules enable row level security;

create policy "Users can manage own schedules"
  on public.study_schedules for all
  using (auth.uid() = user_id);


-- 3. STUDY SESSIONS TABLE
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  schedule_id uuid references public.study_schedules(id) on delete set null,
  subject text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  notes text,
  rating integer check (rating >= 1 and rating <= 5),
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_study_sessions_user_id on public.study_sessions(user_id);
alter table public.study_sessions enable row level security;

create policy "Users can manage own sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id);


-- 4. MOTIVATIONAL QUOTES TABLE
create table if not exists public.motivational_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  quote text not null,
  author text not null,
  category text not null check (category in ('Discipline', 'Consistency', 'Focus', 'Perseverance', 'Mindset', 'Procrastination')),
  is_system boolean default false,
  created_at timestamptz default now()
);

alter table public.motivational_quotes enable row level security;

create policy "Anyone can view system or own quotes"
  on public.motivational_quotes for select
  using (is_system = true or auth.uid() = user_id);

create policy "Users can manage own custom quotes"
  on public.motivational_quotes for all
  using (auth.uid() = user_id and is_system = false);


-- 5. USER BADGES TABLE
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_type text not null,
  unlocked_at timestamptz default now(),
  constraint unique_user_badge unique (user_id, badge_type)
);

alter table public.user_badges enable row level security;

create policy "Users can manage own badges"
  on public.user_badges for all
  using (auth.uid() = user_id);
`;

export default function SupabaseSetupPage() {
  const { isSupabaseConnected } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Database className="w-7 h-7 text-amber-500" />
          <span>Supabase Database & Backend Architecture</span>
        </h1>
        <p className="text-sm text-slate-700 mt-1">
          Complete production setup walkthrough for Supabase PostgreSQL, Row Level Security (RLS), and automated profile triggers.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className={`rounded-3xl p-6 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isSupabaseConnected
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-amber-50/70 border-amber-200'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-2xl shrink-0 ${
            isSupabaseConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isSupabaseConnected ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Server className="w-6 h-6 text-amber-600" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isSupabaseConnected
                ? 'Connected to Live Supabase Cloud Database'
                : 'Running in Local Storage & Client-Side DB Mode'}
            </h3>
            <p className="text-xs text-slate-700 mt-0.5 max-w-xl">
              {isSupabaseConnected
                ? 'Your project is actively synced with your Supabase cloud backend.'
                : 'The application is fully functional offline and in preview mode. To connect your cloud database, follow the steps below and add your credentials to .env.local.'}
            </p>
          </div>
        </div>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0"
        >
          <span>Open Supabase Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Step-by-Step Manual Setup Walkthrough */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Manual Supabase Setup Instructions
          </h2>
          <p className="text-xs text-slate-700 mt-0.5">
            Follow these 4 simple steps to provision your cloud PostgreSQL database
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Create Supabase Project</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Navigate to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-700 underline font-medium">supabase.com</a>, create a free project, and select your preferred region.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Execute SQL Schema</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              In your Supabase dashboard, click <strong>SQL Editor</strong> on the left sidebar, paste the complete SQL script below, and click <strong>Run</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Copy Project API Keys</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Go to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon/public Key</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 text-sm">Update .env.local</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Paste the keys into your <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">.env.local</code> file and restart the development server.
            </p>
          </div>

        </div>
      </div>

      {/* SQL Script Display */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-400" />
              <span>Full PostgreSQL Migration Script</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines profiles, schedules, sessions, quotes, badges, indexes, triggers & Row Level Security
            </p>
          </div>

          <button
            onClick={handleCopySQL}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>SQL Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copy Full SQL Schema</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-2xl overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
          {SQL_SCHEMA}
        </pre>
      </div>

    </div>
  );
}
