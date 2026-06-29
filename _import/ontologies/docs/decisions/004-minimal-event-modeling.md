---
title: ADR-004 Minimal Event Modeling
description: Decision to use minimal event modeling with CIDOC CRM
status: accepted
date: 2026-06-28
decision_makers: LOD-AM Project Team
---

# ADR-004: Minimal Event Modeling

## Status
✅ **Accepted**

## Context
CIDOC CRM is fundamentally event-based, modeling the world as entities participating in events (creation, movement, modification, etc.). While this is powerful for comprehensive documentation, it can be overkill for our focused use case. We need to decide how extensively to use event modeling.

## Decision
**Use minimal event modeling: only model events that are essential to our scientific analysis use cases.**

## Alternatives Considered

### 1. Full Event Modeling
- **Pros**: Complete history, maximum CIDOC CRM compliance
- **Cons**: Very high complexity, slow implementation, high maintenance
- **Verdict**: ❌ Rejected - overkill for prototyping

### 2. No Events (Direct Modeling Only)
- **Pros**: Simplest approach, fastest implementation
- **Cons**: Limited expressivity, may need events later, breaks CIDOC CRM semantics
- **Verdict**: ❌ Rejected - too restrictive

### 3. **Minimal Event Modeling (Chosen)**
- **Pros**: Balanced approach, CIDOC CRM compliant, extensible
- **Cons**: Some complexity, requires careful design
- **Verdict**: ✅ **Accepted** - best balance

## Consequences

### What We Model with Events

#### 1. Scientific Analysis Events (E7 Activity)
**Why**: Core to our project's focus on scientific analytics

**Properties**:
- P2_has_type: Analysis type (XRF, ICP-MS, Radiocarbon, etc.)
- P16_used_specific_object: The object or sample being analyzed
- P14_carried_out_by: Who performed the analysis
- P4_has_time-span: When the analysis was performed
- P7_took_place_at: Where the analysis was performed
- P128_carries: The analysis result (links to AFO)
- P67_refers_to: Methodology citation (links to FRBRoo)

**Example**:
```turtle
:xrf_analysis_001 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :pottery_shard_001 ;
    crm:P14_carried_out_by :analyst_john_doe ;
    crm:P4_has_time-span :analysis_date_2026 ;
    crm:P128_carries :xrf_result_001 .
```

#### 2. Sampling Events (E7 Activity)
**Why**: Critical for tracking provenance of samples

**Properties**:
- P2_has_type: Sampling type
- P16_used_specific_object: The source object
- P14_carried_out_by: Who took the sample
- P4_has_time-span: When the sample was taken
- P7_took_place_at: Where the sample was taken
- P128_carries: The sample created (as E73 Information Object)

**Example**:
```turtle
:sampling_001 a crm:E7_Activity ;
    crm:P16_used_specific_object :pottery_shard_001 ;
    crm:P14_carried_out_by :sampler_jane_doe ;
    crm:P4_has_time-span :sampling_date_2026 ;
    crm:P128_carries :sample_001 .
```

### What We Skip (For Now)

| Event Type | Reason for Deferral | Future Trigger |
|------------|---------------------|----------------|
| Excavation events | Not essential for current focus | Stratigraphy becomes important |
| Conservation events | Not relevant to analysis | Condition tracking needed |
| Storage/Movement events | Current location sufficient | Provenance tracking needed |
| Ownership transfer | Not relevant to research | Legal provenance needed |

### What We Model Directly (No Events)

1. **Object Attributes**: Types, materials, dimensions, locations
2. **Discovery Context**: Discovery locations as places (not excavation events)
3. **Cross-Ontology Links**: Direct references to literature and analytics

**Example**:
```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type ;
    crm:P46_is_composed_of :clay_material ;
    crm:P53_has_former_or_current_location :site_alpha ;
    crm:P67_refers_to :literature_001 ;
    crm:P128_carries :analysis_result_001 .
```

## Rationale

### 1. Focus on What Matters
Our primary research questions are about:
- Archaeological objects and their attributes
- Scientific analysis of those objects
- Literature that documents and interprets them

Minimal event modeling keeps us focused on these core concerns.

### 2. Pragmatism for Prototyping
As a one-person prototype:
- Need to build quickly
- Validate concepts before investing in comprehensive modeling
- Iterate fast based on feedback
- Deliver value early

### 3. Extensibility for the Future
This approach doesn't prevent adding more events later:
- **Backward compatible**: Existing direct links continue to work
- **Incremental migration**: Add events gradually as needed
- **Query flexibility**: Queries can handle both patterns
- **Data integrity**: No data loss during migration

### 4. CIDOC CRM Compliance
- Uses standard CIDOC CRM classes and properties
- Follows CIDOC CRM semantics
- Can be formalized later
- Level 2 - CIDOC CRM Conformant

## Migration Path

If we need to add more events later:

1. **Preparation**: Document approach, create ADRs, establish vocabularies
2. **Incremental Addition**: Add event types as needed
3. **Data Migration**: Keep existing links, add new events alongside
4. **Full Formalization**: Create OWL mappings, define intermediate classes

## Related Decisions
- [ADR-001: Use CIDOC CRM](001-use-cidoc-crm.md)
- [ADR-002: Use FRBRoo](002-use-frbroo.md)
- [ADR-003: Use Allotrope Framework](003-use-allotrope.md)

## Resources
- [Minimal Event Modeling Documentation](../../architecture/minimal-event-modeling.md)
- [CIDOC CRM Overview](../ontologies/cidoc-crm/overview.md)
