# Open modelling questions

Things the 2026-11 clean-up could not settle from the specifications alone.
They need a domain decision from the project. Each one is tracked as a GitHub
issue (label `modelling`). Discuss there. Once decided, record the decision in
CONVENTIONS.md and the shapes, and remove the item here.

Decided on 2026-11-15 and now in CONVENTIONS.md: #1 mass fraction, #2 sampling
event (CRMsci), #3 AFO material class on samples only, #4 Pleiades as identifier,
#5 `P8i_witnessed` shortcut, #6 CRMarchaeo 2.1.1 (`AP21i_is_contained_in`, features
also A2), #8 GeoSPARQL, #12 labels on main resources, #14 lead isotope ratios.

1. [#7](https://github.com/LOD-AM/knowledge-graph/issues/7) **Feature types.** Decided: a local SKOS scheme of feature types
   with AAT matches, like the object typology. The list comes from LOD-AM/ingest#8;
   until then `:Palace_Hoard` keeps the placeholder `:hoard` type.
2. [#17](https://github.com/LOD-AM/knowledge-graph/issues/17) **Formal CRM ↔ AFO mapping** (from #9): about 1½–2 days, when other
   projects consume the data.
3. [#19](https://github.com/LOD-AM/knowledge-graph/issues/19) **Finds without a feature** (from LOD-AM/ingest#8):
   link the object to its site's place (`P53`), an encounter event (CRMsci S19) or an
   "unspecified context" feature.
4. [#20](https://github.com/LOD-AM/knowledge-graph/issues/20) **IRI pattern for converted data** from `id_uuid`
   (from LOD-AM/ingest#14): `/id/find/<uuid>`, `/id/<uuid>` or `:find_<uuid>`; helper nodes.
5. [#21](https://github.com/LOD-AM/knowledge-graph/issues/21) **"Not detected" element values** without a
   detection limit (from LOD-AM/ingest#4): value-less measurement with a local type, a note, or omitted.
