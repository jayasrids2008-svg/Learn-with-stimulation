import { Profile, StudySession, StreakStats, UserBadge, BadgeId } from '@/types';
import { BADGE_DEFINITIONS } from './quotes-data';

// Helper to format date in YYYY-MM-DD (local time)
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate days difference between two YYYY-MM-DD strings
export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Evaluate user streak statistics given profile and sessions
export function calculateStreakStats(profile: Profile | null, sessions: StudySession[]): StreakStats {
  const todayStr = getLocalDateString();
  const dailyGoalMinutes = profile?.daily_goal_minutes || 45;

  // Filter today's sessions
  const todaySessions = sessions.filter(s => {
    const sessionDate = getLocalDateString(new Date(s.completed_at));
    return sessionDate === todayStr;
  });

  const todayCompletedMinutes = todaySessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const isTodayCompleted = todayCompletedMinutes >= dailyGoalMinutes || todaySessions.length > 0;

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalSessionsCount = sessions.length;

  let currentStreak = profile?.current_streak || 0;
  let longestStreak = profile?.longest_streak || 0;
  const lastStudyDate = profile?.last_study_date || null;

  // Check if streak is broken (more than 1 day missed since last study date, excluding today)
  if (lastStudyDate) {
    const diff = daysBetween(lastStudyDate, todayStr);
    if (diff > 1 && !isTodayCompleted) {
      // Streak lapsed
      currentStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastStudyDate,
    todayCompletedMinutes,
    dailyGoalMinutes,
    isTodayCompleted,
    totalStudyMinutes,
    totalSessionsCount,
  };
}

// Process a new session and calculate new streak & new badges
export function processSessionCompletion(
  profile: Profile,
  sessions: StudySession[],
  newSession: StudySession,
  existingBadges: UserBadge[]
): {
  updatedProfile: Profile;
  newBadges: UserBadge[];
  streakIncremented: boolean;
} {
  const allSessions = [...sessions, newSession];
  const todayStr = getLocalDateString(new Date(newSession.completed_at));
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  let newCurrentStreak = profile.current_streak;
  let streakIncremented = false;

  if (!profile.last_study_date) {
    // First ever study day
    newCurrentStreak = 1;
    streakIncremented = true;
  } else if (profile.last_study_date === todayStr) {
    // Already studied today, maintain current streak
    newCurrentStreak = profile.current_streak;
  } else if (profile.last_study_date === yesterdayStr) {
    // Studied yesterday, consecutive day streak!
    newCurrentStreak = profile.current_streak + 1;
    streakIncremented = true;
  } else {
    // Missed previous days, restart streak at 1
    newCurrentStreak = 1;
    streakIncremented = true;
  }

  const newLongestStreak = Math.max(profile.longest_streak, newCurrentStreak);

  const updatedProfile: Profile = {
    ...profile,
    current_streak: newCurrentStreak,
    longest_streak: newLongestStreak,
    last_study_date: todayStr,
  };

  // Evaluate Badges
  const existingBadgeIds = new Set(existingBadges.map(b => b.badge_type));
  const newBadges: UserBadge[] = [];
  const nowISO = new Date().toISOString();

  const totalMinutes = allSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const sessionHour = new Date(newSession.completed_at).getHours();

  const awardBadge = (badgeId: BadgeId) => {
    if (!existingBadgeIds.has(badgeId)) {
      newBadges.push({
        id: 'badge_' + Math.random().toString(36).substring(2, 9),
        user_id: profile.id,
        badge_type: badgeId,
        unlocked_at: nowISO,
      });
      existingBadgeIds.add(badgeId);
    }
  };

  // First session badge
  if (allSessions.length >= 1) awardBadge('first_session');

  // Streak Badges
  if (newCurrentStreak >= 3) awardBadge('streak_3');
  if (newCurrentStreak >= 7) awardBadge('streak_7');
  if (newCurrentStreak >= 14) awardBadge('streak_14');
  if (newCurrentStreak >= 30) awardBadge('streak_30');

  // Time Badges
  if (totalMinutes >= 300) awardBadge('hours_5');
  if (totalMinutes >= 1200) awardBadge('hours_20');
  if (totalMinutes >= 3000) awardBadge('hours_50');

  // Time of Day Badges
  if (sessionHour < 8) awardBadge('early_bird');
  if (sessionHour >= 22) awardBadge('night_owl');

  return {
    updatedProfile,
    newBadges,
    streakIncremented,
  };
}
