# CIDOC CRM Usage in LOD-AM

## Purpose
Foundation ontology for representing archaeological objects, places, and minimal events.

## Key Classes Used
- `crm:E22_Man-Made_Object` - Prehistoric artifacts, features
- `crm:E53_Place` - Sites, findspots, current locations
- `crm:E7_Activity` - **Only** for analysis and sampling events
- `crm:E73_Information_Object` - Documents, data

## Key Properties Used
- `crm:P2_has_type` - Object types, analysis types
- `crm:P46_is_composed_of` - Materials
- `crm:P53_has_former_or_current_location` - Discovery/current locations
- `crm:P128_carries` - Link to analysis results (AFO)
- `crm:P16_used_specific_object` - Event used object
- `crm:P67_refers_to` - Literature references to objects/sites

## Deviations from Standard
- **Minimal events**: We only model analysis and sampling events. We skip excavation, conservation, storage, movement, and ownership events.
- **Direct attributes**: We model object types, materials, dimensions, and locations directly as properties, not through events.
- **Simplified modeling**: We prioritize simplicity and pragmatism over comprehensive event modeling.

## Example Pattern
```turtle
:artifact1 a crm:E22_Man-Made_Object ;
    crm:P2_has_type :pottery_type ;
    crm:P46_is_composed_of :clay_material ;
    crm:P53_has_former_or_current_location :site1 .

:analysis1 a crm:E7_Activity ;
    crm:P2_has_type :chemical_analysis ;
    crm:P16_used_specific_object :artifact1 ;
    crm:P128_carries :analysis_result1 .
```