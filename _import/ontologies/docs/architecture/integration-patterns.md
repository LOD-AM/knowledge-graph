---
title: Ontology Integration Patterns
description: Practical patterns for connecting CIDOC CRM, FRBRoo, and Allotrope Framework
ontologies: [CIDOC CRM, FRBRoo, Allotrope Framework]
tags: [integration, patterns, examples]
status: stable
last_updated: 2026-06-29
---

# Ontology Integration Patterns

## Integration Philosophy
1. Direct linking where semantically appropriate
2. Minimal event modeling to reduce complexity
3. Pragmatic mappings over formal alignments (for now)
4. Extensibility for future formal mappings

## Pattern Catalog

### Pattern 1: Object with Direct Analytics Link
**Use Case**: Simple object-analysis association
**Complexity**: Low

```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result_001 .
:xrf_result_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent .
```

**When to Use**: Simple associations, context not important
**When to Avoid**: When analysis context (who, when, where) matters

### Pattern 2: Object with Analysis Event
**Use Case**: Analysis with full context
**Complexity**: Medium

```turtle
:analysis_001 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P14_carried_out_by :analyst_john ;
    crm:P4_has_time-span :date_2026 ;
    crm:P128_carries :xrf_result_001 .
```

**When to Use**: When context (analyst, date, location) is important

### Pattern 3: Object with Literature Reference
**Use Case**: Link objects to literature
**Complexity**: Low

```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :excavation_report .
:excavation_report a frbroo:F1_Work ;
    crm:P102_has_title "Report Title" ;
    crm:P1_is_identified_by :local_id .
:local_id a crm:E42_Identifier ;
    crm:P190_has_symbolic_content "ARCH-1985-001" .
```

**Legacy Literature**: Use local identifiers, ISBN, DOI, or author+title+date

### Pattern 4: Analysis with Methodology Citation
**Use Case**: Link analysis to methodology literature
**Complexity**: Medium

```turtle
:analysis_001 a crm:E7_Activity ;
    crm:P67_refers_to :methodology_paper .
:methodology_paper a frbroo:F1_Work ;
    crm:P102_has_title "XRF Analysis Methodology" .
```

### Pattern 5: Complete Sampling and Analysis Chain
**Use Case**: Full provenance tracking
**Complexity**: High

```turtle
:sampling_001 a crm:E7_Activity ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :sample_001 .
:analysis_001 a crm:E7_Activity ;
    crm:P16_used_specific_object :sample_001 ;
    crm:P128_carries :xrf_result_001 .
```

### Pattern 6: Literature About a Site
**Use Case**: Link literature to archaeological sites
**Complexity**: Low

```turtle
:site_report a frbroo:F1_Work ;
    crm:P67_refers_to :site_alpha .
:site_alpha a crm:E53_Place .
```

## Pattern Selection Guide

| Use Case | Pattern | Complexity |
|----------|---------|------------|
| Simple object-analysis | Pattern 1 | Low |
| Analysis with context | Pattern 2 | Medium |
| Object in literature | Pattern 3 | Low |
| Methodology citation | Pattern 4 | Medium |
| Complete provenance | Pattern 5 | High |
| Site documentation | Pattern 6 | Low |

## Cross-Ontology Properties
- P128_carries: CIDOC CRM -> AFO (Object to Analysis Result)
- P67_refers_to: CIDOC CRM -> FRBRoo (Entity to Literature)
- P16_used_specific_object: CIDOC CRM -> CIDOC CRM (Activity to Object/Sample)
- P14_carried_out_by: CIDOC CRM -> CIDOC CRM (Activity to Actor)

## See Also
- [Ontology Stack Architecture](ontology-stack.md)
- [Minimal Event Modeling](minimal-event-modeling.md)
