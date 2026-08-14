// Canonical Korean terminology for Soviet-history public prose. The country,
// language, and people are always 그루지야 in Korean copy, including
// post-independence contexts (owner decision, 2026-08-02). The one thing this
// must never touch is the US state (조지아주, 현대차 조지아 공장) — that prose
// lives outside CommuLingo, so the blanket replace here stays safe.
function normalizeSovietKoreanText(value) {
    return typeof value === 'string' ? value.replaceAll('조지아', '그루지야') : value;
}

// The second rule cannot work that way. Korea was 조선 (대한제국 from 1897)
// until the two states of 1948, so 'Korea' translated without that distinction
// makes 한국 the subject of Yalta and 한국어 the language a colonial-era grammar
// described. But 한국 is also simply right for the modern south, which a whole
// set of glossary entries is about (재벌 체제, 전세, 1987년 체제). So instead of
// replacing, this reads the dates around a mention and reports the ones sitting
// in a pre-division context, for a human to judge.
const DIVISION_YEAR = 1948;
// How far to look for a date when the mention's own sentence carries none.
const NEIGHBOUR_WINDOW = 120;

// Compounds that carry 한국 correctly whatever period the sentence is about:
// fixed modern names (한국전쟁 is the site's own event title), and the editorial
// asides that speak of today's Korean language from inside an entry about 1880
// ('한국어 번역본은…', '오늘날 한국어에서…'). The era-bound mistakes this is for
// read differently: 한국어 문법, 한국 독립운동가, 한국 신탁통치.
const KOREA_ALLOWED = [
    '한국전쟁', '한국 전쟁', '한국은행', '한국사학',
    '한국어 번역', '한국어 전문', '한국어판', '한국어 표기',
    '한국어에 남긴', '오늘날 한국어', '한국어에서', '한국어의',
];

const YEAR_RE = /(1[5-9]\d{2}|20\d{2})/g;

// The newest year named in a stretch of prose, or null when it names none.
function latestYear(text) {
    let latest = null;
    for (const match of String(text || '').matchAll(YEAR_RE)) {
        const year = Number(match[1]);
        if (latest === null || year > latest) latest = year;
    }
    return latest;
}

// A period label ('1936, 1946–1948', '1980년대–현재', '1935~') read as the last
// year it covers. An open end means the entry runs to the present.
function periodEndYear(label) {
    const raw = String(label || '');
    if (!raw.trim()) return null;
    if (/현재|~\s*$|[–-]\s*$/.test(raw)) return null;
    return latestYear(raw);
}

// The sentence a position sits in. Scoped this tightly on purpose: the 1945
// trusteeship sentence in the Korean War entry sits one clause away from '1948년
// 남쪽에 대한민국', and a character window wide enough to be useful took the
// later date and cleared the mention.
function sentenceAround(text, at) {
    const before = text.slice(0, at);
    const start = Math.max(
        before.lastIndexOf('. ') + 1, before.lastIndexOf('.\n') + 1,
        before.lastIndexOf('\n') + 1
    );
    const rest = text.slice(at);
    const breaks = ['. ', '.\n', '\n'].map(mark => rest.indexOf(mark)).filter(i => i !== -1);
    const end = breaks.length ? at + Math.min(...breaks) + 1 : text.length;
    return text.slice(start, end);
}

// Every 한국 in `text` that reads as a country before there was one. `fallbackYear`
// is the entry's own period end, used when neither the sentence nor its
// neighbourhood carries a date.
function findKoreaAnachronisms(text, fallbackYear = null) {
    const body = typeof text === 'string' ? text : '';
    const found = [];
    for (const match of body.matchAll(/한국/g)) {
        const at = match.index;
        const allowed = KOREA_ALLOWED.some(word => {
            const start = body.indexOf(word, at - word.length + 1);
            return start !== -1 && start <= at && start + word.length > at;
        });
        if (allowed) continue;
        const sentence = latestYear(sentenceAround(body, at));
        const neighbourhood = sentence === null
            ? latestYear(body.slice(Math.max(0, at - NEIGHBOUR_WINDOW), at + NEIGHBOUR_WINDOW))
            : null;
        const dated = sentence !== null || neighbourhood !== null;
        const year = sentence !== null ? sentence
            : (neighbourhood !== null ? neighbourhood : fallbackYear);
        if (year === null || year >= DIVISION_YEAR) continue;
        found.push({
            at,
            year,
            dated,
            excerpt: body.slice(Math.max(0, at - 45), at + 45).replace(/\s+/g, ' '),
        });
    }
    return found;
}

module.exports = {
    normalizeSovietKoreanText,
    findKoreaAnachronisms,
    periodEndYear,
    latestYear,
    DIVISION_YEAR,
};
