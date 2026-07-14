import Link from 'next/link';
import { SportEvent, SPORT_EMOJI, SPORT_LABELS, formatDateShort } from '@/lib/data';

function formatDayName(dateStr: string) {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return days[new Date(dateStr).getDay()];
}

export default function EventCard({ event }: { event: SportEvent }) {
  const statusConfig = {
    confirmed: { cls: 'bg-success/15 text-success border-success/25',         label: '✓ Confirmed' },
    tentative: { cls: 'bg-accent/15 text-accent border-accent/25',             label: 'Tentative'   },
    completed: { cls: 'bg-text-muted/15 text-text-muted border-text-muted/20', label: 'Selesai'     },
  }[event.status];

  const categoryLabel = {
    international: 'Internasional',
    national:      'Nasional',
    regional:      'Regional',
  }[event.category];

  return (
    <Link href={`/events/${event.slug}`} className="block group h-full">
      <div className="relative h-full flex flex-col glass rounded-xl p-5 border border-border/50 card-hover overflow-hidden">
        {/* Sport emoji watermark */}
        <span className="absolute -bottom-3 -right-2 text-8xl opacity-[0.035] pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.055]">
          {SPORT_EMOJI[event.sport]}
        </span>

        {/* Top row: emoji + status */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-2xl">{SPORT_EMOJI[event.sport]}</span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${statusConfig.cls}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="relative font-semibold text-text group-hover:text-primary-light transition-colors duration-200 mb-3 line-clamp-2 leading-snug">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="relative space-y-1.5 text-sm text-text-muted flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">📅</span>
            <span>{formatDayName(event.startDate)}, {formatDateShort(event.startDate)}{event.startDate !== event.endDate && ` – ${formatDateShort(event.endDate)}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">📍</span>
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        {/* Footer chips */}
        <div className="relative flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary-light font-medium">
            {categoryLabel}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-light/80 text-text-muted">
            {SPORT_LABELS[event.sport]}
          </span>
        </div>
      </div>
    </Link>
  );
}
