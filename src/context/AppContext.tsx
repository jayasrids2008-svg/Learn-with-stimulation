'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { 
  Profile, 
  StudySchedule, 
  StudySession, 
  MotivationalQuote, 
  UserBadge, 
  StreakStats,
  DayOfWeek,
  PracticeResult
} from '@/types';
import { INITIAL_QUOTES } from '@/lib/quotes-data';
import { calculateStreakStats, processSessionCompletion, getLocalDateString } from '@/lib/streak-engine';
import { sendStudyReminder, requestNotificationPermission } from '@/lib/notifications';
import { soundManager } from '@/lib/sound';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export interface ActiveAlarmState {
  id: string;
  schedule: StudySchedule;
  quote: MotivationalQuote;
  timestamp: string;
  isRinging: boolean;
}

interface AppContextType {
  profile: Profile;
  schedules: StudySchedule[];
  sessions: StudySession[];
  quotes: MotivationalQuote[];
  badges: UserBadge[];
  streakStats: StreakStats;
  practiceResults: PracticeResult[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  activeAlarm: ActiveAlarmState | null;
  dismissAlarm: () => void;
  snoozeAlarm: (minutes?: number) => void;
  triggerTestAlarm: () => void;
  addSchedule: (schedule: Omit<StudySchedule, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<StudySchedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleScheduleActive: (id: string) => Promise<void>;
  recordStudySession: (session: {
    subject: string;
    topic?: string;
    duration_minutes: number;
    notes?: string;
    rating?: number;
    schedule_id?: string | null;
  }) => Promise<{ newBadges: UserBadge[]; streakIncremented: boolean }>;
  savePracticeResult: (result: PracticeResult) => Promise<void>;
  addCustomQuote: (quote: string, author: string, category: MotivationalQuote['category']) => Promise<void>;
  getRandomQuote: (category?: MotivationalQuote['category']) => MotivationalQuote;
  updateDailyGoal: (minutes: number) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  notificationPermission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  isSupabaseConnected: boolean;
  isLoading: boolean;
}

const DEFAULT_PROFILE: Profile = {
  id: 'demo-user-id',
  email: 'learner@studypulse.app',
  full_name: 'Alex Johnson',
  daily_goal_minutes: 45,
  current_streak: 3,
  longest_streak: 5,
  last_study_date: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  created_at: new Date().toISOString(),
};

const DEFAULT_SCHEDULES: StudySchedule[] = [
  {
    id: 'sch-1',
    user_id: 'demo-user-id',
    subject: 'Mathematics',
    topic: 'Calculus & Derivatives',
    difficulty: 'Intermediate',
    start_time: '18:30',
    duration_minutes: 45,
    days_of_week: [1, 2, 3, 4, 5], // Mon-Fri
    is_active: true,
    notes: 'Master Power Rule, Chain Rule & critical point optimization with practice exercises.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-2',
    user_id: 'demo-user-id',
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    start_time: '20:00',
    duration_minutes: 30,
    days_of_week: [1, 3, 5], // Mon, Wed, Fri
    is_active: true,
    notes: 'Binary Search Trees, Hash Maps & Breadth-First Search traversals.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-3',
    user_id: 'demo-user-id',
    subject: 'Physics',
    topic: 'Thermodynamics & Heat Engines',
    difficulty: 'Intermediate',
    start_time: '10:00',
    duration_minutes: 60,
    days_of_week: [0, 6], // Weekends
    is_active: true,
    notes: 'Review Carnot efficiency and Second Law of Thermodynamics problem sets.',
    created_at: new Date().toISOString(),
  }
];

// Helper to seed past sessions
const generateInitialSessions = (): StudySession[] => {
  const sessions: StudySession[] = [];
  const now = new Date();

  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 2);
  sessions.push({
    id: 'sess-1',
    user_id: 'demo-user-id',
    subject: 'Mathematics',
    topic: 'Calculus & Derivatives',
    duration_minutes: 45,
    completed_at: d2.toISOString(),
    notes: 'Completed practice test on definite integrals and power rule.',
    rating: 5,
    created_at: d2.toISOString(),
  });

  const d1 = new Date(now);
  d1.setDate(d1.getDate() - 1);
  sessions.push({
    id: 'sess-2',
    user_id: 'demo-user-id',
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    duration_minutes: 35,
    completed_at: d1.toISOString(),
    notes: 'Practiced BFS traversal queue implementation.',
    rating: 4,
    created_at: d1.toISOString(),
  });

  return sessions;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      ...DEFAULT_PROFILE,
      last_study_date: getLocalDateString(yesterday),
    };
  });
  const [schedules, setSchedules] = useState<StudySchedule[]>(DEFAULT_SCHEDULES);
  const [sessions, setSessions] = useState<StudySession[]>(generateInitialSessions());
  const [practiceResults, setPracticeResults] = useState<PracticeResult[]>([]);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(() => {
    return INITIAL_QUOTES.map((q, idx) => ({
      id: `sys-quote-${idx + 1}`,
      ...q,
      created_at: new Date().toISOString(),
    }));
  });
  const [badges, setBadges] = useState<UserBadge[]>([
    {
      id: 'b-init-1',
      user_id: 'demo-user-id',
      badge_type: 'first_session',
      unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'b-init-2',
      user_id: 'demo-user-id',
      badge_type: 'streak_3',
      unlocked_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarmState | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [lastNotifiedSchedule, setLastNotifiedSchedule] = useState<{ [id: string]: string }>({});
  
  const snoozeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from LocalStorage or Supabase
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }

      const hasSupabase = isSupabaseConfigured();
      setIsSupabaseConnected(hasSupabase);

      if (typeof window !== 'undefined') {
        try {
          const storedProfile = localStorage.getItem('studypulse_profile');
          const storedSchedules = localStorage.getItem('studypulse_schedules');
          const storedSessions = localStorage.getItem('studypulse_sessions');
          const storedQuotes = localStorage.getItem('studypulse_quotes');
          const storedBadges = localStorage.getItem('studypulse_badges');
          const storedSound = localStorage.getItem('studypulse_sound');
          const storedPractice = localStorage.getItem('studypulse_practice');

          if (storedProfile) setProfile(JSON.parse(storedProfile));
          if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
          if (storedSessions) setSessions(JSON.parse(storedSessions));
          if (storedQuotes) setQuotes(JSON.parse(storedQuotes));
          if (storedBadges) setBadges(JSON.parse(storedBadges));
          if (storedSound !== null) setSoundEnabled(JSON.parse(storedSound));
          if (storedPractice) setPracticeResults(JSON.parse(storedPractice));
        } catch (e) {
          console.warn('Error reading from localStorage', e);
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      try {
        localStorage.setItem('studypulse_profile', JSON.stringify(profile));
        localStorage.setItem('studypulse_schedules', JSON.stringify(schedules));
        localStorage.setItem('studypulse_sessions', JSON.stringify(sessions));
        localStorage.setItem('studypulse_quotes', JSON.stringify(quotes));
        localStorage.setItem('studypulse_badges', JSON.stringify(badges));
        localStorage.setItem('studypulse_sound', JSON.stringify(soundEnabled));
        localStorage.setItem('studypulse_practice', JSON.stringify(practiceResults));
      } catch (e) {
        console.warn('Error saving to localStorage', e);
      }
    }
  }, [profile, schedules, sessions, quotes, badges, soundEnabled, practiceResults, isLoading]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    return perm;
  }, []);

  // Get random quote
  const getRandomQuote = useCallback((category?: MotivationalQuote['category']): MotivationalQuote => {
    let pool = quotes;
    if (category) {
      const filtered = quotes.filter(q => q.category === category);
      if (filtered.length > 0) pool = filtered;
    }
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] || pool[0];
  }, [quotes]);

  // Stop alarm ringing sound and clear alarm modal
  const dismissAlarm = useCallback(() => {
    soundManager.stopAlarm();
    setActiveAlarm(null);
    if (snoozeTimeoutRef.current) {
      clearTimeout(snoozeTimeoutRef.current);
      snoozeTimeoutRef.current = null;
    }
  }, []);

  // Snooze alarm for X minutes (default 5 min)
  const snoozeAlarm = useCallback((minutes: number = 5) => {
    if (!activeAlarm) return;
    const currentSchedule = activeAlarm.schedule;
    const currentQuote = activeAlarm.quote;

    // Stop sound right now
    soundManager.stopAlarm();
    setActiveAlarm(null);

    // Schedule re-ring
    if (snoozeTimeoutRef.current) clearTimeout(snoozeTimeoutRef.current);
    snoozeTimeoutRef.current = setTimeout(() => {
      if (soundEnabled) {
        soundManager.startAlarm();
      }
      setActiveAlarm({
        id: 'snooze-alert-' + Date.now(),
        schedule: currentSchedule,
        quote: currentQuote,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRinging: true,
      });
    }, minutes * 60 * 1000);
  }, [activeAlarm, soundEnabled]);

  // Trigger test alarm clock simulation
  const triggerTestAlarm = useCallback(() => {
    const sampleSchedule: StudySchedule = schedules[0] || {
      id: 'test-sch',
      user_id: profile.id,
      subject: 'Mathematics',
      topic: 'Calculus & Derivatives',
      difficulty: 'Intermediate',
      start_time: '12:00',
      duration_minutes: 30,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      is_active: true,
      notes: 'Sample study session reminder with active alarm ringing & motivational stimulation!',
      created_at: new Date().toISOString(),
    };
    const randomQuote = getRandomQuote();

    if (soundEnabled) {
      soundManager.startAlarm();
    }
    sendStudyReminder(sampleSchedule, randomQuote, soundEnabled);
    setActiveAlarm({
      id: 'test-alarm-' + Date.now(),
      schedule: sampleSchedule,
      quote: randomQuote,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRinging: true,
    });
  }, [schedules, profile.id, getRandomQuote, soundEnabled]);

  // Background Reminder Watcher (checks every 10 seconds)
  useEffect(() => {
    const checkScheduleTimes = () => {
      const now = new Date();
      const currentDay = now.getDay() as DayOfWeek;
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMin}`;
      const todayDateStr = getLocalDateString(now);

      schedules.forEach(sch => {
        if (!sch.is_active) return;
        if (!sch.days_of_week.includes(currentDay)) return;

        // Check if schedule start_time matches current time
        if (sch.start_time === currentTimeStr) {
          const notificationKey = `${sch.id}_${todayDateStr}_${currentTimeStr}`;
          if (!lastNotifiedSchedule[notificationKey]) {
            setLastNotifiedSchedule(prev => ({ ...prev, [notificationKey]: todayDateStr }));
            const quote = getRandomQuote();
            if (soundEnabled) {
              soundManager.startAlarm();
            }
            sendStudyReminder(sch, quote, soundEnabled);
            setActiveAlarm({
              id: 'alarm-' + Date.now(),
              schedule: sch,
              quote,
              timestamp: currentTimeStr,
              isRinging: true,
            });
          }
        }
      });
    };

    const interval = setInterval(checkScheduleTimes, 10000);
    return () => clearInterval(interval);
  }, [schedules, soundEnabled, getRandomQuote, lastNotifiedSchedule]);

  // Add study schedule
  const addSchedule = useCallback(async (data: Omit<StudySchedule, 'id' | 'user_id' | 'created_at'>) => {
    const newSch: StudySchedule = {
      ...data,
      id: 'sch_' + Math.random().toString(36).substring(2, 9),
      user_id: profile.id,
      created_at: new Date().toISOString(),
    };
    setSchedules(prev => [newSch, ...prev]);
  }, [profile.id]);

  // Update schedule
  const updateSchedule = useCallback(async (id: string, updates: Partial<StudySchedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  // Delete schedule
  const deleteSchedule = useCallback(async (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  // Toggle active
  const toggleScheduleActive = useCallback(async (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  }, []);

  // Record completed study session & process streaks
  const recordStudySession = useCallback(async (sessionData: {
    subject: string;
    topic?: string;
    duration_minutes: number;
    notes?: string;
    rating?: number;
    schedule_id?: string | null;
  }) => {
    const newSession: StudySession = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      user_id: profile.id,
      subject: sessionData.subject,
      topic: sessionData.topic,
      duration_minutes: sessionData.duration_minutes,
      notes: sessionData.notes || '',
      rating: sessionData.rating || 5,
      schedule_id: sessionData.schedule_id || null,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { updatedProfile, newBadges, streakIncremented } = processSessionCompletion(
      profile,
      sessions,
      newSession,
      badges
    );

    setSessions(prev => [newSession, ...prev]);
    setProfile(updatedProfile);

    if (newBadges.length > 0) {
      setBadges(prev => [...newBadges, ...prev]);
    }

    if (soundEnabled) {
      soundManager.playCompletionChime();
    }

    return { newBadges, streakIncremented };
  }, [profile, sessions, badges, soundEnabled]);

  // Save practice test result
  const savePracticeResult = useCallback(async (result: PracticeResult) => {
    setPracticeResults(prev => [result, ...prev]);
    
    // Check if eligible for practice badge
    const existingBadgeIds = new Set(badges.map(b => b.badge_type));
    if (!existingBadgeIds.has('practice_ace') && result.percentage >= 80) {
      setBadges(prev => [
        {
          id: 'b-prac-' + Date.now(),
          user_id: profile.id,
          badge_type: 'practice_ace',
          unlocked_at: new Date().toISOString(),
        },
        ...prev
      ]);
    }
  }, [badges, profile.id]);

  // Add custom quote
  const addCustomQuote = useCallback(async (quote: string, author: string, category: MotivationalQuote['category']) => {
    const newQuote: MotivationalQuote = {
      id: 'user_quote_' + Math.random().toString(36).substring(2, 9),
      user_id: profile.id,
      quote: quote.trim(),
      author: author.trim() || 'Anonymous',
      category,
      is_system: false,
      created_at: new Date().toISOString(),
    };
    setQuotes(prev => [newQuote, ...prev]);
  }, [profile.id]);

  // Update daily goal
  const updateDailyGoal = useCallback(async (minutes: number) => {
    setProfile(prev => ({ ...prev, daily_goal_minutes: minutes }));
  }, []);

  // Update profile name
  const updateProfileName = useCallback(async (name: string) => {
    setProfile(prev => ({ ...prev, full_name: name }));
  }, []);

  const streakStats = calculateStreakStats(profile, sessions, practiceResults.length);

  return (
    <AppContext.Provider
      value={{
        profile,
        schedules,
        sessions,
        quotes,
        badges,
        streakStats,
        practiceResults,
        soundEnabled,
        setSoundEnabled,
        activeAlarm,
        dismissAlarm,
        snoozeAlarm,
        triggerTestAlarm,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        toggleScheduleActive,
        recordStudySession,
        savePracticeResult,
        addCustomQuote,
        getRandomQuote,
        updateDailyGoal,
        updateProfileName,
        notificationPermission,
        requestPermission,
        isSupabaseConnected,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
