'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    career: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'United States',
    town: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  // Password Strength & Validation Calculations
  const password = formData.password;
  const validations = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    matchConfirm: password.length > 0 && password === formData.confirmPassword,
  };

  const strengthScore = Object.values(validations).filter(Boolean).length;

  const getStrengthMeta = () => {
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (strengthScore <= 4) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong', color: 'bg-orange-500', text: 'text-orange-500' };
  };

  const strengthMeta = getStrengthMeta();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validations.minLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!validations.matchConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(formData.email, formData.password, {
        firstName: formData.name,
        surname: formData.surname,
        age: formData.age,
        career: formData.career,
        country: formData.country,
        town: formData.town,
      });

      if (res?.error) {
        setError(typeof res.error === 'string' ? res.error : 'Registration failed.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-12 px-6 flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl glass-card p-8 sm:p-12 shadow-2xl relative z-10 space-y-8 border border-slate-200">
        <div className="text-center space-y-2">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 font-heading inline-block">
            my-board
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Create Account</h1>
          <p className="text-xs text-slate-600 font-body">
            Fill out your profile details to join collaborative room sessions
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Multi-Column Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                First Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Surname *
              </label>
              <input
                type="text"
                name="surname"
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Age
              </label>
              <input
                type="number"
                name="age"
                min={13}
                max={120}
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Career / Profession
              </label>
              <input
                type="text"
                name="career"
                value={formData.career}
                onChange={handleChange}
                placeholder="Software Architect / UX Designer"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>South Africa</option>
                <option>Japan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Town / City
              </label>
              <input
                type="text"
                name="town"
                value={formData.town}
                onChange={handleChange}
                placeholder="San Francisco"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane.doe@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
            />
          </div>

          {/* Password & Show/Hide Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                  Password *
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
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                  Confirm Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[11px] font-semibold text-orange-500 hover:underline font-body"
                >
                  {showConfirmPassword ? 'Hide' : 'View'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-body transition"
              />
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-body">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 font-heading">Password Strength:</span>
                <span className={strengthMeta.text}>{strengthMeta.label}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                  style={{ width: `${(strengthScore / 6) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={validations.minLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.minLength ? '✓' : '○'} At least 8 characters
                </div>
                <div className={validations.hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.hasUpper ? '✓' : '○'} Upper case letter
                </div>
                <div className={validations.hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.hasLower ? '✓' : '○'} Lower case letter
                </div>
                <div className={validations.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.hasNumber ? '✓' : '○'} Number
                </div>
                <div className={validations.hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.hasSpecial ? '✓' : '○'} Special character
                </div>
                <div className={validations.matchConfirm ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {validations.matchConfirm ? '✓' : '○'} Passwords match
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center !py-3.5 shadow-lg text-xs font-heading"
          >
            {loading ? 'Registering Account...' : 'Complete Profile & Sign Up'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600 font-body">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-orange-500 hover:underline font-heading">
            Sign In Here
          </Link>
        </div>
      </div>
    </main>
  );
}
