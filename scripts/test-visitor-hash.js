// visitor-hash middleware: stable per IP, differs by IP and secret, never the raw IP.
const assert = require('node:assert');
const { visitorHash, visitorHashFor, HEADER } = require('../middleware/visitor-hash');

const a = visitorHashFor('203.0.113.7', 's1');
assert.match(a, /^[0-9a-f]{16}$/);
assert.strictEqual(visitorHashFor(' 203.0.113.7 ', 's1'), a);
assert.notStrictEqual(visitorHashFor('203.0.113.8', 's1'), a);
assert.notStrictEqual(visitorHashFor('203.0.113.7', 's2'), a);
assert.strictEqual(visitorHashFor('', 's1'), '');
assert.strictEqual(visitorHashFor('203.0.113.7', ''), '');

function run(headers) {
    const set = {};
    let called = false;
    visitorHash('s1')({ get: name => headers[name.toLowerCase()] },
        { setHeader: (k, v) => { set[k] = v; } }, () => { called = true; });
    assert.ok(called);
    return set;
}
assert.deepStrictEqual(run({ 'cf-connecting-ip': '203.0.113.7' }), { [HEADER]: a });
assert.deepStrictEqual(run({}), {});
console.log('visitor-hash ok');
