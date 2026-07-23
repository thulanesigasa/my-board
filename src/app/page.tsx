'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Zap,
  Users,
  ShieldCheck,
  MousePointer2,
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchInstantBoard = () => {
    const roomId = `room_${Date.now().toString(36)}`;
    router.push(`/board/${roomId}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-white relative overflow-hidden flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glass Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/30">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight gradient-text">
            my-board
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition px-4 py-2 rounded-full hover:bg-white/5"
          >
            Sign In
          </Link>
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary text-xs !py-2.5 !px-5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Canvas</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center flex flex-col items-center">
        <div className="badge mb-8">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>CONFLICT-FREE MULTIPLAYER ENGINE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl gradient-text mb-6">
          Real-time collaborative drawing with zero merge conflicts.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-body">
          Powered by high-frequency Socket.IO presence, dual-layer ink smoothing, vector shapes, sticky notes, and Supabase PostgreSQL persistence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary w-full sm:w-auto text-sm justify-center group"
          >
            <span>Start Blank Whiteboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 glass-card text-slate-200 font-bold rounded-full transition text-sm flex items-center justify-center hover:border-indigo-500/50"
          >
            Create Free Account
          </Link>
        </div>

        {/* Dynamic Glassmorphic Whiteboard Graphic */}
        <div className="mt-16 w-full max-w-4xl glass-card p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="h-64 sm:h-96 rounded-2xl bg-slate-950 border border-white/5 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

            {/* Section Tag */}
            <div className="absolute top-4 left-4 section-number">01 / LIVE PREVIEW</div>

            {/* Mock Vector Shapes & Sticky Note */}
            <div className="absolute top-14 left-16 w-40 h-40 rounded-2xl bg-amber-200/90 border border-amber-400 p-4 shadow-xl transform -rotate-3 text-slate-900 font-medium text-xs">
              📌 Design Review Notes
              <ul className="mt-2 text-[10px] space-y-1 opacity-80 font-mono">
                <li>• Freehand ink smoothing</li>
                <li>• Realtime live cursors</li>
                <li>• LWW state sync</li>
              </ul>
            </div>

            <div className="absolute bottom-16 right-24 w-52 h-32 rounded-2xl border-2 border-indigo-500 bg-indigo-500/10 backdrop-blur-md flex flex-col items-center justify-center text-indigo-300 font-bold text-sm shadow-xl">
              <span>System Architecture</span>
              <span className="text-[10px] font-mono text-indigo-400 mt-1">Socket.IO + Supabase DB</span>
            </div>

            {/* Mock Multi-Cursors */}
            <div className="absolute top-20 right-36 flex items-start gap-1">
              <MousePointer2 className="w-5 h-5 text-emerald-400 fill-emerald-400 drop-shadow-md" />
              <div className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Sarah (Architect)</span>
              </div>
            </div>

            <div className="absolute bottom-12 left-44 flex items-start gap-1">
              <MousePointer2 className="w-5 h-5 text-purple-400 fill-purple-400 drop-shadow-md" />
              <div className="px-2 py-0.5 rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Alex (Designer)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <span className="section-number mb-2 inline-block">02 / CORE CAPABILITIES</span>
            <h2 className="text-3xl font-extrabold text-white">Engineered for perfection</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Cursor Presence</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Track active collaborators in real time with custom user colors, avatar initials, and smooth 60 FPS cursor movement.
            </p>
          </div>

          <div className="glass-card p-8 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Conflict-Free LWW Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Last-Write-Wins field merging guarantees multiple users can draw, move, and edit shapes simultaneously without merge conflicts.
            </p>
          </div>

          <div className="glass-card p-8 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Supabase PostgreSQL Backup</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Persist your board rooms and shapes securely to Supabase PostgreSQL database with instant snapshot hydration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-8 text-center text-xs text-slate-500 font-mono">
        © 2026 my-board • Built with Next.js, Socket.IO & Supabase.
      </footer>
    </main>
  );
}
