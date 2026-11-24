const crypto = require('crypto');
const { loadCommuLingoCatalog } = require('./shards');
const { loadCommuLingoPeople } = require('./people-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { stripStoryMarkers } = require('./story-markers');
const { hasFlag, flagSrc } = require('./flag-icons');
const { listDataDocuments } = require('./data-documents');
const { FATE_KINDS, fateDefaultLabel } = require('./person-card-validation');

// 쇼츠. 문제 없이 위로 넘기며 읽기만 하는 이야기 카드다(2026-11-23, 그 전의
// 「질문 → 탭해서 답」 카드를 대신함). 새 원고를 쓰지 않고 이미 있는 글을 세
// 갈래로 다시 보인다.
//
// - 편(episode): 강좌 한 편의 이야기를 쇼츠용으로 줄인 2~4장(데이터 문서
//   shorts/<강좌 id>, shorts-scenes.js). 강좌의 장면 카드(storyCards)는 길어서
//   그대로 쓰지 않고, 짧은 판이 없는 편은 피드에 나오지 않는다.
// - 인물: 인물 카드의 「결정적 순간」(moment).
// - 오늘의 역사: 사건 연표에서 시작일의 월·일이 그날인 줄.
// - 오늘의 인물: 생일이나 사망일(년·월·일까지 있는 것)의 월·일이 그날인 인물.
//   무작위 인물보다 먼저 나오고, 카드에 출생/사망(사인) 아이콘이 붙는다.
//
// 응답(GET /commulingo/drill/shorts/feed/<key>: e<n> 편, p<n> 인물 묶음,
// d<MM-DD> 오늘의 역사와 오늘의 인물)은 언어와 세션에 무관한 이중 언어 JSON이고 ?v=로
// 캐시된다. 섞는 순서는 클라이언트 몫이다.

const PEOPLE_PER_BUCKET = 40;
// 한 화면 한도(한글). 짧은 것은 내용이 없고 긴 것은 카드에 넘친다.
const MOMENT_MIN = 40;
const MOMENT_MAX = 260;
const TODAY_BODY_MAX = 200;

function pair(value) {
    return value && value.ko && value.en ? { ko: value.ko, en: value.en } : null;
}

function plainPair(value) {
    const p = pair(value);
    return p ? { ko: stripStoryMarkers(p.ko).trim(), en: stripStoryMarkers(p.en).trim() } : null;
}

// ------------------------------------------------------------------ 편

// 짧은 장면 카드 [{ when, title, text }] 두 언어 -> 피드 카드.
function sceneCards(short) {
    const ko = short && short.ko;
    const en = short && short.en;
    if (!Array.isArray(ko) || !Array.isArray(en) || ko.length !== en.length) return [];
    return ko.map((card, index) => ({
        when: { ko: card.when, en: en[index].when },
        title: { ko: card.title, en: en[index].title },
        lines: { ko: [card.text], en: [en[index].text] },
    }));
}

function episodes(shortDocs) {
    const catalog = loadCommuLingoCatalog();
    const out = [];
    for (const collection of catalog.collections || []) {
        const short = shortDocs.get('shorts/' + collection.id);
        const shortEpisodes = (short && short.episodes) || {};
        for (const chapter of collection.chapters || []) {
            const first = (chapter.lessons || [])[0];
            const scenes = first ? sceneCards(shortEpisodes[first.id]) : [];
            if (scenes.length < 2) continue;
            out.push({
                id: first.id,
                course: pair(collection.title),
                title: pair(chapter.title),
                number: chapter.chapterNumber || null,
                href: '/commulingo/book/' + encodeURIComponent(collection.id) + '#lesson=' + encodeURIComponent(first.id),
                scenes,
            });
        }
    }
    return out;
}

// ------------------------------------------------------------------ 인물

function personCards(people) {
    const out = [];
    for (const person of people || []) {
        const moment = pair(person.moment);
        const name = pair(person.name);
        if (!moment || !name) continue;
        if (moment.ko.length < MOMENT_MIN || moment.ko.length > MOMENT_MAX) continue;
        const code = person.citizenship && person.citizenship.code;
        out.push({
            id: person.id,
            name,
            years: person.years || '',
            epithet: pair(person.epithet),
            moment,
            flag: code && hasFlag(code) ? { src: flagSrc(code), label: pair(person.citizenship.label) } : null,
            href: '/commulingo/people/' + encodeURIComponent(person.id),
            birth: fullDate(person.lifeDates && person.lifeDates.birth),
            death: fullDate(person.lifeDates && person.lifeDates.death),
            fate: fateCard(person.fate),
        });
    }
    return out;
}

// 사인: 라벨이 비면 kind의 기본 라벨(「처형」).
function fateCard(fate) {
    if (!fate || !FATE_KINDS[fate.kind]) return null;
    const label = pair(fate.label) || { ko: fateDefaultLabel(fate.kind, 'ko'), en: fateDefaultLabel(fate.kind, 'en') };
    return { kind: fate.kind, label };
}

// [년, 월, 일]이 다 있을 때만. 달까지만 아는 날은 「오늘」에 걸 수 없다.
function fullDate(value) {
    return Array.isArray(value) && value.length === 3 && value.every(Number.isInteger) ? value : null;
}

function dayKey(date) {
    return String(date[1]).padStart(2, '0') + '-' + String(date[2]).padStart(2, '0');
}

// 'MM-DD' -> 그날 태어났거나 죽은 인물 카드. on: ['birth'] / ['death'] / 둘 다.
function todayPeopleIndex(cards) {
    const byDay = new Map();
    for (const card of cards || []) {
        const keys = new Map();
        for (const on of ['birth', 'death']) {
            if (!card[on]) continue;
            const key = dayKey(card[on]);
            if (!keys.has(key)) keys.set(key, []);
            keys.get(key).push(on);
        }
        for (const [key, on] of keys) {
            if (!byDay.has(key)) byDay.set(key, []);
            byDay.get(key).push({ ...card, on });
        }
    }
    return byDay;
}

// ------------------------------------------------------------ 오늘의 역사

// 'MM-DD' -> 그날 시작한 연표 줄. 해가 오랜 것부터.
function todayIndex(events) {
    const byDay = new Map();
    for (const event of events || []) {
        const eventTitle = pair(event.title);
        if (!eventTitle) continue;
        (event.timeline || []).forEach(row => {
            const start = row && row.period && row.period.start;
            if (!Array.isArray(start) || start.length !== 3) return;
            const title = plainPair(row.title);
            const body = plainPair(row.body);
            if (!title || !body || body.ko.length > TODAY_BODY_MAX) return;
            const key = dayKey(start);
            if (!byDay.has(key)) byDay.set(key, []);
            byDay.get(key).push({
                date: start,
                title,
                body,
                event: eventTitle,
                href: '/commulingo/events/' + encodeURIComponent(event.id),
            });
        });
    }
    for (const rows of byDay.values()) rows.sort((a, b) => a.date[0] - b.date[0]);
    return byDay;
}

// ------------------------------------------------------------------ 조립

let cache = null; // { catalog, people, events, shortsKey, value }

function digest(value) {
    return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
}

async function loadCommuLingoShorts() {
    const catalog = loadCommuLingoCatalog();
    const peopleLoaded = await loadCommuLingoPeople();
    const events = await loadCommuLingoHistoryEvents();
    const people = peopleLoaded && peopleLoaded.data && peopleLoaded.data.people;
    const shortEntries = listDataDocuments('shorts/');
    const shortsKey = shortEntries.map(entry => entry.key + '@' + entry.revision).join(',');
    if (cache && cache.catalog === catalog && cache.people === people && cache.events === events && cache.shortsKey === shortsKey) return cache.value;

    const episodeList = episodes(new Map(shortEntries.map(entry => [entry.key, entry.content])));
    const persons = personCards(people);
    const peopleBuckets = [];
    for (let i = 0; i < persons.length; i += PEOPLE_PER_BUCKET) peopleBuckets.push(persons.slice(i, i + PEOPLE_PER_BUCKET));
    const days = todayIndex(events);
    const peopleDays = todayPeopleIndex(persons);

    const version = digest([episodeList, peopleBuckets, Array.from(days)]);
    const episodeBodies = episodeList.map(episode => JSON.stringify({ version, episode }));
    const peopleBodies = peopleBuckets.map(cards => JSON.stringify({ version, cards }));
    const value = {
        version,
        episodeCount: episodeList.length,
        peopleBucketCount: peopleBuckets.length,
        sceneCount: episodeList.reduce((sum, episode) => sum + episode.scenes.length, 0),
        personCount: persons.length,
        // 'e3' 편, 'p0' 인물 묶음, 'd11-23' 오늘의 역사·오늘의 인물; 모르는 키는 null.
        feedBody: key => {
            const match = /^(?:e(\d{1,4})|p(\d{1,4})|d(\d{2}-\d{2}))$/.exec(String(key || ''));
            if (!match) return null;
            if (match[1] !== undefined) return episodeBodies[Number(match[1])] || null;
            if (match[2] !== undefined) return peopleBodies[Number(match[2])] || null;
            return JSON.stringify({ version, day: match[3], rows: days.get(match[3]) || [], people: peopleDays.get(match[3]) || [] });
        },
    };
    cache = { catalog, people, events, shortsKey, value };
    return value;
}

module.exports = { loadCommuLingoShorts, personCards, todayIndex, todayPeopleIndex, sceneCards };
