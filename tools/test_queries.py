#!/usr/bin/env python3
"""Run every queries/*.rq against examples/ + data/ and compare with
tests/queries/<name>.tsv. Use --update to (re)write the expected files
after you have checked the new results are correct."""
import csv
import io
import sys
from pathlib import Path

from rdflib import Graph

ROOT = Path(__file__).resolve().parent.parent


def load_graph():
    g = Graph()
    for d in ("examples", "data"):
        for f in sorted((ROOT / d).rglob("*.ttl")):
            g.parse(f, format="turtle")
    return g


def to_rows(result):
    head = [str(v) for v in result.vars]
    rows = [["" if v is None else str(v) for v in row] for row in result]
    return [head] + rows


def to_tsv(rows):
    buf = io.StringIO()
    csv.writer(buf, delimiter="\t", lineterminator="\n").writerows(rows)
    return buf.getvalue()


def main(argv):
    update = "--update" in argv
    g = load_graph()
    failed = 0
    for q in sorted((ROOT / "queries").glob("*.rq")):
        rows = to_rows(g.query(q.read_text(encoding="utf-8")))
        got = to_tsv(rows)
        exp_file = ROOT / "tests/queries" / f"{q.stem}.tsv"
        if update:
            exp_file.write_text(got, encoding="utf-8")
            print(f"wrote {exp_file.relative_to(ROOT)} ({len(rows) - 1} rows)")
            continue
        if not exp_file.exists():
            failed += 1
            print(f"FAIL {q.name}: no expected file (run with --update)")
        elif exp_file.read_text(encoding="utf-8") != got:
            failed += 1
            print(f"FAIL {q.name}: result differs from {exp_file.relative_to(ROOT)}")
            print(got)
        elif len(rows) == 1:
            failed += 1
            print(f"FAIL {q.name}: returns no rows")
        else:
            print(f"ok   {q.name} ({len(rows) - 1} rows)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
