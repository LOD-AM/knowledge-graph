/**
 * Getty AAT N-Triples Streaming Processor
 * 
 * Memory-efficient script that streams through a large N-Triples file
 * to extract broader terms for specified AAT entities and adds CIDOC-CRM mappings.
 * 
 * Usage: node processAATStreaming.js /path/to/aat.nt [config.json]
 * 
 * Features:
 * - Streams the file line by line (constant memory usage)
 * - Extracts broader hierarchical relationships
 * - Adds CIDOC-CRM type and hierarchy properties
 * - Outputs clean Turtle format
 * - Configurable via JSON config file
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Load configuration
let config = {
  targetEntities: [
    'http://vocab.getty.edu/page/aat/300037118'
  ],
  outputFile: 'aat_broader_terms_cidoc.ttl',
  includeNarrower: false,
  cidocProperties: {
    typeClass: 'crm:E55_Type',
    typeProperty: 'skos:prefLabel',
    broaderProperty: 'crm:P127_has_broader_term',
    narrowerProperty: 'crm:P128_is_type_for'
  }
};

// Try to load config from file
function loadConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      config = { ...config, ...customConfig };
      console.log(`Loaded configuration from ${configPath}`);
    }
  } catch (err) {
    console.warn(`Warning: Could not load config from ${configPath}: ${err.message}`);
  }
}

// Track data as we stream
const concepts = new Map(); // URI -> { broader: Set, narrower: Set, prefLabel: string }
const labels = new Map(); // labelNode URI -> literalForm
const conceptLabelNodes = new Map(); // concept URI -> [labelNode URIs]
const targetEntitySet = new Set();

// Statistics
let linesProcessed = 0;
let triplesProcessed = 0;

/**
 * Parse an N-Triples line into subject, predicate, object
 */
function parseNTriple(line) {
  // Skip comments and empty lines
  if (!line || line.startsWith('#')) return null;
  
  // Remove trailing period and whitespace
  const trimmed = line.trim().replace(/\.$/, '');
  if (!trimmed) return null;
  
  // Split by whitespace, handling quoted strings with spaces
  const parts = [];
  let current = '';
  let inQuote = false;
  let quoteChar = null;
  
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    
    if ((char === '"' || char === "'") && (i === 0 || trimmed[i-1] !== '\\')) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
        current += char;
      } else if (char === quoteChar) {
        inQuote = false;
        current += char;
        quoteChar = null;
      } else {
        current += char;
      }
    } else if (char === ' ' && !inQuote) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  
  if (current) {
    parts.push(current);
  }
  
  if (parts.length !== 3) return null;
  
  return {
    subject: unwrapURI(parts[0]),
    predicate: unwrapURI(parts[1]),
    object: parts[2] // Keep as-is for literals
  };
}

/**
 * Extract the URI from angle brackets or return as-is for literals
 */
function unwrapURI(uri) {
  if (uri.startsWith('<') && uri.endsWith('>')) {
    return uri.slice(1, -1);
  }
  return uri;
}

/**
 * Extract language tag from literal
 */
function extractLanguage(literal) {
  const match = literal.match(/@([a-zA-Z-]+)$/);
  return match ? match[1] : null;
}

/**
 * Extract the literal value without language tag or quotes
 */
function extractLiteralValue(literal) {
  const match = literal.match(/^"([^"]*)"(?:@[a-zA-Z-]+)?$/);
  return match ? match[1] : literal;
}

/**
 * Check if a URI is a target entity or in its hierarchy
 */
