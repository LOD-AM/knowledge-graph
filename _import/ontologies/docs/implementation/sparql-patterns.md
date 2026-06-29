---
title: SPARQL Query Patterns
description: Common SPARQL query patterns for LOD-AM knowledge graph
ontologies: [CIDOC CRM, FRBRoo, Allotrope Framework]
tags: [sparql, queries, patterns]
status: stable
last_updated: 2026-06-29
---

# SPARQL Query Patterns

> **Common query patterns for querying LOD-AM's knowledge graph**

## Prefixes

Always include these prefixes in your queries:

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
```

## Query Patterns

### Pattern 1: Find All Objects

**Use Case**: Get a list of all archaeological objects

```sparql
SELECT ?object ?id ?type ?material WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P2_has_type ?type ;
    crm:P46_is_composed_of ?material .
  
  ?idNode crm:P190_has_symbolic_content ?id .
  
  OPTIONAL { ?type crm:P3_has_note ?typeName }
  OPTIONAL { ?material crm:P3_has_note ?materialName }
}
```

### Pattern 2: Find Objects by Type

**Use Case**: Find all pottery artifacts

```sparql
SELECT ?object ?id WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P2_has_type :pottery_type .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 3: Find Objects by Material

**Use Case**: Find all clay objects

```sparql
SELECT ?object ?id WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P46_is_composed_of :clay_material .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 4: Find Objects at a Site

**Use Case**: Find all objects from Site Alpha

```sparql
SELECT ?object ?id ?type WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P2_has_type ?type ;
    crm:P53_has_former_or_current_location :site_alpha .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 5: Find Objects with Chemical Analysis

**Use Case**: Find all objects that have chemical analysis results

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>

SELECT ?object ?id ?type ?value ?unit ?technique WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P2_has_type ?type ;
    crm:P128_carries ?result .
  
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit ;
    afo:hasTechnique ?technique .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 6: Find Objects with Specific Analysis Technique

**Use Case**: Find all objects analyzed with XRF

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>

SELECT ?object ?id ?value ?unit WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P128_carries ?result .
  
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit ;
    afo:hasTechnique :xrf_technique .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 7: Find Literature About an Object

**Use Case**: Find all literature that references a specific object

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/>

SELECT ?work ?title ?author ?date WHERE {
  :artifact_001 crm:P67_refers_to ?work .
  
  ?work a frbroo:F1_Work ;
    crm:P102_has_title ?titleNode ;
    crm:P94_has_created ?author ;
    crm:P4_has_time-span ?dateSpan .
  
  ?titleNode crm:P190_has_symbolic_content ?title .
  ?author crm:P131_is_identified_by ?authorName .
  ?authorName crm:P190_has_symbolic_content ?author .
  ?dateSpan crm:P82_at_some_time_within ?date .
}
```

### Pattern 8: Find All Literature About a Site

**Use Case**: Find all literature that references Site Alpha

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/>

SELECT ?work ?title ?author ?date WHERE {
  ?work a frbroo:F1_Work ;
    crm:P102_has_title ?titleNode ;
    crm:P94_has_created ?author ;
    crm:P4_has_time-span ?dateSpan ;
    crm:P67_refers_to :site_alpha .
  
  ?titleNode crm:P190_has_symbolic_content ?title .
  ?author crm:P131_is_identified_by ?authorName .
  ?authorName crm:P190_has_symbolic_content ?author .
  ?dateSpan crm:P82_at_some_time_within ?date .
}
```

### Pattern 9: Find Analysis with Methodology Citation

**Use Case**: Find all analyses that cite a specific methodology paper

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>

SELECT ?analysis ?object ?value ?unit WHERE {
  ?analysis a crm:E7_Activity ;
    crm:P16_used_specific_object ?object ;
    crm:P128_carries ?result ;
    crm:P67_refers_to :xrf_methodology_paper .
  
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode .
  
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit .
  
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 10: Find Complete Analysis Chain

**Use Case**: Find complete chain from object -> sampling -> analysis -> result

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>

SELECT ?object ?sample ?samplingDate ?analysis ?analysisDate ?value ?unit WHERE {
  ?sampling a crm:E7_Activity ;
    crm:P2_has_type :sampling_type ;
    crm:P16_used_specific_object ?object ;
    crm:P4_has_time-span ?samplingDateSpan ;
    crm:P128_carries ?sample .
  
  ?analysis a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object ?sample ;
    crm:P4_has_time-span ?analysisDateSpan ;
    crm:P128_carries ?result .
  
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode .
  
  ?sample a crm:E73_Information_Object .
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit .
  
  ?samplingDateSpan crm:P82_at_some_time_within ?samplingDate .
  ?analysisDateSpan crm:P82_at_some_time_within ?analysisDate .
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

### Pattern 11: Find Objects by Date Range

**Use Case**: Find all objects from a specific time period

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?object ?id ?date WHERE {
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode ;
    crm:P4_has_time-span ?dateSpan .
  
  ?idNode crm:P190_has_symbolic_content ?id .
  ?dateSpan crm:P82_at_some_time_within ?date .
  
  FILTER (?date >= "1200-01-01"^^xsd:date && ?date <= "1000-12-31"^^xsd:date)
}
```

### Pattern 12: Find Analysis by Analyst

**Use Case**: Find all analyses performed by a specific analyst

```sparql
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX afo: <http://www.allotrope.org/ontologies/result#>

SELECT ?analysis ?object ?date ?value ?unit WHERE {
  ?analysis a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P14_carried_out_by :analyst_john_doe ;
    crm:P16_used_specific_object ?object ;
    crm:P4_has_time-span ?dateSpan ;
    crm:P128_carries ?result .
  
  ?object a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by ?idNode .
  
  ?result a afo:MeasurementResult ;
    afo:hasValue ?value ;
    afo:hasUnit ?unit .
  
  ?dateSpan crm:P82_at_some_time_within ?date .
  ?idNode crm:P190_has_symbolic_content ?id .
}
```

## Query Optimization Tips

### 1. Use Specific Types
Instead of:
```sparql
?object a crm:E22_Man-Made_Object
```
Use:
```sparql
?object a crm:E22_Man-Made_Object ;
  crm:P2_has_type :pottery_type
```

### 2. Limit Result Fields
Only select the fields you need:
```sparql
SELECT ?object ?id ?type
```
Instead of:
```sparql
SELECT *
```

### 3. Use FILTER Early
Apply filters as early as possible in the query:
```sparql
?object a crm:E22_Man-Made_Object ;
  crm:P2_has_type :pottery_type .
FILTER (...)
```

### 4. Use OPTIONAL for Non-Essential Information
```sparql
OPTIONAL { ?object crm:P3_has_note ?description }
```

### 5. Use UNION for Multiple Patterns
```sparql
{ ?object crm:P128_carries ?result }
UNION
{ ?event crm:P16_used_specific_object ?object ;
  crm:P128_carries ?result }
```

## Testing Queries

### In Fuseki
1. Go to Fuseki web interface
2. Navigate to Query tab
3. Paste your SPARQL query
4. Execute and review results

### Validation
- Check that all prefixes are defined
- Verify all variables are used
- Ensure FILTER expressions are valid
- Test with known data

## See Also

- [Modeling Guide](modeling-guide.md)
- [Ontology Stack Architecture](../architecture/ontology-stack.md)
- [Integration Patterns](../architecture/integration-patterns.md)
