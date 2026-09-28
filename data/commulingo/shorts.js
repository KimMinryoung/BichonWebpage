const crypto = require('crypto');
const { loadCommuLingoDrills } = require('./drills');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('./shards');
const { needsLessonContext } = require('./lesson-context');

// 훈련장 쇼츠. 강좌 문항과 훈련장 덱(용어·인물·사건)을 한 화면에 한 장씩 넘기는
// 짧은 카드로 다시 자른다. 새 원고를 쓰지 않고, 한 화면에 들어가지 않는 긴 문항은
// 자르는 대신 뺀다.
//
// 퀴즈가 아니다. 카드는 질문(용어는 「무슨 뜻일까?」)만 보여 주고, 탭하면 답과
// 해설이 열린다. 보기·채점·오답 재출제는 없다. 강좌 문항 가운데 보기가 있어야
// 뜻이 통하는 것(「고르라」「어느 쪽인가」)은 뺀다.
//
// 피드는 결정적인 묶음(bucket)으로 나눠 준다. 묶음 JSON은 언어·세션과 무관하고
// ?v=로 캐시되며, 무작위 순서는 클라이언트가 묶음 순서와 카드 순서를 섞어 만든다.

const BUCKET_COURSE = 20;
const PEOPLE_PER_BUCKET = 6;
const EVENTS_PER_BUCKET = 4;
const TERMS_PER_BUCKET = 8;

// 보기를 전제로 한 질문. 답만 보여 주면 말이 되지 않는다.
const NEEDS_CHOICES = /고르라|고르시오|어느 쪽인가|다음 중|않은 것은|아닌 것은|which of the following|\bNOT\b/i;

// 한 화면 한도. 영어는 같은 내용이 한글보다 두 배 남짓 길다.
const LIMITS = {
    prompt: 130,
    answer: 110,
    explanation: 240,
    quote: 170,
    definition: 200,
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

function revealCard({ id, topic, prompt, quoteHeading, quote, answer, explanation, href }) {
    const card = { id, topic, prompt, answer };
    if (quoteHeading) card.quoteHeading = quoteHeading;
    if (quote) card.quote = quote;
    if (explanation) card.explanation = explanation;
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
                    if (NEEDS_CHOICES.test(question.prompt.ko) || NEEDS_CHOICES.test(question.prompt.en)) return;
                    const correct = { ko: ko[answer], en: en[answer] };
                    if (!fits(correct, LIMITS.answer)) return;
                    const cardId = 'c-' + lesson.id + '-' + question.id;
                    cards.push(revealCard({
                        id: cardId,
                        topic: courseTopic(collection, chapter),
                        prompt: question.prompt,
                        answer: correct,
                        explanation: question.explanation,
                        href: '/commulingo/book/' + encodeURIComponent(collection.id) + '#lesson=' + encodeURIComponent(lesson.id),
                    }));
                });
            }
        }
    }
    return cards;
}

// ------------------------------------------------------- 훈련장 덱 문항

// 덱 문항은 answer-first라 choices[0]이 답이다.
function deckCard(question, topic) {
    return revealCard({
        id: 'd-' + question.id,
        topic,
        prompt: question.prompt,
        quoteHeading: question.quoteHeading && question.quoteHeading.ko ? question.quoteHeading : null,
        quote: question.quote,
        answer: { ko: question.choices.ko[0], en: question.choices.en[0] },
        explanation: question.explanation,
        href: question.href,
    });
}

// 용어는 용어를 보여 주고 뜻을 떠올리게 한다. 정의가 길면 앞 문장만 쓴다.
function termCards(drills) {
    const cards = [];
    for (const deck of drills.byId.values()) {
        if (deck.group !== 'terms' || deck.kind !== 'quiz') continue;
        const topic = { ko: '용어 · ' + deck.title.ko, en: 'Term · ' + deck.title.en };
        for (const question of deck.questions) {
            const back = leadPair(question.quote, LIMITS.definition);
            if (!back) continue;
            cards.push({
                id: 'f-' + question.id,
                kind: 'term',
                topic,
                term: { ko: question.choices.ko[0], en: question.choices.en[0] },
                answer: back,
                href: question.href,
            });
        }
    }
    return cards;
}

function deckCards(drills, group, deckIds) {
    const cards = [];
    for (const deck of drills.byId.values()) {
        if (deck.kind !== 'quiz' || (group ? deck.group !== group : !deckIds.includes(deck.id))) continue;
        const label = group === 'people'
            ? { ko: '인물 · ' + deck.title.ko, en: 'People · ' + deck.title.en }
            : { ko: '사건 · ' + deck.title.ko, en: 'Events · ' + deck.title.en };
        for (const question of deck.questions) {
            if (!fits(question.quote, LIMITS.quote) || !fits(question.explanation, LIMITS.explanation)) continue;
            if (!fits({ ko: question.choices.ko[0], en: question.choices.en[0] }, LIMITS.answer)) continue;
            cards.push(deckCard(question, label));
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
    const termBuckets = spread(seededShuffle('shorts-terms', termCards(drills)), bucketCount, TERMS_PER_BUCKET);
    const peopleBuckets = spread(seededShuffle('shorts-people', deckCards(drills, 'people')), bucketCount, PEOPLE_PER_BUCKET);
    const eventBuckets = spread(seededShuffle('shorts-events', deckCards(drills, null, ['event-scenes', 'event-people'])),
        bucketCount, EVENTS_PER_BUCKET);

    const buckets = courseBuckets.map((cards, index) => cards
        .concat(termBuckets[index], peopleBuckets[index], eventBuckets[index]));
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
