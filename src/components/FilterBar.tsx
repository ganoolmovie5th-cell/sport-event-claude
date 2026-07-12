'use client';

import { Sport, SPORT_EMOJI, SPORT_LABELS, getAllSports, getAllYears, getAllCities } from '@/lib/data';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sport: string;
  onSportChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
  city: string;
  onCityChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

export default function FilterBar({
  search, onSearchChange,
  sport, onSportChange,
  year, onYearChange,
  city, onCityChange,
  status, onStatusChange,
}: FilterBarProps) {
  const sports = getAllSports();
  const years = getAllYears();
  const cities = getAllCities();

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari event olahraga..."
          className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={sport}
          onChange={(e) => onSportChange(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
        >
          <option value="">Semua Olahraga</option>
          {sports.map((s) => (
            <option key={s} value={s}>{SPORT_EMOJI[s]} {SPORT_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
        >
          <option value="">Semua Kota</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
        >
          <option value="">Semua Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="tentative">Tentative</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {sports.slice(0, 8).map((s) => (
          <button
            key={s}
            onClick={() => onSportChange(sport === s ? '' : s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              sport === s
                ? 'bg-primary/20 border-primary text-primary-light'
                : 'border-border text-text-muted hover:border-primary/30'
            }`}
          >
            {SPORT_EMOJI[s]} {SPORT_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
