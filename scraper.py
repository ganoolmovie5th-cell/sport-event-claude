#!/usr/bin/env python3
"""
SportEvent ID — Daily Monitoring Scraper
=========================================
Jalan tiap hari jam 02:00 WIB via GitHub Actions.
TIDAK menulis ke data.ts langsung.

Cara kerja:
  1. Scrape sumber sport event Indonesia
  2. Bandingkan dengan data existing di src/lib/data.ts
  3. Generate laporan JSON → dikirim ke email sebagai HTML report
  4. Item HIGH confidence → auto_updater.py inject ke data.ts → buat PR
  5. Kamu review & merge

Sumber:
  - allsportdb.com (multi-sport Indonesia)
  - motogp.com/calendar (MotoGP)
  - bwfbadminton.com (Badminton)
  - pssi.org (Sepak Bola)
  - detik.com/sport (berita jadwal)
  - kemenpora.go.id (event nasional)
  - marathons.ahotu.com (running Indonesia)
"""

import json
import re
import sys
import time
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
WIB         = timezone(timedelta(hours=7))
NOW_WIB     = datetime.now(WIB)
TODAY_STR   = NOW_WIB.strftime("%Y-%m-%d")
TODAY_LABEL = NOW_WIB.strftime("%d %b %Y %H:%M WIB")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.google.com/",
}

DATA_TS_PATH  = Path(__file__).parent / "src" / "lib" / "data.ts"
REPORT_PATH   = Path(__file__).parent / "scraper_report.json"
REPORT_HTML   = Path(__file__).parent / "scraper_report.html"

SPORT_KEYWORDS = [
    "motogp", "moto gp", "mandalika", "badminton", "bwf", "thomas cup", "uber cup",
    "piala thomas", "piala uber", "indonesia open", "indonesia masters",
    "liga 1", "pssi", "timnas", "sea games", "asian games", "olympics", "olimpiade",
    "marathon", "lari", "running", "sepeda", "cycling", "surfing", "selancar",
    "basket", "bola basket", "voli", "renang", "swimming", "tenis", "tennis",
    "golf", "esports", "pencak silat", "asian para", "pon 2028", "wsbk",
    "world superbike", "atletik", "athletics",
]

INDONESIA_KEYWORDS = ["indonesia", "jakarta", "bali", "mandalika", "lombok", "surabaya", "bandung"]

# ── Baca event yang sudah ada di data.ts ──────────────────────────────────────
def get_existing_slugs() -> set[str]:
    if not DATA_TS_PATH.exists():
        return set()
    content = DATA_TS_PATH.read_text(encoding="utf-8")
    return set(re.findall(r"slug:\s*'([^']+)'", content))

def get_existing_titles() -> set[str]:
    if not DATA_TS_PATH.exists():
        return set()
    content = DATA_TS_PATH.read_text(encoding="utf-8")
    return {t.lower().strip() for t in re.findall(r"title:\s*'([^']+)'", content)}

