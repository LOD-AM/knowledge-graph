# Ontology Resources

## Core Ontologies Used in LOD-AM

### 1. CIDOC CRM
- **Official Website**: https://cidoc-crm.org/
- **Specification (RDF)**: https://cidoc-crm.org/rdfs/7.1.3/
- **Documentation**: https://cidoc-crm.org/docs/
- **GitHub Repository**: https://github.com/ics-forth/gr-cidoc-crm
- **ISO Standard**: ISO 21127:2023
- **Description**: International standard for cultural heritage information exchange

### 2. FRBRoo
- **Official Website**: https://cidoc-crm.org/frbroo
- **Wikipedia**: https://en.wikipedia.org/wiki/FRBRoo
- **Specification PDF**: http://www.cidoc-crm.org/frbroo/frbroo_v2.4.pdf
- **GitHub Repository**: https://github.com/ics-forth/gr-cidoc-crm (includes FRBRoo)
- **Description**: FRBR-object oriented, extension of CIDOC CRM for bibliographic information

### 3. Allotrope Framework Ontology (AFO)
- **Allotrope Foundation**: https://www.allotrope.org/
- **AFO Documentation**: https://www.allotrope.org/ontologies/result/
- **GitHub Repository**: https://github.com/Allotrope/allotrope-ontologies
- **Description**: Semantic framework for analytical chemistry and materials science

## Additional Ontologies (Future Considerations)

### CRMsci
- **Website**: https://www.ics.forth.gr/isl/CRMsci/
- **Description**: Extension of CIDOC CRM for scientific observation
- **Status**: Future consideration for more detailed scientific modeling

### CRMdig
- **Website**: https://www.ics.forth.gr/isl/CRMdig/
- **Description**: Extension of CIDOC CRM for digital provenance
- **Status**: Future consideration for 3D models and digital objects

### CRMarchaeo
- **Website**: https://www.ics.forth.gr/isl/CRMarchaeo/
- **Description**: Extension of CIDOC CRM for archaeological excavation
- **Status**: Future consideration if we need detailed excavation modeling

### GeoSPARQL
- **W3C Recommendation**: https://www.w3.org/TR/geosparql/
- **Description**: Geographic query language for RDF
- **Status**: Future consideration for spatial queries

### AMO (Argument Model Ontology)
- **GitHub**: https://github.com/ArgumentationInterchangeFormat/AIF
- **Description**: Ontology for scientific argumentation based on Toulmin's model
- **Status**: Deferred (see ADR-005)

## Ontology Validation and Tools

### SHACL
- **W3C Recommendation**: https://www.w3.org/TR/shacl/
- **Description**: Shapes Constraint Language for RDF validation
- **Status**: Future consideration for data validation

### OWL
- **W3C Recommendation**: https://www.w3.org/OWL/
- **Description**: Web Ontology Language for ontology definition
- **Status**: Used by all our ontologies

### RDF
- **W3C Recommendation**: https://www.w3.org/RDF/
- **Description**: Resource Description Framework, foundation of semantic web
- **Status**: Used by all our ontologies

## See Also
- [CIDOC CRM Overview](../docs/ontologies/cidoc-crm/overview.md)
- [FRBRoo Overview](../docs/ontologies/frbroo/overview.md)
- [Allotrope Framework Overview](../docs/ontologies/allotrope-framework/overview.md)
