/**
 * Getty AAT Type Fetcher
 * 
 * Fetches AAT entities and their complete broader hierarchy recursively,
 * converting them to CIDOC-CRM format with SKOS labels and scope notes.
 * 
 * Usage:
 *   node fetchType.js [options]
 * 
 * Options:
 *   --entity, -e    Comma-separated list of AAT entity IDs (default: 300037118)
 *   --output, -o    Output file path (default: aat_types_cidoc.ttl)
 *   --depth, -d     Maximum recursion depth (default: 10)
 *   --delay, -l     Delay between requests in ms (default: 500)
 *   --help, -h      Show this help message
 * 
 * Examples:
 *   node fetchType.js
 *   node fetchType.js --entity 300037118,300037110 --output my_types.ttl
 *   node fetchType.js -e 300037118 -o output.ttl -d 5
 * 
 * Output: Turtle file with full hierarchy and CIDOC-CRM mappings
 * Uses aat: prefix for compact URIs
 */

const fs = require('fs');
const https = require('https');
const { URL } = require('url');

// Default configuration
const defaultConfig = {
  endpoint: 'https://vocab.getty.edu/sparql.xml',
  targetEntities: ['300037118'],
  outputFile: 'aat_types_cidoc.ttl',
  maxDepth: 10,
  requestDelay: 500,
  
  // CIDOC-CRM and SKOS properties
  cidoc: {
    typeClass: 'crm:E55_Type',
    typeProperty: 'skos:prefLabel',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  },
  
  headers: {
    'Accept': 'application/sparql-results+xml',
    'User-Agent': 'Mozilla/5.0 (compatible; LOD-AM Converter/1.0)'
  },
  
  aatPrefix: 'http://vocab.getty.edu/aat/'
};

// Statistics
let requestsMade = 0;
let entitiesProcessed = 0;
let broaderTermsFound = 0;

// Cache to avoid duplicate requests
const cache = new Map();

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...defaultConfig };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      
      case '--entity':
      case '-e':
        if (args[i + 1]) {
          config.targetEntities = args[i + 1].split(',').map(s => s.trim());
          i++;
        }
        break;
        
      case '--output':
      case '-o':
        if (args[i + 1]) {
          config.outputFile = args[i + 1];
          i++;
        }
        break;
        
      case '--depth':
      case '-d':
        if (args[i + 1]) {
          config.maxDepth = parseInt(args[i + 1], 10);
          i++;
        }
        break;
        
      case '--delay':
      case '-l':
        if (args[i + 1]) {
          config.requestDelay = parseInt(args[i + 1], 10);
          i++;
        }
        break;
    }
  }
  
  return config;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Getty AAT Type Fetcher
======================

Fetches AAT entities and their complete broader hierarchy, converting to
CIDOC-CRM format with SKOS labels and scope notes.

Usage:
  node fetchType.js [options]

Options:
  --entity, -e    Comma-separated list of AAT entity IDs
                 (default: ${defaultConfig.targetEntities.join(',')})
  --output, -o    Output file path (default: ${defaultConfig.outputFile})
  --depth, -d     Maximum recursion depth (default: ${defaultConfig.maxDepth})
  --delay, -l     Delay between requests in ms (default: ${defaultConfig.requestDelay})
  --help, -h      Show this help message

Examples:
  node fetchType.js
  node fetchType.js --entity 300037118,300037110 --output my_types.ttl
  node fetchType.js -e 300037118 -o output.ttl -d 5

Output:
  Turtle file with full hierarchy and CIDOC-CRM mappings
  Uses aat: prefix for compact URIs

CIDOC-CRM Mappings:
  AAT Concept    -> crm:E55_Type
  prefLabel      -> skos:prefLabel
  scopeNote      -> skos:scopeNote (English only)
  broader        -> crm:P127_has_broader_term
  narrower       -> crm:P128_is_type_for
