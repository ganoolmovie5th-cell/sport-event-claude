#!/usr/bin/env python3
"""
SportEvent ID — Auto Updater
=============================
Dibaca setelah scraper.py selesai jalan.

Cara kerja:
  1. Baca scraper_report.json (output scraper.py)
  2. Filter hanya item HIGH confidence dari sumber terpercaya
  3. Generate entry SportEvent[] yang valid untuk data.ts
  4. Inject ke src/lib/data.ts sebelum penutup ]; array events
  5. Tulis ringkasan ke auto_update_summary.json → workflow buat PR

Script ini TIDAK push ke main. Workflow yang buat PR → kamu review → merge.
"""

import json
import re
import sys
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR     = Path(__file__).parent
DATA_TS      = BASE_DIR / "src" / "lib" / "data.ts"
REPORT_JSON  = BASE_DIR / "scraper_report.json"
SUMMARY_JSON = BASE_DIR / "auto_update_summary.json"

WIB            = timezone(timedelta(hours=7))
NOW_WIB        = datetime.now(WIB)
TODAY_LABEL    = NOW_WIB.strftime("%d %b %Y %H:%M WIB")

# ── Sumber HIGH confidence ────────────────────────────────────────────────────
HIGH_CONFIDENCE_SOURCES = {
    "allsportdb.com",
    "motogp.com",
    "bwfbadminton.com",
    "pssi.org",
    "kemenpora.go.id",
}

# ── Sport detection ───────────────────────────────────────────────────────────
SPORT_MAP: list[tuple[list[str], str, str]] = [
    (["motogp", "moto gp", "mandalika", "wsbk", "superbike"], "motogp",       "🏍️"),
    (["badminton", "bwf", "thomas", "uber", "indonesia open", "indonesia masters"], "badminton", "🏸"),
    (["liga 1", "pssi", "timnas", "piala dunia", "fifa", "sepak bola", "football"], "football", "⚽"),
    (["marathon", "lari", "running", "10k", "half marathon"], "running",       "🏃"),
    (["cycling", "sepeda", "tour de"], "cycling",      "🚴"),
    (["surfing", "selancar"], "surfing",      "🏄"),
    (["basket", "bola basket", "ibl"], "basketball",   "🏀"),
    (["voli", "volleyball", "proliga"], "volleyball",  "🏐"),
    (["renang", "swimming", "aquatic"], "swimming",    "🏊"),
    (["tenis", "tennis"], "tennis",       "🎾"),
    (["golf"], "golf",         "⛳"),
    (["esports", "e-sports", "gaming"], "esports",    "🎮"),
    (["pencak silat", "silat", "martial"], "martial-arts", "🥋"),
    (["sea games", "asian games", "olympics", "olimpiade", "asian para", "pon", "multi"], "multi-sport", "🏆"),
    (["atletik", "athletics"], "athletics",    "🏃"),
]
SPORT_EMOJI_MAP = {s: e for _, s, e in SPORT_MAP}

def detect_sport(text: str) -> tuple[str, str]:
    t = text.lower()
    for keywords, sport, emoji in SPORT_MAP:
        if any(k in t for k in keywords):
            return sport, emoji
    return "multi-sport", "🏆"

def detect_category(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ["sea games", "asian games", "olympics", "olimpiade", "world", "bwf", "fifa", "motogp", "wsbk"]):
        return "international"
    return "national"

