'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { TrustStatsBar } from '@/components/landing/TrustStatsBar';
import { InteractiveSandbox } from '@/components/landing/InteractiveSandbox';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { UseCaseShowcase } from '@/components/landing/UseCaseShowcase';
import { FeatureSuperpowerMatrix } from '@/components/landing/FeatureSuperpowerMatrix';
import { ComparisonMatrix } from '@/components/landing/ComparisonMatrix';
import { FaqAccordion } from '@/components/landing/FaqAccordion';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchInstantBoard = () => {
    const roomId = `room_${Date.now().toString(36)}`;
    router.push(`/board/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans">
      {/* 1. Floating Header Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-slate-900">
          my-board
        </span>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-4 py-2 rounded-full hover:bg-slate-200/50"
          >
            Sign In
          </Link>
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary text-xs !py-2.5 !px-5"
          >
            Launch Canvas
          </button>
        </div>
      </header>

      {/* 2. Main Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl text-slate-900 mb-6">
          Real-time collaborative drawing with zero merge conflicts.
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-body">
          Powered by high-frequency Socket.IO presence, dual-layer ink smoothing, vector shapes, sticky notes, and Supabase PostgreSQL persistence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={handleLaunchInstantBoard}
            className="btn-primary w-full sm:w-auto text-sm justify-center"
          >
            Start Blank Whiteboard
          </button>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 glass-card text-slate-700 font-bold rounded-full transition text-sm flex items-center justify-center hover:border-blue-500/50 hover:text-slate-900"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* 3. Social Proof & Trust Metrics Bar */}
      <TrustStatsBar />

      {/* 4. Live Interactive Canvas Sandbox */}
      <InteractiveSandbox />

      {/* 5. 3-Step "How It Works" Timeline */}
      <HowItWorksSection />

      {/* 6. Team Use Cases & Workflows Showcase */}
      <UseCaseShowcase />

      {/* 7. Superpower Feature Matrix */}
      <FeatureSuperpowerMatrix />

      {/* 8. Comparison Matrix (my-board vs Legacy) */}
      <ComparisonMatrix />

      {/* 9. Expandable FAQ Accordion */}
      <FaqAccordion />

      {/* 10. Bottom High-Converting CTA Banner */}
      <section className="py-20 bg-slate-900 text-white text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to collaborate in real time?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto font-body">
            Join thousands of teams drawing, diagramming, and brainstorming with zero merge conflicts.
          </p>
          <div className="pt-4">
            <button
              onClick={handleLaunchInstantBoard}
              className="btn-primary text-sm !py-3.5 !px-8 shadow-2xl"
            >
              Launch Board Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* 11. Multi-Column Footer (portflio styled) */}
      <Footer />
    </div>
  );
}