`);
}

// Parse command line arguments
const config = parseArgs();

/**
 * Execute SPARQL query
 */
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    requestsMade++;
    
    const parsedUrl = new URL(config.endpoint);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + '?query=' + encodeURIComponent(query),
      method: 'GET',
      headers: config.headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ data, statusCode: res.statusCode });
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

/**
 * Parse SPARQL XML results
 */
function parseSparqlXml(xml) {
  const results = [];
  const resultRegex = /<result>([\s\S]*?)<\/result>/g;
  let match;
  
  while ((match = resultRegex.exec(xml)) !== null) {
    const resultSection = match[1];
    const result = {};
    
    const broaderMatch = resultSection.match(/<binding name=['"]broader['"]>\s*<uri>([\s\S]*?)<\/uri>\s*<\/binding>/);
    if (broaderMatch) {
      result.broader = broaderMatch[1].trim();
    }
    
    const labelMatch = resultSection.match(/<binding name=['"]broaderLabel['"]>\s*<literal([^>]*)>([\s\S]*?)<\/literal>\s*<\/binding>/);
    if (labelMatch) {
      result.broaderLabel = labelMatch[2].trim();
    }
    
    const entityLabelMatch = resultSection.match(/<binding name=['"]entityLabel['"]>\s*<literal([^>]*)>([\s\S]*?)<\/literal>\s*<\/binding>/);
    if (entityLabelMatch) {
      result.entityLabel = entityLabelMatch[2].trim();
    }
    
    const scopeNoteMatch = resultSection.match(/<binding name=['"]scopeNote['"]>\s*<literal([^>]*)>([\s\S]*?)<\/literal>\s*<\/binding>/);
    if (scopeNoteMatch) {
      result.scopeNote = scopeNoteMatch[2].trim();
    }
    
    if (Object.keys(result).length > 0) {
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Clean literal value
 */
function cleanLiteral(literal) {
  return literal
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

/**
 * Extract language from literal
 */
function extractLanguage(literal) {
  const match = literal.match(/xml:lang=['"]([^'"]+)['"]/);
  return match ? match[1] : 'en';
}

/**
 * Convert full URI to aat: prefix format
 */
function toAATPrefix(uri) {
  const match = uri.match(/http:\/\/vocab\.getty\.edu\/(page\/)?aat\/([^\/]+)/);
  if (match) {
    return `aat:${match[2]}`;
  }
  return uri;
}

/**
 * Normalize entity ID
 */
function normalizeEntityUri(entityId) {
  if (entityId.startsWith('http')) {
    return entityId;
  }
  if (entityId.startsWith('aat:')) {
    return `${config.aatPrefix}${entityId.substring(4)}`;
  }
  return `${config.aatPrefix}${entityId}`;
}

/**
 * Build SPARQL query for entity label, scope note, and broader terms
 */
function buildEntityQuery(entityId) {
  const normalizedId = entityId.replace(/^http:\/\/vocab\.getty\.edu\/(page\/)?aat\//, '');
  
  return `PREFIX aat: <http://vocab.getty.edu/aat/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?broader ?broaderLabel ?entityLabel ?scopeNote WHERE {
  aat:${normalizedId} gvp:prefLabelGVP ?entityLabelNode .
  ?entityLabelNode xl:literalForm ?entityLabel .
  
  OPTIONAL {
    aat:${normalizedId} gvp:broaderPreferred ?broader .
    ?broader gvp:prefLabelGVP ?broaderLabelNode .
    ?broaderLabelNode xl:literalForm ?broaderLabel .
  }
  
  OPTIONAL {
    aat:${normalizedId} gvp:scopeNote ?scopeNoteNode .
    ?scopeNoteNode gvp:scopeNoteText ?scopeNote .
    FILTER(LANG(?scopeNote) = "en" || LANG(?scopeNote) = "")
  }
}
ORDER BY ?broaderLabel`;
}

/**
 * Fetch label, scope note, and broader terms for a single entity
 */
async function fetchEntityData(entityId, depth = 0) {
  // Check cache first
  if (cache.has(entityId)) {
    return cache.get(entityId);
  }
  
  if (depth > config.maxDepth) {
    console.log(`  Max depth reached for ${entityId}`);
    return { uri: normalizeEntityUri(entityId), label: null, language: 'en', scopeNote: null, broader: [] };
  }
  
  const fullUri = normalizeEntityUri(entityId);
  console.log(`${'  '.repeat(depth)}Fetching data for ${fullUri} (depth ${depth})...`);
  
  try {
    const query = buildEntityQuery(entityId);
    const { data } = await executeQuery(query);
    
    const results = parseSparqlXml(data);
    
    // Extract entity label from first result
    let entityLabel = null;
    let entityLanguage = 'en';
    let entityScopeNote = null;
    
    if (results.length > 0) {
      if (results[0].entityLabel) {
        entityLabel = cleanLiteral(results[0].entityLabel);
        entityLanguage = extractLanguage(results[0].entityLabel);
      }
      
      // Find English scope note
      for (const r of results) {
        if (r.scopeNote) {
          const lang = extractLanguage(r.scopeNote);
          if (lang === 'en' || lang === '') {
            entityScopeNote = cleanLiteral(r.scopeNote);
            break;
          }
        }
      }
    }
    
    // Extract broader URIs and labels
    const broaderTerms = [];
    for (const r of results) {
      if (r.broader) {
        const language = extractLanguage(r.broaderLabel);
        broaderTerms.push({
          uri: r.broader,
          label: cleanLiteral(r.broaderLabel),
          language: language
        });
      }
    }
    
    broaderTermsFound += broaderTerms.length;
    
    // Recursively fetch broader terms for each broader term
    const fullBroaderTerms = [];
    for (const broader of broaderTerms) {
      const broaderData = await fetchEntityData(broader.uri, depth + 1);
      fullBroaderTerms.push({
        ...broader,
        broader: broaderData.broader
      });
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, config.requestDelay));
    }
    
    const result = {
      uri: fullUri,
      label: entityLabel,
      language: entityLanguage,
      scopeNote: entityScopeNote,
      broader: fullBroaderTerms
    };
    
    cache.set(entityId, result);
    entitiesProcessed++;
    
    return result;
  } catch (error) {
    console.error(`${'  '.repeat(depth)}Error fetching ${entityId}: ${error.message}`);
    return { uri: fullUri, label: null, language: 'en', scopeNote: null, broader: [], error: error.message };
  }
}

/**
 * Generate flat Turtle output with aat: prefix
 * Each entity is on its own with proper period termination
 */
function generateFlatTurtle(hierarchy) {
  const lines = [];
  const cfg = config.cidoc;
  
  // Process the hierarchy in order (root last)
  function processEntity(entity, visited = new Set()) {
    if (visited.has(entity.uri)) return;
    visited.add(entity.uri);
    
    // First process all broader terms (so they appear before the current entity)
    for (const broader of entity.broader) {
      processEntity(broader, visited);
    }
    
    // Then add the current entity
    const aatUri = toAATPrefix(entity.uri);
    const entityLines = [];
    
    // Start with the type
    entityLines.push(`${aatUri} a ${cfg.typeClass} ;`);
    
    // Add label if available
    if (entity.label) {
      const lang = entity.language ? `@${entity.language}` : '';
      entityLines.push(`  ${cfg.typeProperty} "${entity.label.replace(/"/g, '\\"')}"${lang} ;`);
    }
    
    // Add scope note if available
    if (entity.scopeNote) {
      entityLines.push(`  skos:scopeNote "${entity.scopeNote.replace(/"/g, '\\"')}"@en ;`);
    }
    
    // Add broader terms
    for (const broader of entity.broader) {
      const broaderAatUri = toAATPrefix(broader.uri);
      entityLines.push(`  ${cfg.broaderProperty} ${broaderAatUri} ;`);
    }
    
    // Always end with a period - replace the last semicolon
    if (entityLines.length > 0) {
      const lastLine = entityLines[entityLines.length - 1];
      entityLines[entityLines.length - 1] = lastLine.replace(/;$/, '.');
    }
    
    lines.push(entityLines.join('\n'));
  }
  
  processEntity(hierarchy);
  
  return lines.join('\n\n');
}

