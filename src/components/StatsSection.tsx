import { events, SPORT_LABELS, SPORT_EMOJI } from '@/lib/data';

export default function StatsSection() {
  const sportCounts = events.reduce((acc, e) => {
    acc[e.sport] = (acc[e.sport] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sorted = Object.entries(sportCounts).sort((a, b) => b[1] - a[1]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">Statistik Event per Cabang Olahraga</h2>
          <p className="text-text-muted">Distribusi event berdasarkan jenis olahraga</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map(([sport, count], index) => (
            <div
              key={sport}
              className="stagger-item glass rounded-xl p-5 card-hover group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Unique gradient border glow per card */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1), transparent 70%)` }}
              />

              <div className="relative text-center">
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform duration-300">
                  {SPORT_EMOJI[sport as keyof typeof SPORT_EMOJI]}
                </span>
                <p className="text-2xl font-bold text-primary-light tabular-nums mb-1">{count}</p>
                <p className="text-xs text-text-muted font-medium">{SPORT_LABELS[sport as keyof typeof SPORT_LABELS]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
