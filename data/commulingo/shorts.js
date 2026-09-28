const crypto = require('crypto');
const { loadCommuLingoDrills } = require('./drills');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('./shards');
const { needsLessonContext } = require('./lesson-context');

// 훈련장 쇼츠. 강좌 문항과 훈련장 덱(용어·인물·사건)을 한 화면에 한 장씩 넘기는
// 짧은 카드로 다시 자른다. 새 원고를 쓰지 않고, 한 화면에 들어가지 않는 긴 문항은
// 자르는 대신 뺀다.
//
// 카드는 두 종류다.
// - flip: 앞면(용어)을 보고 뜻을 떠올린 뒤 뒤집어 확인하고 「알았다/몰랐다」를 고른다.
// - pick: 보기 두 개 중 하나를 탭한다. 보기 순서는 클라이언트가 섞는다(answer-first).
// 같은 개념의 flip과 pick은 같은 key를 갖고 같은 묶음에 들어간다. 클라이언트가
// flip 몇 장 뒤에 pick을 끼워 한 개념을 다른 형식으로 두 번 보게 한다.
//
// 피드는 결정적인 묶음(bucket)으로 나눠 준다. 묶음 JSON은 언어·세션과 무관하고
// ?v=로 캐시되며, 무작위 순서는 클라이언트가 묶음 순서와 카드 순서를 섞어 만든다.

const BUCKET_COURSE = 20;
const PEOPLE_PER_BUCKET = 6;
const EVENTS_PER_BUCKET = 4;
const TERMS_PER_BUCKET = 8;

// 한 화면 한도. 영어는 같은 내용이 한글보다 두 배 남짓 길다.
const LIMITS = {
    prompt: 130,
    choice: 70,
    explanation: 240,
    quote: 170,
    flipBack: 200,
};

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

