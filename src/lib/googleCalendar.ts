import { SportEvent } from './data';

export function googleCalendarUrl(event: SportEvent): string {
  const fmt = (d: string) => d.replace(/-/g, '');
  const endExclusive = (() => {
    const d = new Date(event.endDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  })();

  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${fmt(event.startDate)}/${endExclusive}` +
    `&details=${encodeURIComponent(event.description)}` +
    `&location=${encodeURIComponent(`${event.venue}, ${event.city}, Indonesia`)}`
  );
}
