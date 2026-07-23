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
  FileImage,
  FileJson,
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
      {/* Left: Brand & Room Title */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 pointer-events-auto">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">my-board</span>
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        <input
          type="text"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
          placeholder="Untitled Board"
          className="bg-transparent font-semibold text-sm text-slate-200 focus:outline-none focus:bg-slate-800/50 px-2 py-1 rounded-lg transition border border-transparent focus:border-slate-700 w-36 sm:w-48"
        />

        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
          isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        }`}>
          <Wifi className="w-3 h-3 animate-pulse" />
          <span className="hidden md:inline">{isConnected ? 'Live' : 'Connecting'}</span>
        </div>
      </div>

      {/* Right: Presences, Export, Share & Auth */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Active Collaborators Stack */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-3 py-2 shadow-2xl flex items-center gap-1">
          {presences.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-900 shadow-md"
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {presences.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center ring-2 ring-slate-900">
              +{presences.length - 4}
            </div>
          )}
        </div>

        {/* Export Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 hover:bg-slate-800 text-slate-200 p-2.5 rounded-2xl shadow-2xl transition flex items-center gap-2 text-xs font-medium"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1 z-50 text-xs">
              <button
                onClick={exportAsSVG}
                className="w-full px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 text-left transition"
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Export as SVG Vector</span>
              </button>
              <button
                onClick={exportAsJSON}
                className="w-full px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 text-left transition"
              >
                <FileJson className="w-4 h-4 text-amber-400" />
                <span>Export as JSON Backup</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/30 font-semibold text-xs transition flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* User Profile Avatar */}
        {user && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md"
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
              className="p-1 text-slate-400 hover:text-red-400 transition rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Share Collaborative Board</h3>
            <p className="text-xs text-slate-400 mb-6">
              Anyone with this link can view and collaborate on this board in real time.
            </p>

            <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800 mb-6">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="bg-transparent text-xs text-slate-300 w-full focus:outline-none px-2"
              />
              <button
                onClick={handleCopyLink}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium text-xs shrink-0 transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
