#!/usr/bin/env python3
"""
SportEvent ID — Email Reporter
================================
Kirim laporan HTML hasil scraping via Gmail SMTP.
Dipanggil oleh GitHub Actions setelah scraper.py selesai.

Env vars (set di GitHub Secrets):
  GMAIL_APP_PASSWORD  — App Password dari Google Account
  ADMIN_EMAIL         — tujuan email (default: ganoolmovie5th@gmail.com)
"""

import os
import sys
import json
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone, timedelta
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

WIB         = timezone(timedelta(hours=7))
TODAY_LABEL = datetime.now(WIB).strftime("%d %b %Y %H:%M WIB")

SENDER_EMAIL = "ganoolmovie5th@gmail.com"
ADMIN_EMAIL  = os.environ.get("ADMIN_EMAIL", "ganoolmovie5th@gmail.com")
APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

REPORT_HTML = Path(__file__).parent / "scraper_report.html"
REPORT_JSON = Path(__file__).parent / "scraper_report.json"


def load_summary() -> dict:
    if REPORT_JSON.exists():
        try:
            return json.loads(REPORT_JSON.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def send_report():
    if not APP_PASSWORD:
        log.error("GMAIL_APP_PASSWORD tidak di-set!")
        sys.exit(1)

    summary = load_summary()
    n_new   = len(summary.get("new_potential", []))
    n_upd   = len(summary.get("updates", []))
    total   = summary.get("total_raw", 0)

    subject = (
        f"[SportEvent ID] Scraper Report — {TODAY_LABEL} "
        f"| {n_new} Event Baru · {n_upd} Update"
    )

    html_body  = REPORT_HTML.read_text(encoding="utf-8") if REPORT_HTML.exists() else "<p>Report tidak ditemukan.</p>"
    plain_body = (
        f"SportEvent ID Scraper Report — {TODAY_LABEL}\n\n"
        f"Total item ditemukan : {total}\n"
        f"Event baru           : {n_new}\n"
        f"Perlu update         : {n_upd}\n\n"
        f"Review PR di:\n"
        f"https://github.com/ganoolmovie5th-cell/sport-event-claude/pulls\n\n"
        f"--- SportEvent ID Auto-Scraper ---"
    )

    msg            = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"SportEvent Bot <{SENDER_EMAIL}>"
    msg["To"]      = ADMIN_EMAIL
    msg.attach(MIMEText(plain_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body,  "html",  "utf-8"))

    log.info(f"Mengirim laporan ke: {ADMIN_EMAIL}")
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.sendmail(SENDER_EMAIL, ADMIN_EMAIL, msg.as_string())
        log.info("✅ Email laporan berhasil dikirim!")
    except smtplib.SMTPAuthenticationError:
        log.error("❌ Autentikasi Gmail gagal! Cek GMAIL_APP_PASSWORD di GitHub Secrets.")
        sys.exit(1)
    except Exception as exc:
        log.error(f"❌ Gagal kirim email: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    send_report()
