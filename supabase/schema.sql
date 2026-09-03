-- =========================================================
-- StudyPulse: Complete Supabase PostgreSQL Database Schema
-- Includes Tables, Constraints, Indexes, RLS Policies & Triggers
-- =========================================================

-- Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Stores user profile, streak stats, daily goals, and timezone
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

-- Enable RLS on profiles
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

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. STUDY SCHEDULES TABLE
-- Stores scheduled reminder slots for each user
create table if not exists public.study_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  start_time time not null, -- e.g., '18:30:00'
  duration_minutes integer not null check (duration_minutes > 0),
  days_of_week integer[] not null default '{1,2,3,4,5}', -- 0=Sun, 1=Mon, ..., 6=Sat
  is_active boolean default true,
  notes text,
  created_at timestamptz default now()
);

-- Index for fast user_id schedule lookups
create index if not exists idx_study_schedules_user_id on public.study_schedules(user_id);

-- Enable RLS on study_schedules
alter table public.study_schedules enable row level security;

-- Policies for study_schedules
create policy "Users can view own schedules"
  on public.study_schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert own schedules"
  on public.study_schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update own schedules"
  on public.study_schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete own schedules"
  on public.study_schedules for delete
  using (auth.uid() = user_id);


-- 3. STUDY SESSIONS TABLE
-- Records each completed study block and credits towards streak
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

-- Indexes for performance
create index if not exists idx_study_sessions_user_id on public.study_sessions(user_id);
create index if not exists idx_study_sessions_completed_at on public.study_sessions(completed_at);

-- Enable RLS on study_sessions
alter table public.study_sessions enable row level security;

-- Policies for study_sessions
create policy "Users can view own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own study sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own study sessions"
  on public.study_sessions for delete
  using (auth.uid() = user_id);


-- 4. MOTIVATIONAL QUOTES TABLE
-- Stores curated system quotes and custom user-submitted quotes
create table if not exists public.motivational_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade, -- NULL for public/system quotes
  quote text not null,
  author text not null,
  category text not null check (category in ('Discipline', 'Consistency', 'Focus', 'Perseverance', 'Mindset', 'Procrastination')),
  is_system boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on motivational_quotes
alter table public.motivational_quotes enable row level security;

-- Policies: Anyone can view system quotes, authenticated users can view/create own custom quotes
create policy "Anyone can view system quotes"
  on public.motivational_quotes for select
  using (is_system = true or auth.uid() = user_id);

create policy "Users can insert own custom quotes"
  on public.motivational_quotes for insert
  with check (auth.uid() = user_id and is_system = false);

create policy "Users can update own custom quotes"
  on public.motivational_quotes for update
  using (auth.uid() = user_id and is_system = false);

create policy "Users can delete own custom quotes"
  on public.motivational_quotes for delete
  using (auth.uid() = user_id and is_system = false);


-- 5. USER BADGES TABLE
-- Tracks unlocked streak and time milestone achievements
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_type text not null,
  unlocked_at timestamptz default now(),
  constraint unique_user_badge unique (user_id, badge_type)
);

-- Enable RLS on user_badges
alter table public.user_badges enable row level security;

create policy "Users can view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);


-- 6. SEED INITIAL SYSTEM QUOTES
insert into public.motivational_quotes (quote, author, category, is_system) values
  ('We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant', 'Consistency', true),
  ('Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.', 'John C. Maxwell', 'Consistency', true),
  ('You do not rise to the level of your goals. You fall to the level of your systems.', 'James Clear', 'Discipline', true),
  ('Discipline is choosing between what you want now and what you want most.', 'Abraham Lincoln', 'Discipline', true),
  ('The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.', 'Mark Twain', 'Procrastination', true),
  ('Live as if you were to die tomorrow. Learn as if you were to live forever.', 'Mahatma Gandhi', 'Mindset', true),
  ('Concentrate all your thoughts upon the work in hand. The sun''s rays do not burn until brought to a focus.', 'Alexander Graham Bell', 'Focus', true),
  ('It is not that I''m so smart. But I stay with the questions much longer.', 'Albert Einstein', 'Perseverance', true),
  ('Continuous effort—not strength or intelligence—is the key to unlocking our potential.', 'Winston Churchill', 'Perseverance', true),
  ('Deep work is the ability to focus without distraction on a cognitively demanding task.', 'Cal Newport', 'Focus', true),
  ('Success isn''t always about greatness. It''s about consistency. Consistent hard work leads to success. Greatness will come.', 'Dwayne Johnson', 'Consistency', true),
  ('Action is the foundational key to all success.', 'Pablo Picasso', 'Procrastination', true)
on conflict do nothing;
