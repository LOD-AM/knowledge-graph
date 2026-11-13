# Getty AAT in LOD-AM

## Purpose in LOD-AM
Getty Art and Architecture Thesaurus provides the global standard controlled vocabulary for archaeological feature types and object types.

## Key Terms We Use
- Object types: amphora, pottery, tools, weapons, beads, coins
- Feature types: architectural elements, structural remains
- Materials: clay, stone, metal, wood, glass
- Techniques: manufacturing, construction, decoration
- Cultures: Minoan, Mycenaean, Hallstatt, La Tene

## Deviations from Standard
We use a minimal subset focused on our domain. We map to closest existing terms when exact matches are not available.

## Example Snippet
```turtle
:spearhead_1 a crm:E22_Human-Made_Object ;
    crm:P2_has_type aat:300037118 ;        # spearheads
    crm:P45_consists_of aat:300241441 .    # <copper and copper alloy>

aat:300037118 a crm:E55_Type ;
    skos:prefLabel "spearheads"@en ;
    skos:inScheme aat: .
```

Use the concept IRI `http://vocab.getty.edu/aat/<id>`, never the HTML page
`http://vocab.getty.edu/page/aat/<id>` (`make check` rejects it). Materials are
typed `crm:E57_Material`, other terms `crm:E55_Type`.

## Converter
`converter/fetchType.js` fetches a term plus its broader hierarchy into
`data/aat/` (see [converter/README.md](../../converter/README.md)):
```bash
cd converter && npm run aat -- --entity 300037118
```
