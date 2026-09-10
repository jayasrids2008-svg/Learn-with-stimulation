import { PracticeResult, UserAnswerRecord, MotivationalQuote, SubjectDifficulty } from '@/types';

export const ENCOURAGING_MASTERY_QUOTES: MotivationalQuote[] = [
  {
    id: 'enc-1',
    quote: 'Outstanding mastery! Precision and dedication turn knowledge into second nature.',
    author: 'StudyPulse Mastery Coach',
    category: 'Mastery',
    is_system: true,
  },
  {
    id: 'enc-2',
    quote: 'Mistakes are simply the raw blueprints of learning. Review the missed concepts, and watch your understanding soar.',
    author: 'Carol Dweck (Mindset)',
    category: 'Encouragement',
    is_system: true,
  },
  {
    id: 'enc-3',
    quote: 'It is not that I am so smart, it is just that I stay with problems longer.',
    author: 'Albert Einstein',
    category: 'Perseverance',
    is_system: true,
  },
  {
    id: 'enc-4',
    quote: 'Every expert was once a beginner who refused to quit. You are building mental muscle with every question.',
    author: 'Robin Sharma',
    category: 'Encouragement',
    is_system: true,
  },
  {
    id: 'enc-5',
    quote: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
    category: 'Consistency',
    is_system: true,
  }
];

export function generatePracticeResultAnalysis(params: {
  subject: string;
  topic: string;
  answers: UserAnswerRecord[];
  timeSpentSeconds: number;
  scheduleId?: string | null;
}): PracticeResult {
  const { subject, topic, answers, timeSpentSeconds, scheduleId } = params;

  const totalQuestions = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const missedAnswers = answers.filter(a => !a.isCorrect);
  const masteredAnswers = answers.filter(a => a.isCorrect);

  const missedConcepts = Array.from(new Set(missedAnswers.map(a => a.conceptTag)));
  const masteredConcepts = Array.from(new Set(masteredAnswers.map(a => a.conceptTag)));

  // Pick encouraging quote tailored to performance level
  let encouragingQuote: MotivationalQuote;
  let actionRecommendation: string;
  const revisionNotes: string[] = [];

  if (percentage >= 85) {
    encouragingQuote = {
      id: `quote-high-${Date.now()}`,
      quote: 'Exceptional performance! You have a commanding grasp of this topic. Carry this powerful momentum into your next focus block.',
      author: 'StudyPulse Coach',
      category: 'Mastery',
      is_system: true,
    };
    actionRecommendation = 'You are ready for advanced applications or moving to the next chapter. Do a quick 15-minute consolidation session to cement this permanently!';
    revisionNotes.push(
      `Strong foundational clarity established in ${masteredConcepts.join(', ') || topic}.`,
      `Next step: Try solving complex multi-step variations or teach the concept to reinforce active mastery.`
    );
  } else if (percentage >= 60) {
    encouragingQuote = {
      id: `quote-mid-${Date.now()}`,
      quote: 'Great effort! You are over halfway to complete mastery. A quick review of the flagged concepts will lock in an A+ understanding.',
      author: 'StudyPulse Coach',
      category: 'Encouragement',
      is_system: true,
    };
    actionRecommendation = `Target your focus on the ${missedConcepts.length} missed concept(s) below. Spend 10-15 minutes revisiting these explanations before moving forward.`;
    missedAnswers.forEach(ans => {
      revisionNotes.push(
        `Focus Concept: [${ans.conceptTag}] — ${ans.explanation}`
      );
    });
  } else {
    encouragingQuote = {
      id: `quote-growth-${Date.now()}`,
      quote: 'Every breakthrough begins with discovering what you do not know yet. This test did its job! Embrace the learning curve and review the step-by-step solutions.',
      author: 'StudyPulse Coach',
      category: 'Perseverance',
      is_system: true,
    };
    actionRecommendation = `No worries at all — this is where real learning happens! Review each question solution below, take 5 minutes to write down the formulas/principles, and re-attempt the practice test.`;
    missedAnswers.forEach(ans => {
      revisionNotes.push(
        `Review [${ans.conceptTag}]: Correct answer is "${ans.explanation}"`
      );
    });
  }

  return {
    id: `res-${Date.now()}`,
    scheduleId: scheduleId || null,
    subject,
    topic,
    score: correctCount,
    totalQuestions,
    percentage,
    timeSpentSeconds,
    answers,
    missedConcepts,
    masteredConcepts,
    encouragingQuote,
    revisionNotes,
    actionRecommendation,
    completedAt: new Date().toISOString()
  };
}
