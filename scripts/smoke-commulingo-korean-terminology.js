#!/usr/bin/env node
const assert = require('assert');
const { normalizeSovietKoreanText } = require('../data/commulingo/korean-terminology');

assert.strictEqual(
    normalizeSovietKoreanText('조지아 공산당과 조지아 NKVD'),
    '그루지야 공산당과 그루지야 NKVD'
);
assert.strictEqual(normalizeSovietKoreanText('Georgia'), 'Georgia');
assert.strictEqual(normalizeSovietKoreanText(null), null);

console.log('OK — CommuLingo Korean terminology smoke passed.');
