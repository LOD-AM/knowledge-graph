---
title: FRBRoo in LOD-AM
description: How LOD-AM uses FRBRoo for literature and bibliographic references
ontologies: [FRBRoo, CIDOC CRM]
tags: [frbroo, literature, bibliographic, frbr]
status: stable
last_updated: 2026-06-29
---

# FRBRoo in LOD-AM

**FRBRoo** (FRBR-object oriented) is a joint initiative between CIDOC CRM and FRBR (Functional Requirements for Bibliographic Records) communities.

## Why FRBRoo?

| Criterion | Status | Notes |
|-----------|--------|-------|
| Native CIDOC CRM Integration | Extension of CIDOC CRM | Seamless integration |
| Cultural Heritage Focus | Designed for museums, libraries, archives | Perfect fit |
| Legacy Literature Support | Handles works without DOIs | Critical for our use case |
| Formal Structure | FRBR model (Work->Expression->Manifestation->Item) | Structured approach |
| Mature | Version 2.4 | Production ready |
| FOSS | Open-source | Free to use |

## FRBR Model

The FRBR model organizes bibliographic information into **four levels**:

1. **F1 Work**: Intellectual/artistic creation (e.g., "The Uses of Argument")
2. **F2 Expression**: Realization in a particular form (e.g., English edition, German translation)
3. **F3 Manifestation**: Physical embodiment (e.g., paperback, hardcover, PDF)
4. **F4 Item**: Single physical/digital exemplar (e.g., specific copy in library)

**LOD-AM Usage**: Primarily F1 Work, with occasional use of other levels when needed.

## Key Classes

| Class | FRBRoo | LOD-AM Usage | Priority |
|-------|--------|--------------|----------|
| F1 | Work | Literature sources, publications | **Critical** |
| F2 | Expression | Translations, editions | Medium |
| F3 | Manifestation | Physical/digital embodiments | Medium |
| F4 | Item | Specific copies | Low |
| F10 | Person | Authors (subclass of E39_Actor) | Medium |
| F11 | Corporate Body | Institutions (subclass of E39_Actor) | Medium |

## Handling Legacy Literature Without DOIs

One of our **key requirements** is handling literature without DOIs. FRBRoo provides multiple identification methods:

### Method 1: Local Identifier (Most Common)

```turtle
:work1 a frbroo:F1_Work ;
    crm:P1_is_identified_by :local_id .
:local_id a crm:E42_Identifier ;
    crm:P2_has_type :local_id_type ;
    crm:P190_has_symbolic_content "ARCH-1985-001" .
```

### Method 2: Standard Identifier (ISBN, ISSN, DOI)

```turtle
:work2 a frbroo:F1_Work ;
    crm:P1_is_identified_by :isbn_id .
:isbn_id a crm:E42_Identifier ;
    crm:P2_has_type :isbn_type ;
    crm:P190_has_symbolic_content "978-0-123456-78-9" .
```

### Method 3: Author + Title + Date (For Disambiguation)

```turtle
:work3 a frbroo:F1_Work ;
    crm:P102_has_title "Excavation Report: Site X" ;
    crm:P94_has_created :author_archaeologist ;
    crm:P4_has_time-span :publication_date_1985 .
:author_archaeologist a crm:E39_Actor .
:publication_date_1985 a crm:E52_Time-Span ;
    crm:P82_at_some_time_within "1985"^^xsd:gYear .
```

### Method 4: Multiple Identifiers

```turtle
:work4 a frbroo:F1_Work ;
    crm:P1_is_identified_by :local_id, :doi_id .
:local_id a crm:E42_Identifier ;
    crm:P2_has_type :local_id_type ;
    crm:P190_has_symbolic_content "ARCH-1985-001" .
:doi_id a crm:E42_Identifier ;
    crm:P2_has_type :doi_type ;
    crm:P190_has_symbolic_content "10.1234/arch-1985-001" .
```

## Integration with CIDOC CRM

FRBRoo is **natively integrated** with CIDOC CRM:

### Pattern 1: Literature About an Object

```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :excavation_report_1985 .
:excavation_report_1985 a frbroo:F1_Work .
```

### Pattern 2: Literature About a Site

```turtle
:site_report_2020 a frbroo:F1_Work ;
    crm:P67_refers_to :site_alpha .
:site_alpha a crm:E53_Place .
```

### Pattern 3: Literature with Author

```turtle
:work1 a frbroo:F1_Work ;
    crm:P102_has_title :title_001 ;
    crm:P94_has_created :author_archaeologist .
:author_archaeologist a frbroo:F10_Person .
```

## Resources

- Official: https://cidoc-crm.org/frbroo
- Wikipedia: https://en.wikipedia.org/wiki/FRBRoo
- Specification: http://www.cidoc-crm.org/frbroo/frbroo_v2.4.pdf

## See Also

- [Ontology Stack Architecture](../../architecture/ontology-stack.md)
- [CIDOC CRM Overview](../cidoc-crm/overview.md)
- [Allotrope Framework Overview](../allotrope-framework/overview.md)