function seededShuffle(seedKey, items) {
    const rand = mulberry32(hashString(seedKey));
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function fits(value, limit) {
    return Boolean(value && value.ko && value.en
        && value.ko.length <= limit && value.en.length <= limit * 2.2);
}

// 문장 경계에서 한도 안으로 줄인다. 첫 문장부터 한도를 넘으면 null.
function leadSentences(text, limit) {
    const s = String(text || '').trim();
    if (s.length <= limit) return s;
    const sentences = s.match(/[^.!?。]+[.!?。]+(?:[\s」"')\]]+|$)/g) || [];
    let out = '';
    for (const sentence of sentences) {
        if ((out + sentence).trim().length > limit) break;
        out += sentence;
    }
    return out.trim() || null;
}

function leadPair(value, limit) {
    const ko = leadSentences(value && value.ko, limit);
    const en = leadSentences(value && value.en, Math.round(limit * 2.2));
    return ko && en ? { ko, en } : null;
}

function pickCard({ id, key, topic, prompt, quoteHeading, quote, correct, distractor, explanation, wrongNote, href }) {
    const card = {
        id,
        kind: 'pick',
        key,
        topic,
        prompt,
        choices: { ko: [correct.ko, distractor.ko], en: [correct.en, distractor.en] },
        answer: 0,
        explanation,
    };
    if (quoteHeading) card.quoteHeading = quoteHeading;
    if (quote) card.quote = quote;
    if (wrongNote) card.wrongNote = wrongNote;
    if (href) card.href = href;
    return card;
}

// ------------------------------------------------------------ 강좌 문항

// 문항은 장 안에서 풀도록 쓰였다. 따로 떼어 낸 카드에서는 장 제목까지 보여야
// 「27장에서…」 같은 질문이 무엇을 묻는지 안다.
function courseTopic(collection, chapter) {
    const title = collection.title || {};
    const chapterTitle = chapter.title || {};
    const n = chapter.chapterNumber;
    return {
        ko: (title.ko || '') + (n ? ' · ' + n + '장' : '') + (chapterTitle.ko ? ' 「' + chapterTitle.ko + '」' : ''),
        en: (title.en || '') + (n ? ' · Ch. ' + n : '') + (chapterTitle.en ? ' “' + chapterTitle.en + '”' : ''),
    };
}

function courseCards() {
    const catalog = loadCommuLingoCatalog();
    const cards = [];
    for (const collection of catalog.collections || []) {
        for (const chapter of collection.chapters || []) {
            for (const meta of chapter.lessons || []) {
                const loaded = loadCommuLingoLesson(meta.id);
                const lesson = loaded && loaded.lesson;
                if (!lesson) continue;
                (lesson.questions || []).forEach(question => {
                    if (question.type !== 'multiple_choice') return;
                    if (!fits(question.prompt, LIMITS.prompt) || !fits(question.explanation, LIMITS.explanation)) return;
                    const answer = Number(question.answer) || 0;
                    const ko = question.choices && question.choices.ko;
                    const en = question.choices && question.choices.en;
                    if (!Array.isArray(ko) || !Array.isArray(en) || ko.length !== en.length) return;
                    if (needsLessonContext(question)) return;
                    const correct = { ko: ko[answer], en: en[answer] };
                    if (!fits(correct, LIMITS.choice)) return;
                    // 오답 중 한 화면에 들어가는 것 하나를 문항 id로 고정해 고른다.
                    const wrong = ko.map((_, index) => index)
                        .filter(index => index !== answer && fits({ ko: ko[index], en: en[index] }, LIMITS.choice));
                    if (!wrong.length) return;
                    const cardId = 'c-' + lesson.id + '-' + question.id;
                    const pickIndex = wrong[hashString(cardId) % wrong.length];
                    const feedback = question.choiceFeedback;
                    const wrongNote = feedback && feedback.ko && feedback.en
                        && fits({ ko: feedback.ko[pickIndex], en: feedback.en[pickIndex] }, LIMITS.explanation)
                        ? { ko: feedback.ko[pickIndex], en: feedback.en[pickIndex] }
                        : null;
                    cards.push(pickCard({
                        id: cardId,
                        key: cardId,
                        topic: courseTopic(collection, chapter),
                        prompt: question.prompt,
                        correct,
                        distractor: { ko: ko[pickIndex], en: en[pickIndex] },
                        explanation: question.explanation,
                        wrongNote,
                        href: '/commulingo/book/' + encodeURIComponent(collection.id) + '#lesson=' + encodeURIComponent(lesson.id),
                    }));
                });
            }
        }
    }
    return cards;
}

// ------------------------------------------------------- 훈련장 덱 문항

// 덱 문항(4지선다, answer-first)을 2지선다 pick으로. 오답은 덱이 이미 시기·갈래가
// 가까운 것으로 골라 두었으므로 첫 오답을 그대로 쓴다.
function deckPick(question, topic, quote) {
    const choices = question.choices;
    return pickCard({
        id: 'd-' + question.id,
        key: question.id,
        topic,
        prompt: question.prompt,
        quoteHeading: question.quoteHeading && question.quoteHeading.ko ? question.quoteHeading : null,
        quote,
        correct: { ko: choices.ko[0], en: choices.en[0] },
        distractor: { ko: choices.ko[1], en: choices.en[1] },
        explanation: question.explanation,
        href: question.href,
    });
}

// 용어는 flip(용어 → 뜻)과 pick(뜻 → 용어) 한 쌍. 정의가 길면 앞 문장만 쓴다.
function termPairs(drills) {
    const pairs = [];
    for (const deck of drills.byId.values()) {
        if (deck.group !== 'terms' || deck.kind !== 'quiz') continue;
        for (const question of deck.questions) {
            const back = leadPair(question.quote, LIMITS.flipBack);
            const quote = leadPair(question.quote, LIMITS.quote);
            if (!back || !quote) continue;
            const topic = { ko: '용어 · ' + deck.title.ko, en: 'Term · ' + deck.title.en };
            const flip = {
                id: 'f-' + question.id,
                kind: 'flip',
                key: question.id,
                topic,
                front: { ko: question.choices.ko[0], en: question.choices.en[0] },
                back,
                href: question.href,
            };
            pairs.push([flip, deckPick(question, topic, quote)]);
        }
    }
    return pairs;
}

function deckPicks(drills, group, deckIds) {
    const cards = [];
    for (const deck of drills.byId.values()) {
        if (deck.kind !== 'quiz' || (group ? deck.group !== group : !deckIds.includes(deck.id))) continue;
        const label = group === 'people'
            ? { ko: '인물 · ' + deck.title.ko, en: 'People · ' + deck.title.en }
            : { ko: '사건 · ' + deck.title.ko, en: 'Events · ' + deck.title.en };
        for (const question of deck.questions) {
            if (!fits(question.quote, LIMITS.quote) || !fits(question.explanation, LIMITS.explanation)) continue;
            if (!fits({ ko: question.choices.ko[1], en: question.choices.en[1] }, LIMITS.choice)) continue;
            cards.push(deckPick(question, label, question.quote));
        }
    }
    return cards;
}

// ------------------------------------------------------------------ 조립

function spread(items, bucketCount, perBucket) {
    const buckets = Array.from({ length: bucketCount }, () => []);
    items.slice(0, bucketCount * perBucket).forEach((item, index) => {
        buckets[index % bucketCount].push(item);
    });
    return buckets;
}

let cache = null; // { drillsVersion, catalog, value }

async function loadCommuLingoShorts() {
    const drills = await loadCommuLingoDrills();
    const catalog = loadCommuLingoCatalog();
    if (cache && cache.drillsVersion === drills.version && cache.catalog === catalog) return cache.value;

    const course = seededShuffle('shorts-course', courseCards());
    const bucketCount = Math.max(1, Math.ceil(course.length / BUCKET_COURSE));
    const courseBuckets = spread(course, bucketCount, BUCKET_COURSE);
    const termBuckets = spread(seededShuffle('shorts-terms', termPairs(drills)), bucketCount, TERMS_PER_BUCKET);
    const peopleBuckets = spread(seededShuffle('shorts-people', deckPicks(drills, 'people')), bucketCount, PEOPLE_PER_BUCKET);
    const eventBuckets = spread(seededShuffle('shorts-events', deckPicks(drills, null, ['event-scenes', 'event-people'])),
        bucketCount, EVENTS_PER_BUCKET);

    const buckets = courseBuckets.map((cards, index) => cards
        .concat(termBuckets[index].flat(), peopleBuckets[index], eventBuckets[index]));
    const version = crypto.createHash('sha256').update(JSON.stringify(buckets)).digest('hex').slice(0, 16);
    const bodies = buckets.map(cards => JSON.stringify({ version, cards }));
    const value = {
        version,
        bucketCount,
        cardCount: buckets.reduce((sum, cards) => sum + cards.length, 0),
        bucketBody: index => bodies[index] || null,
    };
    cache = { drillsVersion: drills.version, catalog, value };
    return value;
}

module.exports = { loadCommuLingoShorts, leadSentences };
