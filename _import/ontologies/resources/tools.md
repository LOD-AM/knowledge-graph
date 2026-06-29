# Tools and Software

## Core Infrastructure

### Apache Jena Fuseki
- **Website**: https://jena.apache.org/documentation/fuseki2/
- **Description**: Triple store for RDF data storage and SPARQL endpoint
- **License**: Apache License 2.0
- **Role**: Primary data storage and query engine for LOD-AM
- **Version**: Latest stable (3.x)

#### Fuseki Configuration
```ttl
# Example Fuseki configuration (TDB2)
@prefix fuseki: <http://jena.apache.org/fuseki#>
@prefix tdb2: <http://jena.apache.org/2016/tdb2#>
@prefix ja: <http://jena.hpl.hp.com/2005/11/Assembler#>

[] ja:loadClass "org.apache.jena.fuseki.main.FusekiServer" .

## Dataset definition
tdb2:DatasetTDB2  a  ja:RDFDataset ;
    ja:context [ ja:cxtName "lod-am" ] .

## Service definition
:service a fuseki:Service ;
    fuseki:name "lod-am" ;
    fuseki:serviceQuery "sparql" ;
    fuseki:serviceQuery "query" ;
    fuseki:serviceUpdate "update" ;
    fuseki:serviceUpload "upload" ;
    fuseki:serviceReadWriteGraphStore "data" ;
    fuseki:dataset :dataset .

:dataset a ja:RDFDataset ;
    ja:defaultGraph :graph ;
    ja:namedGraph :named_graph .

:graph a ja:Graph ;
    ja:graphName "default" .

:named_graph a ja:Graph ;
    ja:graphName "named" .
```

#### Fuseki Management
- **Start**: `fuseki-server --config=config.ttl`
- **Stop**: Ctrl+C or kill process
- **Web Interface**: http://localhost:3030
- **SPARQL Endpoint**: http://localhost:3030/lod-am/sparql
- **Update Endpoint**: http://localhost:3030/lod-am/update

### Eleventy (11ty)
- **Website**: https://www.11ty.dev/
- **Description**: Modern static site generator
- **License**: MIT
- **Role**: Generates static HTML from templates and SPARQL query results
- **Version**: Latest stable (2.x)

#### Eleventy Configuration
```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  // Add SPARQL data files
  eleventyConfig.addDataExtension("rq", contents => {
    // Execute SPARQL query and return results
    return executeSparqlQuery(contents);
  });
  
  // Add custom filters
  eleventyConfig.addFilter("formatDate", function(date) {
    return new Date(date).toLocaleDateString();
  });
  
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
```

#### SPARQL Query in Eleventy
```javascript
// src/_data/artifacts.js
const { executeSparqlQuery } = require('../utils/sparql');

const query = `
  PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
  SELECT ?object ?id ?type WHERE {
    ?object a crm:E22_Man-Made_Object ;
      crm:P1_is_identified_by ?idNode ;
      crm:P2_has_type ?type .
    ?idNode crm:P190_has_symbolic_content ?id .
  }
`;

module.exports = async function() {
  const results = await executeSparqlQuery(query);
  return results;
};
```

## Development Tools

### Mistral AI
- **Website**: https://mistral.ai/
- **Description**: AI coding assistant used for development
- **Role**: Helps with code generation, debugging, and documentation
- **Integration**: Used via Vibe interface

### GitHub
- **Website**: https://github.com/
- **Description**: Code hosting and collaboration platform
- **Role**: Hosts LOD-AM repositories
- **Features**: Issues, Pull Requests, Discussions, Actions

### VS Codium
- **Website**: https://vscodium.com/
- **Description**: FOSS version of VS Code
- **License**: MIT
- **Role**: Primary code editor for development
- **Extensions**: Markdown, Turtle, SPARQL syntax highlighting

### Proxmox
- **Website**: https://www.proxmox.com/
- **Description**: Virtualization platform
- **License**: AGPL
- **Role**: Server virtualization for development environment

### Garuda Linux
- **Website**: https://garudalinux.org/
- **Description**: Rolling release Linux distribution
- **License**: FOSS
- **Role**: Operating system for development servers

## Data Tools

### RDFLib (Python)
- **Website**: https://rdflib.readthedocs.io/
- **Description**: Python library for RDF manipulation
- **License**: BSD
- **Use Case**: RDF data processing and transformation

### Apache Jena (Command Line)
- **Website**: https://jena.apache.org/
- **Description**: Java-based RDF toolkit
- **Tools**:
  - `riot`: RDF conversion
  - `sparql`: SPARQL query execution
  - `tdbloader`: Load data into TDB
  - `tdbdump`: Dump TDB data

### Oxigraph
- **Website**: https://github.com/oxigraph/oxigraph
- **Description**: Rust-based graph database
- **License**: MIT/Apache
- **Status**: Alternative to Fuseki (future consideration)

## Validation Tools

### SHACL Validators
- **PySHACL**: https://github.com/RDFLib/pyshacl
- **Jena SHACL**: https://jena.apache.org/documentation/shacl/
- **Use Case**: Validate RDF data against SHACL shapes

### RDF Validators
- **W3C RDF Validator**: https://www.w3.org/RDF/Validator/
- **Use Case**: Validate RDF syntax

## See Also
- [LOD-AM Website](https://lod-am.net/)
- [LOD-AM/Ontologies Repository](https://github.com/LOD-AM/Ontologies)
