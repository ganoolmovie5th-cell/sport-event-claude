import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://sport-event.web.id'),
  title: {
    default: 'SportEvent ID - Jadwal Event Olahraga Indonesia 2026-2030',
    template: '%s | SportEvent ID',
  },
  description: 'Platform informasi jadwal lengkap event olahraga di Indonesia dari 2026 hingga 2030. MotoGP, Badminton, Marathon, Liga 1, Asian Games, dan lainnya.',
  keywords: ['event olahraga', 'indonesia', 'jadwal', 'motogp', 'badminton', 'marathon', 'liga 1', 'asian games'],
  verification: {
    google: 'EG6z2dxpC1qiHNLqVF2ne6aDrBP4SvXKwi0fGr_e2ro',
  },
  openGraph: {
    title: 'SportEvent ID - Jadwal Event Olahraga Indonesia 2026-2030',
    description: 'Platform informasi jadwal lengkap event olahraga di Indonesia dari 2026 hingga 2030.',
    url: 'https://sport-event.web.id',
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
      <head>
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WLTFVQZ6');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WLTFVQZ6"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
