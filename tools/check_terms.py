#!/usr/bin/env python3
"""Check LOD-AM Turtle files against the external ontologies.

For every Turtle file given (default: examples/ and data/):
  1. it parses;
  2. its prefixes match tools/prefixes.ttl;
  3. it uses no forbidden namespaces (fake or HTML-page IRIs);
  4. every CIDOC CRM / CRMsci / CRMarchaeo / Allotrope / FaBiO / PROV-O term it uses exists in
     CRM 7.1.3 / CRMsci 3.2 / CRMarchaeo 2.1.1 / AFO 2025/12 / FaBiO / PROV-O 2013-04-30;
  5. every CRM, CRMsci and CRMarchaeo property is used within its rdfs:domain and rdfs:range,
     as far as the explicit rdf:type statements allow us to tell (PROV-O domains and ranges
     are not checked: records are CRM-typed and stand as prov:Entity without being typed so,
     CONVENTIONS.md "Statistical analyses");
  6. every ChEBI IRI is in tools/chebi.tsv and every Wikidata IRI in tools/wikidata.tsv
     (ids verified against ChEBI / Wikidata).

Exit code 1 if any error was found. Run `make fetch` first.
"""
import re
import sys
from pathlib import Path

from rdflib import Graph, Literal, URIRef, RDF, RDFS

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache"
CRM = "http://www.cidoc-crm.org/cidoc-crm/"
CRMSCI = "http://www.cidoc-crm.org/extensions/crmsci/"
CRMARCHAEO = "http://www.cidoc-crm.org/extensions/crmarchaeo/"
WD = "http://www.wikidata.org/entity/"
CHEBI = "http://purl.obolibrary.org/obo/CHEBI_"
AF = "http://purl.allotrope.org/ontologies/"
FABIO = "http://purl.org/spar/fabio/"
PROV = "http://www.w3.org/ns/prov#"
FORBIDDEN = {
    "http://www.allotrope.org/": "not an Allotrope namespace; use http://purl.allotrope.org/ontologies/{result,material,process,property}#",
    "http://vocab.getty.edu/page/": "HTML page IRI; use the concept IRI http://vocab.getty.edu/aat/<id>",
    "http://example.org/": "placeholder IRI; use https://lod-am.net/id/",
    "http://base/": "placeholder IRI; use https://lod-am.net/id/",
    "http://data.ordnancesurvey.co.uk/ontology/geometry/": "osgeo: geometry; use GeoSPARQL geo:hasGeometry / geo:asWKT",
}


def load_reference():
    crm = Graph().parse(CACHE / "cidoc-crm-7.1.3.rdf", format="xml")
    crm.parse(CACHE / "crmsci-3.2.rdf", format="xml")   # one graph: CRMsci declares e.g. E18 ⊑ S10
    crm.parse(CACHE / "crmarchaeo-2.1.1.rdf", format="xml")
    afo = Graph().parse(CACHE / "afo-2025-12.ttl", format="turtle")
    fabio = Graph().parse(CACHE / "fabio.ttl", format="turtle")
    fabio.parse(CACHE / "prov-o-20130430.ttl", format="turtle")   # small vocabularies checked for existence only
    return crm, afo, fabio


def superclasses(crm, cls, _memo={}):
    if cls not in _memo:
        seen, todo = {cls}, [cls]
        while todo:
            for sup in crm.objects(todo.pop(), RDFS.subClassOf):
                if sup not in seen:
                    seen.add(sup)
                    todo.append(sup)
        _memo[cls] = seen
    return _memo[cls]


def is_crm(u):
    return str(u).startswith((CRM, CRMSCI, CRMARCHAEO))


def crm_types(g, crm, node):
    out = set()
    for t in g.objects(node, RDF.type):
        if is_crm(t):
            out |= superclasses(crm, t)
    return out


def short(u):
    return str(u).replace(CRM, "crm:").replace(CRMSCI, "crmsci:").replace(CRMARCHAEO, "crmarchaeo:").replace(AF, "af:").replace(FABIO, "fabio:").replace(PROV, "prov:")


