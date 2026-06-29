---
title: Minimal Event Modeling Approach
description: LOD-AM's philosophy of minimal event modeling with CIDOC CRM
ontologies: [CIDOC CRM]
tags: [events, modeling, philosophy]
status: stable
last_updated: 2026-06-29
---

# Minimal Event Modeling Approach

**Philosophy**: "Use CIDOC CRM's event model where it adds value, skip it where it adds only complexity."

## The Problem
Full CIDOC CRM event modeling requires events for everything:
- Excavation events
- Production events  
- Movement events
- Conservation events
- Ownership transfer events

**Cost**: High complexity, many entities to create and maintain.

## Our Solution
**Selectively apply** event modeling only where it provides clear value.

### What We Model with Events

#### 1. Scientific Analysis Events (E7 Activity)
**Why**: Core to our scientific analysis focus

```turtle
:xrf_analysis_001 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :pottery_shard_001 ;
    crm:P14_carried_out_by :analyst_john_doe ;
    crm:P4_has_time-span :analysis_date_2026 ;
    crm:P128_carries :xrf_result_001 .
```

**Value**: Tracks who, when, where, methodology

#### 2. Sampling Events (E7 Activity)
**Why**: Critical for sample provenance tracking

```turtle
:sampling_001 a crm:E7_Activity ;
    crm:P16_used_specific_object :pottery_shard_001 ;
    crm:P14_carried_out_by :sampler_jane_doe ;
    crm:P4_has_time-span :sampling_date_2026 ;
    crm:P128_carries :sample_001 .
```

**Value**: Tracks sample provenance, enables destructive analysis

### What We Skip (For Now)

| Event Type | Reason | Future Trigger |
|------------|--------|----------------|
| Excavation | Not essential for current focus | Stratigraphy needed |
| Conservation | Not relevant to analysis | Condition tracking needed |
| Storage/Movement | Current location sufficient | Provenance tracking needed |
| Ownership | Not relevant to research | Legal provenance needed |

### What We Model Directly (No Events)

1. **Object Attributes**: Types, materials, dimensions, locations
2. **Discovery Context**: Discovery locations as places
3. **Cross-Ontology Links**: Direct references to literature and analytics

```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type ;
    crm:P46_is_composed_of :clay_material ;
    crm:P53_has_former_or_current_location :site_alpha ;
    crm:P67_refers_to :literature_001 ;
    crm:P128_carries :analysis_result_001 .
```

## Why This Approach Works

### 1. Focus on What Matters
- Primary research questions: objects + scientific analysis + literature
- Minimal event modeling keeps us focused
- Reduces implementation complexity significantly
- Maintains full CIDOC CRM interoperability

### 2. Pragmatism for Prototyping
- Build quickly without unnecessary complexity
- Validate concepts before investing in comprehensive modeling
- Iterate fast based on feedback
- One-person project needs to move quickly

### 3. Extensibility for the Future
- Doesn't prevent adding more events later
- Backward compatible: existing direct links continue to work
- Incremental migration: add events gradually as needed
- Query flexibility: queries can handle both patterns

### 4. CIDOC CRM Compliance
- Uses standard CIDOC CRM classes and properties
- Follows CIDOC CRM semantics
- Can be formalized later
- Level 2 - CIDOC CRM Conformant

## Comparison

| Aspect | Full Event | Minimal Event | No Events |
|--------|------------|---------------|-----------|
| Completeness | All history | Core history | Minimal |
| Complexity | Very High | Low | Very Low |
| Speed | Very Slow | Fast | Very Fast |
| Interoperability | Full | Compliant | Limited |
| Prototyping | Poor | **Excellent** | Good |

## Migration Path

1. **Preparation**: Document approach, create ADRs, establish vocabularies
2. **Incremental Addition**: Add event types as needed (excavation, conservation, etc.)
3. **Data Migration**: Keep existing links, add new events alongside
4. **Full Formalization**: Create OWL mappings, define intermediate classes

## Decision Record
See [ADR-004: Minimal Event Modeling](../decisions/004-minimal-event-modeling.md)

## See Also
- [Ontology Stack Architecture](ontology-stack.md)
- [CIDOC CRM Overview](../ontologies/cidoc-crm/overview.md)
- [Integration Patterns](integration-patterns.md)
