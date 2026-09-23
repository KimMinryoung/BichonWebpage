const assert = require('node:assert/strict');
const { presentedEventList, buildEventPanel } = require('../data/commulingo/event-presentation');
const { presentedDocList } = require('../data/commulingo/doc-presentation');
const { peopleApiBody } = require('../data/commulingo/people-presentation');
const { deckBody } = require('../data/commulingo/drill-presentation');
const { buildTermPanel } = require('../data/commulingo/term-presentation');

// The paired builders belong to independent presentation modules, rather than
// being exported from their Express routers.
assert.equal(typeof buildEventPanel, 'function');
assert.equal(typeof buildTermPanel, 'function');

const events = [{ id: 'event', title: { ko: '사건', en: 'Event' } }];
const firstEvents = presentedEventList(events, 'ko');
assert.strictEqual(presentedEventList(events, 'ko'), firstEvents);
assert.equal(presentedEventList(events, 'en')[0].title, 'Event');
assert.equal(presentedEventList([{ ...events[0], title: { ko: '새 사건', en: 'New event' } }], 'ko')[0].title, '새 사건');

const docs = [{ id: 'doc', title: { ko: '문서', en: 'Document' }, kind: { ko: '책', en: 'Book' } }];
const resolveA = () => ({});
const resolveB = () => ({ marker: 'refreshed' });
const firstDocs = presentedDocList(docs, 'ko', resolveA);
assert.strictEqual(presentedDocList(docs, 'ko', resolveA), firstDocs);
assert.equal(presentedDocList(docs, 'ko', resolveB).docs[0].marker, 'refreshed');
assert.equal(presentedDocList([{ ...docs[0], title: { ko: '새 문서', en: 'New document' } }], 'ko', resolveA).docs[0].title, '새 문서');

const person = { id: 'person' };
const people = { schemaVersion: 1, lang: 'ko', people: [person], groups: [{ id: 'group', people: [person] }] };
const loaded = { source: 'snapshot' };
const firstPeople = peopleApiBody(loaded, people);
assert.strictEqual(peopleApiBody(loaded, people), firstPeople);
assert.equal(JSON.parse(peopleApiBody({ source: 'db' }, people)).source, 'db');
assert.equal(JSON.parse(peopleApiBody(loaded, { ...people, people: [] })).peopleCount, 0);

const deck = { id: 'deck', title: 'Old' };
const drills = { version: 'v1', byId: new Map([['deck', deck]]) };
const firstDeck = deckBody(drills, 'deck');
assert.strictEqual(deckBody(drills, 'deck'), firstDeck);
assert.equal(JSON.parse(deckBody({ version: 'v2', byId: new Map([['deck', { ...deck, title: 'New' }]]) }, 'deck')).deck.title, 'New');

console.log('CommuLingo presentation snapshot and resolver refresh passed');
process.exit(0);
