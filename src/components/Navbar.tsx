'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-lg font-bold text-primary-light">SportEvent</span>
            <span className="text-xs bg-primary/20 text-primary-light px-2 py-0.5 rounded-full">ID</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-text-muted hover:text-text transition-colors">Beranda</Link>
            <Link href="/events" className="text-text-muted hover:text-text transition-colors">Event</Link>
            <Link href="/calendar" className="text-text-muted hover:text-text transition-colors">Kalender</Link>
            <Link href="/about" className="text-text-muted hover:text-text transition-colors">Tentang</Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-text-muted hover:text-text"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-text-muted hover:text-text">Beranda</Link>
            <Link href="/events" onClick={() => setOpen(false)} className="block py-2 text-text-muted hover:text-text">Event</Link>
            <Link href="/calendar" onClick={() => setOpen(false)} className="block py-2 text-text-muted hover:text-text">Kalender</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block py-2 text-text-muted hover:text-text">Tentang</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
