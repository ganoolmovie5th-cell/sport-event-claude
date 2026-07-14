import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center gap-3 mb-6 text-4xl opacity-60">
          <span>⚽</span><span>🏸</span><span>🏍️</span><span>🏃</span><span>🏆</span>
        </div>

        <div className="glass rounded-2xl p-8">
          <p className="text-6xl font-extrabold gradient-text tracking-tighter mb-2">404</p>
          <h1 className="text-xl font-semibold text-text mb-2">Halaman tidak ditemukan</h1>
          <p className="text-sm text-text-muted mb-8">
            Event atau halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 text-sm">
              Beranda
            </Link>
            <Link href="/events" className="glass hover:bg-surface-light/60 active:scale-95 text-text font-medium px-6 py-2.5 rounded-lg transition-all duration-200 text-sm">
              Semua Event
            </Link>
            <Link href="/calendar" className="glass hover:bg-surface-light/60 active:scale-95 text-text font-medium px-6 py-2.5 rounded-lg transition-all duration-200 text-sm">
              Kalender
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
