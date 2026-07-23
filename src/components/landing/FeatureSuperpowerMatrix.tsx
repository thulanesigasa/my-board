'use client';

import React from 'react';

export const FeatureSuperpowerMatrix: React.FC = () => {
  const superpowers = [
    {
      title: 'Freehand Ink Smoothing',
      description: 'Bezier pressure curve smoothing generates natural pen strokes for handwritten notes and diagrams.',
    },
    {
      title: 'Conflict-Free LWW Engine',
      description: 'Last-Write-Wins field CRDT merging guarantees concurrent drawing with zero merge conflicts.',
    },
    {
      title: 'Vector Shapes & Sticky Notes',
      description: 'Place scalable rectangles, circles, straight lines, vector arrows, text boxes, and color-coded sticky notes.',
    },
    {
      title: 'Real-time Multi-Cursors',
      description: 'Stream live cursor positions at 60 FPS over WebSockets with custom name tags and presence avatars.',
    },
    {
      title: 'High-Res SVG & JSON Export',
      description: 'Export vector graphics for documentation or download JSON state backups for room archiving.',
    },
    {
      title: 'Supabase PostgreSQL Backup',
      description: 'Persist rooms securely to PostgreSQL database with Row Level Security (RLS) policies.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white relative z-10 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Core Whiteboard Superpowers
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-16 leading-relaxed font-body">
          Everything you need for seamless real-time visual collaboration in one lightweight web application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {superpowers.map((item, i) => (
            <div key={i} className="glass-card p-8 shadow-lg hover:border-blue-500/50 transition">
              <span className="text-xs font-mono font-bold text-blue-600 block mb-3">
                0{i + 1} / CAPABILITY
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
