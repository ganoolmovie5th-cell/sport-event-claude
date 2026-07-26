import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Event Olahraga Indonesia 2026',
  description:
    'Jadwal lengkap event olahraga di Indonesia: badminton, sepak bola, MotoGP, lari, bersepeda, surfing, dan lainnya. Filter per cabang, kota, dan tanggal.',
  alternates: { canonical: '/events' },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
