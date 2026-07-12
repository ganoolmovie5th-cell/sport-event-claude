import type { Metadata } from 'next';
import { events } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tentang SportEvent ID',
  description: 'Tentang platform informasi jadwal event olahraga Indonesia 2026-2030.',
};

export default function AboutPage() {
  const totalEvents = events.length;
  const sports = new Set(events.map(e => e.sport)).size;
  const cities = new Set(events.map(e => e.city)).size;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Tentang SportEvent ID</h1>
        <p className="text-text-muted">Platform informasi olahraga terlengkap di Indonesia</p>
      </div>

      {/* Stats about the platform */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="glass rounded-xl p-5 text-center card-hover">
          <p className="text-3xl font-bold text-primary-light tabular-nums">{totalEvents}</p>
          <p className="text-xs text-text-muted mt-1">Total Event</p>
        </div>
        <div className="glass rounded-xl p-5 text-center card-hover">
          <p className="text-3xl font-bold text-secondary tabular-nums">{sports}</p>
          <p className="text-xs text-text-muted mt-1">Cabang Olahraga</p>
        </div>
        <div className="glass rounded-xl p-5 text-center card-hover">
          <p className="text-3xl font-bold text-accent tabular-nums">{cities}</p>
          <p className="text-xs text-text-muted mt-1">Kota</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* What is SportEvent ID */}
        <section className="glass rounded-2xl p-6 sm:p-8 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h2 className="text-xl font-semibold text-text">Apa itu SportEvent ID?</h2>
          </div>
          <p className="text-text-muted leading-relaxed">
            SportEvent ID adalah platform informasi jadwal event olahraga di Indonesia dari tahun 2026 hingga 2030.
            Kami mengumpulkan data dari berbagai sumber untuk memberikan informasi terlengkap tentang event olahraga
            yang akan diselenggarakan di Indonesia maupun event internasional yang melibatkan atlet Indonesia.
          </p>
        </section>

        {/* Mission / Goals */}
        <section className="glass rounded-2xl p-6 sm:p-8 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <h2 className="text-xl font-semibold text-text">Tujuan</h2>
          </div>
          <ul className="space-y-3 text-text-muted">
            {[
              'Menyediakan informasi jadwal event olahraga yang akurat dan terkini',
              'Membantu pecinta olahraga merencanakan kehadiran di event favorit',
              'Mempromosikan event olahraga di Indonesia ke audiens yang lebih luas',
              'Menjadi referensi lengkap untuk event olahraga Indonesia 2026-2030',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Feature highlights */}
        <section className="glass rounded-2xl p-6 sm:p-8 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📋</span>
            <h2 className="text-xl font-semibold text-text">Cakupan Event</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🌏', title: 'Event Internasional', desc: 'Asian Games, Olimpiade, MotoGP, BWF World Tour, FIFA World Cup, SEA Games' },
              { icon: '🇮🇩', title: 'Event Nasional', desc: 'PON, Liga 1, Proliga, IBL, Kejurnas berbagai cabor' },
              { icon: '🏃', title: 'Marathon & Lari', desc: 'Jakarta Marathon, Bali Marathon, Borobudur Marathon, Jakarta 10K' },
              { icon: '🏎️', title: 'Motorsport', desc: 'MotoGP Mandalika, WSBK, Mandalika Racing Series' },
            ].map((item) => (
              <div key={item.title} className="glass-light rounded-xl p-4 group hover:bg-surface-light/40 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <h3 className="font-medium text-text text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="glass rounded-2xl p-6 sm:p-8 border-l-4 border-l-accent">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-xl font-semibold text-text">Disclaimer</h2>
          </div>
          <p className="text-text-muted leading-relaxed text-sm">
            Informasi jadwal, venue, dan harga tiket dapat berubah sewaktu-waktu. Kami berusaha memperbarui data
            secara berkala, namun kami sarankan untuk selalu mengecek informasi resmi dari penyelenggara event.
            Event dengan status &quot;Tentative&quot; belum dikonfirmasi secara resmi dan dapat berubah.
          </p>
        </section>
      </div>
    </div>
  );
}
