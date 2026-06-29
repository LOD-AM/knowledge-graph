---
title: ADR-005 Defer AMO
description: Decision to defer Argument Model Ontology for now
status: accepted
date: 2026-06-28
decision_makers: LOD-AM Project Team
---

# ADR-005: Defer AMO (Argument Model Ontology)

## Status
✅ **Accepted**

## Context
We need to decide whether to include scientific argumentation and reasoning chains in our knowledge graph. AMO (Argument Model Ontology) is based on Toulmin's model of argumentation and provides a framework for representing:
- Scientific arguments and hypotheses
- Evidence linked to claims
- Reasoning chains and uncertainty
- Competing interpretations

## Decision
**Defer AMO for now, with the option to adopt it later when needed.**

## Alternatives Considered

### 1. Adopt AMO Now
- **Pros**: Comprehensive argumentation modeling, future-proof
- **Cons**: Adds significant complexity, not needed for current use cases, slows down prototyping
- **Verdict**: ❌ Rejected - premature optimization

### 2. **Defer AMO (Chosen)**
- **Pros**: Keeps prototype simple and focused, can add later when needed
- **Cons**: Argumentation not modeled initially
- **Verdict**: ✅ **Accepted** - pragmatic for prototyping

### 3. Use Simpler Argumentation Model
- **Pros**: Lighter weight than AMO
- **Cons**: Less comprehensive, may need to migrate later
- **Verdict**: ❌ Rejected - AMO is the standard, better to wait

## Consequences

### Positive
- ✅ **Simplicity**: Keeps data model focused on objects and analysis
- ✅ **Speed**: Faster prototyping and implementation
- ✅ **Flexibility**: Can adopt AMO later when argumentation becomes important
- ✅ **Pragmatism**: Don't add complexity until it's needed

### Negative
- ⚠️ **Limited Expressivity**: Cannot model scientific arguments initially
- ⚠️ **Future Migration**: May need to add argumentation later

### Mitigation
- Design data model to be **extensible** for future AMO adoption
- Document **scientific interpretations** in literature references for now
- Track **uncertainty and confidence** in analysis results when possible
- Monitor **AMO development** and adoption in cultural heritage community

## Future Adoption Plan

### Trigger for Adoption
Adopt AMO when we need to:
1. Model **scientific arguments** and hypotheses explicitly
2. Link **evidence to claims** in a structured way
3. Track **reasoning chains** and uncertainty formally
4. Represent **competing interpretations** of the same data

### Implementation Steps
1. **Review AMO**: Understand the ontology and its application
2. **Map to CIDOC CRM**: Create mappings between AMO and our existing model
3. **Extend Data Model**: Add AMO classes and properties to our knowledge graph
4. **Migrate Data**: Add argumentation to existing data where applicable
5. **Update Queries**: Modify SPARQL queries to handle argumentation

### Potential Use Cases
- **Interpretation of Analysis Results**: Different researchers may interpret the same analysis differently
- **Hypothesis Testing**: Track hypotheses and the evidence supporting/against them
- **Scientific Debates**: Represent different interpretations of archaeological findings
- **Uncertainty Management**: Formalize uncertainty and confidence levels

## Current Workaround

Until we adopt AMO, we can:
1. **Document in Literature**: Use FRBRoo to reference papers that contain arguments
2. **Use Descriptions**: Include interpretive text in object/analysis descriptions
3. **Track Confidence**: Add confidence levels to analysis results
4. **Link Evidence**: Use P67_refers_to to link analyses to supporting literature

**Example**:
```turtle
:analysis_001 a crm:E7_Activity ;
    crm:P67_refers_to :interpretation_paper .
:interpretation_paper a frbroo:F1_Work ;
    crm:P102_has_title "Interpretation of Site Alpha Findings" ;
    crm:P3_has_note "Argues that Site Alpha was a Bronze Age settlement" .
```

## Related Decisions
- [ADR-001: Use CIDOC CRM](001-use-cidoc-crm.md)
- [ADR-002: Use FRBRoo](002-use-frbroo.md)
- [ADR-003: Use Allotrope Framework](003-use-allotrope.md)
- [ADR-004: Minimal Event Modeling](004-minimal-event-modeling.md)

## Resources
- AMO (Argument Model Ontology): https://github.com/ArgumentationInterchangeFormat/AIF
- Toulmin Model: https://en.wikipedia.org/wiki/Stephen_Toulmin
- Scientific Argumentation in Archaeology: Research papers and case studies
