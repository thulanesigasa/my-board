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
  Layers,
  Palette,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchInstantBoard = () => {
    const roomId = `room_${Date.now().toString(36)}`;
    router.push(`/board/${roomId}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            my-board
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-slate-900"
          >
            Sign In
          </Link>
          <button
            onClick={handleLaunchInstantBoard}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Canvas</span>
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-8 shadow-inner">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Conflict-Free Real-Time Multiplayer Whiteboard</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-6">
          Collaborate, draw, and brainstorm with zero merge conflicts.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Powered by high-frequency Socket.IO presence, dual-layer ink smoothing, vector shapes, sticky notes, and Supabase PostgreSQL persistence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={handleLaunchInstantBoard}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-3 text-sm group"
          >
            <span>Start Blank Whiteboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-2xl transition text-sm flex items-center justify-center"
          >
            Create Free Account
          </Link>
        </div>

        {/* Dynamic Feature Preview Graphic */}
        <div className="mt-16 w-full max-w-4xl bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="h-64 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800/60 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

            {/* Mock Vector Shapes & Sticky Note */}
            <div className="absolute top-12 left-16 w-36 h-36 rounded-2xl bg-amber-200/90 border border-amber-400 p-3 shadow-xl transform -rotate-3 text-slate-900 font-medium text-xs">
              📌 Design Review Notes
              <ul className="mt-2 text-[10px] space-y-1 opacity-80">
                <li>• Freehand ink smoothing</li>
                <li>• Realtime live cursors</li>
              </ul>
            </div>

            <div className="absolute bottom-16 right-24 w-48 h-28 rounded-2xl border-2 border-indigo-500 bg-indigo-500/10 flex items-center justify-center text-indigo-300 font-bold text-sm shadow-xl">
              System Architecture
            </div>

            {/* Mock Multi-Cursors */}
            <div className="absolute top-20 right-36 flex items-start gap-1">
              <MousePointer2 className="w-5 h-5 text-emerald-400 fill-emerald-400 drop-shadow-md" />
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-md">
                Sarah (Architect)
              </span>
            </div>

            <div className="absolute bottom-12 left-44 flex items-start gap-1">
              <MousePointer2 className="w-5 h-5 text-purple-400 fill-purple-400 drop-shadow-md" />
              <span className="px-2 py-0.5 rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-md">
                Alex (Designer)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Multi-Cursor Presence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track active collaborators in real time with custom user colors, avatar initials, and smooth cursor movement.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Conflict-Free LWW Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Last-Write-Wins field merging guarantees multiple users can draw, move, and edit shapes simultaneously without merge conflicts.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Supabase PostgreSQL Backup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Persist your board rooms and shapes securely to Supabase PostgreSQL database with instant snapshot hydration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        © 2026 my-board. Built with Next.js, Socket.IO & Supabase.
      </footer>
    </main>
  );
}
