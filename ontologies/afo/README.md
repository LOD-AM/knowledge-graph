# Allotrope Framework Ontology (AFO) Usage in LOD-AM

## Purpose
Represent natural scientific analytics: chemical composition, dating, material analysis.

## Key Classes Used
- `afo:MeasurementResult` - Analysis results
- `afo:MeasurementTechnique` - Analysis techniques (XRF, ICP-MS, etc.)
- `afo:Unit` - Units of measurement

## Key Properties Used
- `afo:hasValue` - Numeric result value
- `afo:hasUnit` - Unit of measurement
- `afo:hasTechnique` - Analysis technique used

## Integration with CIDOC CRM
For the prototype, we use **direct links** between CIDOC CRM objects and AFO results:
```turtle
# Option 1: Direct link (simplest)
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result .

:xrf_result a afo:MeasurementResult ;
    afo:hasValue "5.2"^^xsd:decimal ;
    afo:hasUnit afo:Percent ;
    afo:hasTechnique :xrf_technique .

# Option 2: Via minimal event
:analysis1 a crm:E7_Activity ;
    crm:P2_has_type :chemical_analysis ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :xrf_result .
```

## Note on Formal Mapping
Currently, there is **no formal OWL mapping** between CIDOC CRM and AFO. For the prototype, direct linking is sufficient. When interoperability needs grow, we will:
1. Create formal mappings between the ontologies
2. Define intermediate classes if needed
3. Contribute mappings back to the community

## Example Techniques
- XRF (X-Ray Fluorescence)
- ICP-MS (Inductively Coupled Plasma Mass Spectrometry)
- Radiocarbon dating
- Material characterization