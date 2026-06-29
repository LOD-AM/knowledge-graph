---
title: Allotrope Framework in LOD-AM
description: How LOD-AM uses Allotrope Framework for scientific analytics
ontologies: [Allotrope Framework, CIDOC CRM]
tags: [allotrope, scientific-analytics, measurements]
status: stable
last_updated: 2026-06-29
---

# Allotrope Framework in LOD-AM

**Allotrope Framework Ontology (AFO)** is a semantic framework for analytical chemistry and materials science.

## Why Allotrope Framework?

| Criterion | Status | Notes |
|-----------|--------|-------|
| Scientific Focus | Designed for analytical chemistry | Perfect fit |
| RDF/OWL Native | Built for semantic web | Works with Fuseki |
| Comprehensive | Measurements, units, techniques, instruments | Covers our needs |
| FOSS | Open-source | Free to use |
| Industry Adoption | Major pharmaceutical companies | Production proven |

## Key Classes

| Class | AFO | LOD-AM Usage | Priority |
|-------|-----|--------------|----------|
| MeasurementResult | MeasurementResult | Container for measurement values | **Critical** |
| MeasurementValue | MeasurementValue | The actual numeric value | High |
| Unit | Unit | Units of measurement | **Critical** |
| Technique | Technique | Analytical techniques | **Critical** |
| Instrument | Instrument | Equipment used | Medium |
| Sample | Sample | The sample being analyzed | Medium |
| Method | Method | Analysis methodology | Medium |
| Parameter | Parameter | Analysis parameters | Medium |

## Key Properties

| Property | Domain | Range | Usage |
|----------|--------|-------|-------|
| hasValue | MeasurementResult | MeasurementValue/xsd:decimal | Numeric results |
| hasUnit | MeasurementResult | Unit | Units of measurement |
| hasTechnique | MeasurementResult | Technique | Analysis technique used |
| hasInstrument | MeasurementResult | Instrument | Equipment used |
| hasSample | MeasurementResult | Sample | Sample analyzed |
| hasMethod | MeasurementResult | Method | Methodology used |

## Example: Complete Analysis Representation

```turtle
@prefix afo: <http://www.allotrope.org/ontologies/result#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:xrf_analysis_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent ;
    afo:hasTechnique :xrf_technique ;
    afo:hasInstrument :xrf_spectrometer_01 ;
    afo:hasSample :sample_001 ;
    afo:hasMethod :xrf_method .

:xrf_technique a afo:Technique ;
    afo:hasName "X-ray Fluorescence" .

:xrf_spectrometer_01 a afo:Instrument ;
    afo:hasName "Bruker S2 PUMA" ;
    afo:hasModel "S2 PUMA" ;
    afo:hasManufacturer "Bruker" .

:sample_001 a afo:Sample ;
    afo:hasName "Pottery Shard 001 - Sample A" ;
    afo:hasDescription "1g sample from rim fragment" .

:xrf_method a afo:Method ;
    afo:hasName "Standard XRF Analysis Protocol" .
```

## Integration with CIDOC CRM

**Current Approach (Pragmatic)**: Direct linking using CIDOC CRM properties

### Option 1: Direct Link from Object to AFO Result

```turtle
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix afo: <http://www.allotrope.org/ontologies/result#> .

:artifact1 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result_001 .

:xrf_result_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent .
```

### Option 2: Via Analysis Event

```turtle
:analysis1 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :xrf_result_001 .

:xrf_result_001 a afo:MeasurementResult .
```

**Rationale for Direct Linking**:
- Pragmatism: Allows quick prototyping
- Simplicity: Easy to implement
- Extensibility: Can be formalized later
- One-person project: Reduces implementation burden

**Future Formalization**:
When the project scales, we'll need to:
1. Create **formal OWL mappings** between CIDOC CRM and AFO
2. Define **intermediate classes** that are subclasses of both
3. Contribute mappings to the **cultural heritage and scientific communities**

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

## Resources

- Allotrope Foundation: https://www.allotrope.org/
- AFO Documentation: https://www.allotrope.org/ontologies/result/
- GitHub: https://github.com/Allotrope/allotrope-ontologies

## See Also

- [Ontology Stack Architecture](../../architecture/ontology-stack.md)
- [CIDOC CRM Overview](../cidoc-crm/overview.md)
- [FRBRoo Overview](../frbroo/overview.md)
- [Integration Patterns](../../architecture/integration-patterns.md)
