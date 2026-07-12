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

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

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
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2.5 glass rounded-xl hover:bg-surface-light/50 text-text-muted hover:text-text transition-all duration-300 hover:scale-105">
          ←
        </button>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-text">{MONTHS[month]} {year}</h2>
          <p className="text-sm text-text-muted">{monthEvents.length} event bulan ini</p>
        </div>
        <button onClick={nextMonth} className="p-2.5 glass rounded-xl hover:bg-surface-light/50 text-text-muted hover:text-text transition-all duration-300 hover:scale-105">
          →
        </button>
      </div>

      {/* Year selector */}
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {[2026, 2027, 2028, 2029, 2030].map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              year === y
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20'
                : 'glass text-text-muted hover:text-text hover:scale-105'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
          <div key={d} className="text-center text-xs text-text-muted py-2 font-semibold uppercase tracking-wide">{d}</div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isTodayDate = isToday(day);

          return (
            <div
              key={day}
              className={`relative min-h-[60px] sm:min-h-[80px] p-1 rounded-xl border text-xs transition-all duration-200 group ${
                hasEvents
                  ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50'
                  : 'border-border/30 hover:border-border'
              } ${isTodayDate ? 'ring-2 ring-primary/50 ring-offset-1 ring-offset-background' : ''}`}
            >
              <span className={`block text-center mb-0.5 font-medium ${
                isTodayDate
                  ? 'text-primary-light font-bold'
                  : hasEvents ? 'text-primary-light' : 'text-text-muted'
              }`}>
                {day}
              </span>

              {/* Event dots */}
              {hasEvents && (
                <div className="flex justify-center gap-0.5 mb-0.5">
                  {dayEvents.slice(0, 3).map((e, idx) => (
                    <span key={idx} className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                  ))}
                </div>
              )}

              {dayEvents.slice(0, 2).map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="block truncate text-[10px] px-1 py-0.5 rounded bg-primary/15 text-primary-light hover:bg-primary/25 transition-colors mb-0.5"
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

      {/* Event list for month */}
      {monthEvents.length > 0 && (
        <div className="mt-8 space-y-2">
          <h3 className="font-semibold text-text text-sm mb-3">Event bulan ini:</h3>
          {monthEvents.map((e, index) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="stagger-item flex items-center gap-3 p-3 glass rounded-xl card-hover"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-xl">{SPORT_EMOJI[e.sport]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{e.title}</p>
                <p className="text-xs text-text-muted">{formatDateShort(e.startDate)} - {e.venue}</p>
              </div>
              <span className="text-text-muted text-sm">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
