# SportEvent ID — Project Context & Conventions

## Overview

Platform informasi jadwal event olahraga Indonesia 2026-2030. Website dengan data 50+ event + semi-auto scraper harian.

- **Repo:** ganoolmovie5th-cell/sport-event-claude
- **Domain:** sport-event.web.id
- **Branch:** `main` (push langsung untuk manual; scraper pakai PR)
- **Stack:** Next.js 15 (App Router) + TypeScript strict + Tailwind CSS 4
- **Deploy:** Vercel (auto-deploy dari main)

---

## Aturan Penting

- Semua data statis di `src/lib/data.ts` — tidak ada database
- UI dalam Bahasa Indonesia
- Dark mode default (purple/indigo theme)
- Push langsung ke `main` untuk perubahan manual
- Scraper hasil → PR dulu, review, baru merge
- Setiap commit update README.md + steering file

---

## Semi-Auto Scraper

Jalan tiap hari **02:00 WIB** via GitHub Actions (`.github/workflows/scrape.yml`).

| File | Fungsi |
|------|--------|
| `scraper.py` | Scrape 7 sumber → `scraper_report.json` + HTML |
| `auto_updater.py` | Filter HIGH confidence → inject ke `data.ts` |
| `email_reporter.py` | Kirim HTML report via Gmail SMTP |
| `requirements.txt` | requests, beautifulsoup4, lxml |

**Sumber HIGH confidence** (auto-inject ke data.ts via PR):
- allsportdb.com, motogp.com, bwfbadminton.com, pssi.org, kemenpora.go.id

**Sumber MEDIUM** (email report saja, tidak auto-inject):
- detik.com/sport, marathons.ahotu.com

**GitHub Secrets wajib:**
- `GMAIL_APP_PASSWORD` — App Password Gmail
- `ADMIN_EMAIL` — email tujuan laporan

**Cara kerja inject:**
- Cari marker `export const events: SportEvent[] = [` di `data.ts`
- Inject entry baru sebelum `];\n` penutup array
- Entry baru: `status: 'tentative'`, deskripsi prefix `[AUTO-DETECTED]`
- Admin wajib verifikasi & ubah ke `confirmed` sebelum merge

---

## Design System (Dark Purple/Indigo)

| Token | Value | Usage |
|---|---|---|
| `background` | `#0f0a1e` | Page background |
| `surface` | `#1a1230` | Card/section bg |
| `surface-light` | `#241a40` | Hover/lighter surface |
| `primary` | `#8b5cf6` | CTA, accent |
| `primary-light` | `#a78bfa` | Text accent |
| `secondary` | `#6366f1` | Secondary accent |
| `accent` | `#f59e0b` | Warning/tentative |
| `text` | `#f1f5f9` | Primary text |
| `text-muted` | `#94a3b8` | Secondary text |
| `border` | `#2e1f4d` | Borders |
| `success` | `#10b981` | Confirmed status |
| `danger` | `#ef4444` | Error |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage: hero, featured events, stats |
| `/events` | All events with search & filters |
| `/events/[slug]` | Event detail page |
| `/calendar` | Monthly calendar view |
| `/about` | About the platform |

---

## Data Structure (`src/lib/data.ts`)

```typescript
interface SportEvent {
  id: string;           // numeric string, auto-increment
  slug: string;         // kebab-case, unik
  title: string;
  sport: Sport;         // 16 jenis: badminton | football | motogp | running | ...
  category: 'international' | 'national' | 'regional';
  status: 'confirmed' | 'tentative' | 'completed';
  startDate: string;    // YYYY-MM-DD
  endDate: string;      // YYYY-MM-DD
  venue: string;
  city: string;
  country: string;      // selalu 'Indonesia'
  description: string;
  ticketUrl?: string;
  websiteUrl?: string;
  priceRange?: string;
  imageEmoji: string;
  tags: string[];
  athletes?: string;
  organizer?: string;
}
```

Helper functions: `getEventBySlug`, `getUpcomingEvents`, `getAllCities`, `getAllYears`, `getAllSports`, `formatDate`, `formatDateShort`

---

## SEO & Analytics

- **metadataBase:** `https://sport-event.web.id`
- **sitemap.ts:** dynamic sitemap via Next.js App Router → `/sitemap.xml`
- **robots.ts:** dynamic robots.txt → `/robots.txt`
- **public/sitemap.xml:** static backup sitemap
- **public/robots.txt:** static backup robots.txt
- **GTM:** GTM-WLTFVQZ6 (via `next/script`, `strategy="beforeInteractive"`)
- **Google Search Console:** verified via `metadata.verification.google`

---

## Components

| Component | Purpose |
|---|---|
| `Navbar.tsx` | Sticky navigation |
| `Footer.tsx` | Footer links |
| `EventCard.tsx` | Card for event list |
| `FilterBar.tsx` | Search + filters |
| `CalendarView.tsx` | Monthly grid calendar |
| `HeroSection.tsx` | Homepage hero |
| `StatsSection.tsx` | Stats by sport |

---

## Verifikasi (WAJIB)

```bash
npm run build   # harus sukses sebelum merge
```

---

## Commit Convention

```
<type>: <deskripsi singkat>
```
Type: `feat` `fix` `refactor` `chore` `docs`

Auto-scraper commit format: `feat(auto): tambah N event baru (HIGH confidence) — YYYYMMDD-HHMM`
