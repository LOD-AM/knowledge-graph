#!/usr/bin/env python3
"""Check tools/mardi.tsv against the MaRDI portal: every item must exist and carry exactly the
English label in the file. Needs portal.mardi4nfdi.de (with a descriptive User-Agent)."""
import json
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "LOD-AM-checks/0.1 (https://lod-am.net)"}


def label(qid):
    url = f"https://portal.mardi4nfdi.de/wiki/Special:EntityData/{qid}.json"
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return json.load(r)["entities"][qid]["labels"].get("en", {}).get("value")
        except Exception:  # noqa: BLE001 - network or rate limits: retry with backoff
            time.sleep(5 * 2 ** i)
    raise SystemExit(f"cannot reach the MaRDI portal for {qid}")


def main():
    bad = 0
    for line in (ROOT / "tools/mardi.tsv").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        qid, want = line.split("\t")[:2]
        got = label(qid)
        ok = got == want
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {qid} {want!r}" + ("" if ok else f" (MaRDI says {got!r})"))
        time.sleep(1)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
