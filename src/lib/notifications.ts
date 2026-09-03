import { StudySchedule, MotivationalQuote } from '@/types';
import { soundManager } from './sound';

// Permission helper
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  return await Notification.requestPermission();
}

// Send browser notification with motivational quote & audio chime
export function sendStudyReminder(
  schedule: StudySchedule,
  quoteObj: MotivationalQuote,
  soundEnabled: boolean = true
) {
  if (soundEnabled) {
    soundManager.playReminderChime();
  }

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(`⏰ Study Time: ${schedule.subject}`, {
        body: `"${quoteObj.quote}" — ${quoteObj.author}\n\nYour ${schedule.duration_minutes}-minute session starts now!`,
        icon: '/favicon.ico',
        tag: `study-reminder-${schedule.id}`,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.warn('Browser notification error:', e);
    }
  }
}
