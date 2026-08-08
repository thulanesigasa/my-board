'use client';

import React from 'react';

export const TrustStatsBar: React.FC = () => {
  const metrics = [
    {
      number: '120Hz',
      label: 'Refresh Rate Canvas Engine',
      icon: (
        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      number: '< 16ms',
      label: 'Real-Time WebSocket Sync Latency',
      icon: (
        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      number: '99.9%',
      label: 'Supabase RLS Persistence Uptime',
      icon: (
        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      number: '100%',
      label: 'Vector SVG & JSON Export Precision',
      icon: (
        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L11 18l7-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-12 relative z-10 border-y border-slate-800 font-sans shadow-2xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition-all duration-300 shadow-md group"
            >
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                {m.icon}
              </div>
              <div className="space-y-0.5">
                <div className="text-3xl font-black text-white font-heading tracking-tight group-hover:text-blue-400 transition-colors">
                  {m.number}
                </div>
                <div className="text-xs text-slate-400 font-medium font-body leading-snug">
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
