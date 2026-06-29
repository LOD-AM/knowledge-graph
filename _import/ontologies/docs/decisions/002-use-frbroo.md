---
title: ADR-002 Use FRBRoo
description: Decision to use FRBRoo for literature and bibliographic references
status: accepted
date: 2026-06-28
decision_makers: LOD-AM Project Team
---

# ADR-002: Use FRBRoo

## Status
✅ **Accepted**

## Context
We need to represent literature sources and bibliographic references in our knowledge graph. Key requirements:
- Handle bibliographic information comprehensively
- Support legacy literature without DOIs
- Integrate well with CIDOC CRM
- Be open-source and widely adopted in cultural heritage

## Decision
**Use FRBRoo for bibliographic information and literature references.**

## Alternatives Considered

### 1. Dublin Core
- **Pros**: Simple, widely known
- **Cons**: Too simple for comprehensive bibliographic needs
- **Verdict**: ❌ Rejected - lacks necessary structure

### 2. BIBFRAME
- **Pros**: Library-focused, comprehensive
- **Cons**: Less integration with CIDOC CRM, library-specific
- **Verdict**: ❌ Rejected - FRBRoo has better CIDOC CRM integration

### 3. Custom Bibliographic Ontology
- **Pros**: Perfect fit for our needs
- **Cons**: Sacrifices interoperability, reinvents the wheel
- **Verdict**: ❌ Rejected - FRBRoo meets our needs

### 4. Schema.org/BibExtension
- **Pros**: Web-friendly
- **Cons**: Not designed for cultural heritage, limited expressivity
- **Verdict**: ❌ Rejected - not suitable for our domain

## Consequences

### Positive
- ✅ **Native Integration**: FRBRoo is an extension of CIDOC CRM
- ✅ **Cultural Heritage Focus**: Designed for museums, libraries, archives
- ✅ **Legacy Literature Support**: Handles works without DOIs using local identifiers
- ✅ **Formal Structure**: Based on FRBR model (Work → Expression → Manifestation → Item)
- ✅ **Mature**: Version 2.4 released, widely used
- ✅ **FOSS**: Open-source and free to use

### Negative
- ⚠️ **Complexity**: FRBR model has multiple levels
- ⚠️ **Learning Curve**: Requires understanding of FRBR concepts

### Mitigation
- Primarily use **F1 Work** level for simplicity
- Use other levels (F2, F3, F4) only when needed
- Provide **clear documentation and examples**

## Implementation

### Classes Used
- F1 Work (primary): Intellectual creations, literature sources
- F2 Expression (secondary): Translations, editions
- F3 Manifestation (secondary): Physical/digital embodiments
- F4 Item (rare): Specific physical copies
- F10 Person: Authors (subclass of E39_Actor)
- F11 Corporate Body: Institutions (subclass of E39_Actor)

### Identification Methods
1. **Local Identifiers**: For legacy literature without standard IDs
2. **Standard Identifiers**: ISBN, ISSN, DOI when available
3. **Author + Title + Date**: For disambiguation when no ID exists
4. **Multiple Identifiers**: Combine methods for robustness

### Integration with CIDOC CRM
```turtle
# Literature about an object
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :work1 .
:work1 a frbroo:F1_Work .

# Literature about a site
:work2 a frbroo:F1_Work ;
    crm:P67_refers_to :site1 .
:site1 a crm:E53_Place .

# Work created by an author
:work3 a frbroo:F1_Work ;
    crm:P94_has_created :author1 .
:author1 a frbroo:F10_Person .
```

## Related Decisions
- [ADR-001: Use CIDOC CRM](001-use-cidoc-crm.md)
- [ADR-003: Use Allotrope Framework](003-use-allotrope.md)
- [ADR-004: Minimal Event Modeling](004-minimal-event-modeling.md)

## Resources
- Official: https://cidoc-crm.org/frbroo
- Wikipedia: https://en.wikipedia.org/wiki/FRBRoo
- Specification: http://www.cidoc-crm.org/frbroo/frbroo_v2.4.pdf
