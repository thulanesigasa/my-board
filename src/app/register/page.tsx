'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [career, setCareer] = useState('');
  const [country, setCountry] = useState('');
  const [town, setTown] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error & Loading State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Validator Checklist Rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Calculate Password Strength Score (0 to 4)
  const getPasswordStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase && hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: '', color: 'bg-slate-200', text: '' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (strengthScore === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    if (strengthScore === 3) return { label: 'Strong', color: 'bg-blue-600', text: 'text-blue-600' };
    return { label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setError('Please ensure your password meets all validation requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    const res = await signUp(email, password, {
      firstName,
      surname,
      age,
      career,
      country,
      town,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient Reflections */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-tight text-slate-900 block mb-2 font-heading">
            my-board
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
            Create your account
          </h1>
          <p className="text-slate-600 text-sm mt-2 font-body">
            Join my-board to collaborate in real-time with high-frequency 120Hz canvas tools
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* 1. Name & Surname Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  Surname *
                </label>
                <input
                  type="text"
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>
            </div>

            {/* 2. Age & Career Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="13"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  Career / Profession *
                </label>
                <input
                  type="text"
                  required
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  placeholder="UI Designer / Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>
            </div>

            {/* 3. Location Row: Country & Town */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                  Town / City *
                </label>
                <input
                  type="text"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
              </div>
            </div>

            {/* 4. Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@myboard.dev"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
              />
            </div>

            {/* 5. Password & Show/Hide Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-blue-600 px-2 py-1 transition"
                >
                  {showPassword ? 'Hide' : 'View'}
                </button>
              </div>

              {/* Password Strength Progress Bar */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Real-time Password Validator Checklist */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  <span>{hasMinLength ? '[v]' : '[ ]'}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  <span>{hasUppercase ? '[v]' : '[ ]'}</span>
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  <span>{hasLowercase ? '[v]' : '[ ]'}</span>
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  <span>{hasNumber ? '[v]' : '[ ]'}</span>
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  <span>{hasSpecialChar ? '[v]' : '[ ]'}</span>
                  <span>Special char (!@#$)</span>
                </div>
              </div>
            </div>

            {/* 6. Confirm Password & Show/Hide Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-heading">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-blue-600 px-2 py-1 transition"
                >
                  {showConfirmPassword ? 'Hide' : 'View'}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p className={`text-[10px] font-mono mt-1.5 font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center !py-3.5 shadow-lg font-heading"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6 font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
