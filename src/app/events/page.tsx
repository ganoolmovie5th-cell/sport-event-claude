'use client';

import { useState, useMemo } from 'react';
import { events, Sport } from '@/lib/data';
import EventCard from '@/components/EventCard';
import FilterBar from '@/components/FilterBar';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.venue.toLowerCase().includes(search.toLowerCase())) return false;
      if (sport && e.sport !== sport) return false;
      if (year && new Date(e.startDate).getFullYear() !== Number(year)) return false;
      if (city && e.city !== city) return false;
      if (status && e.status !== status) return false;
      return true;
    }).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [search, sport, year, city, status]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Semua Event Olahraga</h1>
        <p className="text-text-muted">Temukan {events.length} event olahraga di Indonesia dari 2026 hingga 2030</p>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        sport={sport} onSportChange={setSport}
        year={year} onYearChange={setYear}
        city={city} onCityChange={setCity}
        status={status} onStatusChange={setStatus}
      />

      <div className="mt-6 mb-4 text-sm text-text-muted">
        Menampilkan {filtered.length} dari {events.length} event
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-text-muted">Tidak ada event yang cocok dengan filter kamu.</p>
        </div>
      )}
    </div>
  );
}
