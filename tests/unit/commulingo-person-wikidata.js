const assert = require('node:assert/strict');
const { normalizeWikidataId, wikidataUrl } = require('../../data/commulingo/person-wikidata');
const { validateEditorial } = require('../../data/commulingo/person-editorial-policy');

// A bare id, lower case and the item URL all store as the bare QID; null and '' clear.
assert.equal(normalizeWikidataId('Q1394'), 'Q1394');
assert.equal(normalizeWikidataId('q1394'), 'Q1394');
assert.equal(normalizeWikidataId(' https://www.wikidata.org/wiki/Q1394 '), 'Q1394');
assert.equal(normalizeWikidataId('http://www.wikidata.org/entity/Q1394'), 'Q1394');
assert.equal(normalizeWikidataId(null), null);
assert.equal(normalizeWikidataId(''), null);
for (const bad of ['P569', 'Q0', 'Q', '1394', 'Q1394x', 'https://en.wikipedia.org/wiki/Lenin', 1394, ['Q1394']]) {
    assert.throws(() => normalizeWikidataId(bad), { status: 400 }, JSON.stringify(bad));
}
assert.equal(wikidataUrl('Q1394'), 'https://www.wikidata.org/wiki/Q1394');
assert.equal(wikidataUrl(null), null);

// The editorial store accepts the field; it is a mapping, so no evidence item is required.
assert.doesNotThrow(() => validateEditorial({ id: 'lenin', wikidataId: 'Q1394', sources: ['https://www.wikidata.org/wiki/Q1394'] }));

console.log('commulingo person wikidata: ok');
