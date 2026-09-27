// Person ids romanize non-ASCII letters instead of dropping them
// (lech-wa-sa, edvard-bene, ern-ger were renamed with redirects on 2026-09-27).
const assert = require('node:assert/strict');
const { foldSlug, assertIdKeepsLetters } = require('../data/commulingo/people-admin-validation');

assert.equal(foldSlug('Wałęsa'), 'walesa');
assert.equal(foldSlug('Mikołajczyk'), 'mikolajczyk');
assert.equal(foldSlug('K’ang'), 'kang');
for (const [id, name, good] of [
    ['lech-wa-sa', 'Lech Wałęsa', 'walesa'],
    ['edvard-bene', 'Edvard Beneš', 'benes'],
    ['ern-ger', 'Ernő Gerő', 'erno'],
    ['stanisaw-kania', 'Stanisław Kania', 'stanislaw'],
    ['ngel-vi-as', 'Ángel Viñas', 'angel'],
]) {
    assert.throws(() => assertIdKeepsLetters(id, name), err => err.message.includes(`"${good}"`), id);
}
for (const [id, name] of [
    ['lech-walesa', 'Lech Wałęsa'],
    ['edvard-benes', 'Edvard Beneš'],
    ['kang-sheng', 'K’ang Sheng'],
    ['lenin', 'Vladimir Lenin'],
    ['trotsky', 'Лев Троцкий'],
]) {
    assertIdKeepsLetters(id, name);
}
console.log('person id letters smoke: ok');
