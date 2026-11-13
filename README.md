# LOD-AM Knowledge Graph

**Data model, controlled vocabularies, converters and example data for the
Linked Open Data for Ancient Metallurgy (LOD-AM) knowledge graph.**
Website: https://lod-am.net · Base IRI: `https://lod-am.net/id/`

This repository merges the former `LOD-AM/ontologies`, `LOD-AM/vocabularies`
and `LOD-AM/converter` repositories, with their full history.

## Layout

```
CONVENTIONS.md          how data is modelled (the rules; start here)
docs/decisions/         why we chose each ontology / vocabulary
docs/open-questions.md  modelling questions not decided yet
ontologies/             usage notes: CIDOC CRM 7.1.3, Allotrope (AFO), FaBiO
vocabularies/           usage notes: Getty AAT, PeriodO, Pleiades
examples/               complete worked example (Arslantepe, Hauptmann et al. 2002)
queries/                SPARQL queries; expected results in tests/queries/
shapes/                 SHACL shapes encoding CONVENTIONS.md
data/                   generated RDF (e.g. data/aat/ from the AAT converter)
converter/              Node.js scripts that fetch/convert external sources
tools/                  validation scripts and canonical prefixes
```

## Checks

```bash
make install   # rdflib + pySHACL (Python ≥ 3.11), Node ≥ 18 for the converter
make           # everything below
make check     # Turtle parses, canonical prefixes, terms exist in CRM/AFO/FaBiO, CRM domain/range
make validate  # SHACL validation of examples/ and data/ against shapes/
make test-queries   # each query returns exactly the expected rows
```

`make fetch` downloads CIDOC CRM 7.1.3, AFO 2025/12 and FaBiO into `.cache/`
(not committed). CI runs `make` on every push and pull request.

## Rules

1. **No external ontology/vocabulary dumps.** Reference them; `make fetch` gets them for checks.
2. **Decisions first.** Change `docs/decisions/` and `CONVENTIONS.md` before changing how data is modelled, and update `shapes/` in the same change.
3. **Every query has a test.** A new `queries/x.rq` needs `tests/queries/x.tsv` (`python3 tools/test_queries.py --update`, then check the rows by hand).
4. **Every invalid pattern you fix gets a fixture** in `tests/shapes/invalid/` so it can't come back.

## Related repositories

- [LOD-AM/triplestore](https://github.com/LOD-AM/triplestore): Fuseki deployment that serves this data
- [LOD-AM/website](https://github.com/LOD-AM/website): project website and blog

## License

Documentation, data and examples: [CC BY 4.0](licenses/CC-BY-4.0.txt).
Code (`converter/`, `tools/`, `Makefile`, workflows): [MIT](licenses/MIT.txt).
External ontologies and vocabularies keep their own licenses (see each `reference.txt`).
