// The war games offered outside themselves: a card on the CommuLingo pages
// a scenario names (its promo: the whole war on its events, a battle on its
// terms and events and on the people who command on its board), the list
// of battles to play one at a time, and each battle's own page and share
// image. Built once from the published scenarios (services/war-map.js).
const { SCENARIOS } = require('./war-map');

const MAX_CARDS = 2;

// A picture of the scenario as an <img>'s attributes: the small file when
// there is one (the cards are small), the full one otherwise.
function pictureOf(D, name) {
    const p = D.pictures && D.pictures[name];
    if (!p) return null;
    const src = `${D.pictureDir}${name}-v1${p.sm ? '-sm' : ''}.webp`;
    return { src, alt: p.caption, w: p.w, h: p.h };
}

const gameUrl = D => `/games/${D.id}/`;
const battleUrl = (D, id) => `/games/${D.id}/battle/${id}/`;
// The share image (scripts/war-og-images.py): the whole war's, or a battle's.
const ogImage = (D, id) => `${D.pictureDir}og-${id || 'game'}.jpg`;

// One battle as its card and page show it.
function battleOf(D, id) {
    const b = D.battles[id];
    const promo = D.promo.battles[id];
    return {
        scenario: D.id, game: D.title, id, title: b.title, date: b.date, turns: b.turnLimit,
        pitch: promo.pitch, picture: pictureOf(D, promo.picture), url: battleUrl(D, id), image: ogImage(D, id),
    };
}

function wholeOf(D) {
    return {
        scenario: D.id, game: D.title, id: null, title: D.title, pitch: D.promo.pitch,
        picture: pictureOf(D, D.promo.picture), url: gameUrl(D), image: ogImage(D),
        battles: Object.keys(D.promo.battles).length,
    };
}

// kind ('events', 'terms', 'people') → id → cards, in the scenario's order.
function buildIndex(scenarios) {
    const index = { events: new Map(), terms: new Map(), people: new Map() };
    const add = (kind, id, card) => {
        if (!index[kind].has(id)) index[kind].set(id, []);
        const list = index[kind].get(id);
        if (!list.some(c => c.scenario === card.scenario && c.id === card.id)) list.push(card);
    };
    for (const D of Object.values(scenarios)) {
        if (!D.promo) continue;
        for (const id of D.promo.events || []) add('events', id, wholeOf(D));
        for (const bid of Object.keys(D.promo.battles)) {
            const card = battleOf(D, bid);
            const promo = D.promo.battles[bid];
            for (const id of promo.terms || []) add('terms', id, card);
            for (const id of promo.events || []) add('events', id, card);
            for (const u of D.battles[bid].units) if (u.person) add('people', u.person[1], card);
        }
    }
    return index;
}

const INDEX = buildIndex(SCENARIOS);

// The cards for a CommuLingo page (kind: 'events', 'terms', 'people'): at
// most two, the games being Korean only.
function promosFor(kind, id, lang) {
    if (lang === 'en' || !INDEX[kind]) return [];
    return (INDEX[kind].get(id) || []).slice(0, MAX_CARDS);
}

// The cards for a page that shows more than one entry (an event with its
// paired term): [[kind, id], ...], each card once, at most two.
function promosForAll(keys, lang) {
    const out = [];
    for (const [kind, id] of keys) {
        for (const card of promosFor(kind, id, lang)) {
            if (!out.some(c => c.scenario === card.scenario && c.id === card.id)) out.push(card);
        }
    }
    return out.slice(0, MAX_CARDS);
}

// A scenario's battles to play one at a time, in its order.
function battlesOf(scenarioId) {
    const D = SCENARIOS[scenarioId];
    return D && D.promo ? Object.keys(D.promo.battles).map(id => battleOf(D, id)) : [];
}

// A battle's own page, or null when the scenario offers no such battle.
function battlePage(scenarioId, battleId) {
    const D = SCENARIOS[scenarioId];
    if (!D || !D.promo || !Object.hasOwn(D.promo.battles, battleId)) return null;
    return battleOf(D, battleId);
}

function gamePage(scenarioId) {
    const D = SCENARIOS[scenarioId];
    return D && D.promo ? wholeOf(D) : null;
}

module.exports = { promosFor, promosForAll, battlesOf, battlePage, gamePage, buildIndex, MAX_CARDS };
