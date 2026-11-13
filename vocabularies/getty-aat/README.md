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
:artifact a crm:E22_Man-Made_Object ;
    crm:P2_has_type <http://vocab.getty.edu/aat/300033879> .
```