# ── Slug & ID ─────────────────────────────────────────────────────────────────
def to_slug(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")

def get_existing_slugs() -> set[str]:
    if not DATA_TS.exists():
        return set()
    return set(re.findall(r"slug:\s*'([^']+)'", DATA_TS.read_text(encoding="utf-8")))

def get_existing_titles() -> set[str]:
    if not DATA_TS.exists():
        return set()
    return {t.lower().strip() for t in re.findall(r"title:\s*'([^']+)'", DATA_TS.read_text(encoding="utf-8"))}

def get_max_id() -> int:
    if not DATA_TS.exists():
        return 0
    ids = re.findall(r"id:\s*'(\d+)'", DATA_TS.read_text(encoding="utf-8"))
    return max((int(i) for i in ids), default=0)

def normalize(name: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", name.lower()).strip()

def is_duplicate(title: str, existing_titles: set[str]) -> bool:
    norm = normalize(title)
    if not norm or len(norm) < 5:
        return True
    for et in existing_titles:
        if norm in et or et in norm:
            return True
    return False

# ── Date parser ───────────────────────────────────────────────────────────────
MONTH_MAP = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "mei": 5,
    "jun": 6, "jul": 7, "aug": 8, "agu": 8, "sep": 9, "oct": 10,
    "okt": 10, "nov": 11, "dec": 12, "des": 12,
}

def parse_date(date_str: str) -> str:
    """Return ISO date YYYY-MM-DD or fallback next year Jan 1."""
    if not date_str:
        return f"{NOW_WIB.year + 1}-01-01"
    s = date_str.lower().strip()
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.search(r"(\d{1,2})\s+([a-z]{3})\w*\s+(\d{4})", s)
    if m:
        d, mon, y = int(m.group(1)), m.group(2)[:3], m.group(3)
        mo = MONTH_MAP.get(mon)
        if mo:
            return f"{y}-{mo:02d}-{d:02d}"
    m = re.search(r"([a-z]{3})\w*\s+(\d{1,2})[,\s]+(\d{4})", s)
    if m:
        mon, d, y = m.group(1)[:3], int(m.group(2)), m.group(3)
        mo = MONTH_MAP.get(mon)
        if mo:
            return f"{y}-{mo:02d}-{d:02d}"
    return f"{NOW_WIB.year + 1}-01-01"

# ── Generate TypeScript entry ─────────────────────────────────────────────────
def generate_event_entry(item: dict, event_id: int, slug: str) -> str:
    title    = item.get("title", "Unknown Event")
    date_str = item.get("date", "")
    venue    = item.get("venue", "TBA") or "TBA"
    city     = item.get("city", "Jakarta") or "Jakarta"
    url      = item.get("url", "") or ""
    source   = item.get("source_label", item.get("source", ""))

    sport, emoji = detect_sport(title)
    if item.get("sport"):
        sport  = item["sport"]
        emoji  = SPORT_EMOJI_MAP.get(sport, "🏆")

    category   = detect_category(title)
    start_date = parse_date(date_str)

    from datetime import date as dt_date, timedelta as td
    try:
        sd  = dt_date.fromisoformat(start_date)
        end = (sd + td(days=3)).isoformat()
    except Exception:
        end = start_date

    description = (
        f"[AUTO-DETECTED] {title}. "
        f"Sumber: {source}. "
        f"Harap verifikasi info lengkap sebelum publish."
    )
    tags = [sport, "indonesia"]
    if "jakarta" in (title + city).lower():
        tags.append("jakarta")
    if any(k in title.lower() for k in ["international", "world", "asia", "bwf", "fifa"]):
        tags.append("international")
    tags_ts    = "[" + ", ".join(f"'{t}'" for t in tags) + "]"
    safe_title = title.replace("'", "\\'")
    safe_venue = venue.replace("'", "\\'")
    safe_desc  = description.replace("'", "\\'")
    safe_url   = url[:120].replace("'", "") if url else ""

    return f"""  {{
    id: '{event_id}',
    slug: '{slug}',
    title: '{safe_title}',
    sport: '{sport}',
    category: '{category}',
    status: 'tentative',
    startDate: '{start_date}',
    endDate: '{end}',
    venue: '{safe_venue}',
    city: '{city}',
    country: 'Indonesia',
    description: '{safe_desc}',
    ticketUrl: '{safe_url}',
    websiteUrl: '{safe_url}',
    priceRange: 'Cek {source}',
    imageEmoji: '{emoji}',
    tags: {tags_ts},
    organizer: '{source}',
  }},"""

# ── Inject ke data.ts ─────────────────────────────────────────────────────────
def inject_to_data_ts(new_entries: list[str]) -> bool:
    if not DATA_TS.exists():
        log.error("src/lib/data.ts tidak ditemukan!")
        return False

    content  = DATA_TS.read_text(encoding="utf-8")
    original = content

    idx = content.find("export const events: SportEvent[] = [")
    if idx < 0:
        log.error("Tidak bisa menemukan 'export const events: SportEvent[] = [' di data.ts")
        return False

    sub         = content[idx:]
    close_match = re.search(r"\n\];\n", sub)
    if not close_match:
        log.error("Tidak bisa menemukan penutup ];\n array events")
        return False

    insert_pos = idx + close_match.start()
    block      = "\n" + "\n".join(new_entries)
    content    = content[:insert_pos] + block + content[insert_pos:]

    if content != original:
        DATA_TS.write_text(content, encoding="utf-8")
        return True
    return False

# ── Main ──────────────────────────────────────────────────────────────────────
def main() -> int:
    log.info(f"=== SportEvent ID Auto Updater — {TODAY_LABEL} ===")

    if not REPORT_JSON.exists():
        log.error("scraper_report.json tidak ditemukan. Jalankan scraper.py dulu.")
        return 1

    report        = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    new_potential = report.get("new_potential", [])
    log.info(f"Total potensi baru dari scraper: {len(new_potential)}")

    if not new_potential:
        SUMMARY_JSON.write_text(json.dumps({
            "generated_at": TODAY_LABEL, "added": [], "skipped": [],
            "message": "Tidak ada event baru terdeteksi hari ini.",
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        return 0

    existing_slugs  = get_existing_slugs()
    existing_titles = get_existing_titles()
    next_id         = get_max_id() + 1

    new_entries   = []
    added_summary = []
    skipped       = []

    for item in new_potential:
        reliability = item.get("reliability", "")
        source      = item.get("source", "")

        if reliability != "HIGH" or source not in HIGH_CONFIDENCE_SOURCES:
            skipped.append({"title": item.get("title", ""), "reason": f"reliability={reliability}, source={source}"})
            continue

        title = item.get("title", "")
        if not title or len(title) < 5:
            skipped.append({"title": title, "reason": "title terlalu pendek"})
            continue

        if is_duplicate(title, existing_titles):
            skipped.append({"title": title, "reason": "event sudah ada di data.ts"})
            continue

        year      = parse_date(item.get("date", ""))[:4]
        base_slug = to_slug(f"{title}-{year}")
        slug      = base_slug
        suffix    = 0
        while slug in existing_slugs:
            suffix += 1
            slug = f"{base_slug}-{suffix}"

        existing_slugs.add(slug)
        existing_titles.add(title.lower())

        entry = generate_event_entry(item, next_id, slug)
        new_entries.append(entry)
        added_summary.append({
            "id": str(next_id), "slug": slug, "title": title,
            "source": source, "url": item.get("url", ""),
            "date": item.get("date", ""), "venue": item.get("venue", ""),
        })
        log.info(f"  ✓ Akan ditambah: {title} (id: {next_id}, slug: {slug})")
        next_id += 1

    if not new_entries:
        log.info("Tidak ada entri baru yang lolos filter HIGH confidence.")
        SUMMARY_JSON.write_text(json.dumps({
            "generated_at": TODAY_LABEL, "added": [], "skipped": skipped,
            "message": "Semua item tidak lolos filter atau sudah ada.",
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        return 0

    changed = inject_to_data_ts(new_entries)
    log.info(f"{'✅ data.ts updated' if changed else '⚠️  data.ts tidak berubah'}: +{len(new_entries)} event")

    SUMMARY_JSON.write_text(json.dumps({
        "generated_at": TODAY_LABEL,
        "added_count": len(added_summary),
        "skipped_count": len(skipped),
        "added": added_summary,
        "skipped": skipped,
        "message": f"Berhasil menambahkan {len(added_summary)} event baru dari sumber HIGH confidence.",
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
