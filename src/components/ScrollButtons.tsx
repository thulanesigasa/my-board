'use client';

import React, { useState, useEffect } from 'react';

export const ScrollButtons: React.FC = () => {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      const isBottom = windowHeight + scrollY >= documentHeight - 120;
      setIsNearBottom(isBottom);
    };

    const checkScrollable = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      setIsScrollable(scrollable);
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkScrollable);

    checkScrollable();
    const timer = setTimeout(checkScrollable, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollable);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!isScrollable) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div className="relative">
        {/* Scroll To Top Button (Visible near bottom) */}
        <div
          className={`transition-all duration-300 absolute bottom-0 right-0 ${
            isNearBottom ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-600 transition-colors focus:outline-none"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>

        {/* Scroll To Bottom Button (Visible when scrolling top/middle) */}
        <div
          className={`transition-all duration-300 absolute bottom-0 right-0 ${
            !isNearBottom ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          <button
            onClick={scrollToBottom}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition-colors focus:outline-none"
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
