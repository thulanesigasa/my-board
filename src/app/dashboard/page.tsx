'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  LogOut,
  Layers,
  Palette,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [joinRoomId, setJoinRoomId] = useState('');

  const createNewBoard = () => {
    const newRoomId = `room_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    router.push(`/board/${newRoomId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      router.push(`/board/${joinRoomId.trim()}`);
    }
  };

  const recentBoards = [
    { id: 'design-sprint', title: 'UX Design Sprint & Wireframes', updatedAt: '2 hours ago', items: 24, color: 'from-indigo-500/20 to-purple-500/20' },
    { id: 'architecture-diagram', title: 'System Architecture & WebSockets', updatedAt: 'Yesterday', items: 42, color: 'from-emerald-500/20 to-teal-500/20' },
    { id: 'brainstorming-session', title: 'Product Roadmap & Ideas', updatedAt: '3 days ago', items: 15, color: 'from-amber-500/20 to-orange-500/20' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation Header */}
        <header className="flex items-center justify-between pb-8 mb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              my-board
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-3 py-1.5 shadow-md">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-200">{user.name}</p>
                  <p className="text-slate-400 font-mono text-[10px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition"
            >
              Sign In
            </Link>
          )}
        </header>

        {/* Hero Quick Action Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Create New Board Card */}
          <div
            onClick={createNewBoard}
            className="md:col-span-2 group bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/40 border border-indigo-500/30 hover:border-indigo-500/70 rounded-3xl p-8 cursor-pointer shadow-2xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition text-indigo-400">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
                <Plus className="w-3.5 h-3.5" />
                <span>Instant Real-Time Room</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Create New Whiteboard
              </h2>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Start drawing freehand ink, placing vector shapes, text, sticky notes, and inviting teammates instantly.
              </p>
              <button className="px-6 py-3 bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 text-sm">
                <span>Launch Board Canvas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          {/* Join Existing Room Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Join Room</h3>
              <p className="text-slate-400 text-xs mb-4">Enter a room code or URL to join live</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="e.g. room_123"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!joinRoomId.trim()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
              >
                Join Room Session
              </button>
            </form>
          </div>
        </div>

        {/* Recent Boards Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Recent Boards</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBoards.map((board) => (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between h-48 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${board.color} opacity-40 group-hover:opacity-70 transition`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                      {board.items} items
                    </span>
                    <Palette className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition" />
                  </div>
                  <h4 className="font-bold text-slate-100 group-hover:text-white transition text-base line-clamp-2">
                    {board.title}
                  </h4>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  <span>{board.updatedAt}</span>
                  <span className="text-indigo-400 font-medium group-hover:translate-x-0.5 transition flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