def normalize(name: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", name.lower()).strip()

def already_exists(title: str, existing_titles: set[str]) -> bool:
    norm = normalize(title)
    if not norm or len(norm) < 5:
        return True
    for et in existing_titles:
        if norm in et or et in norm:
            return True
    return False

def is_sport_event(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in SPORT_KEYWORDS) and any(k in t for k in INDONESIA_KEYWORDS)

# ── Fetcher ───────────────────────────────────────────────────────────────────
def fetch(url: str, timeout: int = 15) -> BeautifulSoup | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as exc:
        log.warning(f"fetch failed: {url} → {exc}")
        return None

# ── Scrapers ──────────────────────────────────────────────────────────────────

def scrape_allsportdb() -> list[dict]:
    """allsportdb.com — database multi-sport calendar Indonesia."""
    found = []
    urls = [
        "https://www.allsportdb.com/Countries/Indonesia",
        "https://www.allsportdb.com/Countries/Indonesia/2026",
        "https://www.allsportdb.com/Countries/Indonesia/2027",
    ]
    for url in urls:
        soup = fetch(url)
        if not soup:
            continue
        for row in soup.select("table tr, .event-row, [class*='event'], [class*='match'], li")[:40]:
            title_el = row.select_one("td, a, h3, h4, .name, [class*='title']")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if len(title) < 5 or not any(k in title.lower() for k in SPORT_KEYWORDS + INDONESIA_KEYWORDS):
                continue
            date_el = row.select_one("time, [class*='date'], td:nth-child(2)")
            date    = date_el.get_text(strip=True) if date_el else ""
            link_el = row.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and link.startswith("/"):
                link = "https://www.allsportdb.com" + link
            found.append({
                "title": title, "url": link, "date": date,
                "source": "allsportdb.com", "source_label": "AllSportDB",
                "reliability": "HIGH",
            })
        time.sleep(1)
    log.info(f"allsportdb: {len(found)} events")
    return found


def scrape_motogp() -> list[dict]:
    """motogp.com — jadwal resmi MotoGP."""
    found = []
    for url in [
        "https://www.motogp.com/en/calendar",
        "https://www.motogp.com/en/races/2026",
        "https://www.motogp.com/en/races/2027",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for ev in soup.select("[class*='event'], [class*='race'], [class*='round'], [class*='card'], article")[:30]:
            title_el = ev.select_one("h1,h2,h3,h4,.title,[class*='title'],[class*='name']")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 3:
                continue
            if "indonesia" not in title.lower() and "mandalika" not in title.lower():
                continue
            date_el = ev.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            link_el = ev.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and link.startswith("/"):
                link = "https://www.motogp.com" + link
            found.append({
                "title": f"MotoGP {title}" if "motogp" not in title.lower() else title,
                "url": link, "date": date, "venue": "Pertamina Mandalika Circuit",
                "city": "Lombok", "sport": "motogp",
                "source": "motogp.com", "source_label": "MotoGP Official",
                "reliability": "HIGH",
            })
        time.sleep(1)
    log.info(f"motogp: {len(found)} events")
    return found


def scrape_bwf() -> list[dict]:
    """bwfbadminton.com — jadwal resmi BWF Badminton."""
    found = []
    for url in [
        "https://bwfbadminton.com/calendar/",
        "https://bwfbadminton.com/events/",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for ev in soup.select("[class*='event'], [class*='tournament'], [class*='card'], article, li")[:40]:
            title_el = ev.select_one("h1,h2,h3,h4,.title,[class*='title'],[class*='name'],a")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 5:
                continue
            if not any(k in title.lower() for k in ["indonesia", "jakarta", "masters", "open"]):
                continue
            date_el = ev.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            venue_el = ev.select_one("[class*='venue'],[class*='location'],[class*='city']")
            venue   = venue_el.get_text(strip=True) if venue_el else ""
            link_el = ev.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and not link.startswith("http"):
                link = "https://bwfbadminton.com" + link
            found.append({
                "title": title, "url": link, "date": date, "venue": venue,
                "city": "Jakarta", "sport": "badminton",
                "source": "bwfbadminton.com", "source_label": "BWF Badminton",
                "reliability": "HIGH",
            })
        time.sleep(1)
    log.info(f"bwf: {len(found)} events")
    return found


def scrape_pssi() -> list[dict]:
    """pssi.org — jadwal resmi PSSI / Timnas Indonesia."""
    found = []
    for url in [
        "https://www.pssi.org/fixtures",
        "https://www.pssi.org/competition",
        "https://www.pssi.org/news",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for ev in soup.select("[class*='match'], [class*='fixture'], [class*='event'], [class*='card'], article")[:30]:
            title_el = ev.select_one("h1,h2,h3,h4,.title,[class*='title'],a,[class*='name']")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 5:
                continue
            date_el = ev.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            link_el = ev.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and link.startswith("/"):
                link = "https://www.pssi.org" + link
            found.append({
                "title": title, "url": link, "date": date,
                "sport": "football",
                "source": "pssi.org", "source_label": "PSSI Official",
                "reliability": "HIGH",
            })
        time.sleep(1)
    log.info(f"pssi: {len(found)} events")
    return found


def scrape_detik() -> list[dict]:
    """detik.com/sport — berita jadwal event olahraga Indonesia."""
    found = []
    for url in [
        "https://sport.detik.com/sport-lain/",
        "https://sport.detik.com/sepakbola/",
        "https://sport.detik.com/otomotif/",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for art in soup.select("article,[class*='article'],[class*='news'],[class*='card']")[:20]:
            title_el = art.select_one("h1,h2,h3,h4,[class*='title'],a")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 10:
                continue
            if not is_sport_event(title):
                continue
            link_el = art.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            date_el = art.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            found.append({
                "title": title, "url": link, "date": date,
                "source": "detik.com", "source_label": "Detik Sport",
                "reliability": "MEDIUM",
            })
        time.sleep(1)
    log.info(f"detik: {len(found)} articles")
    return found


def scrape_kemenpora() -> list[dict]:
    """kemenpora.go.id — event olahraga nasional resmi."""
    found = []
    for url in [
        "https://www.kemenpora.go.id/berita",
        "https://www.kemenpora.go.id/agenda",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for art in soup.select("article,[class*='article'],[class*='news'],[class*='card'],[class*='agenda']")[:20]:
            title_el = art.select_one("h1,h2,h3,h4,[class*='title'],a")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 10:
                continue
            link_el = art.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and link.startswith("/"):
                link = "https://www.kemenpora.go.id" + link
            date_el = art.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            found.append({
                "title": title, "url": link, "date": date,
                "source": "kemenpora.go.id", "source_label": "Kemenpora",
                "reliability": "HIGH",
            })
        time.sleep(1)
    log.info(f"kemenpora: {len(found)} events")
    return found


def scrape_marathons_ahotu() -> list[dict]:
    """marathons.ahotu.com — jadwal marathon & running Indonesia."""
    found = []
    for url in [
        "https://marathons.ahotu.com/calendar/marathon/indonesia",
        "https://marathons.ahotu.com/calendar/halfmarathon/indonesia",
    ]:
        soup = fetch(url)
        if not soup:
            continue
        for ev in soup.select("[class*='event'], [class*='race'], [class*='card'], article, li.race")[:30]:
            title_el = ev.select_one("h1,h2,h3,h4,.title,[class*='title'],[class*='name'],a")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 5:
                continue
            date_el = ev.select_one("time,[class*='date'],[class*='time']")
            date    = date_el.get_text(strip=True) if date_el else ""
            venue_el = ev.select_one("[class*='venue'],[class*='location'],[class*='city']")
            venue   = venue_el.get_text(strip=True) if venue_el else ""
            link_el = ev.select_one("a[href]")
            link    = link_el["href"] if link_el else ""
            if link and link.startswith("/"):
                link = "https://marathons.ahotu.com" + link
            found.append({
                "title": title, "url": link, "date": date, "venue": venue,
                "sport": "running",
                "source": "marathons.ahotu.com", "source_label": "Ahotu Marathons",
                "reliability": "MEDIUM",
            })
        time.sleep(1)
    log.info(f"ahotu: {len(found)} events")
    return found


# ── Deduplicate & Classify ─────────────────────────────────────────────────────

def deduplicate(items: list[dict]) -> list[dict]:
    seen   = set()
    result = []
    for item in items:
        key = normalize(item.get("title", ""))[:50]
        if key and key not in seen:
            seen.add(key)
            result.append(item)
    return result


def classify_items(items: list[dict], existing_titles: set[str]) -> dict:
    new_potential = []
    updates       = []
    irrelevant    = []

    for item in items:
        title = item.get("title", "")
        if already_exists(title, existing_titles):
            updates.append(item)
        elif is_sport_event(title) or item.get("sport"):
            new_potential.append(item)
        else:
            irrelevant.append(item)

    return {
        "new_potential": new_potential,
        "updates":       updates,
        "irrelevant":    irrelevant,
    }


# ── Report Generator ──────────────────────────────────────────────────────────

def generate_html_report(classified: dict, raw_count: int, today: str) -> str:
    new_items    = classified["new_potential"]
    update_items = classified["updates"]

    def item_row(item: dict, highlight: bool = False) -> str:
        title    = item.get("title", "-")
        url      = item.get("url", "#")
        date     = item.get("date", "")
        venue    = item.get("venue", "")
        source   = item.get("source_label", item.get("source", ""))
        sport    = item.get("sport", "")
        rel      = item.get("reliability", "")
        rel_color = {"HIGH": "#4ade80", "MEDIUM": "#fbbf24", "LOW": "#f87171"}.get(rel, "#a1a1aa")
        bg        = "rgba(59,130,246,0.08)" if highlight else "transparent"

        return f"""
        <tr style="background:{bg};border-bottom:1px solid #27272a;">
          <td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:13px;color:#ffffff;max-width:280px;">
            <a href="{url}" style="color:#60a5fa;text-decoration:none;font-weight:600;">{title[:80]}</a>
            {f'<br/><span style="font-size:11px;color:#a1a1aa;">🏅 {sport}</span>' if sport else ''}
          </td>
          <td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:12px;color:#a1a1aa;white-space:nowrap;">{date[:20] if date else '—'}</td>
          <td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:12px;color:#a1a1aa;">{venue[:30] if venue else '—'}</td>
          <td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:12px;color:#a1a1aa;">{source}</td>
          <td style="padding:10px 12px;text-align:center;">
            <span style="font-size:11px;font-weight:700;color:{rel_color};background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:99px;">{rel}</span>
          </td>
        </tr>"""

    new_rows    = "".join(item_row(i, highlight=True) for i in new_items[:30]) if new_items    else '<tr><td colspan="5" style="padding:16px;text-align:center;color:#71717a;font-family:Arial,sans-serif;font-size:13px;">Tidak ada event baru terdeteksi hari ini.</td></tr>'
    update_rows = "".join(item_row(i)                 for i in update_items[:20]) if update_items else '<tr><td colspan="5" style="padding:16px;text-align:center;color:#71717a;font-family:Arial,sans-serif;font-size:13px;">Tidak ada update info event yang sudah ada.</td></tr>'

    return f"""<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SportEvent ID Scraper Report — {today}</title></head>
<body style="margin:0;padding:0;background:#09090b;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#09090b;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;">

  <tr><td style="background:#18181c;border:1px solid #27272a;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;margin:0 0 4px 0;">
      Sport<span style="color:#3b82f6;">Event</span> ID — Scraper Report
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#71717a;margin:0;">
      Daily monitoring run · {today}
    </p>
  </td></tr>

  <tr><td style="background:#18181c;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:20px;text-align:center;border-right:1px solid #27272a;border-bottom:1px solid #27272a;">
          <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;color:#3b82f6;margin:0;">{raw_count}</p>
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#71717a;margin:0;text-transform:uppercase;letter-spacing:1px;">Total Ditemukan</p>
        </td>
        <td style="padding:20px;text-align:center;border-right:1px solid #27272a;border-bottom:1px solid #27272a;">
          <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;color:#22c55e;margin:0;">{len(new_items)}</p>
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#71717a;margin:0;text-transform:uppercase;letter-spacing:1px;">Event Baru</p>
        </td>
        <td style="padding:20px;text-align:center;border-bottom:1px solid #27272a;">
          <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;color:#fbbf24;margin:0;">{len(update_items)}</p>
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#71717a;margin:0;text-transform:uppercase;letter-spacing:1px;">Perlu Update</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#18181c;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:16px 24px;">
    <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:12px 16px;">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#fbbf24;margin:0;line-height:1.6;">
        ⚠️ <strong>REVIEW DIPERLUKAN.</strong> Data belum diverifikasi. Item HIGH confidence sudah di-PR otomatis ke GitHub.
        Item MEDIUM confidence hanya tampil di report ini — update manual jika valid.
      </p>
    </div>
  </td></tr>

  <tr><td style="background:#18181c;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:20px 24px 8px;">
    <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#22c55e;margin:0 0 12px 0;">
      🆕 Event Baru Terdeteksi ({len(new_items)} item)
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f0f12;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:rgba(59,130,246,0.1);">
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Nama Event</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Tanggal</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Venue</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Sumber</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:center;font-weight:600;">Trust</th>
        </tr>
      </thead>
      <tbody>{new_rows}</tbody>
    </table>
  </td></tr>

  <tr><td style="background:#18181c;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:20px 24px 8px;">
    <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fbbf24;margin:0 0 12px 0;">
      🔄 Event yang Mungkin Perlu Update ({len(update_items)} item)
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f0f12;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:rgba(251,191,36,0.08);">
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Nama Event</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Tanggal</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Venue</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:left;font-weight:600;">Sumber</th>
          <th style="padding:8px 12px;font-family:Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:center;font-weight:600;">Trust</th>
        </tr>
      </thead>
      <tbody>{update_rows}</tbody>
    </table>
  </td></tr>

  <tr><td style="background:#18181c;border-left:1px solid #27272a;border-right:1px solid #27272a;padding:20px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="https://github.com/ganoolmovie5th-cell/sport-event-claude/pulls"
             target="_blank"
             style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#22c55e);color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:11px 28px;border-radius:99px;margin:0 6px;">
            🔍 Review PR di GitHub
          </a>
          <a href="https://github.com/ganoolmovie5th-cell/sport-event-claude/actions"
             target="_blank"
             style="display:inline-block;background:rgba(255,255,255,0.07);border:1px solid #27272a;color:#a1a1aa;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:11px 28px;border-radius:99px;margin:0 6px;">
            📊 Lihat Actions Log
          </a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#18181c;border:1px solid #27272a;border-top:none;border-radius:0 0 12px 12px;padding:16px 24px;text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#52525b;margin:0;line-height:1.6;">
      SportEvent ID Auto-Scraper · Laporan harian otomatis · sport-event.web.id<br/>
      Data belum diverifikasi — selalu cek sumber asli sebelum publish
    </p>
  </td></tr>

  <tr><td style="height:24px;"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info(f"=== SportEvent ID Monitoring Scraper — {TODAY_LABEL} ===")

    existing_titles = get_existing_titles()
    log.info(f"Event sudah ada di data.ts: {len(existing_titles)}")

    raw_items: list[dict] = []
    scrapers = [
        ("AllSportDB",      scrape_allsportdb),
        ("MotoGP Official", scrape_motogp),
        ("BWF Badminton",   scrape_bwf),
        ("PSSI",            scrape_pssi),
        ("Detik Sport",     scrape_detik),
        ("Kemenpora",       scrape_kemenpora),
        ("Ahotu Marathons", scrape_marathons_ahotu),
    ]

    for name, fn in scrapers:
        log.info(f"Scraping: {name} ...")
        try:
            items = fn()
            raw_items.extend(items)
            log.info(f"  → {len(items)} item")
        except Exception as exc:
            log.warning(f"  ✗ Error: {exc}")
        time.sleep(2)

    raw_items = deduplicate(raw_items)
    log.info(f"Total unik setelah deduplikasi: {len(raw_items)}")

    classified = classify_items(raw_items, existing_titles)
    log.info(f"Event baru   : {len(classified['new_potential'])}")
    log.info(f"Perlu update : {len(classified['updates'])}")
    log.info(f"Tidak relevan: {len(classified['irrelevant'])}")

    report_data = {
        "generated_at": TODAY_LABEL,
        "total_raw": len(raw_items),
        "new_potential": classified["new_potential"],
        "updates": classified["updates"],
    }
    REPORT_PATH.write_text(json.dumps(report_data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"JSON report disimpan: {REPORT_PATH}")

    html = generate_html_report(classified, len(raw_items), TODAY_LABEL)
    REPORT_HTML.write_text(html, encoding="utf-8")
    log.info(f"HTML report disimpan: {REPORT_HTML}")

    log.info("=== Selesai. Laporan siap dikirim via email_reporter.py ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
