import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { events, getEventBySlug, formatDate, SPORT_EMOJI, SPORT_LABELS } from '@/lib/data';

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: 'Event Tidak Ditemukan' };
  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const statusColor = {
    confirmed: 'bg-success/20 text-success',
    tentative: 'bg-accent/20 text-accent',
    completed: 'bg-text-muted/20 text-text-muted',
  }[event.status];

  const categoryLabel = {
    international: 'Internasional',
    national: 'Nasional',
    regional: 'Regional',
  }[event.category];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-primary-light text-sm mb-6 transition-colors">
        ← Kembali ke daftar event
      </Link>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 text-center">
          <span className="text-6xl block mb-4">{SPORT_EMOJI[event.sport]}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">{event.title}</h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
              {event.status === 'confirmed' ? '✓ Confirmed' : event.status === 'tentative' ? '? Tentative' : '✓ Selesai'}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-light text-text-muted">
              {categoryLabel}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-light text-text-muted">
              {SPORT_LABELS[event.sport]}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-text-muted leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon="📅" label="Tanggal" value={`${formatDate(event.startDate)}${event.startDate !== event.endDate ? ` - ${formatDate(event.endDate)}` : ''}`} />
            <InfoRow icon="📍" label="Venue" value={event.venue} />
            <InfoRow icon="🏙️" label="Kota" value={`${event.city}, ${event.country}`} />
            {event.organizer && <InfoRow icon="🏢" label="Penyelenggara" value={event.organizer} />}
            {event.athletes && <InfoRow icon="🧑‍🤝‍🧑" label="Peserta" value={event.athletes} />}
            {event.priceRange && <InfoRow icon="💰" label="Harga Tiket" value={event.priceRange} />}
          </div>

          {event.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary-light px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {event.ticketUrl && (
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                🎫 Beli Tiket
              </a>
            )}
            {event.websiteUrl && (
              <a href={event.websiteUrl} target="_blank" rel="noopener noreferrer" className="bg-surface-light border border-border hover:border-primary/50 text-text font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                🌐 Website Resmi
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-surface-light/50 rounded-lg">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm text-text font-medium">{value}</p>
      </div>
    </div>
  );
}
