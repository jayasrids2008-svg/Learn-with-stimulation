# Learn-with-stimulation (StudyPulse) ⚡📚

An interactive, high-energy study companion and reminder app built with **Next.js 16 (Turbopack)**, **Tailwind CSS v4**, and **Supabase**.

Features smart study schedules, ambient audio stimulation, streak tracking, Pomodoro focus timers, and daily motivational quotes.

---

## ✨ Features

- 📅 **Smart Study Schedules**: Plan and manage recurring and single study sessions with priority tags and notifications.
- ⏱️ **Focus Timer & Ambient Stimulation**: Customizable Pomodoro intervals with optional background white noise / binaural beats.
- 🔥 **Streak & Analytics**: Track continuous study habits and weekly hour commitments.
- 💡 **Daily Motivational Quotes**: Boost your focus and mindset every single morning.
- ☁️ **Supabase Sync**: Optional cloud database persistence with real-time fallback to local storage.

---

## 🚀 Deploy to Vercel

### One-Click Deploy
Click the button below to deploy this repository directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjayasrids2008-svg%2FLearn-with-stimulation&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20URL%20and%20Anon%20Key%20(optional%20for%20cloud%20sync))

### Manual Vercel Deployment Steps

1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** ➔ **"Project"**.
4. Import the **`Learn-with-stimulation`** repository.
5. In **Environment Variables**, optionally add:
   - `NEXT_PUBLIC_SUPABASE_URL` = *(Your Supabase project URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Your Supabase public anon key)*
6. Click **Deploy**!

---

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables template:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Database**: Supabase (PostgreSQL & Row Level Security)
- **Deployment**: Vercel
