# 🏆 SportEvent ID

Platform informasi jadwal event olahraga di Indonesia dari 2026 hingga 2030.

## Demo

Deploy ke Vercel: [sport-event-claude.vercel.app](https://sport-event-claude.vercel.app)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Deploy:** Vercel

## Fitur

- 🏠 **Beranda** — Hero section, event terdekat, statistik per cabor
- 📋 **Daftar Event** — 50 event dengan pencarian & filter (olahraga/tahun/kota/status)
- 📄 **Detail Event** — Info lengkap: tanggal, venue, harga, link tiket
- 📅 **Kalender** — Tampilan kalender bulanan dengan navigasi tahun
- ℹ️ **Tentang** — Informasi platform

## Event yang Dicakup

- MotoGP Mandalika (2026-2029)
- Indonesia Open & Masters Badminton (2026-2030)
- Asian Games 2026 & 2030
- FIFA World Cup 2026
- Olimpiade Los Angeles 2028
- SEA Games 2027 & 2029
- Jakarta Marathon, Bali Marathon, Borobudur Marathon
- Liga 1 Indonesia (2026-2030)
- Tour de Flores, Tour de Banyuwangi
- WSBK Mandalika
- Indonesian Surfing Championship
- Indonesia Open Golf & Tennis
- PON XXI 2028
- Dan banyak lagi...

## Getting Started

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Tailwind + theme
│   ├── events/
│   │   ├── page.tsx      # Events list
│   │   └── [slug]/
│   │       └── page.tsx  # Event detail
│   ├── calendar/
│   │   └── page.tsx      # Calendar view
│   └── about/
│       └── page.tsx      # About page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   ├── FilterBar.tsx
│   ├── CalendarView.tsx
│   ├── HeroSection.tsx
│   └── StatsSection.tsx
└── lib/
    └── data.ts           # Static data (50 events)
```

## License

MIT
