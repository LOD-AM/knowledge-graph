# FRBRoo Usage in LOD-AM

## Purpose
Represent literature sources, especially legacy publications without DOIs.

## Key Classes Used
- `frbroo:F1_Work` - Intellectual/artistic creation (primary level)
- `frbroo:F2_Expression` - Realization in specific form (when needed)
- `frbroo:F3_Manifestation` - Physical embodiment (when needed)
- `crm:E42_Identifier` - Local identifiers, ISBNs, ISSNs

## Key Properties Used
- `crm:P102_has_title` - Work title
- `crm:P94_has_created` - Author/creator
- `crm:P4_has_time-span` - Publication date
- `crm:P1_is_identified_by` - Identifier (for local IDs, ISBNs, etc.)
- `crm:P67_refers_to` - Link from work to archaeological entities
- `crm:P190_has_symbolic_content` - Identifier value

## Handling Legacy Literature
For works without DOIs, use local identifiers:
```turtle
:work1 a frbroo:F1_Work ;
    crm:P102_has_title "Excavation Report: Site X" ;
    crm:P1_is_identified_by :local_id .

:local_id a crm:E42_Identifier ;
    crm:P2_has_type :local_id_type ;
    crm:P190_has_symbolic_content "ARCH-1985-001" .
```

## Integration with CIDOC CRM
FRBRoo is a native extension of CIDOC CRM. Direct links work seamlessly:
```turtle
:work1 a frbroo:F1_Work ;
    crm:P67_refers_to :site1 .  # Literature about a site

:site1 a crm:E53_Place .
```