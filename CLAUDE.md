# CLAUDE.md: LOD-AM knowledge graph

RDF data model + data for archaeometallurgy (LOD-AM). Owner: one researcher.
Precision about ontology terms matters more than speed: a plausible-looking
but nonexistent term is the most common and most damaging mistake here.

## Before you finish any change
Run `make` (needs `make install` once, and network for `make fetch`). It must pass.
`make fetch` downloads from cidoc-crm.org, purl.allotrope.org and
sparontologies.github.io; the converter needs vocab.getty.edu. The cloud
environment "LOD-AM" allows these hosts, and its setup script runs
`make install` + `make fetch`.
- `make check`: parse, prefixes, term existence (CRM 7.1.3 / AFO / FaBiO), CRM domain/range
- `make validate`: SHACL (`shapes/lod-am.shacl.ttl`)
- `make test-terms` / `make test-shapes`: fixtures in `tests/terms/invalid/` and `tests/shapes/invalid/` must be rejected
- `make test-queries`: `queries/*.rq` vs `tests/queries/*.tsv`
- `make test-converter`: `node --test` in `converter/`

## Rules
- **Read CONVENTIONS.md first.** It is the source of truth for patterns, IRIs and prefixes.
- **Never invent ontology terms.** Look them up in `.cache/` (after `make fetch`):
  CRM `cidoc-crm-7.1.3.rdf`, CRMsci `crmsci-3.2.rdf`, CRMarchaeo `crmarchaeo-2.1.1.rdf`, AFO `afo-2025-12.ttl` (search
  `skos:prefLabel`), FaBiO `fabio.ttl`. AFO IDs are opaque; always put the label in a comment
  (`afx:AFX_0002816 chebi:28694 ;  # quantifies copper atom`). Verify Getty AAT IDs
  via `https://vocab.getty.edu/sparql.json` and say which label you found; AAT labels are
  tagged `@en` *or* `@en-us`, so search both. ChEBI: only ids in `tools/chebi.tsv`; add new
  ones there and run `make verify-chebi` (EBI OLS, www.ebi.ac.uk). Same for Wikidata:
  `tools/wikidata.tsv`, `make verify-wikidata` (www.wikidata.org, descriptive User-Agent). Same for
  MaRDI (methods and software of analysis runs): `tools/mardi.tsv`, `make verify-mardi`
  (portal.mardi4nfdi.de). PROV-O is checked against `.cache/prov-o-20130430.ttl`.
- CIDOC CRM is **7.1.3**: `E22_Human-Made_Object`, no `P71_is_listed_in`,
  `P41_classified` goes from E17 to the object.
- Base IRI `https://lod-am.net/id/`, prefixes only from `tools/prefixes.ttl`.
- Don't commit external ontology/vocabulary dumps (`.cache/` is gitignored).
- A modelling change = `CONVENTIONS.md` + `shapes/` + `examples/` + expected
  query results in one PR. Rationale changes go in `docs/decisions/`.
- When a modelling choice is a domain judgement (not a spec fact), don't
  decide it silently: open an issue in LOD-AM/planning (labels `modelling`, `area: data model`), list it in
  `docs/open-questions.md` and mention it in the PR. Once the owner decides,
  implement it and remove it from the list.
- Updating `tests/queries/*.tsv` with `--update` is only OK after checking the
  new rows are actually right; say so in the PR.
- Converter must never overwrite `data/` with empty/partial output.

## Layout
`examples/` worked example · `queries/` SPARQL · `shapes/` SHACL ·
`data/` generated RDF · `converter/` Node (CommonJS, no deps) ·
`tools/` Python checks · `docs/decisions/` why · `ontologies/`, `vocabularies/` usage notes

## Where to resume (state 2026-11-26)
- Decided and implemented: #1 mass fraction, #2 sampling event (CRMsci 3.2), #3 AFO
  class on samples only, #4 Pleiades as E42 identifier, #5 `P8i_witnessed`, #6 CRMarchaeo
  2.1.1 (`AP21i_is_contained_in`, features also A2), #8 GeoSPARQL, #12 labels on main
  resources, #14 lead isotope ratios (Wikidata nuclides), #19 finds without a feature
  (`P53` → site's place), #20 typed IRIs `/id/<kind>/<uuid>`, #21 `:not_detected`.
- Also implemented: #7 feature types (local SKOS + AAT matches), graves part of their kurgan,
  local periods (phases in their chronology system, part of a culture; until PeriodO).
- **Open:** CRM ↔ AFO mapping (later; tracked in LOD-AM/planning). The converter runs in
  LOD-AM/pipeline (R2RML + Ontop, on the data LXC); its output for released publications feeds the website's entity pages.
- Since then: chronology systems name their source (`dcterms:source`, #33), the topics vocabulary for the
  website (#32), only reported numbers as identifiers of finds and analyses, analysis remarks as
  `P3_has_note` (#35). The ontology downloads are checked against `tools/ontologies.sha256`
  (FaBiO comes from `…/current/`: a change upstream now fails `make fetch` instead of changing the checks).
- Known gaps: the Getty SPARQL
  endpoint is sometimes degraded (the converter then refuses to write).

## Effects on other repos
Blog posts in `LOD-AM/website` describe this model. A significant model change
may deserve a dated update note or a new post: suggest it, the owner writes it.

## LOD-AM project (shared block: keep identical in every repo)
Source of truth: knowledge-graph `CLAUDE.md`. Edit it there first, then copy it unchanged; CI (`scripts/check_shared_block.sh`) fails on drift.
LOD-AM = Linked Open Data for Ancient Metallurgy, a one-person research project (https://lod-am.net).
- `LOD-AM/knowledge-graph`: data model, vocabularies, converters, data. **Authority for all modelling rules** (`CONVENTIONS.md`).
- `LOD-AM/triplestore`: Apache Jena Fuseki (Docker) that serves the knowledge graph.
- `LOD-AM/ingest` (**private**): the owner's research database (dump), its checks and correction rounds; the database as a whole stays private until the owner says otherwise.
- `LOD-AM/pipeline`: the data pipeline, code only (database snapshot → R2RML/Ontop → enrichment → checks → released publications); runs on the data LXC, never with data on GitHub.
- `LOD-AM/extractor` (**private**): extracts analysis data from publications with local models on the owner's AI machine, as proposals for review that go into the research database (ingest).
- `LOD-AM/website`: Eleventy site and blog, self-hosted.
- `LOD-AM/planning` (**private**): project management for all repos: one issue per task, state in labels (see its README).
- `LOD-AM/ontologies`, `vocabularies`, `converter`: **superseded** by knowledge-graph; don't edit.

Rules for every repo:
- Base IRI `https://lod-am.net/id/`; CIDOC CRM **7.1.3**. Don't restate modelling rules elsewhere; link to knowledge-graph `CONVENTIONS.md`.
- Work on a branch and open a PR to `main`; never push to `main`. Create issues, PRs or comments only when asked.
- Domain/modelling decisions belong to the owner: raise them as `LOD-AM/planning` issues (label `modelling`) instead of deciding silently.
- Never commit secrets (passwords, SMTP credentials, `.env`, `shiro.ini`).
- English for code, docs and commits. Keep commits small and explain *why*.
- Verify before you claim: run the repo's checks and report what you ran.
- Open work lives in `LOD-AM/planning` (issues with `status:`/`area:` labels; keep them true);
  PRs reference it (`Closes LOD-AM/planning#<n>`). Each CLAUDE.md's "Where to resume" keeps only
  repo-specific notes. The owner merges PRs; after a merge, start new work from the updated `main`.
