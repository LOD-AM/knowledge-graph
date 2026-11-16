# Decisions for converted data (2026-11-16)

Decided by the owner in #19, #20 and #21 (option 1 each), before the R2RML converter
in LOD-AM/ingest. The patterns are in [CONVENTIONS.md](../../CONVENTIONS.md).

- **#20 IRIs from `id_uuid`: typed path** `/id/<kind>/<uuid>`. The class can be read from the
  IRI, and the website and web server can route entity pages by kind. Drawback accepted: if
  a record ever changes kind (feature ↔ site), its IRI changes. Integer ids in the source are
  only unique per site, and names change, so neither can be used. Helper nodes use
  `<record IRI>/<role>` (slash, not hash): each stays addressable on its own.
- **#19 finds without a feature: `crm:P53_has_former_or_current_location` → the site's place.**
  One triple, a shortcut in the spirit of `P8i_witnessed`. It reuses the place and geometry of
  the site. Not chosen: a CRMsci `S19_Encounter_Event` per find (no data for the event) and an
  "unspecified context" feature per site (a feature we know nothing about).
- **#21 "not detected": value-less measurement typed `:not_detected`.** AFO 2025/12 has no term
  for "not detected" or a limit of detection. Writing `0` would compute a value; leaving the
  measurement out would make "not detected" indistinguishable from "not analysed". The node is
  also a `crm:E54_Dimension` so that `crm:P2_has_type` stays within its CRM domain; measured
  values don't get a CRM class yet (that belongs to #17, the CRM ↔ AFO mapping).
