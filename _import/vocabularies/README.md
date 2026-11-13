# LOD-AM/vocabularies

**Controlled vocabulary information for the Linked Open Data for Ancient Metallurgy (LOD-AM) project.**

## Purpose

This repository stores **only vocabulary-related information** for LOD-AM:
- Which controlled vocabularies we use
- Why we chose them
- How we use them
- Reference URIs and namespaces

## Structure

```
vocabularies/
├── README.md                      # This file
├── DECISIONS.md                   # Vocabulary choice rationale
├── LICENSE                        # License information
└── vocabularies/
    ├── pleiades/
    │   ├── README.md              # Usage notes
    │   └── reference.txt          # Official URI
    ├── periodO/
    │   ├── README.md
    │   └── reference.txt
    ├── getty-aat/
    │   ├── README.md
    │   └── reference.txt
    ├── allotrope/
    │   ├── README.md
    │   └── reference.txt
    └── fabio/
        ├── README.md
        └── reference.txt
```

## Quick Start

1. Read DECISIONS.md for the rationale behind our vocabulary choices
2. Browse vocabularies/ for per-vocabulary usage notes
3. Check vocabularies/*/reference.txt for official URIs and namespaces

## Maintenance Rules

1. **No vocabulary files**: Do not commit external vocabulary TTLs/RDF. Only store references and documentation.
2. **One decisions document**: Keep all rationale in DECISIONS.md.
3. **Minimal examples**: Only include example snippets that demonstrate actual usage patterns.
4. **Decisions first**: Update DECISIONS.md before changing vocabulary usage.

## Current Vocabularies

- **Sites and Site Types**: [Pleiades](https://pleiades.stoa.org/)
- **Cultures and Periods**: [PeriodO](https://perio.do/en/)
- **Feature/Object Types**: [Getty AAT](https://www.getty.edu/research/tools/vocabularies/aat/)
- **Scientific Analytics**: [Allotrope Framework](https://www.allotrope.org/)
- **Literature**: [FABIO](http://purl.org/spar/fabio/)
