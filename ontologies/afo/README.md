# Allotrope Foundation Ontologies (AFO) in LOD-AM

## Purpose
Represent natural-scientific analytics: samples, analytical processes,
measurements (chemical composition, isotopes, dating).

## Namespaces
AFO terms are **opaque IDs** in four namespaces (see `reference.txt`).
Always look up a term's label before using it; `make check` rejects IDs that
do not exist in AFO 2025/12.

| Prefix | Namespace | Contains |
|---|---|---|
| `afr:` | `http://purl.allotrope.org/ontologies/result#` | results, e.g. `afr:AFR_0002036` concentration, `afr:AFR_0002099` mass fraction |
| `afm:` | `http://purl.allotrope.org/ontologies/material#` | materials, e.g. `afm:AFM_0001099` chemical mixture |
| `afp:` | `http://purl.allotrope.org/ontologies/process#` | processes, e.g. `afp:AFP_0000527` spectrometry |
| `afx:` | `http://purl.allotrope.org/ontologies/property#` | properties (see below) |

Values and units use **QUDT 1.1** (which AFO builds on): `qudt:numericValue`,
`qudt:unit unit:PERCENT`.

> `http://www.allotrope.org/ontologies/result#` (and `afo:MeasurementResult`,
> `afo:hasValue`, ...) used in earlier docs **does not exist**. Don't use it.

## Properties we use

| Term | Label | Used for |
|---|---|---|
| `afx:AFX_0001048` | contains | object → sample |
| `afx:AFX_0000399` | has input | analysis → sample |
| `afx:AFX_0000395` | has output | analysis → measurement |
| `afx:AFX_0002816` | quantifies | measurement → element (ChEBI IRI) |
| `afx:AFX_0000331` | maximum | measurement → upper limit, for "< x" values |

## Pattern

```turtle
:object afx:AFX_0001048 :sample .                       # contains

:analysis a afp:AFP_0000527, crm:E7_Activity ;          # spectrometry
    crm:P14_carried_out_by :lab ;
    afx:AFX_0000399 :sample ;                           # has input
    afx:AFX_0000395 :cu, :pb .                          # has output

:cu a afr:AFR_0002036 ;                                 # concentration
    afx:AFX_0002816 chebi:28694 ;                       # quantifies copper
    qudt:numericValue "97"^^xsd:decimal ;
    qudt:unit unit:PERCENT .

:pb a afr:AFR_0002036 ;                                 # reported as "< 0.001 %"
    afx:AFX_0002816 chebi:28702 ;
    afx:AFX_0000331 [ qudt:numericValue "0.001"^^xsd:decimal ] ;
    qudt:unit unit:PERCENT .
```

The analysis is also a `crm:E7_Activity`, which joins the AFO and CIDOC CRM
parts of the graph (who did it: `crm:P14_carried_out_by`; where it is
published: `crm:P70i_is_documented_in`).

## Not yet decided
See [docs/open-questions.md](../../docs/open-questions.md): concentration vs. mass
fraction, object→sample link, formal CRM↔AFO mapping.
