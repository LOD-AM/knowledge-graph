# FABIO in LOD-AM

## Purpose in LOD-AM
FABIO provides lightweight, practical modeling of literature and bibliographic entities for Zenodo-style references.

## Key Terms We Use
- fabio:Work, fabio:JournalArticle
- fabio:hasAuthor, fabio:hasPublicationDate, fabio:hasDOI

## Deviations from Standard
Flat structure, not full FRBR hierarchy. Direct links to archaeological entities via CIDOC CRM.

## Example Snippet
```turtle
:paper a fabio:JournalArticle ;
    fabio:hasAuthor :author ;
    fabio:hasPublicationDate "2024"^^xsd:gYear ;
    crm:P67_refers_to :artifact .
```
