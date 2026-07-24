#!/usr/bin/env node
const assert = require('assert');
const {
    mergePatronymicPatch,
    patronymicProblem,
    nationalOriginInput,
} = require('../data/commulingo/person-name-validation');

const before = { ko: '이바노비치', en: 'Ivanovich', native: 'Иванович' };

let state = mergePatronymicPatch({ cyrillicPatronymic: 'Петрович' }, before);
assert.deepStrictEqual(
    { ko: state.ko, en: state.en, native: state.native },
    { ko: '이바노비치', en: 'Ivanovich', native: 'Петрович' }
);

state = mergePatronymicPatch({ patronymic: { ko: '페트로비치' } }, before);
assert.deepStrictEqual(
    { ko: state.ko, en: state.en, native: state.native },
    { ko: '페트로비치', en: 'Ivanovich', native: 'Иванович' }
);

assert.match(
    patronymicProblem({ ko: '이바노비치', en: '', native: '', invalid: '' }, 'Иван Иванов'),
    /supplied together/
);
assert.match(
    patronymicProblem({ ko: '이바노비치', en: 'Ivanovich', native: '', invalid: '' }, 'Иван Иванов'),
    /requires cyrillicPatronymic/
);
assert.strictEqual(
    patronymicProblem({ ko: '이바노비치', en: 'Ivanovich', native: '', invalid: '' }, 'Jānis Bērziņš'),
    null
);
assert.match(
    patronymicProblem({ ko: '', en: '', native: 'Иванович', invalid: '' }, 'Иван Иванов'),
    /requires both/
);
assert.match(
    patronymicProblem(
        { ko: '이바노비치', en: 'Ivanovich', native: 'Иванович', invalid: '' },
        'Иван Иванович Иванов'
    ),
    /already embeds/
);

assert.deepStrictEqual(nationalOriginInput({ nationalOrigin: { code: 'poland' } }), {
    touched: true, value: { code: 'poland' }, invalid: '',
});
assert.match(
    nationalOriginInput({ origin: { code: 'ukraine' }, nationalOrigin: { code: 'poland' } }).invalid,
    /disagree/
);

console.log('OK — CommuLingo person name validation smoke passed.');
