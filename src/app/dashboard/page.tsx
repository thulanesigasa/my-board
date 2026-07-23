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
    { id: 'design-sprint', title: 'UX Design Sprint & Wireframes', updatedAt: '2 hours ago', items: 24, color: 'from-blue-500/10 to-indigo-500/10' },
    { id: 'architecture-diagram', title: 'System Architecture & WebSockets', updatedAt: 'Yesterday', items: 42, color: 'from-slate-200/50 to-blue-500/10' },
    { id: 'brainstorming-session', title: 'Product Roadmap & Ideas', updatedAt: '3 days ago', items: 15, color: 'from-blue-500/10 to-slate-200/50' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 md:p-12 relative overflow-hidden font-sans">
      {/* 60-30-10 Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-slate-300/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Glass Header Bar */}
        <header className="flex items-center justify-between pb-8 mb-10 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-600/30">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              my-board
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass-card px-3.5 py-1.5 shadow-sm">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shadow-sm"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
                className="p-2.5 rounded-xl glass-card text-slate-500 hover:text-red-600 hover:border-red-200 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-xs !py-2.5 !px-5"
            >
              Sign In
            </Link>
          )}
        </header>

        {/* Section Header 01 */}
        <div className="flex items-center justify-between mb-6">
          <span className="section-number">01 / INSTANT LAUNCH</span>
        </div>

        {/* Quick Action Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Launch New Board Card */}
          <div
            onClick={createNewBoard}
            className="md:col-span-2 group glass-card p-8 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden hover:border-blue-500/60"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition text-blue-600 pointer-events-none">
              <Sparkles className="w-40 h-40" />
            </div>
            <div className="relative z-10 text-left">
              <div className="badge mb-4">
                <Plus className="w-3.5 h-3.5" />
                <span>INSTANT ROOM CREATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Create New Collaborative Whiteboard
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mb-6 leading-relaxed font-body">
                Start drawing freehand pressure ink, placing vector shapes, text, sticky notes, and inviting teammates instantly.
              </p>
              <button className="btn-primary text-xs justify-center group-hover:bg-blue-700 transition">
                <span>Launch Board Canvas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          {/* Join Existing Room Card */}
          <div className="glass-card p-8 flex flex-col justify-between shadow-xl text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Join Session</h3>
              <p className="text-slate-600 text-xs mb-4 font-body">Enter a room code or URL to join live</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="e.g. room_123"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={!joinRoomId.trim()}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition"
              >
                Join Room Session
              </button>
            </form>
          </div>
        </div>

        {/* Section Header 02 */}
        <div className="flex items-center justify-between mb-6">
          <span className="section-number">02 / RECENT BOARDS GALLERY</span>
        </div>

        {/* Recent Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {recentBoards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group glass-card p-6 hover:border-blue-500/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-52 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${board.color} opacity-40 group-hover:opacity-70 transition`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge text-[10px] !py-0.5 !px-2 font-mono">
                    {board.items} items
                  </span>
                  <Palette className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <h4 className="font-bold text-slate-900 transition text-base line-clamp-2">
                  {board.title}
                </h4>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                <span className="font-mono text-[11px]">{board.updatedAt}</span>
                <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
