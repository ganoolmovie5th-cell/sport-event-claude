import Link from 'next/link';
import { events, getUpcomingEvents } from '@/lib/data';

export default function HeroSection() {
  const upcoming = getUpcomingEvents();
  const totalEvents = events.length;
  const confirmedEvents = events.filter(e => e.status === 'confirmed').length;

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-muted">{upcoming.length} event mendatang</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="text-text">Jadwal Event Olahraga</span>
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Indonesia 2026-2030
          </span>
        </h1>

        <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
          Temukan jadwal lengkap event olahraga di Indonesia. Dari MotoGP Mandalika,
          Indonesia Open, Asian Games, hingga marathon dan liga domestik.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/events"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Lihat Semua Event
          </Link>
          <Link
            href="/calendar"
            className="bg-surface border border-border hover:border-primary/50 text-text font-medium px-6 py-3 rounded-lg transition-colors"
          >
            📅 Kalender
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-primary-light">{totalEvents}</p>
            <p className="text-xs text-text-muted">Total Event</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-success">{confirmedEvents}</p>
            <p className="text-xs text-text-muted">Confirmed</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-accent">16+</p>
            <p className="text-xs text-text-muted">Cabang Olahraga</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-secondary">5</p>
            <p className="text-xs text-text-muted">Tahun</p>
          </div>
        </div>
      </div>
    </section>
  );
}
