#!/usr/bin/env node
// The war games offered outside themselves (services/war-promos.js): every
// battle a promo names exists and has a picture and a share image on disk,
// the CommuLingo cards come at most two to a page and only in Korean, and
// a battle's own page is found only for the battles offered.
// @group game
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { SCENARIOS } = require('../../services/war-map');
const P = require('../../services/war-promos');

const ROOT = path.join(__dirname, '..', '..');
const onDisk = src => fs.existsSync(path.join(ROOT, 'public', src.replace(/^\//, '')));

const promoted = Object.values(SCENARIOS).filter(D => D.promo);
assert.ok(promoted.some(D => D.id === 'civil-war'), 'the civil war offers itself');

for (const D of promoted) {
    assert.ok(D.promo.pitch && D.pictures[D.promo.picture], `${D.id}: the whole war's pitch and picture`);
    assert.ok(onDisk(P.gamePage(D.id).image), `${D.id}: og-game.jpg (scripts/war-og-images.py)`);
    for (const [id, promo] of Object.entries(D.promo.battles)) {
        assert.ok(D.battles[id], `${D.id}: the promo's battle ${id} exists`);
        assert.ok(promo.pitch, `${D.id}/${id}: a pitch`);
        assert.ok(D.pictures[promo.picture], `${D.id}/${id}: picture ${promo.picture} is one of the scenario's`);
        const page = P.battlePage(D.id, id);
        assert.equal(page.url, `/games/${D.id}/battle/${id}/`);
        assert.ok(onDisk(page.picture.src), `${D.id}/${id}: ${page.picture.src}`);
        assert.ok(onDisk(page.image), `${D.id}/${id}: ${page.image} (scripts/war-og-images.py)`);
        for (const key of Object.keys(promo)) assert.ok(['pitch', 'picture', 'terms', 'events'].includes(key), `${D.id}/${id}: unknown promo key ${key}`);
    }
    assert.deepEqual(P.battlesOf(D.id).map(b => b.id), Object.keys(D.promo.battles), 'the battles in the promo\'s order');
}

assert.equal(P.battlePage('civil-war', 'no-such-battle'), null);
assert.equal(P.battlePage('civil-war', 'toString'), null, 'only the promo\'s own keys');
assert.equal(P.battlePage('no-such-war', 'kazan'), null);

// The cards: a battle on its term, the whole war on its event, a commander's battles.
const kazan = P.promosFor('terms', 'kazan-operation-1918', 'ko');
assert.equal(kazan.length, 1);
assert.equal(kazan[0].id, 'kazan');
assert.equal(P.promosFor('events', 'civil-war', 'ko')[0].id, null, 'the event names the whole war');
const trotsky = P.promosFor('people', 'trotsky', 'ko');
assert.ok(trotsky.length >= 1 && trotsky.length <= P.MAX_CARDS);
assert.deepEqual(P.promosFor('terms', 'kazan-operation-1918', 'en'), [], 'the games are Korean only');
assert.deepEqual(P.promosFor('terms', 'no-such-term', 'ko'), []);
assert.deepEqual(P.promosFor('nonsense', 'x', 'ko'), []);

// A page with two entries: each card once, at most two.
const both = P.promosForAll([['terms', 'kazan-operation-1918'], ['terms', 'kazan-operation-1918'], ['events', 'civil-war'], ['terms', 'trotsky-train']], 'ko');
assert.equal(both.length, P.MAX_CARDS);
assert.equal(new Set(both.map(c => c.id)).size, both.length);

// The index from a scenario of its own: a person on the board finds the battle.
const index = P.buildIndex({
    x: {
        id: 'x', title: 'X', pictureDir: '/x/', pictures: { p: { caption: 'p', w: 1, h: 1 } },
        battles: { b: { title: 'B', date: 'd', turnLimit: 3, units: [{ person: ['이름', 'someone'] }, {}] } },
        promo: { pitch: 'w', picture: 'p', events: ['e'], battles: { b: { pitch: 'b', picture: 'p', terms: ['t'] } } },
    },
});
assert.equal(index.people.get('someone')[0].id, 'b');
assert.equal(index.terms.get('t')[0].turns, 3);
assert.equal(index.events.get('e')[0].id, null);

console.log(`war promos: ${promoted.length} scenario(s), ${promoted.reduce((n, D) => n + Object.keys(D.promo.battles).length, 0)} battles offered`);
