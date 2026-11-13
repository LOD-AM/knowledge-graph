# PeriodO in LOD-AM

## Purpose in LOD-AM
PeriodO provides a Linked Data period gazetteer for defining and linking
time periods with scholarly assertions.

## Pattern
A PeriodO period IRI is used directly as a `crm:E4_Period`. We copy its dates
into a local time-span so that queries don't depend on PeriodO being online:

```turtle
<http://n2t.net/ark:/99152/p03wskdnzgc> a crm:E4_Period ;
    skos:inScheme <http://n2t.net/ark:/99152/p03wskd> ;     # PeriodO authority
    crm:P4_has_time-span :p03wskdnzgc_TIME_SPAN ;
    crm:P7_took_place_at <http://www.wikidata.org/entity/Q43> .

:p03wskdnzgc_TIME_SPAN a crm:E52_Time-Span ;
    crm:P79_beginning_is_qualified_by "-2000" ;
    crm:P80_end_is_qualified_by "-1750" .

:Palace_Hoard crm:P8i_witnessed <http://n2t.net/ark:/99152/p03wskdnzgc> .
```

## Deviations from Standard
None. We use PeriodO as-is and add no periods of our own yet.
