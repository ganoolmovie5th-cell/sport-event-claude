import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { events, getEventBySlug, formatDate, SPORT_EMOJI, SPORT_LABELS } from '@/lib/data';
import { googleCalendarUrl } from '@/lib/googleCalendar';
import CountdownTimer from '@/components/CountdownTimer';

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: 'Event Tidak Ditemukan' };
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const statusColor = {
    confirmed: 'bg-success/20 text-success border-success/30',
    tentative:  'bg-accent/20 text-accent border-accent/30',
    completed:  'bg-text-muted/20 text-text-muted border-text-muted/30',
  }[event.status];

  const categoryLabel = {
    international: 'Internasional',
    national:      'Nasional',
    regional:      'Regional',
  }[event.category];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-primary-light text-sm mb-6 transition-all duration-300 group">
        <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
        Kembali ke daftar event
      </Link>

      <div className="glass rounded-2xl overflow-hidden">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-primary/25 via-secondary/15 to-primary/10 p-10 sm:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-50" />
          <span className="relative text-7xl sm:text-8xl block mb-5 drop-shadow-lg">{SPORT_EMOJI[event.sport]}</span>
          <h1 className="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-4">{event.title}</h1>
          <div className="relative flex items-center justify-center gap-2 flex-wrap">
            <span className={`text-xs px-3.5 py-1 rounded-full font-medium border ${statusColor}`}>
              {event.status === 'confirmed' ? '✓ Confirmed' : event.status === 'tentative' ? '? Tentative' : '✓ Selesai'}
            </span>
            <span className="text-xs px-3.5 py-1 rounded-full bg-surface-light/80 text-text-muted border border-border/50">{categoryLabel}</span>
            <span className="text-xs px-3.5 py-1 rounded-full bg-surface-light/80 text-text-muted border border-border/50">{SPORT_LABELS[event.sport]}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Countdown */}
          {event.status !== 'completed' && (
            <CountdownTimer startDate={event.startDate} endDate={event.endDate} />
          )}

          {/* Description */}
          <p className="text-text-muted leading-relaxed">{event.description}</p>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="glass-light rounded-xl p-5">
              <p className="text-sm font-semibold text-text mb-3">Highlight</p>
              <ul className="space-y-2">
                {event.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="text-primary-light mt-0.5 shrink-0">✦</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon="📅" label="Tanggal" value={`${formatDate(event.startDate)}${event.startDate !== event.endDate ? ` – ${formatDate(event.endDate)}` : ''}`} />
            <InfoRow icon="📍" label="Venue" value={event.venue} />
            <InfoRow icon="🏙️" label="Kota" value={`${event.city}, ${event.country}`} />
            {event.organizer  && <InfoRow icon="🏢" label="Penyelenggara" value={event.organizer} />}
            {event.athletes   && <InfoRow icon="🧑‍🤝‍🧑" label="Peserta" value={event.athletes} />}
            {event.priceRange && <InfoRow icon="💰" label="Harga Tiket" value={event.priceRange} />}
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gradient-to-r from-primary/15 to-secondary/15 text-primary-light px-3.5 py-1.5 rounded-full border border-primary/20 hover:border-primary/40 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
            {event.ticketUrl && (
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-lg shadow-primary/25">
                🎫 Beli Tiket
              </a>
            )}
            {event.websiteUrl && (
              <a href={event.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="glass hover:bg-surface-light/60 active:scale-95 text-text font-medium px-6 py-2.5 rounded-lg text-sm transition-all duration-200">
                🌐 Website Resmi
              </a>
            )}
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer"
              className="glass hover:bg-surface-light/60 active:scale-95 text-text font-medium px-6 py-2.5 rounded-lg text-sm transition-all duration-200">
              📅 Tambah ke Kalender
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 glass-light rounded-xl">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm text-text font-medium">{value}</p>
      </div>
    </div>
  );
}
