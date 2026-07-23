'use client';

import React, { useState } from 'react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does real-time synchronization work without merge conflicts?',
      a: 'my-board utilizes high-frequency Socket.IO WebSockets and Last-Write-Wins (LWW) field CRDT merging. Each shape update contains a timestamp delta so edits merge deterministically across clients.',
    },
    {
      q: 'Is my-board completely free to use?',
      a: 'Yes! my-board is completely open source and free for personal and team whiteboard collaboration with no room limits.',
    },
    {
      q: 'How is canvas data persisted?',
      a: 'Board snapshots and active shapes are automatically saved to Supabase PostgreSQL database tables with Row Level Security (RLS) policies, alongside instant local disk snapshot backups.',
    },
    {
      q: 'Can I export my whiteboards?',
      a: 'Absolutly! You can export your visual board as scalable vector SVG graphics or download a full JSON state backup at any time.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white relative z-10 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12 leading-relaxed font-body">
          Got questions? Here is everything you need to know about my-board real-time architecture.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="glass-card overflow-hidden transition shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 text-left font-bold text-slate-900 flex items-center justify-between gap-4 text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-600 font-mono text-xl font-bold">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed font-body border-t border-slate-100 pt-4">
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
