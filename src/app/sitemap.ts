import type { MetadataRoute } from 'next';
import { events } from '@/lib/data';

const SITE_URL = 'https://www.sport-event.web.id';

// Generated, not static: scraper.py keeps adding events, and a hardcoded
// public/sitemap.xml silently goes stale every time it does.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/events', '/calendar', '/about'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: new Date(event.endDate),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}
