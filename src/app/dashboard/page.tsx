'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [newRoomTitle, setNewRoomTitle] = useState('');

  const [savedRooms] = useState([
    { id: 'arch-design-v1', title: 'Software System Architecture', shapes: 42, updated: '2 hours ago' },
    { id: 'ux-sprint-retro', title: 'UX Sprint Retrospective', shapes: 18, updated: 'Yesterday' },
    { id: 'db-schema-brainstorm', title: 'Database Schema Brainstorming', shapes: 29, updated: '3 days ago' },
  ]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const roomId = newRoomTitle.trim()
      ? newRoomTitle.toLowerCase().replace(/\s+/g, '-')
      : `room-${Math.random().toString(36).substring(2, 8)}`;
    router.push(`/board/${roomId}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
            my-board
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-body">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold font-heading"
                style={{ backgroundColor: user?.avatarColor || '#F97316' }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="font-semibold text-slate-800 hidden sm:inline">{user?.name || 'User Profile'}</span>
            </div>

            <button
              onClick={() => signOut()}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-body"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Create Room Banner */}
        <div className="glass-card p-8 sm:p-10 shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Welcome back, {user?.name || 'Collaborator'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-body max-w-lg leading-relaxed">
              Create a new 120Hz high-refresh collaborative whiteboard room session or continue working on your saved boards.
            </p>
          </div>

          <form onSubmit={handleCreateRoom} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              placeholder="Enter new room name..."
              className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body shadow-sm min-w-[220px]"
            />
            <button type="submit" className="btn-primary text-xs !py-3 !px-6 whitespace-nowrap font-heading justify-center">
              + Launch New Board
            </button>
          </form>
        </div>

        {/* Saved Whiteboard Rooms Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Your Whiteboard Sessions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedRooms.map((room) => (
              <Link key={room.id} href={`/board/${room.id}`}>
                <div className="glass-card p-6 shadow-md hover:border-orange-500/40 hover:shadow-lg transition space-y-4 group cursor-pointer border border-slate-200">
                  <div className="h-32 rounded-xl bg-slate-900/90 p-4 border border-slate-800 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="text-[10px] font-mono text-orange-400 uppercase font-bold tracking-wider">
                      120Hz Canvas Active
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      {room.shapes} shapes synced
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-heading group-hover:text-orange-500 transition">
                      {room.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1">
                      <span>Room ID: {room.id}</span>
                      <span>{room.updated}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
