const crypto = require('crypto');
const { loadCommuLingoTerms } = require('./terms-store');
const { loadCommuLingoPeople } = require('./people-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { loadTermCategories } = require('./term-categories');
const { parseLifeYears } = require('./people-standard');

// 훈련장 문제 은행. 사전 스토어(용어·인물·사건)를 읽어 4지선다 덱과 연표 게임
// 풀을 만든다. 파일을 쓰지 않고 스냅숏 참조에 메모이즈하므로, 사전이 갱신되면
// 다음 요청에서 자동으로 다시 만들어진다 (termScanMemo 등과 같은 관용구).
//
// 오답(distractor)은 무작위가 아니라 결정적이다: 문항 id를 시드로 한 PRNG로
// 뽑아 데이터가 같으면 항상 같은 덱이 나오고, version(내용 해시)이 안정되어
// ?v= 캐싱이 성립한다. 보기 순서 섞기는 레슨 플레이어와 같이 클라이언트 몫.
//
// 프롬프트·보기에는 링크를 넣지 않는다(레슨과 같은 이유: 링크가 답을 가리킬
// 수 있다). 해설의 사전 링크는 href 필드로만 전달한다.

const QUIZ_ROUND_SIZE = 10;
const TIMELINE_ROUND_SIZE = 5;
// 한 덱의 문항 상한. 인물 무리 하나가 400문항을 넘으면 JSON이 500KB를 넘어
// 모바일 첫 로드가 무거워진다. 상한 초과분은 시드 고정 표본으로 줄인다.
const DECK_QUESTION_CAP = 240;

function hashString(value) {
    let h = 2166136261;
    const s = String(value);
    for (let i = 0; i < s.length; i += 1) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return function next() {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function seededPick(seedKey, items, count) {
    const rand = mulberry32(hashString(seedKey));
    const pool = items.slice();
    const out = [];
    while (pool.length && out.length < count) {
        out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
    }
    return out;
}

function loc(value) {
    if (!value) return { ko: '', en: '' };
    if (typeof value === 'string') return { ko: value, en: value };
    return { ko: value.ko || '', en: value.en || '' };
}

// 표제어에서 괄호 주석을 뗀 머리와, 괄호 안 약칭까지 함께 돌려준다.
// 「외국인직접투자 (FDI)」 → ['외국인직접투자', 'FDI'] — 어느 쪽이 정의문에
// 나와도 답이 드러난 문제라서 걸러야 한다.
function headParts(label) {
    const s = String(label || '').trim();
    const parts = [];
    const head = s.replace(/\s*\(([^)]*)\)\s*$/, (m, inner) => {
        if (inner.trim().length >= 2) parts.push(inner.trim());
        return '';
    }).trim();
    if (head.length >= 2) parts.unshift(head);
    return parts;
}

function textContainsAny(text, parts, caseless) {
    const hay = caseless ? String(text || '').toLowerCase() : String(text || '');
    return parts.some(part => {
        if (!part || part.length < 2) return false;
        return hay.includes(caseless ? part.toLowerCase() : part);
    });
}

function firstSentence(text) {
    const s = String(text || '').trim();
    const m = /^[\s\S]*?[.!?](?=[\s」"')\]]|$)/.exec(s);
    return m ? m[0].trim() : s;
}

function distinctLabelPush(seenKo, seenEn, item) {
    const ko = item.label.ko.trim();
    const en = item.label.en.trim().toLowerCase();
    if (!ko || !en || seenKo.has(ko) || seenEn.has(en)) return false;
    seenKo.add(ko);
    seenEn.add(en);
    return true;
}

// answer-first(정답이 0번) 4지선다 한 문항. 라벨이 겹치는 오답은 버리고 3개를
// 못 채우면 null — 호출자가 문항을 건너뛴다.
function buildChoiceQuestion({ id, prompt, quote, quoteHeading, correct, distractors, explanation, href }) {
    const seenKo = new Set();
    const seenEn = new Set();
    if (!distinctLabelPush(seenKo, seenEn, correct)) return null;
    const chosen = [];
    for (const item of distractors) {
        if (chosen.length >= 3) break;
        if (distinctLabelPush(seenKo, seenEn, item)) chosen.push(item);
    }
    if (chosen.length < 3) return null;
    const all = [correct].concat(chosen);
    return {
        id,
        type: 'multiple_choice',
        prompt: loc(prompt),
        quoteHeading: quoteHeading ? loc(quoteHeading) : null,
        quote: loc(quote),
        choices: { ko: all.map(item => item.label.ko), en: all.map(item => item.label.en) },
        answer: 0,
        explanation: loc(explanation),
        href,
    };
}

// ---------------------------------------------------------------- 용어 덱

function termEligibleForQuestion(term) {
    const def = loc(term.definition);
    if (def.ko.length < 60 || def.en.length < 60) return false;
    if (textContainsAny(def.ko, headParts(term.term && term.term.ko), false)) return false;
    if (textContainsAny(def.en, headParts(term.term && term.term.en), true)) return false;
    return true;
}

function termHeadsOverlap(a, b) {
    const aKo = headParts(a.term && a.term.ko)[0] || '';
    const bKo = headParts(b.term && b.term.ko)[0] || '';
    const aEn = (headParts(a.term && a.term.en)[0] || '').toLowerCase();
    const bEn = (headParts(b.term && b.term.en)[0] || '').toLowerCase();
    if (aKo && bKo && (aKo.includes(bKo) || bKo.includes(aKo))) return true;
    if (aEn && bEn && (aEn.includes(bEn) || bEn.includes(aEn))) return true;
    return false;
}

function termRelatedIds(term) {
    const ids = new Set();
    if (term.parent && term.parent.id) ids.add(term.parent.id);
    (term.children || []).forEach(child => child && child.id && ids.add(child.id));
    (term.related || []).forEach(rel => rel && rel.id && ids.add(rel.id));
    return ids;
}

function yearDistance(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 500;
    return Math.abs(a - b);
}

function termChoice(term) {
    return { label: loc(term.term) };
}

function buildTermQuestion(term, categoryPool, allTerms) {
    const related = termRelatedIds(term);
    const usable = candidate => candidate.id !== term.id
        && !related.has(candidate.id)
        && !termHeadsOverlap(term, candidate);
    // 같은 갈래에서 시기가 가까운 용어가 먼저, 모자라면 전체에서 채운다.
    const near = pool => pool.filter(usable)
        .sort((a, b) => yearDistance(term.startYear, a.startYear) - yearDistance(term.startYear, b.startYear));
    let candidates = near(categoryPool).slice(0, 8);
    if (candidates.length < 3) {
        const have = new Set(candidates.map(item => item.id));
        candidates = candidates.concat(near(allTerms).filter(item => !have.has(item.id)).slice(0, 8 - candidates.length));
    }
    const period = loc(term.period);
    const original = term.original && String(term.original).trim();
    return buildChoiceQuestion({
        id: 't-' + term.id,
        prompt: {
            ko: '다음 설명이 가리키는 용어는 무엇인가?',
            en: 'Which term does this description define?',
        },
        quote: term.definition,
        correct: termChoice(term),
        distractors: seededPick('t-' + term.id, candidates, 3).map(termChoice),
        explanation: {
            ko: '「' + loc(term.term).ko + '」' + (original ? ' (' + original + ')' : '') + (period.ko ? ' · ' + period.ko : ''),
            en: '"' + loc(term.term).en + '"' + (original ? ' (' + original + ')' : '') + (period.en ? ' · ' + period.en : ''),
        },
        href: '/commulingo/terms/' + encodeURIComponent(term.id),
    });
}

function buildTermDecks(terms, categories) {
    return categories.map(category => {
        const pool = terms.filter(term => term.category === category.id);
        const questions = pool
            .filter(termEligibleForQuestion)
            .map(term => buildTermQuestion(term, pool, terms))
            .filter(Boolean);
        if (questions.length < 5) return null;
        return {
            id: 'terms-' + category.id,
            kind: 'quiz',
            group: 'terms',
            title: { ko: category.ko, en: category.en },
            // cardNote 없음: 허브에서는 「용어 사전」 묶음 제목 아래 놓여
            // 갈래 이름과 문항 수만으로 충분하다. description은 덱 페이지 몫.
            description: {
                ko: '용어 사전 「' + category.ko + '」 갈래에서 출제합니다.',
                en: 'Drawn from the "' + category.en + '" section of the glossary.',
            },
            roundSize: QUIZ_ROUND_SIZE,
            questions,
        };
    }).filter(Boolean);
}

// ---------------------------------------------------------------- 인물 덱

function personNameParts(person) {
    const parts = [];
    [person.name, person.familyName, person.givenName].forEach(value => {
        const v = loc(value);
        if (v.ko) parts.push(v.ko);
        if (v.en) parts.push(v.en);
    });
    if (person.cyrillic) parts.push(String(person.cyrillic));
    return parts.filter(part => part && part.length >= 2);
}

function quoteNamesPerson(quoteText, person) {
    const parts = personNameParts(person);
    return textContainsAny(quoteText.ko, parts, false) || textContainsAny(quoteText.en, parts, true);
}

function personChoice(person) {
    return { label: loc(person.name) };
}

function buildPersonQuestion(person, groupPool, allPeople) {
    const epithet = loc(person.epithet);
    const moment = loc(person.moment);
    const momentOk = moment.ko.length >= 20 && moment.en.length >= 20 && !quoteNamesPerson(moment, person);
    const epithetOk = epithet.ko.length >= 10 && epithet.en.length >= 10 && !quoteNamesPerson(epithet, person);
    let style = null;
    if (momentOk && hashString('style-' + person.id) % 2 === 0) style = 'moment';
    else if (epithetOk) style = 'epithet';
    else if (momentOk) style = 'moment';
    if (!style) return null;
    const quote = style === 'moment' ? moment : epithet;

    const birthYear = parseLifeYears(person.years).birthYear;
    const usable = candidate => candidate.id !== person.id && !quoteNamesPerson(quote, candidate);
    const near = pool => pool.filter(usable)
        .sort((a, b) => yearDistance(birthYear, parseLifeYears(a.years).birthYear)
            - yearDistance(birthYear, parseLifeYears(b.years).birthYear));
    let candidates = near(groupPool).slice(0, 10);
    if (candidates.length < 3) {
        const have = new Set(candidates.map(item => item.id));
        candidates = candidates.concat(near(allPeople).filter(item => !have.has(item.id)).slice(0, 10 - candidates.length));
    }

    const name = loc(person.name);
    const years = person.years ? ' (' + person.years + ')' : '';
    const bio = loc(person.bio);
    const tail = style === 'moment'
        ? epithet
        : { ko: firstSentence(bio.ko), en: firstSentence(bio.en) };
    return buildChoiceQuestion({
        id: 'p-' + person.id,
        prompt: style === 'moment'
            ? { ko: '이 장면의 주인공은 누구인가?', en: 'Who is the person in this moment?' }
            : { ko: '다음 소개가 가리키는 인물은 누구인가?', en: 'Which person does this introduction describe?' },
        quote,
        correct: personChoice(person),
        distractors: seededPick('p-' + person.id, candidates, 3).map(personChoice),
        explanation: {
            ko: name.ko + years + (tail.ko ? ' · ' + tail.ko : ''),
            en: name.en + years + (tail.en ? ' · ' + tail.en : ''),
        },
        href: '/commulingo/people/' + encodeURIComponent(person.id),
    });
}

function buildPeopleDecks(peopleData) {
    const people = peopleData.people || [];
    const groups = peopleData.groups || [];
    return groups.map(group => {
        const pool = people.filter(person => person.group === group.id);
        const questions = pool
            .map(person => buildPersonQuestion(person, pool, people))
            .filter(Boolean);
        if (questions.length < 5) return null;
        const title = loc(group.title);
        return {
            id: 'people-' + group.id,
            kind: 'quiz',
            group: 'people',
            title,
            cardNote: group.range ? { ko: group.range, en: group.range } : null,
            description: {
                ko: (group.range ? group.range + ' · ' : '') + '인물 사전 「' + title.ko + '」 무리에서 출제합니다.',
                en: (group.range ? group.range + ' · ' : '') + 'Drawn from the "' + title.en + '" group of the people dictionary.',
            },
            roundSize: QUIZ_ROUND_SIZE,
            questions,
        };
    }).filter(Boolean);
}

// ---------------------------------------------------------------- 사건 덱

function eventYears(event) {
    const period = String(event.period || '');
    const start = Number.parseInt(period, 10);
    const endMatch = /(\d{4})\s*$/.exec(period);
    const end = endMatch ? Number.parseInt(endMatch[1], 10) : start;
    return { start: Number.isFinite(start) ? start : null, end: Number.isFinite(end) ? end : null };
}

function periodsOverlap(a, b) {
    if (a.start === null || b.start === null) return false;
    return a.start <= b.end && b.start <= a.end;
}

function eventChoice(event) {
    return { label: loc(event.title) };
}

// 시기가 겹치는 사건은 오답으로 쓰지 않는다. 한 장면이 두 사건 어느 쪽에도
// 속한다고 우길 수 있는 보기를 만들지 않기 위해서다. 겹치지 않는 것 중
// 시기가 가까운 사건이 좋은 오답이다.
function eventDistractors(event, events, seedKey) {
    const mine = eventYears(event);
    const candidates = events
        .filter(other => other.id !== event.id && !periodsOverlap(mine, eventYears(other)))
        .sort((a, b) => yearDistance(mine.start, eventYears(a).start) - yearDistance(mine.start, eventYears(b).start))
        .slice(0, 6);
    return seededPick(seedKey, candidates, 3).map(eventChoice);
}

function eventTitleGiveaway(event, textLoc) {
    const title = loc(event.title);
    return (title.ko && textLoc.ko.includes(title.ko))
        || (title.en && textLoc.en.toLowerCase().includes(title.en.toLowerCase()));
}

function buildEventSceneDeck(events) {
    const questions = [];
    events.forEach(event => {
        const entries = (event.timeline || []).filter(entry => {
            const body = loc(entry.body);
            const title = loc(entry.title);
            if (body.ko.length < 40 || body.en.length < 40 || !title.ko || !title.en) return false;
            if (eventTitleGiveaway(event, { ko: title.ko + ' ' + body.ko, en: title.en + ' ' + body.en })) return false;
            return true;
        });
        const summary = loc(event.summary);
        const period = String(event.period || '');
        seededPick('scenes-' + event.id, entries, 5).forEach(entry => {
            const question = buildChoiceQuestion({
                id: 'es-' + event.id + '-' + hashString(loc(entry.title).ko + loc(entry.body).ko),
                prompt: {
                    ko: '다음 장면은 어느 역사 사건에 속하는가?',
                    en: 'Which historical event does this scene belong to?',
                },
                quoteHeading: entry.title,
                quote: entry.body,
                correct: eventChoice(event),
                distractors: eventDistractors(event, events, 'es-' + event.id + '-' + loc(entry.title).ko),
                explanation: {
                    ko: '「' + loc(event.title).ko + '」 (' + period + ') · ' + firstSentence(summary.ko),
                    en: '"' + loc(event.title).en + '" (' + period + ') · ' + firstSentence(summary.en),
                },
                href: '/commulingo/events/' + encodeURIComponent(event.id),
            });
            if (question) questions.push(question);
        });
    });
    if (questions.length < 5) return null;
    return {
        id: 'event-scenes',
        kind: 'quiz',
        group: 'events',
        title: { ko: '사건의 장면들', en: 'Scenes from events' },
        description: {
            ko: '연표의 한 장면을 읽고 어느 사건인지 맞혀 보세요.',
            en: 'Read one scene from a timeline and name the event it belongs to.',
        },
        roundSize: QUIZ_ROUND_SIZE,
        questions,
    };
}

function buildEventPeopleDeck(events) {
    // 오답을 같은 배역(kind)에서 먼저 뽑기 위한 전 사건 인물 풀.
    const byKind = new Map();
    const seenPerson = new Set();
    events.forEach(event => (event.people || []).forEach(person => {
        if (!person || !person.id || seenPerson.has(person.id)) return;
        seenPerson.add(person.id);
        const kind = person.kind || 'unclassified';
        (byKind.get(kind) || byKind.set(kind, []).get(kind)).push(person);
    }));

    const questions = [];
    events.forEach(event => {
        const cast = (event.people || []).filter(person => person && person.id);
        const eligible = cast.filter(person => {
            const note = loc(person.note);
            return note.ko.length >= 40 && note.en.length >= 40 && !quoteNamesPerson(note, person);
        });
        seededPick('ep-' + event.id, eligible, 6).forEach(person => {
            const note = loc(person.note);
            const usable = candidate => candidate.id !== person.id && !quoteNamesPerson(note, candidate);
            let candidates = cast.filter(other => other.kind === person.kind && usable(other));
            if (candidates.length < 3) {
                const have = new Set(candidates.map(item => item.id));
                candidates = candidates.concat(cast.filter(other => !have.has(other.id) && usable(other)));
            }
            if (candidates.length < 3) {
                const have = new Set(candidates.map(item => item.id).concat(person.id));
                const global = (byKind.get(person.kind || 'unclassified') || []).filter(other => !have.has(other.id) && usable(other));
                candidates = candidates.concat(global.slice(0, 8));
            }
            const relation = loc(person.relation);
            const years = person.years ? ' (' + person.years + ')' : '';
            const question = buildChoiceQuestion({
                id: 'ep-' + event.id + '-' + person.id,
                prompt: {
                    ko: '「' + loc(event.title).ko + '」 속 이 인물은 누구인가?',
                    en: 'Who is this figure in "' + loc(event.title).en + '"?',
                },
                quote: person.note,
                correct: { label: loc(person.name) },
                distractors: seededPick('ep-' + event.id + '-' + person.id, candidates, 3)
                    .map(other => ({ label: loc(other.name) })),
                explanation: {
                    ko: loc(person.name).ko + years + (relation.ko ? ' · ' + relation.ko : ''),
                    en: loc(person.name).en + years + (relation.en ? ' · ' + relation.en : ''),
                },
                href: '/commulingo/people/' + encodeURIComponent(person.id),
            });
            if (question) questions.push(question);
        });
    });
    if (questions.length < 5) return null;
    return {
        id: 'event-people',
        kind: 'quiz',
        group: 'events',
        title: { ko: '사건 속 인물', en: 'People in events' },
        description: {
            ko: '사건 기록에 적힌 활동을 읽고 누구인지 맞혀 보세요.',
            en: 'Read what someone did in an event and name the person.',
        },
        roundSize: QUIZ_ROUND_SIZE,
        questions,
    };
}

// ------------------------------------------------------------- 연표 게임

function buildTimelineDecks(events) {
    const eventPool = events.map(event => {
        const years = eventYears(event);
        if (years.start === null) return null;
        return {
            id: event.id,
            title: loc(event.title),
            period: String(event.period || ''),
            year: years.start,
            href: '/commulingo/events/' + encodeURIComponent(event.id),
        };
    }).filter(Boolean);

    const episodePool = events.map(event => {
        const entries = (event.timeline || [])
            .filter(entry => entry.date && loc(entry.title).ko && loc(entry.title).en)
            .map(entry => ({ title: loc(entry.title), date: String(entry.date) }));
        if (entries.length < TIMELINE_ROUND_SIZE + 1) return null;
        return {
            eventId: event.id,
            title: loc(event.title),
            period: String(event.period || ''),
            href: '/commulingo/events/' + encodeURIComponent(event.id),
            entries,
        };
    }).filter(Boolean);

    const decks = [];
    if (eventPool.length >= TIMELINE_ROUND_SIZE * 2) {
        decks.push({
            id: 'timeline-events',
            kind: 'timeline',
            mode: 'events',
            group: 'timeline',
            title: { ko: '사건 순서 맞추기', en: 'Order the events' },
            description: {
                ko: '역사 사건 다섯 개를 일어난 순서대로 배열해 보세요.',
                en: 'Arrange five historical events in the order they happened.',
            },
            roundSize: TIMELINE_ROUND_SIZE,
            pool: eventPool,
        });
    }
    if (episodePool.length >= 3) {
        decks.push({
            id: 'timeline-episodes',
            kind: 'timeline',
            mode: 'episodes',
            group: 'timeline',
            title: { ko: '전개 순서 맞추기', en: 'Order the episodes' },
            description: {
                ko: '한 사건 안의 다섯 장면을 시간 순서대로 배열해 보세요.',
                en: 'Arrange five episodes of one event in chronological order.',
            },
            roundSize: TIMELINE_ROUND_SIZE,
            pool: episodePool,
        });
    }
    return decks;
}

// ------------------------------------------------------------------ 조립

const GROUPS = [
    { id: 'terms', label: { ko: '용어 사전', en: 'Glossary' } },
    { id: 'people', label: { ko: '인물 사전', en: 'People' } },
    { id: 'events', label: { ko: '역사 사건', en: 'Historical events' } },
    { id: 'timeline', label: { ko: '연표 게임', en: 'Timeline games' } },
];

function deckCount(deck) {
    return deck.kind === 'timeline' ? deck.pool.length : deck.questions.length;
}

function capDeck(deck) {
    if (!deck || deck.kind !== 'quiz' || deck.questions.length <= DECK_QUESTION_CAP) return deck;
    return { ...deck, questions: seededPick('cap-' + deck.id, deck.questions, DECK_QUESTION_CAP) };
}

function deckMeta(deck) {
    return {
        id: deck.id,
        kind: deck.kind,
        mode: deck.mode || null,
        group: deck.group,
        title: deck.title,
        description: deck.description,
        // 허브 카드에 얹는 짧은 줄. 용어 덱은 묶음 제목+갈래 이름으로 충분해
        // 비워 두고, 인물 덱은 연대(range), 사건·연표 덱은 설명 그대로.
        cardNote: deck.cardNote || ((deck.group === 'events' || deck.group === 'timeline') ? deck.description : null),
        roundSize: deck.roundSize,
        count: deckCount(deck),
        countUnit: deck.kind === 'timeline'
            ? (deck.mode === 'episodes' ? { ko: '사건', en: 'events' } : { ko: '사건', en: 'events' })
            : { ko: '문항', en: 'questions' },
    };
}

let cache = null; // { termsRef, peopleRef, eventsRef, categoriesRef, value }

async function loadCommuLingoDrills() {
    const terms = await loadCommuLingoTerms();
    const peopleLoaded = await loadCommuLingoPeople();
    const peopleData = peopleLoaded.data || {};
    const events = await loadCommuLingoHistoryEvents();
    const categories = await loadTermCategories();
    if (cache && cache.termsRef === terms && cache.peopleRef === peopleData
        && cache.eventsRef === events && cache.categoriesRef === categories) {
        return cache.value;
    }

    const decks = [
        ...buildTermDecks(terms, categories),
        ...buildPeopleDecks(peopleData),
        buildEventSceneDeck(events),
        buildEventPeopleDeck(events),
        ...buildTimelineDecks(events),
    ].filter(Boolean).map(capDeck);

    const byId = new Map(decks.map(deck => [deck.id, deck]));
    const version = crypto.createHash('sha256')
        .update(JSON.stringify(decks))
        .digest('hex')
        .slice(0, 16);
    const groups = GROUPS
        .map(group => ({
            id: group.id,
            label: group.label,
            decks: decks.filter(deck => deck.group === group.id).map(deckMeta),
        }))
        .filter(group => group.decks.length);

    const value = { version, groups, byId };
    cache = { termsRef: terms, peopleRef: peopleData, eventsRef: events, categoriesRef: categories, value };
    return value;
}

module.exports = { loadCommuLingoDrills };
