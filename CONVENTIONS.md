# LOD-AM Modelling Conventions

The single source of truth for how LOD-AM data is modelled. The rules here
are enforced by `make check` (terms, domains/ranges, prefixes) and by
`shapes/lod-am.shacl.ttl` (`make validate`). If you change a rule, change the
shapes in the same PR. *Why* we chose each ontology/vocabulary is in
[docs/decisions/](docs/decisions/).

## Versions

| What | Version | Notes |
|---|---|---|
| CIDOC CRM | **7.1.3** (LTS) | `E22_Human-Made_Object`, not `Man-Made`; no `P71` |
| Allotrope (AFO) | REC/2025/12 | opaque IDs, QUDT 1.1 units |
| FaBiO | current SPAR release | with Dublin Core, PRISM, FOAF |

## IRIs

- **Base IRI** for everything LOD-AM mints: `https://lod-am.net/id/` (prefix `:`).
- Local names: `snake_case`, ASCII only, derived from the source
  (e.g. `:spearhead_1`, `:sample_ARSL31A`). Parts: `<parent>_<part>`
  (`:spearhead_1_blade`). Helper nodes: `<parent>_<role>`
  (`:spearhead_1_id`, `:assign_spearhead_1_type`, `:p03wskdnzgc_TIME_SPAN`).
- Publications without a DOI: `:pub/<citation-key>`.
- **Reuse external IRIs** wherever they exist: Getty AAT concept IRIs
  (`http://vocab.getty.edu/aat/<id>`, never `/page/aat/`), PeriodO ARKs,
  Pleiades places, ChEBI elements, ROR for institutions, DOI URLs for articles.
- Prefixes: only those in [tools/prefixes.ttl](tools/prefixes.ttl), bound to
  exactly those namespaces.
- Never commit placeholder IRIs (`example.org`, `http://base/`).

## Core patterns

### Objects
```turtle
:spearhead_1 a crm:E22_Human-Made_Object ;
    rdfs:label "Spearhead 1"@en ;
    crm:P1_is_identified_by :spearhead_1_id ;          # E42_Identifier, never a literal
    crm:P2_has_type aat:300037118 ;                    # REQUIRED shortcut
    crm:P45_consists_of aat:300241441 ;                # material shortcut (warning if missing)
    crm:P41i_was_classified_by :assign_spearhead_1_type ;  # optional full assignment
    crm:P46_is_composed_of :spearhead_1_blade ;        # physical parts
    crm:P70i_is_documented_in <https://doi.org/...> .  # source (warning if missing)

:spearhead_1_id a crm:E42_Identifier ; crm:P190_has_symbolic_content "T1 2*, y37" .

:assign_spearhead_1_type a crm:E17_Type_Assignment ;
    crm:P41_classified :spearhead_1 ;
    crm:P42_assigned aat:300037118 .
```
Types are `crm:E55_Type`, materials `crm:E57_Material`; both need a
`skos:prefLabel` and, if from AAT, `skos:inScheme aat:`.

### Sites, features, places, periods
```turtle
:Arslantepe a crm:E27_Site ;
    crm:P2_has_type <https://pleiades.stoa.org/vocabularies/settlement> ;
    owl:sameAs <https://pleiades.stoa.org/places/25078867> ;
    crm:P53_has_former_or_current_location <pleiades location IRI> .   # E53_Place with osgeo:asWKT

:Palace_Hoard a crm:E25_Human-Made_Feature ;
    crm:P46i_forms_part_of :Arslantepe ;
    crm:P8i_witnessed <http://n2t.net/ark:/99152/p03wskdnzgc> .        # PeriodO period

:spearhead_1 crmarchaeo:A21_is_contained_in :Palace_Hoard .

<http://n2t.net/ark:/99152/p03wskdnzgc> a crm:E4_Period ;
    skos:inScheme <http://n2t.net/ark:/99152/p03wskd> ;
    crm:P4_has_time-span :p03wskdnzgc_TIME_SPAN ;
    crm:P7_took_place_at wd:Q43 .
:p03wskdnzgc_TIME_SPAN a crm:E52_Time-Span ;
    crm:P79_beginning_is_qualified_by "-2000" ;
    crm:P80_end_is_qualified_by "-1750" .
```

### Analytics
```turtle
:spearhead_1 afx:AFX_0001048 :sample_ARSL31A .          # contains

:ARSL31A a afp:AFP_0000527, crm:E7_Activity ;            # spectrometry + CRM activity
    crm:P14_carried_out_by :sapienza_lab ;              # crm:E74_Group, owl:sameAs ROR
    crm:P70i_is_documented_in <https://doi.org/...> ;
    afx:AFX_0000399 :sample_ARSL31A ;                   # has input   (REQUIRED)
    afx:AFX_0000395 :Cu_measurement .                   # has output  (REQUIRED)

:Cu_measurement a afr:AFR_0002036 ;                      # concentration
    afx:AFX_0002816 chebi:28694 ;                       # quantifies: exactly one
    qudt:numericValue "97"^^xsd:decimal ;               # xsd:decimal
    qudt:unit unit:PERCENT .                            # QUDT IRI, never a string
```
Values reported only as an upper limit (`< 0.001 %`) use
`afx:AFX_0000331 [ qudt:numericValue "0.001"^^xsd:decimal ]` *instead of*
`qudt:numericValue`. Exactly one of the two is required.

### Literature
```turtle
<https://doi.org/10.3406/paleo.2002.4745> a fabio:JournalArticle, crm:E31_Document ;
    dcterms:title "..." ;                               # REQUIRED
    dcterms:creator :andreas_hauptmann ;                # REQUIRED, foaf:Person
    fabio:hasPublicationYear "2002"^^xsd:gYear ;
    prism:doi "10.3406/paleo.2002.4745" ;
    prism:startingPage "43" ; prism:endingPage "69" ;
    dcterms:isPartOf :journal_paleorient .              # fabio:Journal
```

## Linking the parts

| From | Property | To |
|---|---|---|
| object | `afx:AFX_0001048` (contains) | sample |
| analysis | `afx:AFX_0000399` (has input) | sample |
| analysis | `afx:AFX_0000395` (has output) | measurement |
| object / type / analysis | `crm:P70i_is_documented_in` | publication |
| feature | `crm:P46i_forms_part_of` | site |
| object | `crmarchaeo:A21_is_contained_in` | feature |

## Modelling scope

- **Minimal events:** only analysis and sampling events. No excavation,
  conservation, movement or ownership events.
- **No inference:** the triplestore has reasoning off, so state what queries
  need explicitly (shortcuts *and* full paths where both are used).
- **No external ontology/vocabulary dumps** in the repo. Reference them and
  fetch them for checks (`make fetch`). Converter output for terms we actually
  use goes in `data/`.

Undecided points are tracked in [docs/open-questions.md](docs/open-questions.md).
