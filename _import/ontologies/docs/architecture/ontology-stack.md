---
title: Ontology Stack Architecture
description: The layered architecture of LOD-AM's knowledge graph ontologies
ontologies: [CIDOC CRM, FRBRoo, Allotrope Framework]
tags: [architecture, layers, integration]
status: stable
last_updated: 2026-06-29
---

# Ontology Stack Architecture

Our knowledge graph uses a **four-layer architecture**:

## Layer 1: Core Ontology Layer
**Purpose**: Foundation for archaeological domain entities
**Ontology**: CIDOC CRM (ISO 21127:2023)

### Key Classes
- E22 Man-Made Object (artifacts)
- E53 Place (sites, locations)
- E73 Information Object (documents)
- E7 Activity (minimal: analysis, sampling)
- E39 Actor (people, organizations)
- E52 Time-Span (dates)

### Implementation
We use **minimal event modeling**: only events essential to scientific analysis.

## Layer 2: Specialized Ontology Layer
**Purpose**: Domain-specific extensions

### FRBRoo Sub-Layer
**Purpose**: Bibliographic information
**Key Classes**: F1 Work, F2 Expression, F3 Manifestation, F4 Item
**Features**: Native CIDOC CRM integration, legacy literature support

### Allotrope Framework Sub-Layer
**Purpose**: Scientific analytics
**Key Classes**: MeasurementResult, Technique, Unit, Instrument, Sample
**Features**: RDF/OWL native, comprehensive measurement modeling

## Layer 3: Data Integration Layer
**Purpose**: Cross-ontology connections

### Connection Patterns
1. **Direct Analytics Link**: Object -> AFO result via P128_carries
2. **Analysis Event**: Object -> Event -> AFO result with context
3. **Object-Literature**: Object -> FRBRoo work via P67_refers_to
4. **Methodology Citation**: Event -> FRBRoo work via P67_refers_to
5. **Sampling Chain**: Object -> Sampling Event -> Sample -> Analysis Event -> Result
6. **Site Literature**: FRBRoo work -> Site via P67_refers_to

## Layer 4: Technical Infrastructure
**Components**:
- Apache Jena Fuseki (Triple Store)
- Eleventy (Static Site Generator)
- SPARQL (Query Language)

## Design Principles
1. **Interoperability First**: Use widely adopted standards
2. **Focus on What Matters**: Only model what's essential
3. **Pragmatism for Prototyping**: Build quickly, validate, iterate
4. **Extensibility**: Design for future growth
5. **FOSS Compatibility**: All components are open-source

## See Also
- [Integration Patterns](integration-patterns.md)
- [Minimal Event Modeling](minimal-event-modeling.md)
- [CIDOC CRM Usage](../ontologies/cidoc-crm/overview.md)
