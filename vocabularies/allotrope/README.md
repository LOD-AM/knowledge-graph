# Allotrope Framework in LOD-AM

## Purpose in LOD-AM
Allotrope Foundation Ontology provides a controlled vocabulary suite for laboratory analytical processes and measurements.

## Key Terms We Use
- afo:MeasurementResult
- afo:hasValue, afo:hasUnit, afo:hasTechnique
- afo:MeasurementTechnique (XRF, ICP-MS, etc.)

## Deviations from Standard
Direct linking from CIDOC CRM via crm:P128_carries. No formal OWL mapping layer.

## Example Snippet
```turtle
:artifact a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result .

:xrf_result a afo:MeasurementResult ;
    afo:hasValue "5.2"^^xsd:decimal ;
    afo:hasUnit afo:Percent .
```
