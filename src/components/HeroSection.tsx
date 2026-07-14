import Link from 'next/link';
import { events, getUpcomingEvents } from '@/lib/data';

export default function HeroSection() {
  const upcoming = getUpcomingEvents();
  const totalEvents = events.length;
  const confirmedEvents = events.filter(e => e.status === 'confirmed').length;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Single ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned on desktop, centered on mobile */}
        <div className="max-w-4xl lg:mx-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-medium text-text-muted tracking-wide uppercase">{upcoming.length} event mendatang</span>
          </div>

          {/* Headline — heavy, tight, editorial */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tighter mb-6">
            <span className="text-text">Jadwal Event</span>
            <br />
            <span className="text-text">Olahraga</span>
            <br />
            <span className="gradient-text">Indonesia</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-xl mb-10 leading-relaxed">
            MotoGP Mandalika, Indonesia Open, Asian Games, marathon, liga domestik —
            semua jadwal 2026–2030 dalam satu platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              href="/events"
              className="bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold px-7 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-primary/25"
            >
              Lihat Semua Event →
            </Link>
            <Link
              href="/calendar"
              className="glass hover:bg-surface-light/60 active:scale-95 text-text font-medium px-7 py-3 rounded-lg transition-all duration-200"
            >
              Kalender
            </Link>
          </div>
        </div>

        {/* Stats — clean, no hover bounce */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl lg:mx-0">
          {[
            { value: totalEvents,     label: 'Total Event',     color: 'text-primary-light' },
            { value: confirmedEvents, label: 'Confirmed',        color: 'text-success'       },
            { value: '16+',           label: 'Cabang Olahraga', color: 'text-accent'        },
            { value: '5',             label: 'Tahun',           color: 'text-text-muted'    },
          ].map(({ value, label, color }) => (
            <div key={label} className="glass rounded-xl p-4">
              <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
