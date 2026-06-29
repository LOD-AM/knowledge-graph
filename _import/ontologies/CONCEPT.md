# Ontological Strategy for LOD-AM Knowledge Graph

> *How we chose CIDOC CRM, FRBRoo, and the Allotrope Framework for representing archaeological objects, scientific analytics, and literature in a unified RDF knowledge graph*

## Executive Summary

The LOD-AM project uses a three-ontology stack:
1. CIDOC CRM (ISO 21127:2023) - Archaeological objects & context
2. FRBRoo - Literature & bibliographic references
3. Allotrope Framework (AFO) - Scientific analytics

## Project Requirements

### Core Domain
- Prehistoric artifacts, features, sites
- Natural scientific analysis (chemical, physical, dating)
- Bibliographic references (including legacy without DOIs)
- Interoperability with cultural heritage systems

### Technical
- RDF/OWL based
- FOSS compatible
- Static site friendly (SPARQL queryable)
- Prototyping speed

### Modeling Philosophy
- Object-Centric
- Minimal Events
- Pragmatic
- Extensible

## Ontology Selection

### 1. CIDOC CRM
**Decision**: Use CIDOC CRM (ISO 21127:2023)

**Why**:
- Industry Standard (ISO 21127:2023)
- Comprehensive cultural heritage coverage
- RDF/OWL Native
- Large community
- FOSS compatible

**Implementation**: Minimal event modeling
- Modeled with events: Scientific analysis, Sampling
- Not modeled: Excavation, Conservation, Movement, Ownership
- Modeled directly: Object attributes, Discovery locations, Links

### 2. Allotrope Framework
**Decision**: Use AFO for scientific analytics

**Why**:
- Scientific focus (analytical chemistry)
- RDF/OWL native
- Comprehensive (measurements, units, techniques)
- FOSS
- Industry adoption

**Integration**: Direct linking with CIDOC CRM via P128_carries

### 3. FRBRoo
**Decision**: Use FRBRoo for literature

**Why**:
- Native CIDOC CRM integration
- Cultural heritage focus
- Legacy literature support
- Mature (v2.4)
- FOSS

**Handling Legacy Literature**: Multiple identification methods (local IDs, ISBN, DOI, author+title+date)

## Architecture

Four layers:
1. Core Ontology Layer (CIDOC CRM)
2. Specialized Ontology Layer (FRBRoo, Allotrope)
3. Data Integration Layer (cross-ontology links)
4. Technical Infrastructure (Fuseki, Eleventy)

## Why This Combination Works

1. **Interoperability**: All three are standards in their domains
2. **Focus**: Minimal event modeling keeps us focused on what matters
3. **Pragmatism**: Direct linking allows quick prototyping
4. **FOSS**: All components are open-source

## Implementation Patterns

### Pattern 1: Object with Direct Analytics
```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P128_carries :analysis_result1 .
:analysis_result1 a afo:MeasurementResult .
```

### Pattern 2: Object with Analysis Event
```turtle
:analysis1 a crm:E7_Activity ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :analysis_result1 .
```

### Pattern 3: Object with Literature
```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :work1 .
:work1 a frbroo:F1_Work .
```

## SPARQL Examples

### Query 1: Objects with chemical analysis
```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>
SELECT ?object ?type ?result ?value ?unit WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P2_has_type ?type ;
    crm:P128_carries ?result .
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit .
}
```

## Future Considerations

1. Formal ontology mappings (CIDOC CRM <-> AFO)
2. Scientific argumentation (AMO)
3. Event modeling expansion
4. Additional ontologies (CRMsci, CRMdig, CRMarchaeo, GeoSPARQL)
5. Data quality and provenance

## Resources

- CIDOC CRM: https://cidoc-crm.org/
- FRBRoo: https://cidoc-crm.org/frbroo
- Allotrope: https://www.allotrope.org/
- Fuseki: https://jena.apache.org/documentation/fuseki2/
- Eleventy: https://www.11ty.dev/
- LOD-AM: https://lod-am.net/
- ARIADNE: https://www.ariadne-infrastructure.eu/
- CLAROS: https://www.clarosnet.org/

---
*Last updated: June 29, 2026*
