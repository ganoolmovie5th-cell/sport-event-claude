import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang SportEvent ID',
  description: 'Tentang platform informasi jadwal event olahraga Indonesia 2026-2030.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Tentang SportEvent ID</h1>

      <div className="space-y-8">
        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text mb-4">🏆 Apa itu SportEvent ID?</h2>
          <p className="text-text-muted leading-relaxed">
            SportEvent ID adalah platform informasi jadwal event olahraga di Indonesia dari tahun 2026 hingga 2030.
            Kami mengumpulkan data dari berbagai sumber untuk memberikan informasi terlengkap tentang event olahraga
            yang akan diselenggarakan di Indonesia maupun event internasional yang melibatkan atlet Indonesia.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text mb-4">🎯 Tujuan</h2>
          <ul className="space-y-3 text-text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary-light mt-1">•</span>
              <span>Menyediakan informasi jadwal event olahraga yang akurat dan terkini</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-light mt-1">•</span>
              <span>Membantu pecinta olahraga merencanakan kehadiran di event favorit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-light mt-1">•</span>
              <span>Mempromosikan event olahraga di Indonesia ke audiens yang lebih luas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-light mt-1">•</span>
              <span>Menjadi referensi lengkap untuk event olahraga Indonesia 2026-2030</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text mb-4">📋 Cakupan Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="font-medium text-text mb-2">Event Internasional</h3>
              <p className="text-sm text-text-muted">Asian Games, Olimpiade, MotoGP, BWF World Tour, FIFA World Cup, SEA Games</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="font-medium text-text mb-2">Event Nasional</h3>
              <p className="text-sm text-text-muted">PON, Liga 1, Proliga, IBL, Kejurnas berbagai cabor</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="font-medium text-text mb-2">Marathon & Lari</h3>
              <p className="text-sm text-text-muted">Jakarta Marathon, Bali Marathon, Borobudur Marathon, Jakarta 10K</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4">
              <h3 className="font-medium text-text mb-2">Motorsport</h3>
              <p className="text-sm text-text-muted">MotoGP Mandalika, WSBK, Mandalika Racing Series</p>
            </div>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text mb-4">⚠️ Disclaimer</h2>
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
