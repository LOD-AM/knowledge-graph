# Pleiades in LOD-AM

## Purpose in LOD-AM
Pleiades provides a controlled vocabulary for archaeological sites, with the
ability to add entries for underrepresented regions. That matters for
research outside the Mediterranean and Near East.

## Key Terms We Use
- Place IRIs `https://pleiades.stoa.org/places/<id>`: the site itself
- Place types (`https://pleiades.stoa.org/vocabularies/...`), e.g. settlement
- Locations (`.../places/<id>/<location-id>`) with WKT geometry

## Pattern
```turtle
:Arslantepe a crm:E27_Site ;
    crm:P2_has_type <https://pleiades.stoa.org/vocabularies/settlement> ;
    owl:sameAs <https://pleiades.stoa.org/places/25078867> ;
    crm:P53_has_former_or_current_location <https://pleiades.stoa.org/places/osm-location-of-arslantepe-hapya1-4aa1-4> .
```
`crm:P67_refers_to` (used in earlier docs) only works from documents
(E89 Propositional Object), not from sites. Whether `owl:sameAs` is too strong
is an open question; see [docs/open-questions.md](../../docs/open-questions.md).
