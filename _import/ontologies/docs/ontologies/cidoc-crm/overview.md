---
title: CIDOC CRM in LOD-AM
description: How LOD-AM uses CIDOC CRM for archaeological objects and context
ontologies: [CIDOC CRM]
tags: [cidoc-crm, overview, archaeological-objects]
status: stable
last_updated: 2026-06-29
---

# CIDOC CRM in LOD-AM

**CIDOC CRM** (Conceptual Reference Model) is the international ISO standard (ISO 21127:2023) for representing cultural heritage information.

## Why CIDOC CRM?

| Criterion | Status | Notes |
|-----------|--------|-------|
| Industry Standard | ISO 21127:2023 | Critical for interoperability |
| Cultural Heritage Focus | Designed for museums, archives, libraries | Perfect fit |
| Comprehensive | All aspects of cultural heritage | Covers our needs |
| RDF/OWL Native | Built for semantic web | Works with Fuseki |
| Community | Large, active | Resources available |
| Extensibility | Domain-specific extensions | Future-proof |
| FOSS | Open standard | Free to use |

## Implementation

We use a **focused subset** of CIDOC CRM optimized for our use cases.

### Core Classes Used

| Class | CIDOC CRM | LOD-AM Usage | Priority |
|-------|-----------|--------------|----------|
| E22 | Man-Made Object | Archaeological artifacts | **Critical** |
| E53 | Place | Sites, findspots, locations | **Critical** |
| E73 | Information Object | Documents, datasets | High |
| E7 | Activity | Events (analysis, sampling) | Medium |
| E39 | Actor | People, organizations | Medium |
| E52 | Time-Span | Dates, time periods | Medium |
| E42 | Identifier | IDs, DOIs, local identifiers | Medium |
| E55 | Type | Classifications | High |
| E57 | Material | Materials, substances | Medium |
| E54 | Dimension | Measurements | Low |

### Key Properties Used

| Property | Domain | Range | Usage |
|----------|--------|-------|-------|
| P1_is_identified_by | E1 | E42 | Identification |
| P2_has_type | E1 | E55 | Classification |
| P3_has_note | E1 | E62 | Descriptions |
| P46_is_composed_of | E70 | E57 | Material composition |
| P53_has_former_or_current_location | E70 | E53 | Object locations |
| P67_refers_to | E1 | E1 | References to literature |
| P128_carries | E24 | E73 | Links to analysis results |
| P16_used_specific_object | E7 | E70 | Activity-object relationships |
| P14_carried_out_by | E7 | E39 | Activity-actor relationships |
| P4_has_time-span | E2 | E52 | Temporal information |

## Modeling Patterns

### Pattern 1: Archaeological Object

```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by :id_001 ;
    crm:P2_has_type :pottery_type ;
    crm:P46_is_composed_of :clay_material ;
    crm:P53_has_former_or_current_location :site_alpha ;
    crm:P3_has_note "Storage jar fragment, Late Bronze Age" .
```

### Pattern 2: Archaeological Site

```turtle
:site_alpha a crm:E53_Place ;
    crm:P1_is_identified_by :site_id_001 ;
    crm:P2_has_type :archaeological_site_type ;
    crm:P89_falls_within :region_southern_germany ;
    crm:P3_has_note "Prehistoric settlement site" .
```

### Pattern 3: Scientific Analysis Event

```turtle
:analysis_001 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :artifact_001 ;
    crm:P14_carried_out_by :analyst_john_doe ;
    crm:P4_has_time-span :date_2026 ;
    crm:P128_carries :xrf_result_001 .
```

### Pattern 4: Sampling Event

```turtle
:sampling_001 a crm:E7_Activity ;
    crm:P2_has_type :sampling_type ;
    crm:P16_used_specific_object :artifact_001 ;
    crm:P14_carried_out_by :sampler_jane_doe ;
    crm:P4_has_time-span :date_2026 ;
    crm:P128_carries :sample_001 .

:sample_001 a crm:E73_Information_Object ;
    crm:P2_has_type :ceramic_sample_type .
```

## Integration with Other Ontologies

### With FRBRoo
Native integration (FRBRoo is a CIDOC CRM extension):

```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :excavation_report_1985 .
:excavation_report_1985 a frbroo:F1_Work .
```

### With Allotrope Framework
Direct linking via P128_carries:

```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result_001 .
:xrf_result_001 a afo:MeasurementResult .
```

**Note**: This is a pragmatic approach for prototyping. Formal OWL mappings will be created later.

## Resources

- Official: https://cidoc-crm.org/
- Specification: https://cidoc-crm.org/rdfs/7.1.3/
- Documentation: https://cidoc-crm.org/docs/
- GitHub: https://github.com/ics-forth/gr-cidoc-crm

## See Also

- [Ontology Stack Architecture](../../architecture/ontology-stack.md)
- [Minimal Event Modeling](../../architecture/minimal-event-modeling.md)
- [Integration Patterns](../../architecture/integration-patterns.md)