/**
 * Write results to Turtle file
 */
function writeResults(hierarchies) {
  const output = fs.createWriteStream(config.outputFile);
  
  // Write prefixes
  output.write(`@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n`);
  output.write(`@prefix gvp: <http://vocab.getty.edu/ontology#> .\n`);
  output.write(`@prefix xl: <http://www.w3.org/2008/05/skos-xl#> .\n`);
  output.write(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`);
  output.write(`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`);
  output.write(`@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .\n`);
  output.write(`@prefix aat: <${config.aatPrefix}> .\n\n`);
  
  // Write header
  output.write(`# Getty AAT Types with CIDOC-CRM mappings\n`);
  output.write(`# Generated: ${new Date().toISOString()}\n`);
  output.write(`# Endpoint: ${config.endpoint}\n`);
  output.write(`# Max depth: ${config.maxDepth}\n`);
  output.write(`# Target entities: ${config.targetEntities.join(', ')}\n\n`);
  
  // Write each hierarchy
  for (const hierarchy of hierarchies) {
    output.write(`# ${hierarchy.uri}\n`);
    output.write(generateFlatTurtle(hierarchy) + '\n\n');
  }
  
  output.end();
  console.log(`\nResults written to ${config.outputFile}`);
}

/**
 * Main function
 */
async function main() {
  console.log('Getty AAT Type Fetcher');
  console.log('======================');
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Target entities: ${config.targetEntities.join(', ')}`);
  console.log(`Max depth: ${config.maxDepth}`);
  console.log(`Output file: ${config.outputFile}`);
  console.log(`Request delay: ${config.requestDelay}ms`);
  console.log('');
  
  const hierarchies = [];
  
  // Process each target entity
  for (const entityId of config.targetEntities) {
    console.log(`\nProcessing: ${entityId}`);
    const hierarchy = await fetchEntityData(entityId, 0);
    hierarchies.push(hierarchy);
    
    // Delay between top-level requests
    await new Promise(resolve => setTimeout(resolve, config.requestDelay));
  }
  
  // Write results
  writeResults(hierarchies);
  
  // Print summary
  console.log('\nSummary:');
  console.log(`  Entities processed: ${entitiesProcessed}`);
  console.log(`  Requests made: ${requestsMade}`);
  console.log(`  Broader terms found: ${broaderTermsFound}`);
  console.log(`  Output file: ${config.outputFile}`);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
