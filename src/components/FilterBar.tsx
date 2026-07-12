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
      {/* Search input with glass effect */}
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary-light">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari event olahraga..."
          className="w-full glass rounded-xl pl-11 pr-4 py-3.5 text-text placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1 rounded-full hover:bg-surface-light/50 transition-all"
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={sport}
          onChange={(e) => onSportChange(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Semua Olahraga</option>
          {sports.map((s) => (
            <option key={s} value={s}>{SPORT_EMOJI[s]} {SPORT_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Semua Kota</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Semua Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="tentative">Tentative</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      {/* Pill-shaped sport chips */}
      <div className="flex flex-wrap gap-2">
        {sports.slice(0, 8).map((s) => (
          <button
            key={s}
            onClick={() => onSportChange(sport === s ? '' : s)}
            className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              sport === s
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20 scale-105'
                : 'glass text-text-muted hover:text-text hover:scale-105'
            }`}
          >
            {SPORT_EMOJI[s]} {SPORT_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
