#!/usr/bin/env python3
"""
Build/refresh the Grace daily-art archive for heathernew.com.

Reads ~/Documents/Grace/heather/art + stories, converts new days to
web-sized WebP, and rewrites public/data/grace-archive.json. Idempotent —
safe to run daily or weekly; only processes dates not already thumbnailed,
or whose source art is newer than its thumbnail (a redone day).

Blank/failed ComfyUI generations (solid or near-solid color output) are
detected automatically via pixel extrema rather than a hardcoded list, so
future failures show up as honest "failed" entries instead of shipping as
broken image tiles.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

ART_DIR = Path.home() / "Documents/Grace/heather/art"
STORIES_DIR = Path.home() / "Documents/Grace/heather/stories"
OUT_IMG_DIR = Path.home() / "Sites/heathernew.com/public/assets/grace"
OUT_JSON = Path.home() / "Sites/heathernew.com/public/data/grace-archive.json"
# Grace records which image she actually sent ("original" or "revision") here.
FEEDBACK = Path.home() / "Agents/ecosystem/data/grace-feedback.json"

BLANK_SPAN_THRESHOLD = 10  # sum of per-channel (max-min); real art is well above this

date_re = re.compile(r"^\d{4}-\d{2}-\d{2}$")
noticed_re = re.compile(r"\*Noticed:\s*(.+?)\*", re.DOTALL)


def is_blank(path: Path) -> bool:
    im = Image.open(path).convert("RGB")
    extrema = im.getextrema()
    span = sum(hi - lo for lo, hi in extrema)
    return span < BLANK_SPAN_THRESHOLD


def load_sent() -> dict:
    """date -> "original" | "revision", for days Grace recorded it (2026-10-01 on).
    Since then she sends the revision only if Paula scores it at least as well,
    so "always prefer -r" would publish a different image than Telegram got."""
    try:
        history = json.loads(FEEDBACK.read_text()).get("history", [])
    except Exception:
        return {}
    return {h["date"]: h["sent"] for h in history if h.get("date") and h.get("sent")}


SENT = load_sent()


def pick_source(date: str) -> tuple[Path | None, bool]:
    """Return (usable_path_or_None, revised_bool). Uses whichever image Grace
    actually sent when that's recorded; otherwise prefers -r as before. Treats a
    candidate as unusable if it's blank."""
    candidates = []
    r_path = ART_DIR / f"{date}-r.png"
    base_path = ART_DIR / f"{date}.png"
    if r_path.exists():
        candidates.append((r_path, True))
    if base_path.exists():
        candidates.append((base_path, False))
    if SENT.get(date) == "original":
        candidates.sort(key=lambda c: c[1])        # base first

    for path, revised in candidates:
        if not is_blank(path):
            return path, revised
    return None, False


def main():
    dates = sorted(p.stem for p in STORIES_DIR.glob("*.md") if date_re.match(p.stem))

    entries = []
    new_images = []
    failed_dates = []

    for date in dates:
        story_path = STORIES_DIR / f"{date}.md"
        story_text = story_path.read_text()
        m = noticed_re.search(story_text)
        noticed = " ".join(m.group(1).split()) if m else ""

        body_parts = [p.strip() for p in story_text.split("\n\n") if p.strip()]
        body_paragraphs = [p for p in body_parts if not p.startswith("*")]
        story_body = "\n\n".join(body_paragraphs)

        src, revised = pick_source(date)

        if src is None:
            entries.append({
                "date": date,
                "image": None,
                "failed": True,
                "noticed": noticed,
                "story": story_body,
                "revised": False,
            })
            failed_dates.append(date)
            continue

        out_path = OUT_IMG_DIR / f"{date}.webp"
        # Rebuild when the source is newer than the published copy, so a redo
        # of a day (grace-morning-practice.py --redo-draw) actually reaches the
        # site instead of the first thumbnail sticking forever.
        if not out_path.exists() or src.stat().st_mtime > out_path.stat().st_mtime:
            subprocess.run(
                ["cwebp", "-q", "80", "-resize", "512", "512", str(src), "-o", str(out_path)],
                check=True,
                capture_output=True,
            )
            new_images.append(date)

        entries.append({
            "date": date,
            "image": f"/assets/grace/{date}.webp",
            "failed": False,
            "noticed": noticed,
            "story": story_body,
            "revised": revised,
        })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(entries, indent=2))

    print(f"Wrote {len(entries)} entries to {OUT_JSON}")
    print(f"New thumbnails generated: {len(new_images)}")
    if new_images:
        print("  " + ", ".join(new_images))
    if failed_dates:
        print(f"Failed/blank generations ({len(failed_dates)} total): {', '.join(failed_dates)}")

    # signal to the calling shell script whether there's anything new to deploy
    sys.exit(0 if new_images else 3)


if __name__ == "__main__":
    main()
