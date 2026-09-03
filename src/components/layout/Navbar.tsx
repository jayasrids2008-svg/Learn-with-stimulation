'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Clock, 
  Calendar, 
  BarChart3, 
  Quote, 
  Database, 
  Volume2, 
  VolumeX, 
  Bell, 
  Menu, 
  X,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Navbar() {
  const pathname = usePathname();
  const { 
    streakStats, 
    soundEnabled, 
    setSoundEnabled, 
    triggerTestReminder, 
    profile, 
    notificationPermission, 
    requestPermission 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Sparkles },
    { href: '/schedule', label: 'Schedules & Reminders', icon: Calendar },
    { href: '/study', label: 'Focus Timer', icon: Clock },
    { href: '/analytics', label: 'Streaks & Analytics', icon: BarChart3 },
    { href: '/quotes', label: 'Quotes Hub', icon: Quote },
    { href: '/supabase-setup', label: 'Database Setup', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-amber-200 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Study<span className="text-amber-600">Pulse</span>
                </span>
                <span className="text-[10px] block text-slate-700 font-medium -mt-1 tracking-wider uppercase">
                  Habit & Reminder
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions & Status Badges */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Streak Counter Badge */}
            <Link
              href="/analytics"
              title="Click to view streak breakdown and badges"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                streakStats.isTodayCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Flame className={`w-4 h-4 ${streakStats.currentStreak > 0 ? 'fill-amber-500 text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <span>{streakStats.currentStreak} Day Streak</span>
            </Link>

            {/* Test Reminder Trigger Button */}
            <button
              onClick={triggerTestReminder}
              title="Test study reminder notification & audio chime"
              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="sr-only">Test Reminder</span>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Audio chimes active (click to mute)" : "Audio muted (click to unmute)"}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="sr-only">Toggle Sound</span>
            </button>

            {/* Direct Study Button */}
            <Link
              href="/study"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Start Study</span>
            </Link>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                {profile.full_name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/analytics"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streakStats.currentStreak}d</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span className="sr-only">Open Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600">
              <span className="font-medium">Audio Chimes</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="font-semibold text-amber-600 flex items-center gap-1"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <button
              onClick={() => {
                triggerTestReminder();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Test Study Reminder Popup</span>
            </button>

            <Link
              href="/study"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Start Focus Session Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
