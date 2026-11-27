# Open modelling questions

Things the 2026-11 clean-up could not settle from the specifications alone.
They need a domain decision from the project. Each one is tracked as a GitHub
issue (label `modelling`). Discuss there. Once decided, record the decision in
CONVENTIONS.md and the shapes, and remove the item here.

Decided on 2026-11-15 and now in CONVENTIONS.md: #1 mass fraction, #2 sampling
event (CRMsci), #3 AFO material class on samples only, #4 Pleiades as identifier,
#5 `P8i_witnessed` shortcut, #6 CRMarchaeo 2.1.1 (`AP21i_is_contained_in`, features
also A2), #8 GeoSPARQL, #12 labels on main resources, #14 lead isotope ratios.
Decided on 2026-11-16: #19 finds without a feature (`P53` → the site's place), #20 typed
IRIs from `id_uuid`, #21 "not detected" (local type `:not_detected`), #7 feature types
(local SKOS scheme from the database with AAT matches; LOD-AM/ingest#8).

1. [#17](https://github.com/LOD-AM/knowledge-graph/issues/17) **Formal CRM ↔ AFO mapping** (from #9): about 1½–2 days, when other
   projects consume the data.
2. **Statistical analyses and arguments** (LOD-AM/planning#47). Runs are modelled
   (CONVENTIONS.md "Statistical analyses": #48, #49, #50). Decided, still to implement:
   arguments as nanopublications mirrored on the website (#51); computed values only as
   results of a documented run (#52, website). Open (to raise with the owner on #49 / #50):
   - the property that links a run to MaRDI items (model, task, algorithm, software)
   - records the run left out (outliers, missing values): only described in
     `dcterms:description`, or listed?
   - results as values in the RDF (and their typing), or only as files (as now)
3. **Base IRI on w3id.org** (LOD-AM/planning#53): decided by the owner (2026-11-26/27):
   full switch to `https://w3id.org/lod-am/id/<kind>/<uuid>`, forwarded 1:1 to `lod-am.net`;
   no `owl:sameAs` to the old IRIs; graph names stay. Registration files: `docs/w3id/lod-am/`.
   To implement once w3id has merged the registration (perma-id/w3id.org#7325).
