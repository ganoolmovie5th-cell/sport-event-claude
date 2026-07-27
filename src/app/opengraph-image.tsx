import { ImageResponse } from 'next/og';

// Repo ships no image assets. This is the single crawlable image for OG tags and
// for schema.org `image` (Google flags Events that have none).
export const alt = 'SportEvent ID - Jadwal Event Olahraga Indonesia 2026-2030';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b1120 0%, #14532d 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 6, color: '#4ade80' }}>SPORTEVENT ID</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
          Jadwal Event Olahraga Indonesia
        </div>
        <div style={{ fontSize: 44, marginTop: 20, color: '#cbd5e1' }}>2026 – 2030</div>
      </div>
    ),
    size
  );
}
