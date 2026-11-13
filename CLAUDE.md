# CLAUDE.md: LOD-AM knowledge graph

RDF data model + data for archaeometallurgy (LOD-AM). Owner: one researcher.
Precision about ontology terms matters more than speed: a plausible-looking
but nonexistent term is the most common and most damaging mistake here.

## Before you finish any change
Run `make` (needs `make install` once, and network for `make fetch`). It must pass.
- `make check`: parse, prefixes, term existence (CRM 7.1.3 / AFO / FaBiO), CRM domain/range
- `make validate`: SHACL (`shapes/lod-am.shacl.ttl`)
- `make test-terms` / `make test-shapes`: fixtures in `tests/terms/invalid/` and `tests/shapes/invalid/` must be rejected
- `make test-queries`: `queries/*.rq` vs `tests/queries/*.tsv`
- `make test-converter`: `node --test` in `converter/`

## Rules
- **Read CONVENTIONS.md first.** It is the source of truth for patterns, IRIs and prefixes.
- **Never invent ontology terms.** Look them up in `.cache/` (after `make fetch`):
  CRM `cidoc-crm-7.1.3.rdf`, AFO `afo-2025-12.ttl` (search `skos:prefLabel`),
  FaBiO `fabio.ttl`. AFO IDs are opaque; always put the label in a comment
  (`afx:AFX_0002816 chebi:28694 ;  # quantifies copper`). Verify Getty AAT IDs
  via `https://vocab.getty.edu/sparql.json` and say which label you found.
- CIDOC CRM is **7.1.3**: `E22_Human-Made_Object`, no `P71_is_listed_in`,
  `P41_classified` goes from E17 to the object.
- Base IRI `https://lod-am.net/id/`, prefixes only from `tools/prefixes.ttl`.
- Don't commit external ontology/vocabulary dumps (`.cache/` is gitignored).
- A modelling change = `CONVENTIONS.md` + `shapes/` + `examples/` + expected
  query results in one PR. Rationale changes go in `docs/decisions/`.
- When a modelling choice is a domain judgement (not a spec fact), don't
  decide it silently: add it to `docs/open-questions.md` and mention it in the PR.
- Updating `tests/queries/*.tsv` with `--update` is only OK after checking the
  new rows are actually right; say so in the PR.
- Converter must never overwrite `data/` with empty/partial output.

## Layout
`examples/` worked example · `queries/` SPARQL · `shapes/` SHACL ·
`data/` generated RDF · `converter/` Node (CommonJS, no deps) ·
`tools/` Python checks · `docs/decisions/` why · `ontologies/`, `vocabularies/` usage notes

## Related repos (separate)
`LOD-AM/triplestore` (Fuseki, docker-compose), `LOD-AM/website` (Eleventy blog;
blog posts describe this model, so model changes may need a post or update).
