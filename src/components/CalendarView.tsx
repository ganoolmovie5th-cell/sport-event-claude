'use client';

import { useState } from 'react';
import Link from 'next/link';
import { events, SPORT_EMOJI, formatDateShort } from '@/lib/data';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function CalendarView() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(new Date().getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthEvents = events.filter((e) => {
    const d = new Date(e.startDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const getEventsForDay = (day: number) => {
    return monthEvents.filter((e) => {
      const start = new Date(e.startDate).getDate();
      const end = new Date(e.endDate).getDate();
      const endMonth = new Date(e.endDate).getMonth();
      if (endMonth === month) return day >= start && day <= end;
      return day >= start;
    });
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 bg-surface border border-border rounded-lg hover:border-primary/50 text-text-muted hover:text-text transition-colors">
          ←
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-text">{MONTHS[month]} {year}</h2>
          <p className="text-sm text-text-muted">{monthEvents.length} event bulan ini</p>
        </div>
        <button onClick={nextMonth} className="p-2 bg-surface border border-border rounded-lg hover:border-primary/50 text-text-muted hover:text-text transition-colors">
          →
        </button>
      </div>

      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {[2026, 2027, 2028, 2029, 2030].map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              year === y ? 'bg-primary/20 border-primary text-primary-light' : 'border-border text-text-muted hover:border-primary/30'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
          <div key={d} className="text-center text-xs text-text-muted py-2 font-medium">{d}</div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day}
              className={`min-h-[60px] sm:min-h-[80px] p-1 rounded-lg border text-xs ${
                hasEvents ? 'border-primary/30 bg-primary/5' : 'border-border/50'
              }`}
            >
              <span className={`block text-center mb-0.5 ${hasEvents ? 'text-primary-light font-bold' : 'text-text-muted'}`}>
                {day}
              </span>
              {dayEvents.slice(0, 2).map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="block truncate text-[10px] px-1 py-0.5 rounded bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors mb-0.5"
                >
                  {SPORT_EMOJI[e.sport]} {e.title.substring(0, 15)}
                </Link>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[10px] text-text-muted px-1">+{dayEvents.length - 2} lagi</span>
              )}
            </div>
          );
        })}
      </div>

      {monthEvents.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-text text-sm">Event bulan ini:</h3>
          {monthEvents.map((e) => (
            <Link key={e.id} href={`/events/${e.slug}`} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors">
              <span className="text-xl">{SPORT_EMOJI[e.sport]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{e.title}</p>
                <p className="text-xs text-text-muted">{formatDateShort(e.startDate)} - {e.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
