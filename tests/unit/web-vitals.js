// services/web-vitals.js: buckets, p75 from bucket counts, and which browser
// errors count.
const assert = require('node:assert/strict');
const { EDGES, bucketFor, p75, normalizeError } = require('../../services/web-vitals');

assert.equal(bucketFor('lcp', 0), 0);
assert.equal(bucketFor('lcp', 2500), EDGES.lcp.indexOf(2500), 'a threshold is its own bucket edge');
assert.equal(bucketFor('lcp', 2501), EDGES.lcp.indexOf(2500) + 1);
assert.equal(bucketFor('lcp', 50000), EDGES.lcp.length, 'open-ended last bucket');
assert.equal(bucketFor('lcp', -1), null);
assert.equal(bucketFor('lcp', 1e9), null);
assert.equal(bucketFor('lcp', '100'), null);
assert.equal(bucketFor('fid', 10), null);
assert.equal(bucketFor('cls', 100), EDGES.cls.indexOf(100));

const rows = (metric, values) => {
    const counts = {};
    for (const v of values) { const b = bucketFor(metric, v); counts[b] = (counts[b] || 0) + 1; }
    return Object.entries(counts).map(([bucket, samples]) => ({ bucket: Number(bucket), samples }));
};
let r = p75('lcp', rows('lcp', [400, 900, 1200, 1800]));
assert.deepEqual(r, { samples: 4, p75: 1500, rating: 'good' });
r = p75('lcp', rows('lcp', [3000, 3500, 3900, 800]));
assert.equal(r.p75, 4000);
assert.equal(r.rating, 'needs-improvement');
r = p75('inp', rows('inp', [900, 1600, 2000, 3000]));
assert.equal(r.p75, '>1500');
assert.equal(r.rating, 'poor');
assert.deepEqual(p75('cls', []), { samples: 0, p75: null, rating: null });

const origin = 'https://cyber-lenin.com';
assert.deepEqual(normalizeError({ message: ' x is\n not defined ', source: `${origin}/js/chat.js?v=abc`, line: 10, column: 4 }, origin),
    { source: '/js/chat.js:10:4', message: 'x is not defined' });
assert.equal(normalizeError({ message: 'm', source: 'chrome-extension://abc/x.js' }, origin), null);
assert.equal(normalizeError({ message: 'm', source: 'https://evil.example/js/a.js' }, origin), null);
assert.equal(normalizeError({ message: 'm', source: `${origin}/commulingo` }, origin), null, 'inline scripts are not counted');
assert.equal(normalizeError({ message: '', source: `${origin}/js/a.js` }, origin), null);
assert.equal(normalizeError({ message: 'x'.repeat(500), source: `${origin}/js/a.js` }, origin).message.length, 300);
console.log('web vitals ok');
