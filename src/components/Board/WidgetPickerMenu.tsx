'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolType } from '@/types/board';
import {
  Smartphone,
  GitFork,
  Table as TableIcon,
  Clock,
  Kanban as KanbanIcon,
  FileText,
  Presentation,
  Target,
  Video,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface WidgetPickerMenuProps {
  onSelectWidget: (tool: ToolType, templateTitle?: string) => void;
}

export const WIDGET_TEMPLATES: Record<ToolType, { title: string; desc: string }[]> = {
  prototype: [
    { title: 'Mobile App Sign-up Flow', desc: '4-step mobile onboarding screens with hotspots' },
    { title: 'E-commerce Checkout Wireframe', desc: 'Cart, shipping & payment screen prototype' },
    { title: 'SaaS Dashboard Navigation', desc: 'Sidebar navigation & metrics screen' },
    { title: 'Social Feed Screen', desc: 'Card feed with likes & comments interactions' },
    { title: 'Settings Profile View', desc: 'Account preferences & avatar editor' },
  ],
  diagram: [
    { title: 'Microservices Flow', desc: 'Client → Socket WS → PostgreSQL DB architecture' },
    { title: 'User Authentication State', desc: 'Login, token refresh & Supabase RLS decision tree' },
    { title: 'Payment Gateway Decision Tree', desc: 'Stripe webhook handling & fallback retry' },
    { title: 'CI/CD Deployment Pipeline', desc: 'Build, lint, test & Vercel deployment' },
    { title: 'Customer Support Escalation', desc: 'Triage ticket routing & response SLA' },
  ],
  table: [
    { title: 'Sprint Task Matrix', desc: 'Task, status, owner & priority matrix' },
    { title: 'Feature Comparison Matrix', desc: 'My-board vs competitors specs' },
    { title: 'Bug Triage Log', desc: 'Severity, module & fix release version' },
    { title: 'Project Budget Breakdown', desc: 'Item, category, cost & variance' },
    { title: 'Team Member Directory', desc: 'Name, role, time zone & status' },
  ],
  timeline: [
    { title: 'Q1-Q4 Product Roadmap', desc: 'Quarterly milestones & deliverables' },
    { title: 'Agile Release Sprint Sequence', desc: 'Sprint 1 through Sprint 6 release dates' },
    { title: 'Marketing Campaign Launch', desc: 'Teaser, launch day & post-launch tasks' },
    { title: 'Engineering Migration Steps', desc: 'Database schema migration timeline' },
    { title: 'Client Onboarding Journey', desc: 'Kickoff to final signoff milestones' },
  ],
  kanban: [
    { title: 'Agile Sprint Backlog', desc: 'To Do, In Progress & Done columns' },
    { title: 'Bug Tracking Pipeline', desc: 'Reported, Triaged, In Fix, QA & Released' },
    { title: 'Content Editorial Calendar', desc: 'Idea, Writing, Review, Scheduled & Published' },
    { title: 'Sales CRM Pipeline', desc: 'Leads, Contacted, Qualified, Proposal & Closed' },
    { title: 'Hiring Recruitment Funnel', desc: 'Applied, Screening, Interview & Offer' },
  ],
  doc: [
    { title: 'Product Requirement Doc (PRD)', desc: 'Goals, specs, user stories & acceptance' },
    { title: 'Engineering Architecture RFC', desc: 'Technical design, trade-offs & security' },
    { title: 'Meeting Agenda & Action Items', desc: 'Attendees, discussion topics & assigned tasks' },
    { title: 'User Research Findings', desc: 'Participant quotes, insights & recommendations' },
    { title: 'Release Notes & Changelog', desc: 'Version history, new features & bug fixes' },
  ],
  slides: [
    { title: 'Investor Pitch Deck (5 Slides)', desc: 'Problem, solution, market & traction' },
    { title: 'Quarterly Business Review (QBR)', desc: 'Key metrics, wins & next quarter goals' },
    { title: 'Product Strategy Keynote', desc: 'Vision, roadmap & feature superpowers' },
    { title: 'Engineering Tech Talk', desc: 'Architecture deep dive & WebSocket sync' },
    { title: 'Team Sprint Demo Slide Deck', desc: 'Show & tell feature accomplishments' },
  ],
  engage: [
    { title: 'Feature Prioritization Vote Poll', desc: 'Team vote on top 3 backlog items' },
    { title: 'Sprint Retrospective Pulse Check', desc: 'What went well vs what to improve' },
    { title: 'Team Icebreaker Quiz', desc: 'Fun trivia & interactive vote options' },
    { title: 'Design Feedback Rating Poll', desc: '5-star design sentiment vote' },
    { title: 'Product Naming Survey', desc: 'Vote on feature naming candidates' },
  ],
  talktrack: [
    { title: 'Architecture Video Walkthrough', desc: 'Recorded breakdown of socket sync' },
    { title: 'Design System Video Demo', desc: 'Recorded guide on 60-30-10 palette' },
    { title: 'Onboarding Video Guide', desc: 'Recorded tutorial for new collaborators' },
    { title: 'Bug Reproduction Recording', desc: 'Recorded video of canvas edge case' },
    { title: 'Executive Update Audio Note', desc: '2-minute audio summary for stakeholders' },
  ],
  select: [],
  pencil: [],
  highlighter: [],
  rectangle: [],
  circle: [],
  diamond: [],
  triangle: [],
  star: [],
  line: [],
  arrow: [],
  text: [],
  stickyNote: [],
  eraser: [],
};

export const WidgetPickerMenu: React.FC<WidgetPickerMenuProps> = ({ onSelectWidget }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolType>('prototype');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items: { id: ToolType; label: string; icon: React.ReactNode; color: string; badge?: string }[] = [
    { id: 'prototype', label: 'Prototype', icon: <Smartphone className="w-4 h-4" />, color: 'text-purple-600', badge: '↑' },
    { id: 'diagram', label: 'Diagram', icon: <GitFork className="w-4 h-4" />, color: 'text-orange-500' },
    { id: 'table', label: 'Table', icon: <TableIcon className="w-4 h-4" />, color: 'text-emerald-600' },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'kanban', label: 'Kanban', icon: <KanbanIcon className="w-4 h-4" />, color: 'text-emerald-500' },
    { id: 'doc', label: 'Doc', icon: <FileText className="w-4 h-4" />, color: 'text-cyan-600' },
    { id: 'slides', label: 'Slides', icon: <Presentation className="w-4 h-4" />, color: 'text-red-500' },
    { id: 'engage', label: 'Engage activities', icon: <Target className="w-4 h-4" />, color: 'text-rose-500' },
    { id: 'talktrack', label: 'Talktrack', icon: <Video className="w-4 h-4" />, color: 'text-teal-600' },
  ];

  const handleSelectTemplate = (tool: ToolType, templateTitle: string) => {
    onSelectWidget(tool, templateTitle);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-3.5 py-2 hover:border-orange-500/40 text-slate-900 font-bold text-xs transition shadow-md flex items-center gap-2 font-heading bg-white border border-slate-200"
        title="Interactive Widgets & Tools with Ready Templates"
      >
        <Sparkles className="w-4 h-4 text-orange-500" />
        <span>Interactive Widgets & Tools</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[520px] glass-card p-3 shadow-2xl z-50 bg-white border border-slate-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Left Categories List */}
          <div className="w-48 border-r border-slate-100 pr-2 space-y-0.5">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1 font-mono">
              Widgets & Tools
            </div>
            {items.map((item) => {
              const isSelected = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  onMouseEnter={() => setActiveCategory(item.id)}
                  className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition font-body text-xs ${
                    isSelected ? 'bg-orange-50 font-bold text-slate-900' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={item.color}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-500' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>

          {/* Right 5 Ready-to-Use Templates for Selected Widget */}
          <div className="flex-1 space-y-1">
            <div className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider px-2 py-1 font-mono flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span>5 Ready Templates</span>
              <span className="text-[9px] text-slate-400 font-normal">Auto-switches to Cursor</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {(WIDGET_TEMPLATES[activeCategory] || []).map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectTemplate(activeCategory, tpl.title)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-orange-500/40 hover:bg-orange-50/50 transition group space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-heading group-hover:text-orange-600 transition">
                      {tpl.title}
                    </span>
                    <span className="text-[10px] text-orange-500 font-bold font-mono opacity-0 group-hover:opacity-100 transition">
                      + Insert
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-body leading-tight">
                    {tpl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
