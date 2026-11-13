# FaBiO in LOD-AM

## Purpose
Bibliographic description of the publications our data comes from. FaBiO
supplies the classes; properties come from Dublin Core, PRISM and FOAF, as in
the other SPAR ontologies. `make check` rejects FaBiO terms that don't exist.

## Terms we use
| Term | Use |
|---|---|
| `fabio:JournalArticle` (+ `crm:E31_Document`) | articles; the DOI URL is the IRI |
| `fabio:Journal` | journals (`dcterms:isPartOf`) |
| `fabio:hasPublicationYear` (`xsd:gYear`) | year |
| `dcterms:title`, `dcterms:publisher` | title, publisher |
| `dcterms:creator` → `foaf:Person` | authors (`foaf:givenName`, `foaf:familyName`, `foaf:name`) |
| `prism:doi`, `prism:startingPage`, `prism:endingPage` | DOI, pages |

> `fabio:hasAuthor`, `fabio:hasPublicationDate`, `fabio:hasDOI`,
> `fabio:hasPageStart/End` and `fabio:Person` **do not exist** in FaBiO.

Legacy literature without a DOI gets a local IRI `https://lod-am.net/id/pub/<citation-key>`.

## Linking to archaeological data
Objects, types and analyses point to the publication with
`crm:P70i_is_documented_in`. That's why each article is also a `crm:E31_Document`.

## Example
```turtle
<https://doi.org/10.3406/paleo.2002.4745> a fabio:JournalArticle, crm:E31_Document ;
    dcterms:title "Chemical composition and lead isotopy of metal objects ..." ;
    fabio:hasPublicationYear "2002"^^xsd:gYear ;
    prism:doi "10.3406/paleo.2002.4745" ;
    prism:startingPage "43" ; prism:endingPage "69" ;
    dcterms:isPartOf :journal_paleorient ;
    dcterms:creator :andreas_hauptmann .

:spearhead_1 crm:P70i_is_documented_in <https://doi.org/10.3406/paleo.2002.4745> .
```
