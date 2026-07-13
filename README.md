# 🏆 SportEvent ID

Platform informasi jadwal event olahraga di Indonesia dari 2026 hingga 2030.

🌐 **Live:** [sport-event.web.id](https://sport-event.web.id)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Deploy:** Vercel
- **Scraper:** Python 3.12 (BeautifulSoup4)

## Fitur

- 🏠 **Beranda** — Hero section, event terdekat, statistik per cabor
- 📋 **Daftar Event** — 50+ event dengan pencarian & filter (olahraga/tahun/kota/status)
- 📄 **Detail Event** — Info lengkap: tanggal, venue, harga, link tiket
- 📅 **Kalender** — Tampilan kalender bulanan dengan navigasi tahun
- ℹ️ **Tentang** — Informasi platform
- 🤖 **Semi-Auto Scraper** — Update harian otomatis via GitHub Actions

## Event yang Dicakup

- MotoGP & WSBK Mandalika (2026-2029)
- Indonesia Open & Masters Badminton (2026-2030)
- Asian Games 2026 & 2030
- FIFA World Cup 2026
- Olimpiade Los Angeles 2028
- SEA Games 2027 & 2029
- Jakarta Marathon, Bali Marathon, Borobudur Marathon
- Liga 1 Indonesia (2026-2030)
- Tour de Flores, Tour de Banyuwangi
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
sport-event-claude/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Root layout (GTM, metadata)
│   │   ├── globals.css           # Tailwind + theme
│   │   ├── sitemap.ts            # /sitemap.xml (dynamic)
│   │   ├── robots.ts             # /robots.txt
│   │   ├── events/
│   │   │   ├── page.tsx          # Events list
│   │   │   └── [slug]/page.tsx   # Event detail
│   │   ├── calendar/page.tsx     # Calendar view
│   │   └── about/page.tsx        # About page
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EventCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CalendarView.tsx
│   │   ├── HeroSection.tsx
│   │   └── StatsSection.tsx
│   └── lib/
│       └── data.ts               # Static data (50+ events)
├── public/
│   ├── sitemap.xml               # Static sitemap
│   └── robots.txt                # Static robots.txt
├── scraper.py                    # Scrape 7 sumber olahraga
├── auto_updater.py               # Inject HIGH confidence ke data.ts
├── email_reporter.py             # Kirim HTML report via Gmail
├── requirements.txt              # Python deps
└── .github/workflows/
    └── scrape.yml                # Cron 02:00 WIB → scrape → PR
```

## Semi-Auto Scraper

Update otomatis tiap hari jam **02:00 WIB** via GitHub Actions.

**Sumber:**

| Sumber | Data | Reliability |
|--------|------|-------------|
| allsportdb.com | Multi-sport calendar Indonesia | HIGH |
| motogp.com/calendar | MotoGP schedule | HIGH |
| bwfbadminton.com | Badminton world tour | HIGH |
| pssi.org | Tim nasional sepak bola | HIGH |
| kemenpora.go.id | Event nasional | HIGH |
| detik.com/sport | Berita jadwal event | MEDIUM |
| marathons.ahotu.com | Running events Indonesia | MEDIUM |

**Workflow:**
1. Scrape → deduplikasi → klasifikasi
2. HIGH confidence → inject ke `data.ts` → buat PR otomatis
3. Semua hasil → email report ke admin
4. Admin review PR → merge jika valid

**GitHub Secrets yang wajib di-set:**

| Secret | Value |
|--------|-------|
| `GMAIL_APP_PASSWORD` | App Password Gmail |
| `ADMIN_EMAIL` | Email tujuan laporan |

Jalankan manual: GitHub → Actions → "Daily Sport Event Monitor" → Run workflow

## SEO & Analytics

- **Domain:** sport-event.web.id
- **Sitemap:** sport-event.web.id/sitemap.xml
- **Google Search Console:** verified
- **Google Tag Manager:** GTM-WLTFVQZ6

## License

MIT
