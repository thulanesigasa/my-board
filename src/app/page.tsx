'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchInstantBoard = () => {
    const roomId = `room_${Date.now().toString(36)}`;
    router.push(`/board/${roomId}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 60-30-10 Subtle Ambient Reflections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glass Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-600/30">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            my-board
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-4 py-2 rounded-full hover:bg-slate-200/50"
          >
            Sign In
          </Link>
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary text-xs !py-2.5 !px-5"
          >
            Launch Canvas
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl text-slate-900 mb-6">
          Real-time collaborative drawing with zero merge conflicts.
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-body">
          Powered by high-frequency Socket.IO presence, dual-layer ink smoothing, vector shapes, sticky notes, and Supabase PostgreSQL persistence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary w-full sm:w-auto text-sm justify-center"
          >
            Start Blank Whiteboard
          </button>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 glass-card text-slate-700 font-bold rounded-full transition text-sm flex items-center justify-center hover:border-blue-500/50 hover:text-slate-900"
          >
            Create Free Account
          </Link>
        </div>

        {/* Dynamic Glassmorphic Whiteboard Graphic */}
        <div className="mt-16 w-full max-w-4xl glass-card p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="h-64 sm:h-96 rounded-2xl bg-white border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

            {/* Mock Vector Shapes & Sticky Note */}
            <div className="absolute top-14 left-16 w-40 h-40 rounded-2xl bg-amber-100 border border-amber-300 p-4 shadow-xl transform -rotate-3 text-slate-900 font-medium text-xs">
              Design Review Notes
              <ul className="mt-2 text-[10px] space-y-1 text-slate-700 font-mono">
                <li>• Freehand ink smoothing</li>
                <li>• Realtime live cursors</li>
                <li>• LWW state sync</li>
              </ul>
            </div>

            <div className="absolute bottom-16 right-24 w-52 h-32 rounded-2xl border-2 border-blue-600 bg-blue-50/90 backdrop-blur-md flex flex-col items-center justify-center text-blue-900 font-bold text-sm shadow-xl">
              <span>System Architecture</span>
              <span className="text-[10px] font-mono text-blue-700 mt-1">Socket.IO + Supabase DB</span>
            </div>

            {/* Mock Multi-Cursors */}
            <div className="absolute top-20 right-36 flex items-start gap-1">
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-md flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Sarah (Architect)</span>
              </div>
            </div>

            <div className="absolute bottom-12 left-44 flex items-start gap-1">
              <div className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Alex (Designer)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Engineered for perfection</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Cursor Presence</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Track active collaborators in real time with custom user colors, avatar initials, and smooth 60 FPS cursor movement.
            </p>
          </div>

          <div className="glass-card p-8 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Conflict-Free LWW Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Last-Write-Wins field merging guarantees multiple users can draw, move, and edit shapes simultaneously without merge conflicts.
            </p>
          </div>

          <div className="glass-card p-8 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Supabase PostgreSQL Backup</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Persist your board rooms and shapes securely to Supabase PostgreSQL database with instant snapshot hydration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-mono bg-white/50">
        © 2026 my-board • Built with Next.js, Socket.IO & Supabase.
      </footer>
    </main>
  );
}
