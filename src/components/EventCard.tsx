import Link from 'next/link';
import { SportEvent, Sport, SPORT_EMOJI, SPORT_LABELS, formatDateShort } from '@/lib/data';

const SPORT_BORDER_COLOR: Partial<Record<Sport, string>> = {
  badminton: 'border-l-green-500',
  football: 'border-l-emerald-500',
  motogp: 'border-l-red-500',
  running: 'border-l-orange-500',
  cycling: 'border-l-yellow-500',
  surfing: 'border-l-cyan-500',
  basketball: 'border-l-amber-500',
  volleyball: 'border-l-blue-500',
  swimming: 'border-l-sky-500',
  athletics: 'border-l-orange-400',
  tennis: 'border-l-lime-500',
  golf: 'border-l-teal-500',
  esports: 'border-l-purple-500',
  'martial-arts': 'border-l-rose-500',
  'multi-sport': 'border-l-violet-500',
  motorsport: 'border-l-red-600',
};

function formatDayName(dateStr: string) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

export default function EventCard({ event }: { event: SportEvent }) {
  const statusColor = {
    confirmed: 'bg-success/20 text-success border-success/30',
    tentative: 'bg-accent/20 text-accent border-accent/30',
    completed: 'bg-text-muted/20 text-text-muted border-text-muted/30',
  }[event.status];

  const categoryColor = {
    international: 'bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary',
    national: 'bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary-light',
    regional: 'bg-gradient-to-r from-accent/20 to-amber-500/20 text-accent',
  }[event.category];

  const borderColor = SPORT_BORDER_COLOR[event.sport] || 'border-l-primary';

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className={`relative glass rounded-xl p-5 border-l-4 ${borderColor} card-hover h-full flex flex-col overflow-hidden`}>
        {/* Sport emoji watermark */}
        <span className="absolute -bottom-2 -right-2 text-7xl opacity-[0.04] pointer-events-none select-none transition-transform duration-500 group-hover:scale-110">
          {SPORT_EMOJI[event.sport]}
        </span>

        <div className="relative flex items-start justify-between mb-3">
          <span className="text-3xl drop-shadow-sm">{SPORT_EMOJI[event.sport]}</span>
          <div className="flex gap-1.5">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${statusColor} ${event.status === 'confirmed' ? 'status-pulse' : ''}`}>
              {event.status === 'confirmed' ? '✓ Confirmed' : event.status === 'tentative' ? 'Tentative' : 'Selesai'}
            </span>
          </div>
        </div>

        <h3 className="relative font-semibold text-text group-hover:text-primary-light transition-colors duration-300 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="relative space-y-1.5 text-sm text-text-muted flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs">📅</span>
            <span>{formatDayName(event.startDate)}, {formatDateShort(event.startDate)}{event.startDate !== event.endDate && ` - ${formatDateShort(event.endDate)}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">📍</span>
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${categoryColor}`}>
            {event.category === 'international' ? 'Internasional' : event.category === 'national' ? 'Nasional' : 'Regional'}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-light/80 text-text-muted">
            {SPORT_LABELS[event.sport]}
          </span>
        </div>
      </div>
    </Link>
  );
}
