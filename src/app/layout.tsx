import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'SportEvent ID - Jadwal Event Olahraga Indonesia 2026-2030',
    template: '%s | SportEvent ID',
  },
  description: 'Platform informasi jadwal lengkap event olahraga di Indonesia dari 2026 hingga 2030. MotoGP, Badminton, Marathon, Liga 1, Asian Games, dan lainnya.',
  keywords: ['event olahraga', 'indonesia', 'jadwal', 'motogp', 'badminton', 'marathon', 'liga 1', 'asian games'],
  openGraph: {
    title: 'SportEvent ID - Jadwal Event Olahraga Indonesia 2026-2030',
    description: 'Platform informasi jadwal lengkap event olahraga di Indonesia dari 2026 hingga 2030.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
