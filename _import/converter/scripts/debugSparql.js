/**
 * Debug script to fetch raw SPARQL XML response from Getty
 * 
 * Usage: node debugSparql.js
 * 
 * This script makes the exact same request as the working curl command
 * and outputs the raw XML response for debugging.
 */

const https = require('https');
const { URL } = require('url');

// The exact query that works with curl
const QUERY = `PREFIX aat: <http://vocab.getty.edu/aat/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX gvp: <http://vocab.getty.edu/ontology#>
PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>

SELECT DISTINCT ?broader ?broaderLabel WHERE {
  aat:300037118 gvp:broaderPreferred ?broader .
  ?broader gvp:prefLabelGVP ?labelNode .
  ?labelNode xl:literalForm ?broaderLabel .
}
ORDER BY ?broaderLabel`;

const ENDPOINT = 'https://vocab.getty.edu/sparql.xml';

console.log('Fetching raw SPARQL XML response...');
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Query length: ${QUERY.length} characters`);
console.log('');

const parsedUrl = new URL(ENDPOINT);
const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || 443,
  path: parsedUrl.pathname + '?query=' + encodeURIComponent(QUERY),
  method: 'GET',
  headers: {
    'Accept': 'application/sparql-results+xml',
    'User-Agent': 'Mozilla/5.0 (compatible; YASGUI/3.0)'
  }
};

console.log('Request options:');
console.log(`  hostname: ${options.hostname}`);
console.log(`  port: ${options.port}`);
console.log(`  path: ${options.path.substring(0, 80)}...`);
console.log(`  method: ${options.method}`);
console.log(`  headers.Accept: ${options.headers.Accept}`);
console.log(`  headers.User-Agent: ${options.headers['User-Agent']}`);
console.log('');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response: ${res.statusCode}`);
    console.log(`Headers:`);
    console.log(res.headers);
    console.log('');
    console.log('Response body (raw):');
    console.log('='.repeat(80));
    console.log(data);
    console.log('='.repeat(80));
    console.log('');
    console.log(`Body length: ${data.length} bytes`);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
