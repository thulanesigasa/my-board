'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 py-16 font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left mb-12">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              my-board
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Empowering team collaboration with real-time pressure ink, conflict-free CRDT canvas synchronization, and instant PostgreSQL snapshot persistence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/thulanesigasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 flex items-center justify-center transition border border-slate-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/thulanesigasa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 flex items-center justify-center transition border border-slate-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-mono">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/#features" className="hover:text-blue-600 transition">
                  Core Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#sandbox" className="hover:text-blue-600 transition">
                  Interactive Sandbox
                </Link>
              </li>
              <li>
                <Link href="/#use-cases" className="hover:text-blue-600 transition">
                  Team Workflows
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-mono">
              RESOURCES
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/#faq" className="hover:text-blue-600 transition">
                  FAQ & Documentation
                </Link>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-blue-600 transition">
                  System Architecture
                </Link>
              </li>
              <li>
                <a
                  href="https://tldraw.dev/docs/sync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition"
                >
                  Realtime CRDT Sync Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-mono">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <span className="hover:text-blue-600 transition cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-blue-600 transition cursor-pointer">
                  Security & RLS Policies
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} my-board. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-slate-600 font-sans">
            Built with Next.js 15, Socket.IO & Supabase PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  );
};
