---
title: ADR-001 Use CIDOC CRM
description: Decision to use CIDOC CRM as the core ontology for LOD-AM
status: accepted
date: 2026-06-28
decision_makers: LOD-AM Project Team
---

# ADR-001: Use CIDOC CRM

## Status
✅ **Accepted**

## Context
We need a foundational ontology for representing archaeological objects, their context, and related information in a knowledge graph. The ontology must:
- Support archaeological artifacts, features, and sites
- Enable interoperability with other cultural heritage systems
- Work with RDF/OWL and our triple store (Apache Jena Fuseki)
- Be open-source and free to use

## Decision
**Use CIDOC CRM (ISO 21127:2023) as the core ontology for LOD-AM.**

## Alternatives Considered

### 1. Dublin Core
- **Pros**: Simple, widely known
- **Cons**: Too simple, not domain-specific enough for archaeology
- **Verdict**: ❌ Rejected - lacks necessary expressivity

### 2. Schema.org
- **Pros**: Web-friendly, Google support
- **Cons**: Not designed for cultural heritage, limited expressivity
- **Verdict**: ❌ Rejected - not suitable for our domain

### 3. Custom Ontology
- **Pros**: Perfect fit for our needs
- **Cons**: Sacrifices interoperability, reinvents the wheel
- **Verdict**: ❌ Rejected - interoperability is critical

### 4. CRMarchaeo
- **Pros**: Archaeology-specific, extends CIDOC CRM
- **Cons**: Less widely adopted, more complex than needed
- **Verdict**: ❌ Rejected - CIDOC CRM is sufficient and more standard

## Consequences

### Positive
- ✅ **Interoperability**: CIDOC CRM is the international standard for cultural heritage
- ✅ **Comprehensive**: Covers all aspects of our domain
- ✅ **Extensible**: Can be extended for our specific needs
- ✅ **Community**: Large, active community with resources
- ✅ **FOSS**: Open standard, free to use
- ✅ **RDF Native**: Built for semantic web technologies

### Negative
- ⚠️ **Complexity**: CIDOC CRM is event-based, which can be complex
- ⚠️ **Learning Curve**: Requires understanding of CIDOC CRM model

### Mitigation
- Use **minimal event modeling** to reduce complexity
- Focus on **subset of classes** relevant to our use cases
- Provide **documentation and examples** for team members

## Implementation

### Classes Used
- E22 Man-Made Object (artifacts)
- E53 Place (sites, locations)
- E73 Information Object (documents)
- E7 Activity (minimal: analysis, sampling)
- E39 Actor (people, organizations)
- E52 Time-Span (dates)

### Properties Used
- P1_is_identified_by (identification)
- P2_has_type (classification)
- P46_is_composed_of (material composition)
- P53_has_former_or_current_location (locations)
- P67_refers_to (references to literature)
- P128_carries (links to analysis results)

## Related Decisions
- [ADR-002: Use FRBRoo](002-use-frbroo.md)
- [ADR-003: Use Allotrope Framework](003-use-allotrope.md)
- [ADR-004: Minimal Event Modeling](004-minimal-event-modeling.md)

## Resources
- Official: https://cidoc-crm.org/
- Specification: https://cidoc-crm.org/rdfs/7.1.3/
- Documentation: https://cidoc-crm.org/docs/
