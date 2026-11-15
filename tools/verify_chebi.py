#!/usr/bin/env python3
"""Check tools/chebi.tsv against ChEBI (EBI Ontology Lookup Service, www.ebi.ac.uk).
Every id must exist and carry exactly the label in the file. Needs network."""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://www.ebi.ac.uk/ols4/api/ontologies/chebi/terms/"


def label(cid):
    iri = "http://purl.obolibrary.org/obo/" + cid
    url = API + urllib.parse.quote(urllib.parse.quote(iri, safe=""), safe="")
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)["label"]


def main():
    bad = 0
    for line in (ROOT / "tools/chebi.tsv").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        cid, want = line.split("\t")[:2]
        got = label(cid)
        ok = got == want
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {cid} {want!r}" + ("" if ok else f" (ChEBI says {got!r})"))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
