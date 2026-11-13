# Open modelling questions

Things the 2026-11 clean-up could not settle from the specifications alone.
They need a domain decision from the project. Each should become a GitHub issue
(label `modelling`); once decided, record it in CONVENTIONS.md and the shapes.

1. **Concentration vs. mass fraction.** Measurements use `afr:AFR_0002036`
   (concentration). For alloy composition in wt% `afr:AFR_0002099`
   (mass fraction) is arguably more precise. The shapes accept both.
2. **Object → sample link.** `afx:AFX_0001048` (contains) is defined for
   containers. A sample taken *from* an object might be better modelled as a
   sampling event (`crm:E7_Activity` / CRMsci `S2_Sample_Taking`) or as a part.
   The current example also attaches the blade sample to the whole spearhead.
3. **Objects typed as `afm:AFM_0001099` (chemical mixture).** Is the double
   typing of `:spearhead_1` wanted, or should only the sample carry the AFO
   material class?
4. **Site ↔ Pleiades identity.** `owl:sameAs` merges both resources under
   reasoning. Alternatives: `skos:exactMatch`/`closeMatch`, or an `E42_Identifier`.
5. **Feature dating.** `P8i_witnessed` (feature → period) is the closest
   valid shortcut. Strictly, the deposition event of the hoard falls within
   the period (`P10_falls_within`), which needs an event we don't model yet.
6. **CRMarchaeo.** `crmarchaeo:A21_is_contained_in` is not checked yet, because
   the CRMarchaeo RDFS was not reachable. Confirm the version and term name and
   add it to `make fetch`.
7. **Hoard type.** `:Palace_Hoard` uses a local `:hoard` type. Map it to the AAT
   term for hoards.
8. **Geometry.** `osgeo:asWKT` (Ordnance Survey) is used for WKT. GeoSPARQL's
   `geo:asWKT` with `^^geo:wktLiteral` is the more common choice and is what
   Fuseki's spatial index understands.
9. **Formal CRM ↔ AFO mapping.** Still the "later" item from the decisions.
