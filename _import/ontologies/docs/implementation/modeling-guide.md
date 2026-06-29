---
title: Modeling Guide
description: Practical guide for modeling archaeological data using LOD-AM ontologies
tags: [modeling, guide, best-practices]
status: stable
last_updated: 2026-06-29
---

# Modeling Guide

> **Practical patterns and best practices for modeling archaeological data in LOD-AM**

## General Principles

### 1. Start Simple
- Use **direct links** where possible (Pattern 1, Pattern 3)
- Add **events** only when context is needed (Pattern 2, Pattern 5)
- Use **methodology citations** when reproducibility matters (Pattern 4)

### 2. Be Consistent
- Use the **same pattern** for similar use cases
- Stick to our **controlled vocabularies**
- Follow our **naming conventions**

### 3. Use Controlled Vocabularies

#### Object Types
```turtle
:pottery_type a crm:E55_Type ;
    crm:P2_has_type :artifact_type ;
    crm:P3_has_note "Pottery" .

:stone_tool_type a crm:E55_Type ;
    crm:P2_has_type :artifact_type ;
    crm:P3_has_note "Stone tool" .

:metal_object_type a crm:E55_Type ;
    crm:P2_has_type :artifact_type ;
    crm:P3_has_note "Metal object" .
```

#### Material Types
```turtle
:clay_material a crm:E57_Material ;
    crm:P2_has_type :ceramic_material ;
    crm:P3_has_note "Clay" .

:bronze_material a crm:E57_Material ;
    crm:P2_has_type :metal_material ;
    crm:P3_has_note "Bronze alloy (Cu-Sn)" .

:flint_material a crm:E57_Material ;
    crm:P2_has_type :stone_material ;
    crm:P3_has_note "Flint" .
```

#### Analysis Types
```turtle
:xrf_analysis_type a crm:E55_Type ;
    crm:P2_has_type :analysis_type ;
    crm:P3_has_note "X-ray Fluorescence analysis" .

:icp_ms_analysis_type a crm:E55_Type ;
    crm:P2_has_type :analysis_type ;
    crm:P3_has_note "Inductively Coupled Plasma Mass Spectrometry" .

:radiocarbon_dating_type a crm:E55_Type ;
    crm:P2_has_type :analysis_type ;
    crm:P3_has_note "Radiocarbon dating" .
```

### 4. Naming Conventions

#### Identifiers
- Use **kebab-case** for local IDs: `ART-2026-001`, `SITE-ALPHA-001`
- Use **consistent prefixes**: ART-, SITE-, ANA-, SAMP-, etc.
- Include **year** for temporal context when possible

#### URIs
- Use **lowercase** for URI local names: `:pottery_shard_001`
- Use **singular** form for individual entities
- Use **plural** form for collections/types

## Modeling Patterns

### Pattern 1: Simple Artifact

**Use Case**: Basic artifact with minimal information

```turtle
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .

:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by :id_001 ;
    crm:P2_has_type :pottery_type ;
    crm:P46_is_composed_of :clay_material ;
    crm:P53_has_former_or_current_location :site_alpha ;
    crm:P3_has_note "Storage jar fragment" .

:id_001 a crm:E42_Identifier ;
    crm:P2_has_type :local_id_type ;
    crm:P190_has_symbolic_content "ART-2026-001" .
```

### Pattern 2: Artifact with Dimensions

**Use Case**: Artifact with physical measurements

```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P43_has_dimension :height_001, :width_001, :thickness_001 .

:height_001 a crm:E54_Dimension ;
    crm:P2_has_type :height ;
    crm:P90_has_value "12.5"^^xsd:decimal ;
    crm:P91_has_unit :centimeter .

:width_001 a crm:E54_Dimension ;
    crm:P2_has_type :width ;
    crm:P90_has_value "8.3"^^xsd:decimal ;
    crm:P91_has_unit :centimeter .

:thickness_001 a crm:E54_Dimension ;
    crm:P2_has_type :thickness ;
    crm:P90_has_value "0.7"^^xsd:decimal ;
    crm:P91_has_unit :centimeter .
```

### Pattern 3: Artifact with Analysis (Direct)

**Use Case**: Artifact with direct link to analysis result

```turtle
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix afo: <http://www.allotrope.org/ontologies/result#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P128_carries :xrf_result_001 .

:xrf_result_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent ;
    afo:hasTechnique :xrf_technique .
```

### Pattern 4: Artifact with Analysis (Event-Based)

**Use Case**: Artifact with analysis event including context

