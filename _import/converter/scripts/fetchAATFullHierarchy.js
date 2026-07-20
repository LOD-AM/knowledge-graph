/**
 * Getty AAT Full Hierarchy Fetcher
 * 
 * Fetches the complete broader hierarchy for AAT entities recursively.
 * For each entity, gets broader terms, then broader of broader, etc. up to the root.
 * 
 * Usage: node fetchAATFullHierarchy.js
 * 
 * Output: Turtle file with full hierarchy and CIDOC-CRM mappings
 * Uses aat: prefix for compact URIs
 */

const fs = require('fs');
const https = require('https');
const { URL } = require('url');

// Configuration
const config = {
  endpoint: 'https://vocab.getty.edu/sparql.xml',
  
  // Target AAT entities
  targetEntities: [
    '300037118',
    // Add more entity IDs here
  ],
  
  outputFile: 'aat_full_hierarchy_cidoc.ttl',
  
  // Maximum recursion depth (prevent infinite loops)
  maxDepth: 10,
  
  // Delay between requests (ms)
  requestDelay: 500,
  
  cidoc: {
    typeClass: 'crm:E55_Type',
    typeProperty: 'crm:P2_has_type',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  },
  
  headers: {
    'Accept': 'application/sparql-results+xml',
    'User-Agent': 'Mozilla/5.0 (compatible; YASGUI/3.0)'
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
  // Remove the prefix and return aat:ID format
  const match = uri.match(/http:\/\/vocab\.getty\.edu\/(page\/)?aat\/([^\/]+)/);
  if (match) {
    return `aat:${match[2]}`;
  }
  // If it doesn't match, return as-is
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
 * Build SPARQL query for broader terms
 */
function buildBroaderQuery(entityId) {
  const normalizedId = entityId.replace(/^http:\/\/vocab\.getty\.edu\/(page\/)?aat\//, '');
  
  return `PREFIX aat: <http://vocab.getty.edu/aat/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  aat:${normalizedId} gvp:broaderPreferred ?broader .
  ?broader gvp:prefLabelGVP ?labelNode .
  ?labelNode xl:literalForm ?broaderLabel .
}
ORDER BY ?broaderLabel`;
}

/**
 * Fetch broader terms for a single entity
 */
async function fetchBroaderTerms(entityId, depth = 0) {
  // Check cache first
  if (cache.has(entityId)) {
    return cache.get(entityId);
  }
  
  if (depth > config.maxDepth) {
    console.log(`  Max depth reached for ${entityId}`);
    return { uri: normalizeEntityUri(entityId), label: null, broader: [] };
  }
  
  const fullUri = normalizeEntityUri(entityId);
  console.log(`${'  '.repeat(depth)}Fetching broader terms for ${fullUri} (depth ${depth})...`);
  
  try {
    const query = buildBroaderQuery(entityId);
    const { data } = await executeQuery(query);
    
    const results = parseSparqlXml(data);
    broaderTermsFound += results.length;
    
    // Extract broader URIs and labels
    const broaderTerms = [];
    for (const r of results) {
      const language = extractLanguage(r.broaderLabel);
      broaderTerms.push({
        uri: r.broader,
        label: cleanLiteral(r.broaderLabel),
        language: language
      });
    }
    
    // Recursively fetch broader terms for each broader term
    const fullBroaderTerms = [];
    for (const broader of broaderTerms) {
      const broaderData = await fetchBroaderTerms(broader.uri, depth + 1);
      fullBroaderTerms.push({
        ...broader,
        broader: broaderData.broader
      });
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, config.requestDelay));
    }
    
    const result = {
      uri: fullUri,
      label: null, // Will be set by parent
      broader: fullBroaderTerms
    };
    
    cache.set(entityId, result);
    entitiesProcessed++;
    
    return result;
  } catch (error) {
    console.error(`${'  '.repeat(depth)}Error fetching ${entityId}: ${error.message}`);
    return { uri: fullUri, label: null, broader: [], error: error.message };
  }
}

/**
 * Generate flat Turtle output with aat: prefix
 * Each entity is on its own lines with no indentation
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
    
    // Start the entity
    let entityLines = [];
    entityLines.push(`${aatUri} a ${cfg.typeClass} ;`);
    
    // Add label if available
    if (entity.label) {
      const lang = entity.language ? `@${entity.language}` : '';
      entityLines.push(`  ${cfg.typeProperty} "${entity.label.replace(/"/g, '\\"')}"${lang} ;`);
    }
    
    // Add broader terms
    for (const broader of entity.broader) {
      const broaderAatUri = toAATPrefix(broader.uri);
      entityLines.push(`  ${cfg.broaderProperty} ${broaderAatUri} .`);
    }
    
    // If there are no properties, just add a period
    if (entityLines.length === 1) {
      entityLines[0] = entityLines[0].replace(/;$/, '.');
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
  output.write(`# Getty AAT Full Hierarchy with CIDOC-CRM mappings\n`);
  output.write(`# Generated: ${new Date().toISOString()}\n`);
  output.write(`# Endpoint: ${config.endpoint}\n`);
  output.write(`# Max depth: ${config.maxDepth}\n\n`);
  
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
  console.log('Getty AAT Full Hierarchy Fetcher');
  console.log('=================================');
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Target entities: ${config.targetEntities.length}`);
  console.log(`Max depth: ${config.maxDepth}`);
  console.log(`Output file: ${config.outputFile}`);
  console.log('');
  
  const hierarchies = [];
  
  // Process each target entity
  for (const entityId of config.targetEntities) {
    console.log(`\nProcessing: ${entityId}`);
    const hierarchy = await fetchBroaderTerms(entityId, 0);
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