function isRelevantConcept(uri) {
  // Check if it's a target entity
  if (targetEntitySet.has(uri)) return true;
  
  // Check if it's in the broader hierarchy of any target
  for (const targetUri of targetEntitySet) {
    if (concepts.has(targetUri)) {
      const targetData = concepts.get(targetUri);
      if (targetData.broader.has(uri)) return true;
      
      // Check transitive broader
      for (const broaderUri of targetData.broader) {
        if (concepts.has(broaderUri)) {
          const broaderData = concepts.get(broaderUri);
          if (broaderData.broader.has(uri)) return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Process a single triple
 */
function processTriple(triple) {
  const { subject, predicate, object } = triple;
  
  // Initialize concept if not exists
  if (!concepts.has(subject)) {
    concepts.set(subject, { broader: new Set(), narrower: new Set(), prefLabel: null });
  }
  
  // Track broader relationships
  if (predicate === 'http://www.w3.org/2004/02/skos/core#broader') {
    const objectUri = unwrapURI(object);
    concepts.get(subject).broader.add(objectUri);
    
    // Ensure the broader concept exists
    if (!concepts.has(objectUri)) {
      concepts.set(objectUri, { broader: new Set(), narrower: new Set(), prefLabel: null });
    }
    concepts.get(objectUri).narrower.add(subject);
  }
  
  // Track narrower relationships (if configured)
  if (config.includeNarrower && predicate === 'http://www.w3.org/2004/02/skos/core#narrower') {
    const objectUri = unwrapURI(object);
    concepts.get(subject).narrower.add(objectUri);
    
    if (!concepts.has(objectUri)) {
      concepts.set(objectUri, { broader: new Set(), narrower: new Set(), prefLabel: null });
    }
    concepts.get(objectUri).broader.add(subject);
  }
  
  // Track GVP preferred labels
  if (predicate === 'http://vocab.getty.edu/ontology#prefLabelGVP') {
    const labelNodeUri = unwrapURI(object);
    if (!conceptLabelNodes.has(subject)) {
      conceptLabelNodes.set(subject, []);
    }
    conceptLabelNodes.get(subject).push(labelNodeUri);
  }
  
  // Track label node literal forms
  if (predicate === 'http://www.w3.org/2008/05/skos-xl#literalForm') {
    labels.set(subject, object);
  }
  
  // Track skos:prefLabel as fallback
  if (predicate === 'http://www.w3.org/2004/02/skos/core#prefLabel') {
    concepts.get(subject).prefLabel = object;
  }
}

/**
 * Resolve GVP labels
 */
function resolveLabels() {
  for (const [conceptUri, labelNodes] of conceptLabelNodes) {
    if (concepts.has(conceptUri)) {
      for (const labelNodeUri of labelNodes) {
        if (labels.has(labelNodeUri)) {
          const literal = labels.get(labelNodeUri);
          concepts.get(conceptUri).prefLabel = literal;
          break; // Use the first label found
        }
      }
    }
  }
}

/**
 * Collect all URIs in the broader hierarchy of target entities
 */
function collectHierarchyUris() {
  const hierarchyUris = new Set();
  
  function collect(uri) {
    if (hierarchyUris.has(uri)) return;
    hierarchyUris.add(uri);
    
    const data = concepts.get(uri);
    if (data) {
      for (const broaderUri of data.broader) {
        collect(broaderUri);
      }
    }
  }
  
  for (const targetUri of targetEntitySet) {
    collect(targetUri);
  }
  
  return hierarchyUris;
}

/**
 * Generate CIDOC-CRM mappings for a concept
 */
function generateCIDOCMappings(conceptUri, data) {
  const lines = [];
  const cfg = config.cidocProperties;
  
  // Concept as E55_Type
  lines.push(`${conceptUri} a ${cfg.typeClass} ;`);
  
  // Add P2 has type (if we have a label)
  if (data.prefLabel) {
    const labelValue = extractLiteralValue(data.prefLabel);
    const lang = extractLanguage(data.prefLabel);
    const labelLang = lang ? `@${lang}` : '';
    lines.push(`    ${cfg.typeProperty} "${labelValue.replace(/"/g, '\\"')}"${labelLang} ;`);
  }
  
  // Add broader relationships
  for (const broaderUri of data.broader) {
    lines.push(`    ${cfg.broaderProperty} <${broaderUri}> ;`);
  }
  
  // Add narrower relationships if configured
  if (config.includeNarrower) {
    for (const narrowerUri of data.narrower) {
      lines.push(`    ${cfg.narrowerProperty} <${narrowerUri}> ;`);
    }
  }
  
  // Remove trailing semicolon
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/;$/, '');
  }
  
  return lines.join('\n');
}

/**
 * Write output to Turtle file
 */
function writeOutput(hierarchyUris) {
  const output = fs.createWriteStream(config.outputFile);
  
  // Write prefixes
  output.write(`@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n`);
  output.write(`@prefix gvp: <http://vocab.getty.edu/ontology#> .\n`);
  output.write(`@prefix xl: <http://www.w3.org/2008/05/skos-xl#> .\n`);
  output.write(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`);
  output.write(`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`);
  output.write(`@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .\n`);
  output.write(`@prefix aat: <http://vocab.getty.edu/page/aat/> .\n\n`);
  
  // Write comment header
  output.write(`# Getty AAT Broader Terms with CIDOC-CRM mappings\n`);
  output.write(`# Generated: ${new Date().toISOString()}\n`);
  output.write(`# Target entities: ${Array.from(targetEntitySet).join(', ')}\n\n`);
  
  // Write each concept in the hierarchy
  for (const uri of hierarchyUris) {
    if (concepts.has(uri)) {
      const data = concepts.get(uri);
      output.write(`# ${uri}\n`);
      output.write(generateCIDOCMappings(uri, data) + '\n');
      output.write('.\n\n');
    }
  }
  
  output.end();
  console.log(`\nOutput written to ${config.outputFile}`);
}

/**
 * Main processing function
 */
async function processFile(inputFile) {
  console.log(`Starting to process: ${inputFile}`);
  console.log(`Target entities: ${Array.from(targetEntitySet).join(', ')}`);
  console.log(`Output file: ${config.outputFile}`);
  console.log(`Include narrower terms: ${config.includeNarrower}`);
  console.log('');
  
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  // Process each line - First pass: extract structure
  console.log('First pass: Extracting hierarchical relationships...');
  for await (const line of rl) {
    linesProcessed++;
    
    if (linesProcessed % 1000000 === 0) {
      process.stdout.write(`\rProcessed ${linesProcessed} lines, ${triplesProcessed} triples...`);
    }
    
    const triple = parseNTriple(line);
    if (triple) {
      triplesProcessed++;
      processTriple(triple);
    }
  }
  
  console.log(`\rFirst pass complete: ${linesProcessed} lines, ${triplesProcessed} triples`);
  console.log(`Found ${concepts.size} unique concepts`);
  
  // Resolve labels
  console.log('Resolving GVP labels...');
  resolveLabels();
  
  // Collect hierarchy URIs
  console.log('Collecting hierarchy URIs...');
  const hierarchyUris = collectHierarchyUris();
  console.log(`Found ${hierarchyUris.size} concepts in hierarchy`);
  
  // Write output
  writeOutput(hierarchyUris);
  
  console.log('\nProcessing complete!');
  console.log(`Total lines: ${linesProcessed}`);
  console.log(`Total triples: ${triplesProcessed}`);
  console.log(`Concepts in memory: ${concepts.size}`);
  console.log(`Concepts in hierarchy: ${hierarchyUris.size}`);
}

// Main entry point
function main() {
  // Parse command line arguments
  if (process.argv.length < 3) {
    console.log('Usage: node processAATStreaming.js /path/to/aat.nt [config.json]');
    console.log('');
    console.log('Arguments:');
    console.log('  /path/to/aat.nt    Path to the N-Triples file');
    console.log('  config.json        Optional path to config file (default: scripts/config.json)');
    console.log('');
    console.log('Example:');
    console.log('  node processAATStreaming.js ~/Downloads/aat.nt');
    console.log('  node processAATStreaming.js ~/Downloads/aat.nt ../my-config.json');
    process.exit(1);
  }
  
  const inputFile = process.argv[2];
  const configPath = process.argv[3] || path.join(__dirname, 'config.json');
  
  // Load configuration
  loadConfig(configPath);
  
  // Initialize target entities
  targetEntitySet.clear();
  for (const uri of config.targetEntities) {
    targetEntitySet.add(uri);
  }
  
  // Check if file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Check if it's a file
  const stats = fs.statSync(inputFile);
  if (!stats.isFile()) {
    console.error(`Error: Not a file: ${inputFile}`);
    process.exit(1);
  }
  
  console.log(`Processing ${inputFile} (${(stats.size / 1024 / 1024 / 1024).toFixed(2)} GB)`);
  console.log('');
  
  processFile(inputFile).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

// Run
main();
