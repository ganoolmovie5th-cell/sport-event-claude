import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import EventCard from '@/components/EventCard';
import { getUpcomingEvents } from '@/lib/data';
import Link from 'next/link';

export default function HomePage() {
  const upcoming = getUpcomingEvents().slice(0, 6);

  return (
    <div>
      <HeroSection />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">Event Terdekat</h2>
            <Link href="/events" className="text-sm text-primary-light hover:text-primary transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
    </div>
  );
}
