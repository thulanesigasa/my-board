'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, UserPlus, AlertCircle } from 'lucide-react';
import { getRandomAvatarColor } from '@/lib/supabase/client';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const previewColor = email ? getRandomAvatarColor(email) : '#6366F1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signUp(email, password, name || email.split('@')[0]);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Create your account
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Join my-board to create & share live interactive whiteboards
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 border border-white/20 shadow-md"
                  style={{ backgroundColor: previewColor }}
                  title="Your live cursor avatar color"
                >
                  {(name || email || 'A').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@myboard.dev"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
