/**
 * Getty AAT Broader Terms Fetcher via SPARQL XML Endpoint
 * 
 * Uses the working sparql.xml endpoint with the query pattern that works in YASGUI.
 * Fetches broader terms for specified AAT entities and saves with CIDOC-CRM mappings.
 * 
 * Usage: node fetchAATBroaderYASGUI.js
 * 
 * Note: This uses the sparql.xml endpoint which works with external clients like YASGUI.
 * The correct prefix for AAT URIs is <http://vocab.getty.edu/page/aat/>
 */

const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const config = {
  // SPARQL endpoint that works (via YASGUI discovery)
  endpoint: 'https://vocab.getty.edu/sparql.xml',
  
  // Target AAT entities (can use full URI or just the numeric ID)
  targetEntities: [
    'http://vocab.getty.edu/page/aat/300037118',
    // Add more entities here as needed
    // '300037118',  // Short form also works
  ],
  
  // Output file
  outputFile: 'aat_broader_terms_cidoc.ttl',
  
  // CIDOC-CRM properties
  cidoc: {
    typeClass: 'crm:E55_Type',
    typeProperty: 'crm:P2_has_type',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  },
  
  // Request headers that mimic YASGUI
  headers: {
    'Accept': 'application/sparql-results+xml',
    'User-Agent': 'YASGUI/3.0 (Mozilla/5.0; compatible; LOD-AM Converter)'
  },
  
  // Correct prefix for AAT - note the /page/ in the path
  aatPrefix: 'http://vocab.getty.edu/page/aat/'
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
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + '?query=' + encodeURIComponent(query),
      method: 'GET',
      headers: config.headers
    };
    
    console.log(`Executing query ${requestsMade}...`);
    
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ data, statusCode: res.statusCode });
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data.substring(0, 200)}`));
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
  
  // Simple XML parsing (no external dependencies)
  // Look for <result> tags and extract bindings
  const resultMatches = xml.match(/<result[^>]*>([\s\S]*?)<\/result>/g) || [];
  
  for (const result of resultMatches) {
    const bindingMatches = result.match(/<binding name="([^"]+)">[\s\S]*?<literal>([\s\S]*?)<\/literal>/g) || [];
    const bindingMatchesUri = result.match(/<binding name="([^"]+)">[\s\S]*?<uri>([\s\S]*?)<\/uri>/g) || [];
    
    const bindings = {};
    
    // Parse literal bindings
    for (const match of bindingMatches) {
      const nameMatch = match.match(/name="([^"]+)"/);
      const valueMatch = match.match(/<literal>([\s\S]*?)<\/literal>/);
      
      if (nameMatch && valueMatch) {
        bindings[nameMatch[1]] = valueMatch[1];
      }
    }
    
    // Parse URI bindings
    for (const match of bindingMatchesUri) {
      const nameMatch = match.match(/name="([^"]+)"/);
      const valueMatch = match.match(/<uri>([\s\S]*?)<\/uri>/);
      
      if (nameMatch && valueMatch) {
        bindings[nameMatch[1]] = valueMatch[1];
      }
    }
    
    if (Object.keys(bindings).length > 0) {
      results.push(bindings);
    }
  }
  
  return results;
}

/**
 * Extract language from literal
 */
function extractLanguage(literal) {
  const match = literal.match(/xml:lang="([^"]+)"/);
  return match ? match[1] : 'en';
}

/**
 * Clean literal value
 */
function cleanLiteral(literal) {
  // Remove XML tags and unescape
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
 * Normalize entity URI - ensure it has the full path
 */
function normalizeEntityUri(entityUri) {
  // If it's just a number, add the full prefix
  if (/^\d+$/.test(entityUri)) {
    return `${config.aatPrefix}${entityUri}`;
  }
  
  // If it's aat:300037118 format, expand it
  if (entityUri.startsWith('aat:')) {
    return `${config.aatPrefix}${entityUri.substring(4)}`;
  }
  
  // If it's already a full URI, return as-is
  return entityUri;
}

/**
 * Build SPARQL query for broader terms
 * Uses the correct prefix: http://vocab.getty.edu/page/aat/
 */
function buildBroaderQuery(entityUri) {
  const fullUri = normalizeEntityUri(entityUri);
  
  // Use the working query pattern from YASGUI with CORRECT prefix
  return `PREFIX aat: <${config.aatPrefix}>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  <${fullUri}> gvp:broaderPreferred ?broader .
  ?broader gvp:prefLabelGVP ?labelNode .
  ?labelNode xl:literalForm ?broaderLabel .
}
ORDER BY ?broaderLabel`;
}

/**
 * Process a single entity
 */
async function processEntity(entityUri) {
  console.log(`\nProcessing entity: ${entityUri}`);
  
  try {
    const query = buildBroaderQuery(entityUri);
    console.log('Query:', query.substring(0, 200) + '...');
    
    const { data } = await executeQuery(query);
    
    const results = parseSparqlXml(data);
    
    console.log(`  Found ${results.length} broader terms`);
    broaderTermsFound += results.length;
    
    // Extract broader URIs and labels
    const broaderTerms = results.map(r => ({
      uri: r.broader,
      label: r.broaderLabel
    }));
    
    return { entityUri: normalizeEntityUri(entityUri), broaderTerms };
  } catch (error) {
    console.error(`  Error processing ${entityUri}: ${error.message}`);
    return { entityUri: normalizeEntityUri(entityUri), broaderTerms: [], error: error.message };
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
  output.write(`# Endpoint: ${config.endpoint}\n`);
  output.write(`# AAT Prefix: ${config.aatPrefix}\n\n`);
  
  // Write each entity and its broader terms
  for (const result of results) {
    if (result.error) {
      output.write(`# Error processing ${result.entityUri}: ${result.error}\n\n`);
      continue;
    }
    
    // Write the main entity
    output.write(`# ${result.entityUri}\n`);
    output.write(generateConceptTurtle(result.entityUri, null, result.broaderTerms.map(b => b.uri)) + '\n');
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
  
  // Process each entity sequentially (to avoid rate limiting)
  for (const entityUri of config.targetEntities) {
    const result = await processEntity(entityUri);
    results.push(result);
    entitiesProcessed++;
    
    // Small delay between requests to be polite
    await new Promise(resolve => setTimeout(resolve, 1000));
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
