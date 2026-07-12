import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-lg font-bold text-primary-light">SportEvent ID</span>
            </div>
            <p className="text-text-muted text-sm">
              Platform informasi jadwal event olahraga di Indonesia 2026-2030.
              Temukan event favorit kamu dan jangan sampai ketinggalan.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">Navigasi</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-text-muted hover:text-primary-light text-sm transition-colors">Beranda</Link>
              <Link href="/events" className="block text-text-muted hover:text-primary-light text-sm transition-colors">Semua Event</Link>
              <Link href="/calendar" className="block text-text-muted hover:text-primary-light text-sm transition-colors">Kalender</Link>
              <Link href="/about" className="block text-text-muted hover:text-primary-light text-sm transition-colors">Tentang</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">Kategori Olahraga</h3>
            <div className="flex flex-wrap gap-2">
              {['🏸 Bulu Tangkis', '⚽ Sepak Bola', '🏍️ MotoGP', '🏃 Lari', '🚴 Sepeda', '🏄 Selancar'].map((s) => (
                <span key={s} className="text-xs bg-surface-light text-text-muted px-2 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} SportEvent ID. Dibuat untuk pecinta olahraga Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
