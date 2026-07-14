'use client';

import { useEffect, useRef } from 'react';
import { SportEvent } from '@/lib/data';

const CITY_COORDS: Record<string, [number, number]> = {
  'Jakarta':           [-6.2088, 106.8456],
  'Seluruh Indonesia': [-2.5489, 118.0149],
  'Gianyar':           [-8.5432, 115.1030],
  'Lombok':            [-8.6529, 116.3242],
  'Surabaya':          [-7.2575, 112.7521],
  'Banyuwangi':        [-8.2192, 114.3691],
  'Flores':            [-8.6574, 122.0161],
  'Bandung':           [-6.9175, 107.6191],
  'Magelang':          [-7.4797, 110.2177],
  'Bali':              [-8.3405, 115.0920],
};

function getCityCoords(city: string): [number, number] | null {
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (city.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(city.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

interface Props {
  events: SportEvent[];
  onCitySelect: (city: string) => void;
}

export default function MapView({ events, onCitySelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    import('leaflet').then((L) => {
      // Fix marker icon webpack issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-2.5489, 118.0149],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      instanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Group events by city
      const cityMap = new Map<string, { coords: [number, number]; count: number; city: string }>();
      for (const event of events) {
        const coords = getCityCoords(event.city);
        if (!coords) continue;
        const existing = cityMap.get(event.city);
        if (existing) existing.count++;
        else cityMap.set(event.city, { coords, count: 1, city: event.city });
      }

      cityMap.forEach(({ coords, count, city }) => {
        const marker = L.circleMarker(coords, {
          radius: 8 + Math.min(count * 2, 16),
          fillColor: '#8b5cf6',
          color: '#a78bfa',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindTooltip(`<b>${city}</b><br/>${count} event`, {
          permanent: false,
          className: 'leaflet-tooltip-custom',
        });

        marker.on('click', () => onCitySelect(city));
      });
    });

    return () => {
      if (instanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (instanceRef.current as any).remove();
        instanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50">
        <p className="text-sm text-text-muted">Klik pin kota untuk filter event</p>
      </div>
      <div ref={mapRef} style={{ height: '420px', width: '100%' }} />
      <style>{`
        .leaflet-tooltip-custom {
          background: #1a1230;
          border: 1px solid #2e1f4d;
          color: #f1f5f9;
          font-size: 12px;
          border-radius: 8px;
          padding: 6px 10px;
        }
        .leaflet-control-attribution { font-size: 9px; opacity: 0.5; }
      `}</style>
    </div>
  );
}
