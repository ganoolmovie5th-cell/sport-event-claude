import Link from 'next/link';
import { SportEvent, SPORT_EMOJI, SPORT_LABELS, formatDateShort } from '@/lib/data';

export default function EventCard({ event }: { event: SportEvent }) {
  const statusColor = {
    confirmed: 'bg-success/20 text-success',
    tentative: 'bg-accent/20 text-accent',
    completed: 'bg-text-muted/20 text-text-muted',
  }[event.status];

  const categoryColor = {
    international: 'bg-secondary/20 text-secondary',
    national: 'bg-primary/20 text-primary-light',
    regional: 'bg-accent/20 text-accent',
  }[event.category];

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-surface-light transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{SPORT_EMOJI[event.sport]}</span>
          <div className="flex gap-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
              {event.status === 'confirmed' ? 'Confirmed' : event.status === 'tentative' ? 'Tentative' : 'Selesai'}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-text group-hover:text-primary-light transition-colors mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-text-muted flex-1">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDateShort(event.startDate)}{event.startDate !== event.endDate && ` - ${formatDateShort(event.endDate)}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColor}`}>
            {event.category === 'international' ? 'Internasional' : event.category === 'national' ? 'Nasional' : 'Regional'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-light text-text-muted">
            {SPORT_LABELS[event.sport]}
          </span>
        </div>
      </div>
    </Link>
  );
}
