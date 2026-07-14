'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSearchOpen]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/events', label: 'Event' },
    { href: '/calendar', label: 'Kalender' },
    { href: '/about', label: 'Tentang' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-surface/70 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-background/50'
        : 'bg-surface/50 backdrop-blur-md border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏆</span>
            <span className="text-lg font-bold gradient-text">SportEvent</span>
            <span className="text-xs bg-primary/20 text-primary-light px-2 py-0.5 rounded-full border border-primary/30">ID</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-primary-light'
                    : 'text-text-muted hover:text-text hover:bg-surface-light/50'
                }`}>
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onSearchOpen}
              className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-sm text-text-muted hover:text-text transition-colors"
              aria-label="Cari event">
              <span>🔍</span>
              <span className="hidden sm:inline text-xs opacity-60">⌘K</span>
            </button>

            <button onClick={toggleTheme}
              className="p-2 glass rounded-lg text-text-muted hover:text-text transition-colors"
              aria-label="Toggle tema">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-text-muted hover:text-text rounded-lg hover:bg-surface-light/50 transition-colors"
              aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 glass">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className={`block py-2.5 px-3 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-light bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-surface-light/50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
