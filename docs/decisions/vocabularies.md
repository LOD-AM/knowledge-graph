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

**How** (*updated 2026-11-15, knowledge-graph#4 and #8*): A `crm:E27_Site` carries its Pleiades place URI as a `crm:E42_Identifier` (`crm:P1_is_identified_by`, typed "Pleiades place URI"), never `owl:sameAs`, so Pleiades' own statements are not merged into ours. Locations are our own `crm:E53_Place` with a GeoSPARQL geometry (`geo:hasGeometry` / `geo:asWKT`). *Originally:* a site was `owl:sameAs` its Pleiades place, uses a Pleiades place type via `crm:P2_has_type`, and points to Pleiades locations via `crm:P53_has_former_or_current_location`.

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

## Addendum 2026-11-17: Wikidata for topics

Blog posts on lod-am.net need subjects, and free tags had become inconsistent (singular and
plural, post kinds mixed with topics, a site as a tag). The owner chose a small local SKOS
vocabulary, `data/vocab/topics.ttl`, matched to **Wikidata**:

- Wikidata covers both halves of the field (archaeometallurgy, periods, regions *and* Linked
  Data, RDM, self-hosting), which AAT does not; LOD-AM already uses Wikidata (nuclides) with a
  verified id list (`tools/wikidata.tsv`).
- Local concepts keep LOD-AM's own wording and hierarchy; the match says how close Wikidata is
  (exact / close / broad). Where Wikidata's item means something else, there is no match.
- Records of the data (sites, publications) are linked directly, not turned into topics.

## Addendum 2026-11-19: the source of a chronology system

Every chronology system of the database (`zt_type`) comes from one publication
(`zt_type.literature_id`). The local `skos:ConceptScheme` that stands for it now names that
publication with **`dcterms:source`** (owner, 2026-11-19).

- **Why `dcterms:source`:** a chronology system is the stand-in for a PeriodO period collection,
  and PeriodO records a collection's source with `dcterms:source`. The scheme stays a plain
  `skos:ConceptScheme`, so moving to PeriodO later needs no remodelling.
- **Rejected:** `crm:P70i_is_documented_in`, the property finds and analyses use. Its domain is
  CRM `E1`, so the scheme would have had to become a CRM class as well (e.g. `E32_Authority_Document`)
  only for this link.
- Shape: `lodsh:ChronologySystemShape` (exactly one `dcterms:source`, a `crm:E31_Document`).
