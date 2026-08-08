'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPresence, BaseShape, ToolType } from '@/types/board';
import { Wifi, WifiOff, Download, Share2, ArrowLeft } from 'lucide-react';
import { exportToSvg, exportToJson } from '@/lib/drawing';
import { WidgetPickerMenu } from './WidgetPickerMenu';

interface HeaderProps {
  roomId: string;
  roomTitle: string;
  setRoomTitle: (title: string) => void;
  presences: UserPresence[];
  shapes: BaseShape[];
  isConnected: boolean;
  onSelectWidget?: (tool: ToolType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomId,
  roomTitle,
  setRoomTitle,
  presences,
  shapes,
  isConnected,
  onSelectWidget,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportSvg = () => {
    exportToSvg(shapes, `${roomTitle.toLowerCase().replace(/\s+/g, '-')}-board.svg`);
  };

  const handleExportJson = () => {
    exportToJson(shapes, `${roomTitle.toLowerCase().replace(/\s+/g, '-')}-state.json`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between pointer-events-auto font-sans">
      {/* Left Title & Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          title="Return to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <Link href="/dashboard" className="font-black text-sm tracking-tight text-slate-900 hover:text-orange-500 transition font-heading">
          my-board
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
            placeholder="Room Title..."
            className="bg-transparent font-bold text-sm text-slate-900 focus:outline-none focus:bg-slate-100 px-2.5 py-1 rounded-xl transition border border-transparent focus:border-orange-500/40 w-36 sm:w-52 font-heading"
          />
          <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            {roomId}
          </div>
        </div>

        {onSelectWidget && <WidgetPickerMenu onSelectWidget={onSelectWidget} />}
      </div>

      {/* Center Multiplayer Presence Avatars */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex -space-x-2 overflow-hidden">
          {presences.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm font-heading"
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        {presences.length > 5 && (
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            +{presences.length - 5}
          </span>
        )}
      </div>

      {/* Right Actions & Export Controls */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-slate-700 font-bold hidden sm:inline">120Hz Sync</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
              <span className="text-slate-500 hidden sm:inline">Disconnected</span>
            </>
          )}
        </div>

        <button
          onClick={handleExportSvg}
          className="glass-card px-3.5 py-2 hover:border-orange-500/40 text-slate-700 font-semibold text-xs transition shadow-sm flex items-center gap-1.5 font-body"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SVG Export</span>
        </button>

        <button
          onClick={handleExportJson}
          className="glass-card px-3.5 py-2 hover:border-orange-500/40 text-slate-700 font-semibold text-xs transition shadow-sm hidden md:flex items-center gap-1.5 font-body"
        >
          <Download className="w-3.5 h-3.5" />
          <span>JSON</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-primary text-xs !py-2 !px-4 shadow-md font-heading"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied Link!' : 'Share Room'}</span>
        </button>
      </div>
    </header>
  );
};
