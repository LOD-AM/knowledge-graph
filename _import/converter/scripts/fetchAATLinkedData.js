/**
 * Getty AAT Linked Data Fetcher
 * 
 * Fetches AAT entities using the direct Linked Data API (JSON-LD format)
 * which is more reliable than the SPARQL endpoint for automated requests.
 * 
 * Usage: node fetchAATLinkedData.js
 * 
 * This approach uses the direct entity URLs like:
 *   http://vocab.getty.edu/page/aat/300037118.jsonld
 * 
 * Which return JSON-LD with full hierarchy information.
 */

const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const config = {
  // Base URL for AAT Linked Data
  baseUrl: 'http://vocab.getty.edu/page/aat/',
  
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
    typeProperty: 'crm:P2_has_type',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  },
  
  // Request headers
  headers: {
    'Accept': 'application/ld+json',
    'User-Agent': 'Mozilla/5.0 (compatible; LOD-AM Converter/1.0)'
  }
};

// Statistics
let requestsMade = 0;
let entitiesProcessed = 0;
let broaderTermsFound = 0;

/**
 * Fetch JSON-LD for a single AAT entity
 */
function fetchEntity(entityId) {
  return new Promise((resolve, reject) => {
    requestsMade++;
    
    const url = `${config.baseUrl}${entityId}.jsonld`;
    const parsedUrl = new URL(url);
    
    console.log(`Fetching: ${url}`);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: config.headers
    };
    
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
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
 * Extract broader terms from JSON-LD
 */
function extractBroaderTerms(jsonld) {
  const broaderTerms = [];
  
  // Get the main concept node
  const concept = jsonld['@graph'] ? jsonld['@graph'].find(node => 
    node['@id'] && node['@id'].includes('/page/aat/')
  ) : jsonld;
  
  if (!concept) {
    console.log('  No concept found in JSON-LD');
    return broaderTerms;
  }
  
  console.log(`  Concept ID: ${concept['@id']}`);
  
  // Look for gvp:broaderPreferred or skos:broader
  const broaderIds = [];
  
  // Check for gvp:broaderPreferred
  if (concept['gvp:broaderPreferred']) {
    const broader = concept['gvp:broaderPreferred'];
    if (Array.isArray(broader)) {
      broaderIds.push(...broader.map(b => b['@id']));
    } else {
      broaderIds.push(broader['@id']);
    }
  }
  
  // Also check for skos:broader
  if (concept['skos:broader']) {
    const broader = concept['skos:broader'];
    if (Array.isArray(broader)) {
      broaderIds.push(...broader.map(b => b['@id']));
    } else {
      broaderIds.push(broader['@id']);
    }
  }
  
  console.log(`  Found ${broaderIds.length} broader term IDs`);
  
  // Get labels for broader terms from the graph
  for (const broaderId of broaderIds) {
    const broaderNode = jsonld['@graph'] ? jsonld['@graph'].find(node => 
      node['@id'] === broaderId
    ) : null;
    
    if (broaderNode) {
      // Get preferred label
      let label = null;
      
      // Try gvp:prefLabelGVP first
      if (broaderNode['gvp:prefLabelGVP']) {
        const labelNode = broaderNode['gvp:prefLabelGVP'];
        if (labelNode['xl:literalForm']) {
          label = labelNode['xl:literalForm'];
        }
      }
      
      // Fallback to skos:prefLabel
      if (!label && broaderNode['skos:prefLabel']) {
        const prefLabel = broaderNode['skos:prefLabel'];
        label = Array.isArray(prefLabel) ? prefLabel[0] : prefLabel;
      }
      
      broaderTerms.push({
        uri: broaderId,
        label: label || broaderId
      });
    }
  }
  
  return broaderTerms;
}

/**
 * Clean literal value
 */
function cleanLiteral(literal) {
  if (typeof literal === 'object' && literal !== null) {
    if (literal['@value']) {
      return literal['@value'];
    }
    return JSON.stringify(literal);
  }
  return String(literal || '');
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
 * Normalize entity ID
 */
function normalizeEntityId(entityId) {
  // If it's a full URI, extract the ID
  if (entityId.includes('/page/aat/')) {
    return entityId.split('/').pop();
  }
  // If it's aat:ID format
  if (entityId.startsWith('aat:')) {
    return entityId.substring(4);
  }
  // If it's just a number
  return entityId;
}

/**
 * Process a single entity
 */
async function processEntity(entityId) {
  const normalizedId = normalizeEntityId(entityId);
  console.log(`\nProcessing entity: ${entityId} (normalized: ${normalizedId})`);
  
  try {
    const jsonld = await fetchEntity(normalizedId);
    
    const broaderTerms = extractBroaderTerms(jsonld);
    
    console.log(`  Found ${broaderTerms.length} broader terms`);
    broaderTermsFound += broaderTerms.length;
    
    const fullUri = `${config.baseUrl}${normalizedId}`;
    
    return { 
      entityUri: fullUri, 
      broaderTerms,
      jsonld: jsonld // Keep for debugging
    };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { 
      entityUri: `${config.baseUrl}${normalizedId}`, 
      broaderTerms: [], 
      error: error.message 
    };
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
  output.write(`@prefix aat: <${config.baseUrl}> .\n\n`);
  
  // Write header
  output.write(`# Getty AAT Broader Terms with CIDOC-CRM mappings\n`);
  output.write(`# Generated: ${new Date().toISOString()}\n`);
  output.write(`# Source: Getty AAT Linked Data API (JSON-LD)\n\n`);
  
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
  console.log('Getty AAT Linked Data Fetcher');
  console.log('================================');
  console.log(`Base URL: ${config.baseUrl}`);
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
