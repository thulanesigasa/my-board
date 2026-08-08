'use client';

import React, { useState } from 'react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do collaborators need an account to join a room?',
      a: 'No sign-up is required to join collaborative room sessions. Simply share the room link with teammates to start whiteboarding instantly.',
    },
    {
      q: 'How does real-time multiplayer synchronization work?',
      a: 'We use Socket.IO WebSockets paired with a Last-Write-Wins CRDT engine. State deltas and cursor coordinates stream with less than 16ms latency.',
    },
    {
      q: 'Can I export whiteboard diagrams as vector graphics?',
      a: 'Yes. You can export your whiteboard sessions at any time into clean vector SVG files or JSON state snapshots.',
    },
    {
      q: 'Are room whiteboard sessions saved permanently?',
      a: 'Yes. Board data is persisted to Supabase PostgreSQL database tables protected by Row Level Security (RLS) policies.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[var(--color-bg)] relative z-10 font-sans">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12 leading-relaxed font-body">
          Everything you need to know about real-time whiteboarding with my-board.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="glass-card overflow-hidden transition shadow-sm border border-slate-200/80">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-bold text-slate-900 flex items-center justify-between gap-4 text-base focus:outline-none hover:text-orange-500 transition"
                >
                  <span className="font-heading">{faq.q}</span>
                  <span className={`text-orange-500 font-mono text-xl font-bold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-body border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
