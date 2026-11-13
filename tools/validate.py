#!/usr/bin/env python3
"""Validate examples/ and data/ against shapes/*.ttl with pySHACL.
Violations fail the run; warnings are printed but do not."""
import sys
from pathlib import Path

from pyshacl import validate
from rdflib import Graph, Namespace

ROOT = Path(__file__).resolve().parent.parent
SH = Namespace("http://www.w3.org/ns/shacl#")


def main(argv):
    targets = [Path(a) for a in argv] or [ROOT / "examples", ROOT / "data"]
    data = Graph()
    for t in targets:
        for f in (sorted(t.rglob("*.ttl")) if t.is_dir() else [t]):
            data.parse(f, format="turtle")
    shapes = Graph()
    for f in sorted((ROOT / "shapes").glob("*.ttl")):
        shapes.parse(f, format="turtle")
    _, report, _ = validate(data, shacl_graph=shapes, advanced=True, allow_warnings=True)
    violations = warnings = 0
    for r in report.subjects(SH.resultSeverity, None):
        sev = report.value(r, SH.resultSeverity)
        focus = report.value(r, SH.focusNode)
        path = report.value(r, SH.resultPath)
        msg = report.value(r, SH.resultMessage)
        kind = "VIOLATION" if sev == SH.Violation else "warning"
        violations += sev == SH.Violation
        warnings += sev != SH.Violation
        print(f"{kind}: {focus} {path or ''}: {msg}")
    print(f"SHACL: {violations} violation(s), {warnings} warning(s), {len(data)} triples")
    return 1 if violations else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
