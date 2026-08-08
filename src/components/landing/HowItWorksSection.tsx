'use client';

import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Create or Join Room',
      description: 'Enter a room name or launch directly. Share the unique room link with team members for instant session pairing.',
    },
    {
      number: '02',
      title: 'Draw & Brainstorm Live',
      description: 'Use 120Hz smooth ink, sticky notes, and vector shapes. Multi-user cursor presence shows team activity in real-time.',
    },
    {
      number: '03',
      title: 'Export & Persist State',
      description: 'Download crisp SVG diagrams, JSON snapshots, or save room state automatically to PostgreSQL DB via Supabase.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          How my-board Works In 3 Steps
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-16 leading-relaxed font-body">
          Simple, friction-free real-time collaboration with zero complex setup.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card p-8 relative flex flex-col justify-between shadow-lg hover:border-orange-500/40 transition">
              <div>
                <span className="text-4xl font-black text-orange-500 font-mono block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Step {step.number} of 03</span>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
