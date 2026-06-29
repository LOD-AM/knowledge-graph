# LOD-AM/ontologies

> **Central knowledge base for ontological decisions, documentation, and implementation patterns for the LOD-AM archaeological knowledge graph.**

## Purpose

This repository documents the **ontological foundation** of the [LOD-AM](https://lod-am.net/) project, which publishes archaeological data as a static website from a triple store (Apache Jena Fuseki). It serves as:

- The **single source of truth** for all ontology-related decisions and patterns
- A **practical implementation guide** for our knowledge graph
- A **reference library** of examples, queries, and best practices
- A **collaboration space** for the LOD-AM community and contributors

## Ontology Stack

Our knowledge graph is built on three complementary ontologies:

| Ontology | Purpose | Standard | Documentation |
|----------|---------|----------|---------------|
| **CIDOC CRM** | Archaeological objects & context | ISO 21127:2023 | [docs/ontologies/cidoc-crm/](docs/ontologies/cidoc-crm/) |
| **FRBRoo** | Literature & bibliographic references | CIDOC CRM extension | [docs/ontologies/frbroo/](docs/ontologies/frbroo/) |
| **Allotrope Framework** | Scientific analytics & measurements | AFO | [docs/ontologies/allotrope-framework/](docs/ontologies/allotrope-framework/) |

These ontologies are integrated using a **layered architecture** with **minimal event modeling** - see [Architecture Overview](docs/architecture/ontology-stack.md).

## Repository Structure

```
LOD-AM/ontologies/
├── README.md                      # This file
├── CONCEPT.md                     # High-level ontological strategy
│
├── docs/
│   ├── architecture/              # Architectural decisions & patterns
│   │   ├── ontology-stack.md      # Layered architecture overview
│   │   ├── integration-patterns.md # Cross-ontology connection patterns
│   │   └── minimal-event-modeling.md # Our event modeling philosophy
│   │
│   ├── ontologies/                # Ontology-specific documentation
│   │   ├── cidoc-crm/
│   │   │   ├── overview.md        # Why CIDOC CRM & how we use it
│   │   │   ├── classes-used.md    # Complete class reference
│   │   │   ├── properties-used.md # Complete property reference
│   │   │   └── extensions.md      # LOD-AM-specific extensions
│   │   │
│   │   ├── frbroo/
│   │   │   ├── overview.md        # FRBRoo in LOD-AM
│   │   │   ├── handling-legacy-lit.md # Legacy literature strategy
│   │   │   └── frbr-model.md      # FRBR model explanation
│   │   │
│   │   └── allotrope-framework/
│   │       ├── overview.md        # Allotrope Framework in LOD-AM
│   │       ├── measurement-model.md # Measurement representation
│   │       └── integration.md     # Integration with CIDOC CRM
│   │
│   ├── decisions/                 # Architecture Decision Records (ADRs)
│   │   ├── 001-use-cidoc-crm.md
│   │   ├── 002-use-frbroo.md
│   │   ├── 003-use-allotrope.md
│   │   ├── 004-minimal-event-modeling.md
│   │   └── 005-defer-amo.md
│   │
│   └── implementation/            # Practical guides
│       ├── modeling-guide.md      # Data modeling patterns
│       ├── sparql-patterns.md     # Common SPARQL queries
│       └── validation-rules.md    # Data validation constraints
│
├── examples/
│   ├── data/
│   │   ├── objects/
│   │   │   └── pottery-shard.ttl
│   │   ├── analytics/
│   │   │   └── xrf-analysis.ttl
│   │   └── literature/
│   │       └── excavation-report.ttl
│   │
│   └── queries/
│       ├── find-objects-with-analysis.rq
│       ├── find-literature-about-site.rq
│       └── find-analyses-by-technique.rq
│
├── resources/
│   ├── ontologies.md              # External ontology references
│   ├── tools.md                   # Tools & software used
│   └── related-projects.md       # Related LOD projects
│
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
└── .gitignore                     # Git ignore rules
```

## Quick Start

### Understanding Our Approach

1. **Read the concept**: [CONCEPT.md](CONCEPT.md) explains our ontological strategy
2. **See the architecture**: [docs/architecture/ontology-stack.md](docs/architecture/ontology-stack.md)
3. **Review decisions**: [docs/decisions/](docs/decisions/) contains ADRs for all major choices

### For Implementers

- **Modeling guide**: [docs/implementation/modeling-guide.md](docs/implementation/modeling-guide.md)
- **SPARQL patterns**: [docs/implementation/sparql-patterns.md](docs/implementation/sparql-patterns.md)
- **Working examples**: [examples/](examples/)

### For Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Project Status

- **Status**: Active development
- **Version**: 1.0.0 (Initial release)
- **Last updated**: June 29, 2026
- **Maintainer**: LOD-AM Project Team

## Community

- **Website**: [https://lod-am.net/](https://lod-am.net/)
- **Issues**: [GitHub Issues](https://github.com/LOD-AM/Ontologies/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LOD-AM/Ontologies/discussions)

## License

This repository is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

**Tip**: Start with [CONCEPT.md](CONCEPT.md) for the complete ontological decision-making process that led to this repository.
