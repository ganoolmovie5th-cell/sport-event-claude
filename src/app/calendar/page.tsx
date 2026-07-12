import type { Metadata } from 'next';
import CalendarView from '@/components/CalendarView';

export const metadata: Metadata = {
  title: 'Kalender Event Olahraga',
  description: 'Lihat jadwal event olahraga Indonesia 2026-2030 dalam tampilan kalender bulanan.',
};

export default function CalendarPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Kalender Event</h1>
        <p className="text-text-muted">Lihat jadwal event olahraga Indonesia dalam tampilan kalender bulanan.</p>
      </div>
      <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
        <CalendarView />
      </div>
    </div>
  );
}
