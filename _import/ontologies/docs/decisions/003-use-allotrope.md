---
title: ADR-003 Use Allotrope Framework
description: Decision to use Allotrope Framework for scientific analytics
status: accepted
date: 2026-06-28
decision_makers: LOD-AM Project Team
---

# ADR-003: Use Allotrope Framework

## Status
✅ **Accepted**

## Context
We need to represent scientific analytics, measurements, and techniques in our knowledge graph. Key requirements:
- Model chemical composition analysis
- Support dating methods
- Represent material characterization
- Handle measurements, units, techniques
- Work with RDF/OWL and our triple store
- Be open-source and free to use

## Decision
**Use Allotrope Framework Ontology (AFO) for scientific analytics.**

## Alternatives Considered

### 1. CRMsci
- **Pros**: Designed for scientific observation in cultural heritage
- **Cons**: Less widely adopted, more focused on observations than measurements
- **Verdict**: ❌ Rejected - Allotrope has better measurement support

### 2. Custom Scientific Ontology
- **Pros**: Perfect fit for our needs
- **Cons**: Sacrifices interoperability, reinvents the wheel
- **Verdict**: ❌ Rejected - Allotrope meets our needs

### 3. SIO (SemanticScience Integrated Ontology)
- **Pros**: Comprehensive scientific ontology
- **Cons**: Too broad, not focused on analytical chemistry
- **Verdict**: ❌ Rejected - Allotrope is more specialized

### 4. QUDT (Quantities, Units, Dimensions and Types)
- **Pros**: Good for units and quantities
- **Cons**: Not designed for analytical chemistry, lacks technique modeling
- **Verdict**: ❌ Rejected - Allotrope is more comprehensive

## Consequences

### Positive
- ✅ **Scientific Focus**: Designed specifically for analytical chemistry and materials science
- ✅ **Comprehensive**: Covers measurements, units, techniques, instruments, samples
- ✅ **RDF/OWL Native**: Built for semantic web technologies
- ✅ **FOSS**: Open-source and free to use
- ✅ **Industry Adoption**: Used by major pharmaceutical and materials science organizations
- ✅ **Production Proven**: Tested in real-world applications

### Negative
- ⚠️ **Integration Complexity**: No formal mapping to CIDOC CRM exists
- ⚠️ **Learning Curve**: Requires understanding of AFO model

### Mitigation
- Use **pragmatic direct linking** for prototyping (via P128_carries)
- Create **formal OWL mappings** later when project scales
- Provide **clear documentation and examples**

## Implementation

### Classes Used
- MeasurementResult: Container for measurement values
- MeasurementValue: The actual numeric value
- Unit: Units of measurement (Percent, MilligramPerGram, etc.)
- Technique: Analytical techniques (XRF, ICP-MS, Radiocarbon, etc.)
- Instrument: Equipment used for analysis
- Sample: The sample being analyzed
- Method: Analysis methodology

### Properties Used
- hasValue: Numeric value of measurement
- hasUnit: Unit of measurement
- hasTechnique: Analytical technique used
- hasInstrument: Equipment used
- hasSample: Sample analyzed
- hasMethod: Methodology used

### Integration with CIDOC CRM

**Current Approach (Pragmatic)**: Direct linking

```turtle
# Option 1: Direct link from object to AFO result
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result_001 .
:xrf_result_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent .

# Option 2: Via analysis event
:analysis1 a crm:E7_Activity ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :xrf_result_001 .
```

**Future Work**:
1. Create formal OWL mappings between CIDOC CRM and AFO
2. Define intermediate classes that bridge the two ontologies
3. Contribute mappings to the community

## Common Units and Techniques

### Units
- afo:Percent
- afo:MilligramPerGram
- afo:MicrogramPerGram
- afo:PartsPerMillion
- afo:Millimeter
- afo:Centimeter
- afo:Gram
- afo:Kilogram

### Techniques
- XRF (X-ray Fluorescence)
- ICP-MS (Inductively Coupled Plasma Mass Spectrometry)
- Radiocarbon Dating
- Thermoluminescence Dating
- Material Characterization
- Chemical Analysis

## Related Decisions
- [ADR-001: Use CIDOC CRM](001-use-cidoc-crm.md)
- [ADR-002: Use FRBRoo](002-use-frbroo.md)
- [ADR-004: Minimal Event Modeling](004-minimal-event-modeling.md)

## Resources
- Allotrope Foundation: https://www.allotrope.org/
- AFO Documentation: https://www.allotrope.org/ontologies/result/
- GitHub: https://github.com/Allotrope/allotrope-ontologies
