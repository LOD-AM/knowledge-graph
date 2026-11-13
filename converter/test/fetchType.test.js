const test = require('node:test');
const assert = require('node:assert');
const { turtleEscape, generateFlatTurtle } = require('../fetchType.js');

test('turtleEscape escapes quotes, backslashes and newlines', () => {
  assert.strictEqual(turtleEscape('a "b" \\ c\nd'), 'a \\"b\\" \\\\ c\\nd');
});

test('generateFlatTurtle emits broader terms before narrower ones', () => {
  const root = { uri: 'http://vocab.getty.edu/aat/1', label: 'root', language: 'en', broader: [] };
  const child = { uri: 'http://vocab.getty.edu/aat/2', label: 'say "hi"', language: 'en', scopeNote: 'x', broader: [root] };
  const ttl = generateFlatTurtle(child);
  assert.ok(ttl.indexOf('aat:1 a crm:E55_Type') < ttl.indexOf('aat:2 a crm:E55_Type'));
  assert.match(ttl, /skos:prefLabel "say \\"hi\\""@en/);
  assert.match(ttl, /crm:P127_has_broader_term aat:1 \./);
  assert.doesNotMatch(ttl, /P128/);
});
