#!/usr/bin/env python3
"""knowledge-graph is the source of the shared "LOD-AM project" block that
website and triplestore copy into their CLAUDE.md (and check in CI).
Make sure it exists here and is the last section, so copies can take
everything from the marker to the end of the file."""
import sys
from pathlib import Path

lines = (Path(__file__).resolve().parent.parent / "CLAUDE.md").read_text(encoding="utf-8").splitlines()
starts = [i for i, l in enumerate(lines) if l.startswith("## LOD-AM project (shared block")]
if len(starts) != 1:
    sys.exit("FAIL CLAUDE.md must contain exactly one shared LOD-AM block")
if any(l.startswith("## ") for l in lines[starts[0] + 1:]):
    sys.exit("FAIL the shared LOD-AM block must be the last section of CLAUDE.md")
print("ok   CLAUDE.md shared block present and last")
