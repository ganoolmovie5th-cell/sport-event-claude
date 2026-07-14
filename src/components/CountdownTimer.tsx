'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(startDate: string, endDate: string): 'ongoing' | 'finished' | TimeLeft {
  const now   = Date.now();
  const start = new Date(startDate).getTime();
  const end   = new Date(endDate).getTime() + 86400000; // end of end day

  if (now >= end)   return 'finished';
  if (now >= start) return 'ongoing';

  const diff = start - now;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ startDate, endDate }: { startDate: string; endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<'ongoing' | 'finished' | TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(startDate, endDate));
    const id = setInterval(() => setTimeLeft(getTimeLeft(startDate, endDate)), 1000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  if (!timeLeft) return null;

  if (timeLeft === 'finished') {
    return (
      <div className="glass-light rounded-xl px-5 py-3 text-center">
        <p className="text-sm text-text-muted">Event telah selesai</p>
      </div>
    );
  }

  if (timeLeft === 'ongoing') {
    return (
      <div className="glass-light rounded-xl px-5 py-3 text-center border border-success/30">
        <span className="inline-flex items-center gap-2 text-success text-sm font-medium">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Event sedang berlangsung
        </span>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days,    label: 'Hari'  },
    { value: timeLeft.hours,   label: 'Jam'   },
    { value: timeLeft.minutes, label: 'Menit' },
    { value: timeLeft.seconds, label: 'Detik' },
  ];

  return (
    <div className="glass-light rounded-xl p-5">
      <p className="text-xs text-text-muted text-center mb-3 uppercase tracking-wide">Mulai dalam</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        {units.map(({ value, label }) => (
          <div key={label} className="glass rounded-lg py-3">
            <p className="text-2xl font-bold tabular-nums text-primary-light">
              {String(value).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
