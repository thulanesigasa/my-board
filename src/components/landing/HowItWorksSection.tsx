'use client';

import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Launch or Join a Room',
      description: 'Create an instant room session or enter a shared room code with zero sign-up friction.',
    },
    {
      number: '02',
      title: 'Draw & Brainstorm Live',
      description: 'Use smooth pressure ink, vector shapes, sticky notes, and live presence cursors with teammates.',
    },
    {
      number: '03',
      title: 'Export & DB Persistence',
      description: 'Download high-resolution SVG or JSON backups with automatic Supabase PostgreSQL snapshot persistence.',
    },
  ];

  return (
    <section className="py-20 bg-white relative z-10 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          How my-board Works
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-16 leading-relaxed font-body">
          Three simple steps to start collaborating seamlessly without merge conflicts or setup delay.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((step, i) => (
            <div key={i} className="glass-card p-8 relative overflow-hidden flex flex-col justify-between h-64">
              <div>
                <span className="text-4xl font-black text-blue-600 font-mono block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-body">
                  {step.description}
                </p>
              </div>

              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-blue-600 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
