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
| CRMsci | **3.2** (the release for CRM 7.1.3) | sampling only: `S2_Sample_Taking`, `S13_Sample`, `O3`, `O5` |
| CRMarchaeo | **2.1.1** (released for CRM 7.1.2; every CRM term it uses exists in 7.1.3) | object in feature: `AP21i_is_contained_in`, `A2_Stratigraphic_Volume_Unit` |
| Allotrope (AFO) | REC/2025/12 | opaque IDs, QUDT 1.1 units |
| FaBiO | current SPAR release | with Dublin Core, PRISM, FOAF |

## IRIs

- **Base IRI** for everything LOD-AM mints: `https://lod-am.net/id/` (prefix `:`).
- Local names: `snake_case`, ASCII only, derived from the source
  (e.g. `:spearhead_1`, `:sample_ARSL31A`). Parts: `<parent>_<part>`
  (`:spearhead_1_blade`). Helper nodes: `<parent>_<role>`
  (`:spearhead_1_id`, `:assign_spearhead_1_type`, `:p03wskdnzgc_TIME_SPAN`).
- Publications without a DOI: `:pub/<citation-key>`.
- **Converted data** (records from a database with an `id_uuid`, #20) uses a typed path
  instead of readable names: `https://lod-am.net/id/<kind>/<uuid>`, uuid in lower case with
  hyphens. Kinds: `site` (E27), `feature` (E25), `find` (E22), `analysis` (E7, chemical and
  lead isotope), `period`, `type` (types, type groups and classes of the typology), `culture`,
  `region`, `lab`. Helper nodes without a uuid of their own hang below their record with a
  slash: `<record IRI>/<role>`, role in `snake_case` (`/id/find/<uuid>/id`,
  `/id/site/<uuid>/location`, `/id/analysis/<uuid>/sample`, `/id/analysis/<uuid>/sn`,
  `/id/analysis/<uuid>/pb207_pb206`). `make validate` checks the pattern and that `site`,
  `feature`, `find` and `analysis` IRIs carry their class. The hand-written `examples/` keep
  readable names.
- **Reuse external IRIs** wherever they exist: Getty AAT concept IRIs
  (`http://vocab.getty.edu/aat/<id>`, never `/page/aat/`), PeriodO ARKs,
  Pleiades places (as identifiers, see Sites), ChEBI elements (only ids listed in
  [tools/chebi.tsv](tools/chebi.tsv), verified against ChEBI), Wikidata for nuclides and
  places (only ids in [tools/wikidata.tsv](tools/wikidata.tsv)), ROR for institutions,
  DOI URLs for articles.
- Prefixes: only those in [tools/prefixes.ttl](tools/prefixes.ttl), bound to
  exactly those namespaces.
- Never commit placeholder IRIs (`example.org`, `http://base/`).

## Labels

Main resources carry a language-tagged `rdfs:label`: objects, features, sites,
samples, analyses and groups. English (`@en`) should always be there (warning
if missing); add other languages as they exist (`@de`, `@ru`). Types and
materials use `skos:prefLabel`, persons `foaf:name`, publications
`dcterms:title`. Helper nodes (identifiers, type assignments, time-spans,
sampling events, measurements, geometries) need no label: the website names
them from their context.

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
    rdfs:label "Arslantepe"@en ;
    crm:P2_has_type <https://pleiades.stoa.org/vocabularies/settlement> ;
    crm:P1_is_identified_by :Arslantepe_pleiades_id ;                  # Pleiades: an identifier, never owl:sameAs
    crm:P53_has_former_or_current_location :Arslantepe_location .

:Arslantepe_pleiades_id a crm:E42_Identifier ;
    crm:P2_has_type :pleiades_place_uri ;                              # E55_Type "Pleiades place URI"
    crm:P190_has_symbolic_content "https://pleiades.stoa.org/places/25078867" .

:Arslantepe_location a crm:E53_Place, geo:Feature ;                   # GeoSPARQL
    geo:hasGeometry :Arslantepe_location_geometry .
:Arslantepe_location_geometry a geo:Geometry ;
    geo:asWKT "POINT (38.3613 38.3821)"^^geo:wktLiteral .              # lon lat (CRS84)

:Palace_Hoard a crm:E25_Human-Made_Feature, crmarchaeo:A2_Stratigraphic_Volume_Unit ;
    rdfs:label "Palace Hoard"@en ;
    crm:P46i_forms_part_of :Arslantepe ;
    crm:P8i_witnessed <http://n2t.net/ark:/99152/p03wskdnzgc> .        # dating shortcut, see below

:spearhead_1 crmarchaeo:AP21i_is_contained_in :Palace_Hoard .     # object found in the feature

<http://n2t.net/ark:/99152/p03wskdnzgc> a crm:E4_Period ;
    skos:inScheme <http://n2t.net/ark:/99152/p03wskd> ;
    crm:P4_has_time-span :p03wskdnzgc_TIME_SPAN ;
    crm:P7_took_place_at wd:Q43 .
:p03wskdnzgc_TIME_SPAN a crm:E52_Time-Span ;
    crm:P79_beginning_is_qualified_by "-2000" ;
    crm:P80_end_is_qualified_by "-1750" .
```
- **Pleiades** is never `owl:sameAs`: that would merge Pleiades' statements with
  ours. The site carries the Pleiades URI as an `E42_Identifier`.
- **Geometry** is GeoSPARQL (`geo:hasGeometry` → `geo:Geometry` with one
  `geo:asWKT` typed `geo:wktLiteral`), which Fuseki's spatial index understands.
  `osgeo:` is no longer used (`make check` rejects it).
- **Finds in features:** a feature that contains finds is also a CRMarchaeo
  `A2_Stratigraphic_Volume_Unit` (a deposit: hoard, grave fill, layer; a kurgan as a
  whole is a coarse A2), so the object can be `crmarchaeo:AP21i_is_contained_in` it.
- **Finds without a feature** (#19): the object points to its site's place,
  `crm:P53_has_former_or_current_location` → the site's `E53_Place` (the same node that
  carries the geometry). "Finds from site X" therefore has two paths:
  `AP21i_is_contained_in/P46i_forms_part_of` or the shared place (`queries/find-objects-at-site.rq`).
  Parts of an object (`P46_is_composed_of`) need no context of their own.
- **Dating** a feature (or a site, when there is no real feature) uses the
  shortcut `crm:P8i_witnessed` → period. We don't model deposition events.

### Analytics
```turtle
:sampling_ARSL31A a crmsci:S2_Sample_Taking ;            # sampling event (no label needed)
    crmsci:O3_sampled_from :spearhead_1_blade ;          # the object, or the part sampled
    crmsci:O5_removed :sample_ARSL31A .

:sample_ARSL31A a crmsci:S13_Sample, afm:AFM_0001099 ;   # the AFO material class only on samples
    rdfs:label "Sample from Spearhead 1 Blade (ARSL31A)"@en .

:ARSL31A a afp:AFP_0000527, crm:E7_Activity ;            # spectrometry + CRM activity
    crm:P14_carried_out_by :sapienza_lab ;              # crm:E74_Group, owl:sameAs ROR
    crm:P70i_is_documented_in <https://doi.org/...> ;
    afx:AFX_0000399 :sample_ARSL31A ;                   # has input   (REQUIRED)
    afx:AFX_0000395 :Cu_measurement .                   # has output  (REQUIRED)

:Cu_measurement a afr:AFR_0002099 ;                      # mass fraction
    afx:AFX_0002816 chebi:28694 ;                       # quantifies copper atom: exactly one
    qudt:numericValue "97"^^xsd:decimal ;               # xsd:decimal
    qudt:unit unit:PERCENT .                            # QUDT IRI, never a string
```
- Element values in wt % are **mass fractions** (`afr:AFR_0002099`).
  `afr:AFR_0002036` (concentration) is only for real concentrations (e.g. ppm in solution).
- Objects are not typed with an AFO material class; `afm:AFM_0001099` (chemical
  mixture) is on the sample. The object's material is `crm:P45_consists_of`.
- **Lead isotope ratios** (mass spectrometry `afp:AFP_0001427`):
  ```turtle
  :ARSL18_pb207_206 a afr:AFR_0002368 ;     # analyte molar ratio
      afx:AFX_0002816 wd:Q18883443 ;          # quantifies lead-207 (numerator)
      afx:AFX_0001550 wd:Q18883438 ;          # has reference lead-206 (denominator)
      qudt:numericValue "0.8374"^^xsd:decimal .   # no qudt:unit: ratios are dimensionless
  ```
  Only ratios reported in the publication; any non-empty set per analysis. Nuclides are
  Wikidata items (lead-204 `Q18883429`, -206 `Q18883438`, -207 `Q18883443`, -208 `Q16670466`):
  ChEBI has only lead-207 and AFO has no nuclides.

Values reported only as an upper limit (`< 0.001 %`) use
`afx:AFX_0000331 [ qudt:numericValue "0.001"^^xsd:decimal ]` *instead of*
`qudt:numericValue`.

**Not detected** (#21): the element was looked for but not found, and no detection limit
is known. Same measurement node, but no value; it carries the local type `:not_detected`
(`data/vocab/measurement-status.ttl`) and is also a `crm:E54_Dimension`, so
`crm:P2_has_type` is used within its domain (AFO has no term for "not detected"):
```turtle
:Bi_measurement a afr:AFR_0002099, crm:E54_Dimension ;   # mass fraction
    afx:AFX_0002816 chebi:33301 ;                       # quantifies bismuth atom
    crm:P2_has_type :not_detected ;
    qudt:unit unit:PERCENT .
```
A measurement has **exactly one** of: `qudt:numericValue`, `afx:AFX_0000331` (maximum),
or `crm:P2_has_type :not_detected`. An element that was *not analysed* gets no
measurement at all. Never write `0` for "not detected".

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
| sampling | `crmsci:O3_sampled_from` | object or part |
| sampling | `crmsci:O5_removed` | sample |
| analysis | `afx:AFX_0000399` (has input) | sample |
| analysis | `afx:AFX_0000395` (has output) | measurement |
| object / type / analysis | `crm:P70i_is_documented_in` | publication |
| feature | `crm:P46i_forms_part_of` | site |
| feature / site | `crm:P8i_witnessed` | period |
| site | `crm:P1_is_identified_by` | `E42_Identifier` (Pleiades URI) |
| place | `geo:hasGeometry` | `geo:Geometry` |
| object | `crmarchaeo:AP21i_is_contained_in` | feature (also `crmarchaeo:A2_Stratigraphic_Volume_Unit`) |
| object without feature | `crm:P53_has_former_or_current_location` | the site's place (`E53_Place`) |
| measurement "not detected" | `crm:P2_has_type` | `:not_detected` |
| ratio | `afx:AFX_0002816` / `afx:AFX_0001550` | numerator / denominator nuclide |

## Modelling scope

- **Minimal events:** only analysis and sampling events. No excavation,
  conservation, movement or ownership events.
- **No inference:** the triplestore has reasoning off, so state what queries
  need explicitly (shortcuts *and* full paths where both are used).
- **No external ontology/vocabulary dumps** in the repo. Reference them and
  fetch them for checks (`make fetch`). Converter output for terms we actually
  use goes in `data/`.

Undecided points are tracked in [docs/open-questions.md](docs/open-questions.md).
