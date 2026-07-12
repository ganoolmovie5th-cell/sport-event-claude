import Link from 'next/link';
import { events, getUpcomingEvents } from '@/lib/data';

export default function HeroSection() {
  const upcoming = getUpcomingEvents();
  const totalEvents = events.length;
  const confirmedEvents = events.filter(e => e.status === 'confirmed').length;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/15 animate-gradient" />
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern" />
      
      {/* Floating sport emoji particles — CSS only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[10%] left-[5%] text-4xl opacity-[0.08] animate-float">⚽</span>
        <span className="absolute top-[20%] right-[10%] text-5xl opacity-[0.06] animate-float-slow">🏸</span>
        <span className="absolute top-[60%] left-[15%] text-3xl opacity-[0.07] animate-float-reverse">🏍️</span>
        <span className="absolute top-[70%] right-[20%] text-4xl opacity-[0.06] animate-float">🏃</span>
        <span className="absolute top-[40%] left-[80%] text-3xl opacity-[0.05] animate-float-slow">🏀</span>
        <span className="absolute top-[85%] left-[50%] text-4xl opacity-[0.07] animate-float-reverse">🏊</span>
        <span className="absolute top-[15%] left-[45%] text-3xl opacity-[0.05] animate-float">🎾</span>
        <span className="absolute top-[50%] left-[3%] text-5xl opacity-[0.06] animate-float-slow">🏆</span>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-secondary/8 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-muted">{upcoming.length} event mendatang</span>
        </div>

        {/* Title with gradient text */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
          <span className="text-text">Jadwal Event Olahraga</span>
          <br />
          <span className="bg-gradient-to-r from-primary-light via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Indonesia 2026-2030
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Temukan jadwal lengkap event olahraga di Indonesia. Dari MotoGP Mandalika,
          Indonesia Open, Asian Games, hingga marathon dan liga domestik.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/events"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 animate-pulse-glow shadow-lg shadow-primary/20"
          >
            Lihat Semua Event →
          </Link>
          <Link
            href="/calendar"
            className="glass hover:bg-surface-light/60 text-text font-medium px-8 py-3.5 rounded-xl transition-all duration-300"
          >
            📅 Kalender
          </Link>
        </div>

        {/* Stats bar with glass effect */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="glass rounded-xl p-5 card-hover group">
            <p className="text-3xl font-bold text-primary-light tabular-nums group-hover:scale-110 transition-transform duration-300">{totalEvents}</p>
            <p className="text-xs text-text-muted mt-1">Total Event</p>
          </div>
          <div className="glass rounded-xl p-5 card-hover group">
            <p className="text-3xl font-bold text-success tabular-nums group-hover:scale-110 transition-transform duration-300">{confirmedEvents}</p>
            <p className="text-xs text-text-muted mt-1">Confirmed</p>
          </div>
          <div className="glass rounded-xl p-5 card-hover group">
            <p className="text-3xl font-bold text-accent tabular-nums group-hover:scale-110 transition-transform duration-300">16+</p>
            <p className="text-xs text-text-muted mt-1">Cabang Olahraga</p>
          </div>
          <div className="glass rounded-xl p-5 card-hover group">
            <p className="text-3xl font-bold text-secondary tabular-nums group-hover:scale-110 transition-transform duration-300">5</p>
            <p className="text-xs text-text-muted mt-1">Tahun</p>
          </div>
        </div>
      </div>
    </section>
  );
}