def check_file(path, crm, afo, fabio, canonical, chebi, wikidata):
    errors = []
    g = Graph()
    try:
        g.parse(path, format="turtle")
    except Exception as e:  # noqa: BLE001 - report any parser error
        return [f"does not parse: {e}"]

    text = path.read_text(encoding="utf-8")
    for prefix, ns in canonical.items():
        decl = f"@prefix {prefix}:"
        for line in text.splitlines():
            if line.strip().startswith(decl) and f"<{ns}>" not in line:
                errors.append(f"prefix '{prefix}:' must be <{ns}>")

    terms = set()
    for s, p, o in g:
        for n in (s, p, o):
            if isinstance(n, URIRef):
                for bad, why in FORBIDDEN.items():
                    if str(n).startswith(bad):
                        errors.append(f"forbidden IRI {n}: {why}")
        terms.add(p)
        if p == RDF.type:
            terms.add(o)

    for t in sorted(terms):
        st = str(t)
        if is_crm(t) and (t, None, None) not in crm:
            errors.append(f"unknown CRM 7.1.3 / CRMsci 3.2 / CRMarchaeo 2.1.1 term {short(t)}")
        if st.startswith(AF) and (t, None, None) not in afo:
            errors.append(f"unknown Allotrope term {short(t)}")
        if st.startswith(FABIO) and (t, None, None) not in fabio:
            errors.append(f"unknown FaBiO term {short(t)}")
        if st.startswith(PROV) and (t, None, None) not in fabio:
            errors.append(f"unknown PROV-O term {short(t)}")

    for n in set(g.subjects()) | set(g.objects()):
        if isinstance(n, URIRef) and str(n).startswith(CHEBI) and str(n)[len(CHEBI) - 6:] not in chebi:
            errors.append(f"ChEBI {str(n)[len(CHEBI) - 6:]} is not in tools/chebi.tsv (verify it with tools/verify_chebi.py first)")
        if isinstance(n, URIRef) and str(n).startswith(WD) and str(n)[len(WD):] not in wikidata:
            errors.append(f"Wikidata {str(n)[len(WD):]} is not in tools/wikidata.tsv (verify it with tools/verify_wikidata.py first)")

    for s, p, o in g:
        if not is_crm(p):
            continue
        for dom in crm.objects(p, RDFS.domain):
            st = crm_types(g, crm, s)
            if st and dom not in st:
                errors.append(f"{short(s)} {short(p)}: subject is not a {short(dom)} (domain)")
        for rng in crm.objects(p, RDFS.range):
            literal_range = rng == RDFS.Literal
            if isinstance(o, Literal) and not literal_range:
                errors.append(f"{short(s)} {short(p)} \"{o}\": literal, but range is {short(rng)}")
            elif not isinstance(o, Literal) and literal_range:
                errors.append(f"{short(s)} {short(p)} {short(o)}: range is a literal")
            elif not isinstance(o, Literal):
                ot = crm_types(g, crm, o)
                if ot and rng not in ot:
                    errors.append(f"{short(s)} {short(p)} {short(o)}: object is not a {short(rng)} (range)")
    return sorted(set(errors))


def main(argv):
    targets = [Path(a) for a in argv] or [ROOT / "examples", ROOT / "data"]
    files = []
    for t in targets:
        files += sorted(t.rglob("*.ttl")) if t.is_dir() else [t]
    canonical = dict(re.findall(r"^@prefix\s+([\w-]*):\s*<([^>]+)>", (ROOT / "tools/prefixes.ttl").read_text(), re.M))
    crm, afo, fabio = load_reference()
    def ids(name):
        return {l.split("\t")[0] for l in (ROOT / "tools" / name).read_text(encoding="utf-8").splitlines()
                if l.strip() and not l.startswith("#")}
    chebi, wikidata = ids("chebi.tsv"), ids("wikidata.tsv")
    failed = 0
    for f in files:
        errs = check_file(f, crm, afo, fabio, canonical, chebi, wikidata)
        rel = f.resolve().relative_to(ROOT) if f.resolve().is_relative_to(ROOT) else f
        if errs:
            failed += 1
            print(f"FAIL {rel}")
            for e in errs:
                print(f"  - {e}")
        else:
            print(f"ok   {rel}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
