# Ontology Decisions for LOD-AM Knowledge Graph

*How we chose Pleiades, PeriodO, Getty AAT, Allotrope Framework, and FABIO for representing archaeological data in a unified RDF knowledge graph.*

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

**How**: Direct references to Pleiades places from CIDOC CRM entities via crm:P67_refers_to.

**Official**: https://pleiades.stoa.org/

### 2. PeriodO for Cultures and Periods

Use PeriodO as the controlled vocabulary for archaeological cultures and chronological periods.

**Why**: Linked Data period gazetteer supporting scholarly assertions. Extensible for custom periods. Global scope.

**How**: Period definitions with start/end dates, geographic scope, cultural associations.

**Official**: https://perio.do/en/

### 3. Getty AAT for Feature and Object Types

Use Getty Art and Architecture Thesaurus as the controlled vocabulary for feature/object types.

**Why**: International standard with 30,000+ terms. Multilingual. Comprehensive coverage of material culture.

**How**: Minimal event modeling. Direct attributes for object types, materials, dimensions.

**Official**: https://www.getty.edu/research/tools/vocabularies/aat/

### 4. Allotrope Framework for Scientific Analytics

Use Allotrope Framework Ontology for natural scientific analytics.

**Why**: Purpose-built for laboratory analytical processes. Industry standard. Comprehensive coverage.

**How**: Direct linking from CIDOC CRM objects to AFO results via crm:P128_carries.

**Official**: https://www.allotrope.org/ontologies/result/

### 5. FABIO for Literature Sources

Use FABIO (FRBR Aligned Bibliographic Ontology) for literature.

**Why**: Lightweight, FRBR-aligned ontology. Perfect for Zenodo-style references. Simple structure.

**How**: fabio:JournalArticle and related classes for publication tracking.

**Official**: http://purl.org/spar/fabio/

## Integration Approach

Direct links between ontologies:
- Objects to Analytics: crm:P128_carries
- Objects to Literature: crm:P67_refers_to
- Literature to Sites: crm:P67_refers_to

## Resources

- CIDOC CRM: https://cidoc-crm.org/
- Pleiades: https://pleiades.stoa.org/
- PeriodO: https://perio.do/en/
- Getty AAT: https://www.getty.edu/research/tools/vocabularies/aat/
- Allotrope Framework: https://www.allotrope.org/
- FABIO: http://purl.org/spar/fabio/
