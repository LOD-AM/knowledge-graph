/**
 * Getty AAT Broader Terms Fetcher via SPARQL XML Endpoint
 * 
 * Uses the working sparql.xml endpoint with the exact query pattern that works with curl.
 * Fetches broader terms for specified AAT entities and saves with CIDOC-CRM mappings.
 * 
 * Usage: node fetchAATBroaderYASGUI.js
 * 
 * Note: Uses the same approach as the working curl command.
 */

const fs = require('fs');
const https = require('https');
const { URL } = require('url');

// Configuration
const config = {
  // SPARQL endpoint that works
  endpoint: 'https://vocab.getty.edu/sparql.xml',
  
  // Target AAT entities (can use full URI or just the numeric ID)
  targetEntities: [
    '300037118',
    // Add more entity IDs here
  ],
  
  // Output file
  outputFile: 'aat_broader_terms_cidoc.ttl',
  
  // CIDOC-CRM properties
  cidoc: {
    typeClass: 'crm:E55_Type',
    typeProperty: 'skos:prefLabel',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  },
  
  // Headers that work (from the successful curl command)
  headers: {
    'Accept': 'application/sparql-results+xml',
    'User-Agent': 'Mozilla/5.0 (compatible; YASGUI/3.0)'
  },
  
  // AAT prefix - note: the query uses aat: <http://vocab.getty.edu/aat/>
  // but the actual URIs returned are http://vocab.getty.edu/aat/...
  aatPrefix: 'http://vocab.getty.edu/aat/'
};

// Statistics
let requestsMade = 0;
let entitiesProcessed = 0;
let broaderTermsFound = 0;

/**
 * Execute SPARQL query against Getty endpoint
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
 * Handles both single and double quotes in attribute values
 */
function parseSparqlXml(xml) {
  const results = [];
  
  // Match result sections (handles both single and double quotes)
  const resultRegex = /<result>([\s\S]*?)<\/result>/g;
  let match;
  
  while ((match = resultRegex.exec(xml)) !== null) {
    const resultSection = match[1];
    const result = {};
    
    // Extract broader URI (handles both quote types)
    const broaderMatch = resultSection.match(/<binding name=['"]([^'"]+)['"]>\s*<uri>([\s\S]*?)<\/uri>\s*<\/binding>/);
    if (broaderMatch) {
      result.broader = broaderMatch[2].trim();
    }
    
    // Extract broaderLabel literal (handles both quote types and xml:lang attribute)
    const labelMatch = resultSection.match(/<binding name=['"]([^'"]+)['"]>\s*<literal([^>]*)>([\s\S]*?)<\/literal>\s*<\/binding>/);
    if (labelMatch) {
      result.broaderLabel = labelMatch[3].trim();
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
 * Generate CIDOC-CRM Turtle for a concept
 */
function generateConceptTurtle(conceptUri, label, broaderUris = []) {
  const lines = [];
  const cfg = config.cidoc;
  
  lines.push(`<${conceptUri}> a ${cfg.typeClass} ;`);
  
  if (label) {
    const cleanLabel = cleanLiteral(label);
    lines.push(`    ${cfg.typeProperty} "${cleanLabel.replace(/"/g, '\\"')}" ;`);
  }
  
  for (const broaderUri of broaderUris) {
    lines.push(`    ${cfg.broaderProperty} <${broaderUri}> ;`);
  }
  
  // Remove trailing semicolon
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/;$/, '');
  }
  
  return lines.join('\n');
}

/**
 * Normalize entity ID to full URI
 */
function normalizeEntityUri(entityId) {
  // If it's a full URI, return as-is
  if (entityId.startsWith('http')) {
    return entityId;
  }
  // If it's aat:ID format
  if (entityId.startsWith('aat:')) {
    return `${config.aatPrefix}${entityId.substring(4)}`;
  }
  // If it's just a number, use the aat: prefix format that works in the query
  return `${config.aatPrefix}${entityId}`;
}

/**
 * Build SPARQL query for broader terms
 */
function buildBroaderQuery(entityId) {
  const normalizedId = entityId.replace(/^http:\/\/vocab\.getty\.edu\/page\/aat\//, '');
  
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
 * Process a single entity
 */
async function processEntity(entityId) {
  console.log(`\nProcessing entity: ${entityId}`);
  
  try {
    const query = buildBroaderQuery(entityId);
    const { data } = await executeQuery(query);
    
    const results = parseSparqlXml(data);
    
    console.log(`  Found ${results.length} broader terms`);
    if (results.length > 0) {
      console.log(`  Sample result:`, results[0]);
    }
    broaderTermsFound += results.length;
    
    // Extract broader URIs and labels
    const broaderTerms = results.map(r => ({
      uri: r.broader,
      label: r.broaderLabel
    }));
    
    const fullUri = normalizeEntityUri(entityId);
    
    return { entityUri: fullUri, broaderTerms };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { entityUri: normalizeEntityUri(entityId), broaderTerms: [], error: error.message };
  }
}

/**
 * Write results to Turtle file
 */
function writeResults(results) {
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
  output.write(`# Getty AAT Broader Terms with CIDOC-CRM mappings\n`);
  output.write(`# Generated: ${new Date().toISOString()}\n`);
  output.write(`# Endpoint: ${config.endpoint}\n\n`);
  
  // Write each entity and its broader terms
  for (const result of results) {
    if (result.error) {
      output.write(`# Error processing ${result.entityUri}: ${result.error}\n\n`);
      continue;
    }
    
    // Write the main entity
    output.write(`# ${result.entityUri}\n`);
    output.write(generateConceptTurtle(
      result.entityUri, 
      null, 
      result.broaderTerms.map(b => b.uri)
    ) + '\n');
    output.write('.\n\n');
    
    // Write each broader term as a separate entity
    for (const broader of result.broaderTerms) {
      output.write(`# Broader: ${broader.uri}\n`);
      output.write(generateConceptTurtle(broader.uri, broader.label, []) + '\n');
      output.write('.\n\n');
    }
  }
  
  output.end();
  console.log(`\nResults written to ${config.outputFile}`);
}

/**
 * Main function
 */
async function main() {
  console.log('Getty AAT Broader Terms Fetcher');
  console.log('================================');
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`AAT Prefix: ${config.aatPrefix}`);
  console.log(`Target entities: ${config.targetEntities.length}`);
  console.log(`Output file: ${config.outputFile}`);
  console.log('');
  
  const results = [];
  
  // Process each entity sequentially
  for (const entityId of config.targetEntities) {
    const result = await processEntity(entityId);
    results.push(result);
    entitiesProcessed++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Write results
  writeResults(results);
  
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
