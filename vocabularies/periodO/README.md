# PeriodO in LOD-AM

## Purpose in LOD-AM
PeriodO provides a Linked Data period gazetteer for defining and linking time periods with scholarly assertions.

## Key Terms We Use
- Period definitions with start/end dates
- Geographic scope associations
- Cultural period definitions
- Scholarly references for period assertions

## Deviations from Standard
None - we use PeriodO as-is.

## Example Snippet
```turtle
:my_period a periodo:Period ;
    periodo:startDate "-2000"^^xsd:gYear ;
    periodo:endDate "-1500"^^xsd:gYear .
```
