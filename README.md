# SportEvent ID

Platform informasi jadwal event olahraga di Indonesia dari 2026 hingga 2030. Update otomatis harian via scraper.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · Python (scraper) · Vercel

**Live:** [sport-event.web.id](https://www.sport-event.web.id)

## Features

- 50+ event olahraga (MotoGP, Badminton, Asian Games, Marathon, Liga 1, dll)
- Pencarian & filter (olahraga/tahun/kota/status/promotor)
- Live Feed Status (badge On-Sale/Live/Selesai)
- Map clustering (event locations by city)
- Detail event (tanggal, venue, harga, link tiket, JSON-LD schema)
- Kalender bulanan dengan navigasi tahun
- Semi-auto scraper harian (7 sumber, GitHub Actions 02:00 WIB)
- Auto-update PR untuk HIGH confidence events
- SEO (sitemap, robots.txt, structured data Event schema)
- GTM analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx              → Homepage
    events/               → Events list + [slug] detail
    calendar/             → Calendar view
    about/                → About page
    sitemap.ts            → Dynamic sitemap
    robots.ts             → robots.txt
  components/             → Navbar, Footer, EventCard, FilterBar, CalendarView, Hero, Stats
  lib/
    data.ts               → Static data (50+ events)
scraper.py                → Scrape 7 sumber olahraga
auto_updater.py           → Inject HIGH confidence ke data.ts
email_reporter.py         → Kirim HTML report via Gmail
.github/workflows/
  scrape.yml              → Cron 02:00 WIB (scrape + PR)
```

## Scraper Sources

- allsportdb.com (HIGH)
- motogp.com/calendar (HIGH)
- bwfbadminton.com (HIGH)
- pssi.org (HIGH)
- kemenpora.go.id (HIGH)
- detik.com/sport (MEDIUM)
- marathons.ahotu.com (MEDIUM)

## License

MIT
