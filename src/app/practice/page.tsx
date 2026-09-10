'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PracticeModule } from '@/components/practice/PracticeModule';

function PracticeContent() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || undefined;
  const topic = searchParams.get('topic') || undefined;
  const scheduleId = searchParams.get('scheduleId') || undefined;

  return (
    <PracticeModule 
      initialSubject={subject} 
      initialTopic={topic} 
      scheduleId={scheduleId} 
    />
  );
}

export default function PracticePage() {
  return (
    <div className="max-w-4xl mx-auto py-2">
      <Suspense fallback={
        <div className="p-12 text-center text-slate-500 font-medium">
          Loading practice exercises...
        </div>
      }>
        <PracticeContent />
      </Suspense>
    </div>
  );
}
