/**
 * Getty AAT Broader Terms Fetcher
 * 
 * This script queries the Getty AAT SPARQL endpoint to fetch all broader terms
 * for a given AAT entity and saves them to export.ttl in Turtle format.
 * 
 * Usage: node fetchAATBroaderTerms.js
 * 
 * Note: The Getty SPARQL endpoint may require proper headers or manual execution
 * due to access restrictions on automated requests.
 */

const fs = require('fs');
const https = require('https');
const { URL } = require('url');

// Configuration
const TARGET_ENTITY = '<http://vocab.getty.edu/page/aat/300037118>';
const SPARQL_ENDPOINT = 'http://vocab.getty.edu/sparql';
const OUTPUT_FILE = 'export.ttl';

// SPARQL query to get broader terms
const SPARQL_QUERY = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  ${TARGET_ENTITY} skos:broader* ?broader .
  ?broader skos:prefLabel ?broaderLabel .
  FILTER (lang(?broaderLabel) = 'en')
}
ORDER BY ?broaderLabel
`;

// Alternative query using gvp:prefLabelGVP (more reliable for Getty)
const SPARQL_QUERY_GVP = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  ${TARGET_ENTITY} skos:broader* ?broader .
  ?broader gvp:prefLabelGVP ?labelNode .
  ?labelNode xl:literalForm ?broaderLabel .
}
ORDER BY ?broaderLabel
`;

// Function to URL encode the SPARQL query
function encodeSparqlQuery(query) {
  return encodeURIComponent(query);
}

// Function to execute SPARQL query
function executeSparqlQuery(query, endpoint, outputFormat = 'json') {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeSparqlQuery(query);
    const url = `${endpoint}?query=${encodedQuery}&format=${outputFormat}`;
    
    console.log(`Executing query: ${url}`);
    
    // Use http module since the endpoint is HTTP
    const http = require('http');
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Accept': `application/sparql-results+${outputFormat}`,
        'User-Agent': 'Mozilla/5.0 (compatible; LOD-AM Converter/1.0)'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to convert SPARQL JSON results to Turtle
function jsonToTurtle(jsonResults, targetEntity) {
  let turtle = '';
  
  // Add prefix declarations
  turtle += '@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n';
  turtle += '@prefix gvp: <http://vocab.getty.edu/ontology#> .\n';
  turtle += '@prefix xl: <http://www.w3.org/2008/05/skos-xl#> .\n';
  turtle += '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n';
  turtle += '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n';
  turtle += '\n';
  
  // Add the target entity
  turtle += `${targetEntity} a skos:Concept ;\n`;
  
  try {
    const results = JSON.parse(jsonResults);
    
    if (results.results && results.results.bindings) {
      const bindings = results.results.bindings;
      
      // Add broader relationships
      bindings.forEach((binding, index) => {
        const broader = binding.broader ? binding.broader.value : null;
        const broaderLabel = binding.broaderLabel ? binding.broaderLabel.value : null;
        
        if (broader) {
          turtle += `    skos:broader ${broader} ;\n`;
          
          if (broaderLabel) {
            turtle += `    rdfs:label "${broaderLabel.replace(/"/g, '\\"')}"@en ;\n`;
          }
        }
      });
      
      // Remove trailing semicolon and add period
      turtle = turtle.replace(/;\s*$/, '.');
    }
  } catch (error) {
    console.error('Error parsing JSON results:', error);
    // Fallback: just add the target entity
    turtle += '    rdfs:label "Target entity" .';
  }
  
  return turtle;
}

// Main function
async function main() {
  console.log('Starting Getty AAT Broader Terms Fetcher...');
  console.log(`Target entity: ${TARGET_ENTITY}`);
  console.log(`SPARQL endpoint: ${SPARQL_ENDPOINT}`);
  console.log('');
  
  try {
    // Try with the GVP query first (more reliable for Getty)
    console.log('Attempting to fetch broader terms using GVP query...');
    const results = await executeSparqlQuery(SPARQL_QUERY_GVP, SPARQL_ENDPOINT, 'json');
    
    // Convert to Turtle
    const turtle = jsonToTurtle(results, TARGET_ENTITY);
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, turtle);
    console.log(`\nSuccess! Results saved to ${OUTPUT_FILE}`);
    console.log('\nGenerated Turtle content:');
    console.log(turtle);
    
  } catch (error) {
    console.error('Error executing SPARQL query:', error.message);
    console.log('\nNote: The Getty SPARQL endpoint may block automated requests.');
    console.log('Try running this script manually with proper authentication or headers.');
    console.log('\nAlternative: Download the RDF dump from https://www.getty.edu/research/tools/vocabularies/obtain/download.html');
    
    // Create a fallback file with the query
    const queryForFallback = SPARQL_QUERY_GVP.replace(/\n/g, '\n# ');
    const fallbackContent = `# Getty AAT Broader Terms Query
# To execute manually, visit: ${SPARQL_ENDPOINT}
# 
# Query:
# ${queryForFallback}
`;
    fs.writeFileSync(OUTPUT_FILE, fallbackContent);
    console.log(`\nFallback query saved to ${OUTPUT_FILE}`);
  }
}

// Run the script
main();
