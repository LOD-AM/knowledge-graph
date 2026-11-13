# Getty AAT Type Fetcher

This script fetches Getty Art & Architecture Thesaurus (AAT) entities and their complete broader hierarchy, converting them to CIDOC-CRM format with SKOS labels and scope notes.

## Usage

```bash
# Basic usage with default settings
node fetchType.js

# With custom entity IDs
node fetchType.js --entity 300037118,300037110

# With custom output file
node fetchType.js --output my_types.ttl

# With all options
node fetchType.js -e 300037118,300037110 -o output.ttl -d 5 -l 1000

# Show help
node fetchType.js --help
```

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--entity` | `-e` | Comma-separated list of AAT entity IDs | `300037118` |
| `--output` | `-o` | Output file path | `aat_types_cidoc.ttl` |
| `--depth` | `-d` | Maximum recursion depth | `10` |
| `--delay` | `-l` | Delay between requests in ms | `500` |
| `--help` | `-h` | Show help message | - |

## CIDOC-CRM Mappings

The script maps Getty AAT concepts to CIDOC-CRM as follows:

| Getty AAT | CIDOC-CRM/SKOS | Property |
|-----------|----------------|----------|
| Concept | `crm:E55_Type` | Class |
| prefLabel | `skos:prefLabel` | Property |
| scopeNote | `skos:scopeNote` | Property (English only) |
| broader | `crm:P127_has_broader_term` | Property |
| narrower | `crm:P128_is_type_for` | Property |

## Output Format

The script generates a Turtle (`.ttl`) file with:
- Compact `aat:` prefix for AAT URIs
- Full CIDOC-CRM and SKOS prefixes
- Each entity with its type class, label, scope note, and broader term relationships
- Complete hierarchy from target entity up to root

### Example Output

```turtle
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix aat: <http://vocab.getty.edu/aat/> .

aat:300264092 a crm:E55_Type ;
  skos:prefLabel "Objects Facet"@en ;
  skos:scopeNote "Use for the discipline of ..."@en .

aat:300241490 a crm:E55_Type ;
  skos:prefLabel "Components (hierarchy name)"@en ;
  skos:scopeNote "Hierarchy for components..."@en ;
  crm:P127_has_broader_term aat:300264092 .

aat:300037118 a crm:E55_Type ;
  skos:prefLabel "staff weapon components"@en ;
  skos:scopeNote "Components that are parts of staff weapons."@en ;
  crm:P127_has_broader_term aat:300211001 .
```

## Getty AAT Data Model

Getty uses a SKOS-XL model with custom extensions:

- `gvp:prefLabelGVP` → Preferred label (guaranteed 1 per concept)
- `gvp:broaderPreferred` → Broader relationship
- `gvp:scopeNote` → Scope note with language information
- `gvp:scopeNoteText` → Text value of scope note
- `skos:broader` / `skos:narrower` → Standard SKOS hierarchy
- `xl:literalForm` → Literal value of a label

## Endpoints

- **SPARQL XML (working)**: `https://vocab.getty.edu/sparql.xml`
- **SPARQL (may be blocked)**: `http://vocab.getty.edu/sparql`
- **Linked Data (RDF/XML)**: `http://vocab.getty.edu/page/aat/{ID}.rdf`
- **Linked Data (JSON-LD)**: `http://vocab.getty.edu/page/aat/{ID}.jsonld`
- **Linked Data (N-Triples)**: `http://vocab.getty.edu/page/aat/{ID}.nt`

## Downloads

Full AAT dataset downloads (refreshed monthly):
- https://www.getty.edu/research/tools/vocabularies/obtain/download.html

Formats available: N-Triples, RDF/XML, JSON, Turtle
