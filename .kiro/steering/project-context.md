# SportEvent ID — Project Context & Conventions

## Overview

Platform informasi jadwal event olahraga Indonesia 2026-2030. Website statis dengan data ~50 event.

- **Repo:** ganoolmovie5th-cell/sport-event-claude
- **Branch:** `main` (push langsung)
- **Stack:** Next.js 15 (App Router) + TypeScript strict + Tailwind CSS 4
- **Deploy:** Vercel

---

## Aturan Penting

- Semua data statis di `src/lib/data.ts` — tidak ada database
- UI dalam Bahasa Indonesia
- Dark mode default (purple/indigo theme)
- Push langsung ke `main`, tanpa PR
- Setiap commit update README.md + steering file

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

## Data Structure

`src/lib/data.ts` contains:
- `SportEvent` interface
- `Sport` type (16 sports)
- `events` array (50 entries)
- Helper functions: getEventBySlug, getUpcomingEvents, formatDate, etc.

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
npm run build   # harus sukses
```

---

## Commit Convention

```
<type>: <deskripsi singkat>
```
Type: `feat` `fix` `refactor` `chore` `docs`
