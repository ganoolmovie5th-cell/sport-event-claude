import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-surface mt-16">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-lg font-bold gradient-text">SportEvent ID</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Platform informasi jadwal event olahraga di Indonesia 2026-2030.
              Temukan event favorit kamu dan jangan sampai ketinggalan.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              <span className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary-light hover:shadow-md hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                𝕏
              </span>
              <span className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary-light hover:shadow-md hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                📷
              </span>
              <span className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary-light hover:shadow-md hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                ▶
              </span>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-semibold text-text mb-4">Navigasi</h3>
            <div className="space-y-2.5">
              <Link href="/" className="block text-text-muted hover:text-primary-light text-sm transition-colors duration-300">Beranda</Link>
              <Link href="/events" className="block text-text-muted hover:text-primary-light text-sm transition-colors duration-300">Semua Event</Link>
              <Link href="/calendar" className="block text-text-muted hover:text-primary-light text-sm transition-colors duration-300">Kalender</Link>
              <Link href="/about" className="block text-text-muted hover:text-primary-light text-sm transition-colors duration-300">Tentang</Link>
            </div>
          </div>

          {/* Sports column */}
          <div>
            <h3 className="font-semibold text-text mb-4">Kategori Olahraga</h3>
            <div className="flex flex-wrap gap-2">
              {['🏸 Bulu Tangkis', '⚽ Sepak Bola', '🏍️ MotoGP', '🏃 Lari', '🚴 Sepeda', '🏄 Selancar'].map((s) => (
                <span key={s} className="text-xs glass text-text-muted px-3 py-1.5 rounded-full hover:text-primary-light transition-colors duration-300">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-10 pt-8 text-center text-text-muted text-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p>&copy; {new Date().getFullYear()} SportEvent ID. Dibuat untuk pecinta olahraga Indonesia 🇮🇩</p>
        </div>
      </div>
    </footer>
  );
}
