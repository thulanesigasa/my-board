'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TrustStatsBar } from '@/components/landing/TrustStatsBar';
import { InteractiveSandbox } from '@/components/landing/InteractiveSandbox';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { UseCaseShowcase } from '@/components/landing/UseCaseShowcase';
import { FeatureSuperpowerMatrix } from '@/components/landing/FeatureSuperpowerMatrix';
import { ComparisonMatrix } from '@/components/landing/ComparisonMatrix';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [roomInput, setRoomInput] = useState('');
  const router = useRouter();

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = roomInput.trim() || `room-${Math.random().toString(36).substring(2, 8)}`;
    router.push(`/board/${targetRoom}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden font-sans">
      {/* 60-30-10 Ambient Background Reflections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Floating Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
            my-board
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 font-body">
            <a href="#sandbox" className="hover:text-blue-600 transition">Interactive Sandbox</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#use-cases" className="hover:text-blue-600 transition">Use Cases</a>
            <a href="#features" className="hover:text-blue-600 transition">Workbench Engine</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 transition font-body"
            >
              Sign In
            </Link>
            <button onClick={handleLaunch} className="btn-primary text-xs !py-2.5 !px-5 font-heading">
              <span>Launch Whiteboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. Main Hero Section */}
      <section className="relative pt-20 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-xs font-semibold text-blue-700">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Real-time WebSocket & Supabase PostgreSQL Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.15] mb-6 font-heading tracking-tight">
          Collaborative Whiteboarding <br />
          <span className="gradient-text">Built For Modern Teams</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-body">
          Draw smooth Bezier pressure ink, create vector shapes, write sticky notes, and stream multi-user cursor tags in real-time with Last-Write-Wins CRDT sync.
        </p>

        {/* Room Launch Form */}
        <form onSubmit={handleLaunch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room code or leave blank..."
            className="flex-1 px-5 py-3.5 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-body shadow-sm"
          />
          <button type="submit" className="btn-primary text-xs !py-3.5 justify-center shadow-lg font-heading">
            <span>Start Collaborating</span>
          </button>
        </form>
      </section>

      {/* 2. Authentic Tech Specs Bar */}
      <TrustStatsBar />

      {/* 3. Interactive Sandbox Demo */}
      <InteractiveSandbox />

      {/* 4. How It Works Timeline */}
      <HowItWorksSection />

      {/* 5. Team Use Cases Showcase */}
      <UseCaseShowcase />

      {/* 6. Unified Canvas Workbench Board */}
      <FeatureSuperpowerMatrix />

      {/* 7. Comparison Matrix */}
      <ComparisonMatrix />

      {/* 8. FAQ Accordion */}
      <FaqAccordion />

      {/* 9. High-Converting Bottom CTA Banner */}
      <section className="py-20 bg-slate-900 text-white relative z-10 font-sans">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
            Ready to Start Whiteboarding?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-body leading-relaxed">
            Create an instant collaborative room session with zero configuration or sign in for persistent cloud whiteboard saves.
          </p>
          <div>
            <button onClick={handleLaunch} className="btn-primary text-sm !py-3.5 !px-8 shadow-2xl font-heading">
              <span>Create Whiteboard Room Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. Portflio-Style Multi-Column Footer */}
      <Footer />
    </main>
  );
}
