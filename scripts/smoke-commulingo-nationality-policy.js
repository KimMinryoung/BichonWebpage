const assert = require('node:assert/strict');
const { normalizeNationality, requireNationalOrigin } = require('../data/commulingo/people-admin-validation');
const { citizenshipOnlyCodes } = require('../data/commulingo/nationality-policy.json');
for (const code of citizenshipOnlyCodes) {
    assert.equal(normalizeNationality({ code }, 'citizenship').code, code);
    for (const field of ['nationalOrigin', 'origin']) {
        assert.throws(() => normalizeNationality({ code }, field), /citizenship-only/);
    }
    const resolved = requireNationalOrigin({ origin: { code } });
    assert.throws(() => normalizeNationality(resolved.value, 'nationalOrigin'), /citizenship-only/);
}
for (const code of ['serbia', 'croatia', 'slovenia', 'montenegro', 'bosnia-herzegovina', 'russia']) {
    assert.equal(normalizeNationality({ code }, 'nationalOrigin').code, code);
}
const mixed = { code: 'croatia', label: { ko: '크로아트·슬로베니아계', en: 'Croat–Slovene background' } };
assert.equal(normalizeNationality(mixed, 'nationalOrigin').ko, mixed.label.ko);
assert.throws(() => normalizeNationality({ code: 'invented' }, 'nationalOrigin'), /not a known/);
assert.equal(normalizeNationality(null, 'nationalOrigin').code, '');
console.log('nationality policy passed');
