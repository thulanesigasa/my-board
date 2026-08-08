'use client';

import React from 'react';

export const TrustStatsBar: React.FC = () => {
  const metrics = [
    {
      number: '120Hz',
      label: 'Refresh Rate Canvas Engine',
    },
    {
      number: '< 16ms',
      label: 'Real-Time WebSocket Sync Latency',
    },
    {
      number: '99.9%',
      label: 'Supabase RLS Persistence Uptime',
    },
    {
      number: '100%',
      label: 'Vector SVG & JSON Export Precision',
    },
  ];

  return (
    <section className="py-12 relative z-10 border-y border-slate-200/80 bg-transparent font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                {m.number}
              </div>
              <div className="text-xs text-slate-600 font-medium font-body leading-snug">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
