import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import EventCard from '@/components/EventCard';
import { getUpcomingEvents } from '@/lib/data';
import { SITE_URL, OG_IMAGE, eventJsonLd } from '@/lib/eventJsonLd';
import Link from 'next/link';

// The homepage carried no structured data at all, so Rich Results reported
// "No items detected". Emit the upcoming events as full SportsEvent nodes —
// an ItemList of bare URLs is not a rich-result type Google reports on.
// Lives here rather than in layout.tsx so event nodes don't leak onto every route.
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'SportEvent ID',
      description:
        'Jadwal lengkap event olahraga di Indonesia dari 2026 hingga 2030: MotoGP, Badminton, Marathon, Liga 1, Asian Games, dan lainnya.',
      inLanguage: 'id-ID',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'SportEvent ID',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: OG_IMAGE },
    },
    ...getUpcomingEvents().slice(0, 12).map(eventJsonLd),
  ],
};

export default function HomePage() {
  const upcoming = getUpcomingEvents().slice(0, 6);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HeroSection />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text">Event Terdekat</h2>
              <p className="text-text-muted text-sm mt-1">Jangan lewatkan event-event yang akan datang</p>
            </div>
            <Link href="/events" className="text-sm text-primary-light hover:text-primary transition-colors font-medium group">
              Lihat semua <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((event, index) => (
              <div key={event.id} className="stagger-item" style={{ animationDelay: `${index * 0.08}s` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
    </div>
  );
}
