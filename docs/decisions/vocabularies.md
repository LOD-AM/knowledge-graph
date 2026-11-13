# Vocabulary Decisions for LOD-AM Knowledge Graph

*How we chose Pleiades, PeriodO, Getty AAT, Allotrope Framework, and FABIO for representing archaeological data in a unified RDF knowledge graph.*

> **Revision 2026-11-13:** The "How" lines were corrected to match CIDOC CRM 7.1.3 (see [CONVENTIONS.md](../../CONVENTIONS.md)). Allotrope and FaBiO are ontologies; their usage notes live in [ontologies/](../../ontologies/).

## Summary

| Vocabulary | Domain | Purpose in LOD-AM |
|------------|--------|-------------------|
| **Pleiades** | Archaeological Sites | Controlled vocabulary for sites with ability to add custom entries |
| **PeriodO** | Cultures & Periods | Linked Data period gazetteer with scholarly assertions |
| **Getty AAT** | Feature/Object Types | Global standard for material culture and architectural features |
| **Allotrope Framework** | Scientific Analytics | Purpose-built vocabulary for laboratory analytical data |
| **FABIO** | Literature | Lightweight FRBR-aligned ontology for bibliographic references |

## Core Decisions

### 1. Pleiades for Sites and Site Types

Use Pleiades as the controlled vocabulary for archaeological sites and site types.

**Why**: Global scope with Classical foundation, actively expanding. Community-driven model allows researchers to add new sites directly. Critical for research outside Mediterranean/Orient.

**How**: A `crm:E27_Site` is `owl:sameAs` its Pleiades place, uses a Pleiades place type via `crm:P2_has_type`, and points to Pleiades locations via `crm:P53_has_former_or_current_location`.

**Official**: https://pleiades.stoa.org/

### 2. PeriodO for Cultures and Periods

Use PeriodO as the controlled vocabulary for archaeological cultures and chronological periods.

**Why**: Linked Data period gazetteer supporting scholarly assertions. Extensible for custom periods. Global scope.

**How**: The PeriodO IRI is used as a `crm:E4_Period`, with a local `crm:E52_Time-Span` holding the start/end dates and `crm:P7_took_place_at` for geographic scope.

**Official**: https://perio.do/en/

### 3. Getty AAT for Feature and Object Types

Use Getty Art and Architecture Thesaurus as the controlled vocabulary for feature/object types.

**Why**: International standard with 30,000+ terms. Multilingual. Comprehensive coverage of material culture.

**How**: AAT concept IRIs (`aat:<id>`) via `crm:P2_has_type` (types, `crm:E55_Type`) and `crm:P45_consists_of` (materials, `crm:E57_Material`). Hierarchies are fetched with `converter/fetchType.js`.

**Official**: https://www.getty.edu/research/tools/vocabularies/aat/

### 4. Allotrope Framework for Scientific Analytics

Use Allotrope Framework Ontology for natural scientific analytics.

**Why**: Purpose-built for laboratory analytical processes. Industry standard. Comprehensive coverage.

**How**: object → sample → analysis → measurement, see [ontologies/afo](../../ontologies/afo/README.md).

**Official**: https://www.allotrope.org/ontologies/result/

### 5. FABIO for Literature Sources

Use FABIO (FRBR Aligned Bibliographic Ontology) for literature.

**Why**: Lightweight, FRBR-aligned ontology. Perfect for Zenodo-style references. Simple structure.

**How**: `fabio:JournalArticle` with Dublin Core / PRISM properties, see [ontologies/fabio](../../ontologies/fabio/README.md).

**Official**: http://purl.org/spar/fabio/

## Integration Approach

Direct links between ontologies:
See [CONVENTIONS.md](../../CONVENTIONS.md#linking-the-parts).

## Resources

- CIDOC CRM: https://cidoc-crm.org/
- Pleiades: https://pleiades.stoa.org/
- PeriodO: https://perio.do/en/
- Getty AAT: https://www.getty.edu/research/tools/vocabularies/aat/
- Allotrope Framework: https://www.allotrope.org/
- FABIO: http://purl.org/spar/fabio/
