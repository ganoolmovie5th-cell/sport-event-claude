# 🏆 SportEvent ID

Platform informasi jadwal event olahraga di Indonesia dari 2026 hingga 2030.

🌐 **Live:** [www.sport-event.web.id](https://www.sport-event.web.id)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Deploy:** Vercel
- **Scraper:** Python 3.12 (BeautifulSoup4)

## Fitur

- 🏠 **Beranda** — Hero section, event terdekat, statistik per cabor
- 📋 **Daftar Event** — 50+ event dengan pencarian & filter (olahraga/tahun/kota/status/promotor)
- 🔴 **Live Feed Status** — Badge On-Sale/Live/Selesai per event
- 📍 **Map Clustering** — Event locations peta dengan clustering by city
- 📄 **Detail Event** — Info lengkap: tanggal, venue, harga, link tiket + structured data JSON-LD
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

## SEO: addressCountry pakai kode ISO (Juli 2026)

GSC melaporkan `Cannot continue validation process` dengan 3 item contoh (Asian Games 2026, Asian Para Games 2026, Borobudur Marathon 2026). Pesan itu sendiri **bukan** error data — itu proses validasi GSC yang berhenti, biasanya karena markup halaman berubah saat validasi masih jalan. Tapi pengecekan menemukan bug nyata: field `country` di `data.ts` adalah prosa Bahasa Indonesia dan dikirim apa adanya sebagai `addressCountry`, padahal Google minta kode ISO 3166-1 alpha-2.

| nilai `country` | jumlah | sebelumnya | sekarang |
|---|---|---|---|
| `Indonesia` | 43 | `"Indonesia"` | `"ID"` |
| `Jepang` | 2 | `"Jepang"` (invalid) | `"JP"` |
| `Malaysia` | 1 | `"Malaysia"` | `"MY"` |
| `USA` | 1 | `"USA"` (bukan ISO) | `"US"` |
| `TBD` | 2 | `"TBD"` (bukan negara) | field dihapus |
| `USA/Meksiko/Kanada` | 1 | 3 negara dalam 1 string | field dihapus |

Map `COUNTRY_CODES` di `src/lib/eventJsonLd.ts` hanya dipakai untuk JSON-LD — string tampilan di UI tidak diubah. Untuk nilai yang bukan negara, `addressCountry` dihapus dan `addressLocality` (kota) tetap ada, jadi `address` masih valid. Verifikasi build: 43 `ID`, 2 `JP`, 1 `MY`, 1 `US`, 3 tanpa `addressCountry` — total 50 halaman event.

## SEO: offers pakai AggregateOffer (Juli 2026)

Rich Results Test melaporkan `missing field price`, `priceCurrency`, `validFrom` pada `offers`. Field `priceRange` di `data.ts` adalah prosa (`'Rp 150.000 - Rp 1.500.000'`), bukan angka, jadi sebelumnya cuma dikirim sebagai `description`. Sekarang `parsePriceRange()` di `src/lib/eventJsonLd.ts` mengurai kedua ujungnya jadi `AggregateOffer` dengan `lowPrice` + `highPrice` + `priceCurrency: 'IDR'` — tipe schema.org yang tepat untuk rentang harga, angkanya asli dari data (bukan karangan). Event tanpa `priceRange` tetap pakai `Offer` biasa. `validFrom` **tidak** ditambahkan: tanggal mulai penjualan tiket tidak ada di dataset, dan tanggal karangan lebih buruk daripada field recommended yang hilang. Hasil build: 25 dari 50 halaman event memuat `AggregateOffer`.

## Security: pin sharp ^0.35.3 (Juli 2026)

`sharp` masuk sebagai optionalDependency dari `next`, ter-hoist ke root `node_modules` pada versi `0.34.5` — kena GHSA-f88m-g3jw-g9cj (vulnerable `< 0.35.0`, patched `0.35.0`). Ditambah blok `overrides` di `package.json` supaya npm memaksa `^0.35.3`. Catatan: di Vercel `next/image` dilayani infrastruktur Image Optimization Vercel, jadi `sharp` tidak ada di request path — ini menutup alert lockfile, bukan exploit aktif. `npm run build` sukses.

## License

MIT
