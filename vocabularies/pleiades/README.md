# Pleiades in LOD-AM

## Purpose in LOD-AM
Pleiades provides a controlled vocabulary for archaeological sites, with the
ability to add entries for underrepresented regions. That matters for
research outside the Mediterranean and Near East.

## Key Terms We Use
- Place URIs `https://pleiades.stoa.org/places/<id>`: recorded as an identifier of our site
- Place types (`https://pleiades.stoa.org/vocabularies/...`), e.g. settlement
- Location geometries from Pleiades, copied into our own `crm:E53_Place` (GeoSPARQL)

## Pattern
```turtle
:Arslantepe a crm:E27_Site ;
    crm:P2_has_type <https://pleiades.stoa.org/vocabularies/settlement> ;
    crm:P1_is_identified_by :Arslantepe_pleiades_id ;
    crm:P53_has_former_or_current_location :Arslantepe_location .

:Arslantepe_pleiades_id a crm:E42_Identifier ;
    crm:P2_has_type :pleiades_place_uri ;
    crm:P190_has_symbolic_content "https://pleiades.stoa.org/places/25078867" .
```
We don't use `owl:sameAs`: it would declare our site and the Pleiades place to be
one resource and merge all their statements (knowledge-graph#4, decided 2026-11-15).
`crm:P67_refers_to` only works from documents (E89 Propositional Object), not from sites.
