'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { events } from '@/lib/data';
import EventCard from '@/components/EventCard';
import FilterBar from '@/components/FilterBar';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [sport, setSport]   = useState('');
  const [year, setYear]     = useState('');
  const [city, setCity]     = useState('');
  const [status, setStatus] = useState('');
  const [view, setView]     = useState<'list' | 'map'>('list');

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

  function handleCitySelect(selectedCity: string) {
    setCity(selectedCity);
    setView('list');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Semua Event Olahraga</h1>
          <p className="text-text-muted">Temukan {events.length} event olahraga di Indonesia dari 2026 hingga 2030</p>
        </div>
        <div className="flex glass rounded-lg p-1 gap-1 shrink-0">
          <button onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-text'}`}>
            ☰ List
          </button>
          <button onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'map' ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-text'}`}>
            🗺 Peta
          </button>
        </div>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        sport={sport}   onSportChange={setSport}
        year={year}     onYearChange={setYear}
        city={city}     onCityChange={setCity}
        status={status} onStatusChange={setStatus}
      />

      {view === 'map' ? (
        <div className="mt-6">
          <MapView events={filtered} onCitySelect={handleCitySelect} />
        </div>
      ) : (
        <>
          <div className="mt-6 mb-4 flex items-center gap-3 text-sm text-text-muted">
            <span>Menampilkan {filtered.length} dari {events.length} event</span>
            {city && (
              <button onClick={() => setCity('')} className="text-primary-light hover:underline">
                × hapus filter kota
              </button>
            )}
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
        </>
      )}
    </div>
  );
}