```turtle
:artifact_001 a crm:E22_Man-Made_Object .

:analysis_001 a crm:E7_Activity ;
    crm:P2_has_type :xrf_analysis_type ;
    crm:P16_used_specific_object :artifact_001 ;
    crm:P14_carried_out_by :analyst_john_doe ;
    crm:P4_has_time-span :date_2026 ;
    crm:P128_carries :xrf_result_001 .

:xrf_result_001 a afo:MeasurementResult ;
    afo:hasValue "18.5"^^xsd:decimal ;
    afo:hasUnit afo:Percent .
```

### Pattern 5: Artifact with Literature Reference

**Use Case**: Artifact mentioned in literature

```turtle
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix frbroo: <http://iflastandards.info/ns/fr/frbr/frbroo/> .

:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P67_refers_to :excavation_report_1985 .

:excavation_report_1985 a frbroo:F1_Work ;
    crm:P102_has_title "Excavation Report: Site Alpha, 1985 Season" ;
    crm:P1_is_identified_by :local_id_001 .

:local_id_001 a crm:E42_Identifier ;
    crm:P2_has_type :local_id_type ;
    crm:P190_has_symbolic_content "ARCH-1985-001" .
```

### Pattern 6: Complete Archaeological Site

**Use Case**: Site with hierarchical location

```turtle
:site_alpha a crm:E53_Place ;
    crm:P1_is_identified_by :site_id_001 ;
    crm:P2_has_type :archaeological_site_type ;
    crm:P89_falls_within :region_southern_germany ;
    crm:P3_has_note "Prehistoric settlement site, Late Bronze Age" .

:region_southern_germany a crm:E53_Place ;
    crm:P2_has_type :region_type ;
    crm:P89_falls_within :country_germany ;
    crm:P3_has_note "Southern Germany" .

:country_germany a crm:E53_Place ;
    crm:P2_has_type :country_type ;
    crm:P3_has_note "Germany" .
```

## Best Practices

### 1. Always Include Identification
Every entity should have at least one identifier:
```turtle
:entity_001 a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by :id_001 .
```

### 2. Use Meaningful URIs
Use URIs that are self-descriptive:
- Good: `:pottery_shard_001`, `:site_alpha_001`
- Bad: `:x1`, `:item123`

### 3. Include Descriptions
Add human-readable descriptions where helpful:
```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P3_has_note "Storage jar fragment with red slip decoration, Late Bronze Age" .
```

### 4. Use Consistent Types
Always classify entities:
```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type .
```

### 5. Link to Related Entities
Connect entities to related entities:
```turtle
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P53_has_former_or_current_location :site_alpha ;
    crm:P67_refers_to :literature_001 .
```

## Common Mistakes to Avoid

### 1. Over-Modeling
❌ Don't create events for everything:
```turtle
# Too much:
:movement_001 a crm:E9_Move ;
    crm:P16_used_specific_object :artifact_001 ;
    crm:P7_took_place_at :storage_room .

# Better:
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P53_has_former_or_current_location :storage_room .
```

### 2. Missing Identifiers
❌ Don't forget to identify entities:
```turtle
# Bad:
:artifact_001 a crm:E22_Man-Made_Object .

# Good:
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P1_is_identified_by :id_001 .
```

### 3. Inconsistent Naming
❌ Don't use inconsistent naming:
```turtle
# Bad:
:Pottery_Shard_001 a crm:E22_Man-Made_Object .
:site-alpha a crm:E53_Place .

# Good:
:pottery_shard_001 a crm:E22_Man-Made_Object .
:site_alpha a crm:E53_Place .
```

### 4. Not Using Controlled Vocabularies
❌ Don't create duplicate types:
```turtle
# Bad:
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery .
:artifact_002 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :Pottery .

# Good:
:artifact_001 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type .
:artifact_002 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type .
```

## Validation

### Checklist
- [ ] Every entity has an identifier
- [ ] Every entity has a type
- [ ] URIs are consistent (lowercase, underscores)
- [ ] All required properties are present
- [ ] Cross-references are valid
- [ ] Turtle syntax is valid

### Common Validation Errors
1. **Missing prefix declarations**: Always include `@prefix` declarations
2. **Undefined entities**: Make sure all referenced entities are defined
3. **Syntax errors**: Validate Turtle syntax
4. **Inconsistent types**: Use controlled vocabularies

## See Also

- [Ontology Stack Architecture](../architecture/ontology-stack.md)
- [Integration Patterns](../architecture/integration-patterns.md)
- [CIDOC CRM Overview](../ontologies/cidoc-crm/overview.md)
- [FRBRoo Overview](../ontologies/frbroo/overview.md)
- [Allotrope Framework Overview](../ontologies/allotrope-framework/overview.md)
- [SPARQL Patterns](sparql-patterns.md)
