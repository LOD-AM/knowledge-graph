# Open modelling questions

Things the 2026-11 clean-up could not settle from the specifications alone.
They need a domain decision from the project. Each one is tracked as a GitHub
issue (label `modelling`). Discuss there. Once decided, record the decision in
CONVENTIONS.md and the shapes, and remove the item here.

Decided on 2026-11-15 and now in CONVENTIONS.md: #1 mass fraction, #2 sampling
event (CRMsci), #3 AFO material class on samples only, #4 Pleiades as identifier,
#5 `P8i_witnessed` shortcut, #8 GeoSPARQL, #12 labels on main resources.

1. [#6](https://github.com/LOD-AM/knowledge-graph/issues/6) **CRMarchaeo.** CRMarchaeo 2.1.1 (for CRM 7.1.2; all CRM terms it uses
   exist in 7.1.3) has no `A21_is_contained_in`. Its `AP21i_is_contained_in` points
   to an `A2_Stratigraphic_Volume_Unit`, not to an `E25_Human-Made_Feature`.
   How should objects be linked to their feature?
2. [#7](https://github.com/LOD-AM/knowledge-graph/issues/7) **Feature types.** Which controlled vocabulary for types of
   archaeological features (`:Palace_Hoard` still uses a local `:hoard` type)?
3. [#9](https://github.com/LOD-AM/knowledge-graph/issues/9) **Formal CRM ↔ AFO mapping.** Needed when other projects consume the data.
4. [#14](https://github.com/LOD-AM/knowledge-graph/issues/14) **Lead isotope ratios.** Pattern agreed (`afr:AFR_0002368` analyte
   molar ratio, `afx:AFX_0001550` has reference, reported ratios only, any non-empty
   set, mass spectrometry `afp:AFP_0001427`). Open: ChEBI has lead-207 but no
   lead-204, -206 or -208, so the nuclides need another identifier.
