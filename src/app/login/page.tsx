'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res?.error) {
        setError(typeof res.error === 'string' ? res.error : 'Invalid email or password credentials.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected sign-in error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 sm:p-10 shadow-2xl relative z-10 space-y-8 border border-slate-200">
        <div className="text-center space-y-2">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 font-heading inline-block">
            my-board
          </Link>
          <h1 className="text-xl font-bold text-slate-900 font-heading">Welcome Back</h1>
          <p className="text-xs text-slate-600 font-body">
            Sign in to access your saved collaborative whiteboard rooms
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-orange-500 hover:underline font-body"
              >
                {showPassword ? 'Hide' : 'View'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center !py-3.5 shadow-lg text-xs font-heading"
          >
            {loading ? 'Signing In...' : 'Sign In To Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600 font-body">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-orange-500 hover:underline font-heading">
            Create Free Account
          </Link>
        </div>
      </div>
    </main>
  );
}
