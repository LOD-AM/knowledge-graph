# CIDOC CRM 7.1.3 in LOD-AM

## Purpose
Core ontology for archaeological objects, sites, features, periods and the
few events we model. We use version **7.1.3** (the LTS release); `make check`
rejects terms that don't exist in it and properties used outside their
domain/range.

## Classes we use
- `crm:E22_Human-Made_Object` – artefacts and their parts (7.x name; `E22_Man-Made_Object` is gone)
- `crm:E25_Human-Made_Feature` – features such as hoards
- `crm:E27_Site` – sites
- `crm:E53_Place` – locations, countries
- `crm:E4_Period`, `crm:E52_Time-Span` – periods (from PeriodO) and their dates
- `crm:E17_Type_Assignment` – who classified what as which type
- `crm:E55_Type`, `crm:E57_Material` – types and materials (mostly Getty AAT)
- `crm:E42_Identifier` – inventory/field numbers
- `crm:E7_Activity` – **only** analysis and sampling events
- `crm:E74_Group` – laboratories, institutions
- `crm:E31_Document` – publications (also typed as FaBiO)

## Properties we use
| Property | Use |
|---|---|
| `P2_has_type` | object → type (shortcut, always present) |
| `P45_consists_of` | object → material (shortcut) |
| `P41i_was_classified_by` / `P41_classified` + `P42_assigned` | full type assignment |
| `P46_is_composed_of` / `P46i_forms_part_of` | physical parts (object → blade; feature → site) |
| `P1_is_identified_by` → `E42_Identifier` + `P190_has_symbolic_content` | identifiers (never a plain literal) |
| `P53_has_former_or_current_location` | physical thing → place |
| `P4_has_time-span`, `P79`/`P80_..._is_qualified_by` | period dating |
| `P7_took_place_at` | period → place |
| `P8i_witnessed` | feature → period |
| `P14_carried_out_by` | analysis → lab |
| `P70i_is_documented_in` | anything → publication |

## Common mistakes (all caught by `make check`)
- `P71_is_listed_in` does not exist in 7.1.3 → use `P70i_is_documented_in` (publication) or `skos:inScheme` (vocabulary).
- `P148_has_component` is for propositional objects (texts), not physical parts → `P46_is_composed_of`.
- `P46_is_composed_of` is not for materials → `P45_consists_of`.
- `P89_falls_within` is place → place only.
- `P41_classified` goes *from* the E17 assignment *to* the object; from the object use `P41i_was_classified_by`.
- `P128_carries` (E18 → E90 symbolic object) does not link objects to measurement results.

## Deviations from standard practice
- **Minimal events**: only analysis and sampling; no excavation, conservation, movement or ownership events.
- **Shortcuts first**: `P2_has_type` / `P45_consists_of` are always given, so queries stay simple; the E17 assignment is added when provenance matters.
