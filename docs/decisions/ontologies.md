# Ontology Decisions for LOD-AM Knowledge Graph

*How we chose CIDOC CRM, FABIO, and the Allotrope Framework for representing archaeological objects, scientific analytics, and literature in a unified RDF knowledge graph.*

> **Revision 2026-11-13:** The "key classes/properties" and integration links below were corrected after checking them against CIDOC CRM 7.1.3, AFO 2025/12 and FaBiO. Several of the original terms don't exist or were used outside their domain/range. The choices and the rationale are unchanged. The authoritative patterns are in [CONVENTIONS.md](../../CONVENTIONS.md).

---

## Core Decisions

### 1. CIDOC CRM for Archaeological Objects & Context

**Decision**: Use CIDOC CRM (ISO 21127:2023) as the foundation.

**Why**:
- International standard for cultural heritage information exchange
- Lingua franca of museum, archive, and library data integration
- Comprehensive coverage of cultural heritage documentation
- RDF/OWL native, works with Apache Jena Fuseki
- Large, active community with extensive documentation

**How we use it**:
- **Minimal event modeling**: Only model events essential to scientific analysis (analysis events, sampling events)
- **Skip**: Excavation, conservation, storage/movement, ownership transfer, exhibition events
- **Direct attributes**: Object types, materials, dimensions, discovery locations, current locations
- **Focus**: Objects and their scientific analysis context

**Key classes/properties** (details: [ontologies/cidoc-crm](../../ontologies/cidoc-crm/README.md)):
- `crm:E22_Human-Made_Object` (artefacts), `crm:E25_Human-Made_Feature` (features), `crm:E27_Site`
- `crm:E53_Place` (locations), `crm:E4_Period` / `crm:E52_Time-Span`
- `crm:E7_Activity` (analysis, sampling only)
- `crm:P2_has_type`, `crm:P45_consists_of` (material), `crm:P46_is_composed_of` (parts), `crm:P53_has_former_or_current_location`
- `crm:P70i_is_documented_in` (link to literature)

**Official**: https://cidoc-crm.org/

---

### 2. Allotrope Framework (AFO) for Scientific Analytics

**Decision**: Use Allotrope Framework Ontology (AFO) for natural scientific analytics.

**Why**:
- Designed specifically for analytical chemistry and materials science
- RDF/OWL native
- Covers measurements, units, techniques, instruments, samples
- Open-source and free to use
- Used by major pharmaceutical and materials science organizations

**How we use it**:
- **Direct linking**: object → sample (`afx:AFX_0001048` contains) ← analysis (`afx:AFX_0000399` has input) → measurements (`afx:AFX_0000395` has output). The analysis is also a `crm:E7_Activity`, which connects the two models.
- **No formal mapping yet**: For prototype, we use direct links; formal OWL mappings can be added later
- **Focus**: Chemical composition, dating, material analysis results

**Key classes/properties** (details: [ontologies/afo](../../ontologies/afo/README.md)):
- `afr:AFR_0002036` (concentration), `afp:AFP_0000527` (spectrometry), `afm:AFM_0001099` (chemical mixture)
- `afx:AFX_0002816` (quantifies), `afx:AFX_0000331` (maximum)
- values and units via QUDT: `qudt:numericValue`, `qudt:unit unit:PERCENT`

**Official**: https://www.allotrope.org/ (namespaces `http://purl.allotrope.org/ontologies/...`)

---

### 3. FABIO for Literature Sources

**Decision**: Use FABIO (FRBR Aligned Bibliographic Ontology) for bibliographic references.

**Why**:
- Lightweight, FRBR-aligned ontology designed for practical bibliographic modeling
- Perfect for Zenodo-style literature references
- Simple structure without the complexity of full FRBRoo
- Handles legacy literature without DOIs using local identifiers
- Open and free to use

**How we use it**:
- **Primary level**: `fabio:Work` and its subclasses (e.g., `fabio:JournalArticle`) for literature sources
- **Legacy support**: Use local identifiers when DOIs are unavailable
- **Integration**: archaeological entities point to the literature via `crm:P70i_is_documented_in` (articles are also `crm:E31_Document`)

**Key classes/properties** (details: [ontologies/fabio](../../ontologies/fabio/README.md)):
- `fabio:JournalArticle`, `fabio:Journal`, `fabio:hasPublicationYear`
- `dcterms:title`, `dcterms:creator` → `foaf:Person`
- `prism:doi`, `prism:startingPage`, `prism:endingPage`

**Official**: http://purl.org/spar/fabio/

---

## Integration Approach

### Direct Links Between Ontologies

We use **direct property links** to minimize complexity for the prototype:

1. **Objects to Analytics**: object `afx:AFX_0001048` (contains) sample; analysis `afx:AFX_0000399` (has input) sample
2. **Objects to Literature**: `crm:P70i_is_documented_in` (object/type → publication)
3. **Analytics to Literature**: `crm:P70i_is_documented_in` (analysis → publication)

### Minimal Event Modeling

Only model events that are **essential to scientific analysis**:
- Analysis events (`crm:E7_Activity`, additionally typed with an AFO process class such as `afp:AFP_0000527` spectrometry)
- Sampling events

Skip events that don't add value to our use cases (excavation, conservation, movement, etc.)

### Future Considerations

- **Formal mappings**: Create OWL mappings between CIDOC CRM and AFO when interoperability needs grow
- **Additional ontologies**: CRMsci, CRMdig, CRMarchaeo, GeoSPARQL may be added later
- **Scientific argumentation**: AMO (Argument Model Ontology) for interpretive content

---

## Architecture Overview

```
Core Layer (CIDOC CRM)
  Objects, Places, Minimal Events
  
Specialized Layer
  FABIO (Literature) | AFO (Analytics)
  
Integration Layer
  Direct links: afx contains / has input / has output, P70i_is_documented_in
```

---

## Resources

- **CIDOC CRM**: https://cidoc-crm.org/
- **FABIO**: http://purl.org/spar/fabio/
- **Allotrope Framework**: https://www.allotrope.org/
- **LOD-AM**: https://lod-am.net/