'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 font-heading">
            my-board
          </Link>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-body">
            High-refresh collaborative whiteboard workbench. Built with 120Hz smooth Bezier ink, Socket.IO WebSockets, and Supabase PostgreSQL persistence.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/thulanesigasa/my-board"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-500 flex items-center justify-center transition border border-slate-200"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-500 flex items-center justify-center transition border border-slate-200"
              aria-label="Twitter Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="space-y-3 font-body text-xs">
          <h4 className="font-extrabold text-slate-900 font-heading uppercase tracking-wider text-[11px]">
            Product
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/#features" className="hover:text-orange-500 transition">
                Workbench Engine
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-orange-500 transition">
                My Dashboard
              </Link>
            </li>
            <li>
              <Link href="/#sandbox" className="hover:text-orange-500 transition">
                Interactive Sandbox
              </Link>
            </li>
            <li>
              <Link href="/#use-cases" className="hover:text-orange-500 transition">
                Team Use Cases
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Architecture */}
        <div className="space-y-3 font-body text-xs">
          <h4 className="font-extrabold text-slate-900 font-heading uppercase tracking-wider text-[11px]">
            Architecture
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/#faq" className="hover:text-orange-500 transition">
                FAQ & Security
              </Link>
            </li>
            <li>
              <Link href="/#architecture" className="hover:text-orange-500 transition">
                Supabase RLS DB
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/thulanesigasa/my-board"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition"
              >
                GitHub Source
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & System */}
        <div className="space-y-3 font-body text-xs">
          <h4 className="font-extrabold text-slate-900 font-heading uppercase tracking-wider text-[11px]">
            System
          </h4>
          <ul className="space-y-2 text-slate-500">
            <li>
              <span className="hover:text-orange-500 transition cursor-pointer">
                Privacy Policy
              </span>
            </li>
            <li>
              <span className="hover:text-orange-500 transition cursor-pointer">
                Terms of Service
              </span>
            </li>
            <li>
              <span className="hover:text-orange-500 transition cursor-pointer">
                Status: Operational 120Hz
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
        <p>© {new Date().getFullYear()} my-board. All rights reserved.</p>
        <p>120Hz High-Refresh Vector Sync Engine</p>
      </div>
    </footer>
  );
};
