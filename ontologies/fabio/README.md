# FABIO in LOD-AM

## Purpose in LOD-AM

FABIO (FRBR Aligned Bibliographic Ontology) provides lightweight, practical modeling of literature and bibliographic entities for Zenodo-style references.

## Key Classes/Properties We Use

- `fabio:Work` - Intellectual/artistic creation (articles, papers, books)
- `fabio:Expression` - Specific realization of a work
- `fabio:Manifestation` - Physical/embodied form of an expression
- `fabio:Item` - Single physical/exemplar instance
- `fabio:JournalArticle` - Specific type of work for academic papers
- `fabio:hasAuthor` - Link to authors
- `fabio:hasPublicationDate` - Publication date
- `fabio:hasDOI` - Digital Object Identifier

## Deviations from Standard

- We use a flat structure, not the full FRBR hierarchy
- We focus on simple bibliographic metadata (title, authors, date, DOI)
- We link directly to archaeological entities via CIDOC CRM properties

## Example Snippet

```turtle
:paper1 a fabio:JournalArticle ;
    fabio:hasAuthor :author1 ;
    fabio:hasPublicationDate "2024-03-15"^^xsd:date ;
    fabio:hasDOI "10.1234/example" ;
    crm:P67_refers_to :artifact1 .
```