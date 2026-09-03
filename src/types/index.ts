export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ... 6 = Saturday

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  daily_goal_minutes: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null; // YYYY-MM-DD
  timezone: string;
  created_at: string;
}

export interface StudySchedule {
  id: string;
  user_id: string;
  subject: string;
  start_time: string; // "HH:MM" 24-hr format
  duration_minutes: number;
  days_of_week: DayOfWeek[];
  is_active: boolean;
  notes?: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  schedule_id?: string | null;
  subject: string;
  duration_minutes: number;
  completed_at: string; // ISO string
  notes?: string;
  rating?: number; // 1 to 5
  created_at: string;
}

export type QuoteCategory = 'Discipline' | 'Consistency' | 'Focus' | 'Perseverance' | 'Mindset' | 'Procrastination';

export interface MotivationalQuote {
  id: string;
  user_id?: string | null;
  quote: string;
  author: string;
  category: QuoteCategory;
  is_system: boolean;
  created_at?: string;
}

export type BadgeId = 
  | 'first_session'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'hours_5'
  | 'hours_20'
  | 'hours_50'
  | 'early_bird'
  | 'night_owl'
  | 'weekend_warrior';

export interface BadgeDefinition {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'time' | 'habit';
  requiredValue: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: BadgeId;
  unlocked_at: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  minutes: number;
  sessionCount: number;
  count: number; // 0 to 4 intensity level for heatmap
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  todayCompletedMinutes: number;
  dailyGoalMinutes: number;
  isTodayCompleted: boolean;
  totalStudyMinutes: number;
  totalSessionsCount: number;
}
