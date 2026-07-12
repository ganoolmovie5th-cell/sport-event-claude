import { events, SPORT_LABELS, SPORT_EMOJI } from '@/lib/data';

export default function StatsSection() {
  const sportCounts = events.reduce((acc, e) => {
    acc[e.sport] = (acc[e.sport] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sorted = Object.entries(sportCounts).sort((a, b) => b[1] - a[1]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text mb-6">Statistik Event per Cabang Olahraga</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sorted.map(([sport, count]) => (
            <div key={sport} className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">{SPORT_EMOJI[sport as keyof typeof SPORT_EMOJI]}</span>
              <div>
                <p className="font-medium text-text text-sm">{SPORT_LABELS[sport as keyof typeof SPORT_LABELS]}</p>
                <p className="text-xs text-text-muted">{count} event</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
