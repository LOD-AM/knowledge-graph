# Getty AAT Processing Scripts

This directory contains scripts for processing Getty Art & Architecture Thesaurus (AAT) data and converting it to CIDOC-CRM format.

## Scripts

### 1. `fetchAATBroaderYASGUI.js` (Recommended)

Uses the working Getty SPARQL XML endpoint to fetch broader terms for AAT entities.

**Features:**
- Uses the `sparql.xml` endpoint which works with external clients
- Based on the query pattern that works in YASGUI
- Adds CIDOC-CRM mappings (E55_Type, skos:prefLabel, P127_has_broader_term)
- Outputs clean Turtle format

**Usage:**
```bash
# Edit config in the script or create a custom config
node fetchAATBroaderYASGUI.js

# Or modify the script directly to change target entities
```

**Configuration:**
Edit the `config` object at the top of the script to:
- Add more target AAT URIs
- Change the output filename
- Customize CIDOC-CRM properties

**Example Query Used:**
```sparql
PREFIX aat: <http://vocab.getty.edu/aat/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  aat:300037118 gvp:broaderPreferred ?broader .
  ?broader gvp:prefLabelGVP ?labelNode .
  ?labelNode xl:literalForm ?broaderLabel .
}
ORDER BY ?broaderLabel
```

---

### 2. `processAATStreaming.js`

Memory-efficient processor for large N-Triples files (e.g., the 3.4GB AAT dump).

**Features:**
- Streams the N-Triples file line by line (constant memory usage)
- Extracts broader hierarchical relationships
- Adds CIDOC-CRM mappings
- Handles Getty's SKOS-XL model

**Usage:**
```bash
# Process a local N-Triples file
node processAATStreaming.js /path/to/aat.nt

# With custom config
node processAATStreaming.js /path/to/aat.nt config.json
```

**Configuration:**
See `config.json` for configuration options:
- `targetEntities`: Array of AAT URIs to process
- `outputFile`: Output Turtle filename
- `includeNarrower`: Boolean to include narrower terms
- `cidocProperties`: CIDOC-CRM property mappings

---

### 3. `fetchAATBroaderTerms.js`

Original script that attempts to use the Getty SPARQL endpoint directly.
Note: This may be blocked by Getty's access restrictions.

---

## CIDOC-CRM Mappings

The scripts map Getty AAT concepts to CIDOC-CRM as follows:

| Getty AAT | CIDOC-CRM | Property |
|-----------|-----------|----------|
| Concept | E55_Type | Class |
| prefLabel | skos:prefLabel | Property |
| broader | P127_has_broader_term | Property |
| narrower | P128_is_type_for | Property |

---

## Getty AAT Data Model

Getty uses a SKOS-XL model with custom extensions:

- `gvp:prefLabelGVP` → Preferred label (guaranteed 1 per concept)
- `gvp:broaderPreferred` → Broader relationship
- `skos:broader` / `skos:narrower` → Standard SKOS hierarchy
- `xl:literalForm` → Literal value of a label

---

## Endpoints

- **SPARQL XML (working)**: `https://vocab.getty.edu/sparql.xml`
- **SPARQL (may be blocked)**: `http://vocab.getty.edu/sparql`
- **Linked Data (RDF/XML)**: `http://vocab.getty.edu/page/aat/{ID}.rdf`
- **Linked Data (JSON-LD)**: `http://vocab.getty.edu/page/aat/{ID}.jsonld`
- **Linked Data (N-Triples)**: `http://vocab.getty.edu/page/aat/{ID}.nt`

---

## Downloads

Full AAT dataset downloads (refreshed monthly):
- https://www.getty.edu/research/tools/vocabularies/obtain/download.html

Formats available: N-Triples, RDF/XML, JSON, Turtle
