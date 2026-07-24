'use client';

import React, { useState } from 'react';

export const UseCaseShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brainstorm' | 'architecture' | 'sprint'>('brainstorm');

  const useCases = {
    brainstorm: {
      title: 'UX/UI Brainstorming & Wireframes',
      description: 'Map out user journeys, sticky notes, and freehand pressure wireframes simultaneously with your design team.',
      highlights: ['120Hz freehand smooth stroke ink', 'Color-coded sticky notes', 'Live multiplayer cursor tags'],
      mockup: 'UX Wireframe & Journey Map Session',
    },
    architecture: {
      title: 'Software System Architecture & WebSockets',
      description: 'Diagram complex cloud microservices, database schemas, and Socket.IO real-time event streaming flows.',
      highlights: ['Vector Rectangles & Arrows', 'Supabase PostgreSQL persistence', 'Export SVG vector diagrams'],
      mockup: 'Microservices & Database Architecture',
    },
    sprint: {
      title: 'Agile Sprint Planning & Retrospectives',
      description: 'Organize sprint backlogs, feature prioritization grids, and retrospective feedback cards with your agile team.',
      highlights: ['Drag & drop state sync', 'Conflict-free LWW engine', 'Unlimited room sessions'],
      mockup: 'Sprint Backlog & Retrospective Board',
    },
  };

  const current = useCases[activeTab];

  return (
    <section id="use-cases" className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Built For Modern Team Workflows
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-10 leading-relaxed font-body">
          Explore how engineering, design, and product teams use my-board to accelerate collaboration.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab('brainstorm')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'brainstorm'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'glass-card text-slate-700 hover:border-blue-500/40'
            }`}
          >
            UX Brainstorming
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'glass-card text-slate-700 hover:border-blue-500/40'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'sprint'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'glass-card text-slate-700 hover:border-blue-500/40'
            }`}
          >
            Agile Sprint Planning
          </button>
        </div>

        {/* Display Card */}
        <div className="glass-card p-8 text-left shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
              {current.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              {current.description}
            </p>

            <div className="pt-2 space-y-2">
              {current.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800 font-body">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
            <div className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider">
              {current.mockup}
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs">
              Live WebSocket Sync Active - 120Hz High-Refresh Cursor Stream
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
