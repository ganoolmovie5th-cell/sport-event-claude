'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { events, SPORT_EMOJI, SPORT_LABELS, formatDateShort } from '@/lib/data';

function search(q: string) {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return events
    .filter((e) =>
      e.title.toLowerCase().includes(lower) ||
      e.venue.toLowerCase().includes(lower) ||
      e.city.toLowerCase().includes(lower) ||
      SPORT_LABELS[e.sport].toLowerCase().includes(lower) ||
      e.tags.some((t) => t.toLowerCase().includes(lower))
    )
    .slice(0, 8);
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = search(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  function go(slug: string) {
    router.push(`/events/${slug}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl glass rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <span className="text-text-muted">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari event, venue, kota, cabang olahraga..."
            className="flex-1 bg-transparent text-text placeholder-text-muted text-sm outline-none"
          />
          <kbd className="text-[10px] text-text-muted glass px-1.5 py-0.5 rounded">Esc</kbd>
        </div>

        {/* Results */}
        {query.trim() ? (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
            ) : (
              results.map((event) => (
                <button key={event.id} onClick={() => go(event.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-light/50 transition-colors text-left">
                  <span className="text-xl shrink-0">{SPORT_EMOJI[event.sport]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{event.title}</p>
                    <p className="text-xs text-text-muted">{event.city} · {formatDateShort(event.startDate)}</p>
                  </div>
                  <span className="text-[10px] text-text-muted glass px-2 py-0.5 rounded shrink-0">
                    {SPORT_LABELS[event.sport]}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          <p className="text-xs text-text-muted text-center py-6">
            Ketik untuk mencari event olahraga Indonesia
          </p>
        )}
      </div>
    </div>
  );
}
