'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserPresence, BaseShape } from '@/types/board';
import {
  LayoutGrid,
  Share2,
  Download,
  Check,
  Copy,
  LogOut,
  Wifi,
  FileCode,
  FileJson,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  roomId: string;
  roomTitle: string;
  setRoomTitle: (title: string) => void;
  presences: UserPresence[];
  shapes: BaseShape[];
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  roomId,
  roomTitle,
  setRoomTitle,
  presences,
  shapes,
  isConnected,
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(shapes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${roomTitle.toLowerCase().replace(/\s+/g, '_')}_board.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportMenu(false);
  };

  const exportAsSVG = () => {
    const svgEl = document.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `${roomTitle.toLowerCase().replace(/\s+/g, '_')}_board.svg`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportMenu(false);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
      {/* Brand & Room Title Glass Container */}
      <div className="glass-card px-4 py-2 flex items-center gap-3 pointer-events-auto shadow-lg">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-600/30 group-hover:scale-105 transition">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 hidden sm:inline">my-board</span>
        </Link>

        <div className="h-4 w-px bg-slate-200" />

        <input
          type="text"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
          placeholder="Untitled Board"
          className="bg-transparent font-bold text-sm text-slate-900 focus:outline-none focus:bg-slate-100 px-2.5 py-1 rounded-xl transition border border-transparent focus:border-blue-500/40 w-36 sm:w-52"
        />

        <div className={`badge ${isConnected ? 'badge-primary' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
          <Wifi className="w-3 h-3 animate-pulse" />
          <span className="hidden md:inline font-mono">{isConnected ? 'LIVE SYNC' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Right Action Glass Bar */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Collaborators Stack */}
        <div className="glass-card px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
          {presences.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold ring-2 ring-white shadow-md transition hover:scale-110"
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {presences.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center ring-2 ring-white">
              +{presences.length - 4}
            </div>
          )}
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="glass-card px-3.5 py-2 hover:border-blue-500/40 text-slate-700 font-semibold text-xs transition flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-52 glass-card p-1.5 z-50 text-xs shadow-2xl">
              <button
                onClick={exportAsSVG}
                className="w-full px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2.5 text-left transition"
              >
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Export SVG Vector</span>
              </button>
              <button
                onClick={exportAsJSON}
                className="w-full px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2.5 text-left transition"
              >
                <FileJson className="w-4 h-4 text-amber-600" />
                <span>Export JSON Backup</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="btn-primary text-xs !py-2 !px-4"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Profile */}
        {user && (
          <div className="glass-card p-1 flex items-center gap-2 shadow-lg">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-red-600 transition rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="glass-card p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Share Collaborative Board</span>
              </h3>
              <span className="section-number">ROOM LINK</span>
            </div>
            <p className="text-xs text-slate-600 mb-6 font-body">
              Anyone with this link can join, view, and draw live on this whiteboard in real time.
            </p>

            <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200 mb-6">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="bg-transparent text-xs text-slate-700 w-full focus:outline-none px-2 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="btn-primary text-xs !py-1.5 !px-3 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
