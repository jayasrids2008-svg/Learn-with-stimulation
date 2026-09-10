import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { AlarmClockModal } from '@/components/alarm/AlarmClockModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'StudyPulse — Smart Study Reminder, Alarm & Practice Companion',
  description: 'Smart study alarm clock reminder with motivational stimulation, customizable subject scheduling, active recall practice exercises, and personalized content mastery guidance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-amber-200 selection:text-amber-950">
        <AppProvider>
          <Navbar />
          <AlarmClockModal />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-700">
            <p>© {new Date().getFullYear()} StudyPulse • AI Study Reminder & Alarm • Practice Exercises & Revision Engine</p>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
