# Ontology Decisions for LOD-AM Knowledge Graph

*How we chose CIDOC CRM, FRBRoo, and the Allotrope Framework for representing archaeological objects, scientific analytics, and literature in a unified RDF knowledge graph.*

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

**Key classes/properties**:
- `crm:E22_Man-Made_Object` (artifacts, features)
- `crm:E53_Place` (sites, findspots)
- `crm:E7_Activity` (analysis, sampling only)
- `crm:P2_has_type`, `crm:P46_is_composed_of`, `crm:P53_has_former_or_current_location`
- `crm:P128_carries` (link to analysis results)

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
- **Direct linking**: Connect AFO results to CIDOC CRM objects via `crm:P128_carries`
- **No formal mapping yet**: For prototype, we use direct links; formal OWL mappings can be added later
- **Focus**: Chemical composition, dating, material analysis results

**Key classes/properties**:
- `afo:MeasurementResult`
- `afo:hasValue`, `afo:hasUnit`, `afo:hasTechnique`

**Official**: https://www.allotrope.org/ontologies/result/

---

### 3. FRBRoo for Literature Sources

**Decision**: Use FRBRoo for bibliographic references.

**Why**:
- Joint initiative between CIDOC CRM and FRBR communities
- Harmonizes library and museum worlds
- Native CIDOC CRM extension (not separate ontology)
- Handles legacy literature without DOIs using local identifiers, ISBNs, ISSNs, or author+title+date
- Cultural heritage focus
- Mature (v2.4), widely used in production

**How we use it**:
- **Primary level**: `frbroo:F1_Work` for literature sources
- **Legacy support**: Use local identifiers when DOIs are unavailable
- **Integration**: Direct links between literature and archaeological entities via `crm:P67_refers_to`

**Key classes/properties**:
- `frbroo:F1_Work` (intellectual/artistic creation)
- `frbroo:F2_Expression` (realization in specific form)
- `frbroo:F3_Manifestation` (physical embodiment)
- `crm:P67_refers_to` (link from work to archaeological entities)
- `crm:P102_has_title`, `crm:P94_has_created`, `crm:P4_has_time-span`

**Official**: https://cidoc-crm.org/frbroo

---

## Integration Approach

### Direct Links Between Ontologies

We use **direct property links** to minimize complexity for the prototype:

1. **Objects to Analytics**: `crm:P128_carries` (object → AFO result)
2. **Objects to Literature**: `crm:P67_refers_to` (literature → object/site)
3. **Analytics to Literature**: `crm:P67_refers_to` (methodology citation)

### Minimal Event Modeling

Only model events that are **essential to scientific analysis**:
- Analysis events (`crm:E7_Activity` with type `chemical_analysis`, `dating`, etc.)
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
  FRBRoo (Literature) | AFO (Analytics)
  
Integration Layer
  Direct links: P128_carries, P67_refers_to
```

---

## Resources

- **CIDOC CRM**: https://cidoc-crm.org/
- **FRBRoo**: https://cidoc-crm.org/frbroo
- **Allotrope Framework**: https://www.allotrope.org/
- **LOD-AM**: https://lod-am.net/