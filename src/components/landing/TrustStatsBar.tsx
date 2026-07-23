'use client';

import React from 'react';

export const TrustStatsBar: React.FC = () => {
  const stats = [
    { label: 'Active Whiteboard Rooms', value: '10,000+' },
    { label: 'Real-time Uptime SLA', value: '99.99%' },
    { label: 'Conflict-Free Delay', value: '0ms' },
    { label: 'Pressure Ink FPS', value: '60 FPS' },
  ];

  return (
    <section className="bg-slate-900 text-white py-10 relative z-10 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-blue-400 font-mono tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
