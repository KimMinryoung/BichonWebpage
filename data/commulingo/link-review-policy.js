const { createHash } = require('crypto');

const KINDS = ['term', 'event', 'doc'];
function key(kind, id, lang, text) { return JSON.stringify([kind, id, lang, text]); }
function normalize(text, lang) {
    const value = String(text).normalize('NFC').trim().replace(/\s+/gu, ' ');
    return lang === 'en' ? value.toLocaleLowerCase('en') : value;
}
function signature(record, expression) {
    const names = record.term || record.title || {};
    return createHash('sha256').update(JSON.stringify([names[expression.lang] || names.ko || names.en || '', expression])).digest('hex');
}
function reviewMap(rows) {
    return new Map(rows.map(row => [key(row.kind, row.entity_id, row.lang, row.expression), row]));
}
function applyReviews(kind, record, candidates, options = {}) {
    // Only migration/test fixtures opt into the old behaviour. Public callers
    // without a review snapshot fail closed, including externally created data.
    if (options.legacyReview === true) return candidates;
    return candidates.map(expression => {
        const review = options.reviews?.get(key(kind, record.id, expression.lang, expression.text));
        const valid = review && review.source_signature === signature(record, expression);
        return { ...expression, role: valid ? review.role : expression.role,
            policy: valid ? review.policy : 'search' };
    });
}
function risks(text, lang) {
    const value = normalize(text, lang);
    const generic = lang === 'ko'
        ? /^(?:\d{1,2}월\s*(?:위기|사태|봉기|시위|혁명)|(?:제\d차\s*)?연립(?:정부|내각)|임시정부|문화혁명|국민혁명|인민전선)$/u
        : /^(?:(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:crisis|days|uprising|events|demonstrations|revolution)|(?:(?:first|second|third)\s+)?coalition\s+(?:government|cabinet|ministry)|provisional government|cultural revolution|national revolution|popular front)$/u;
    const reasons = [];
    if (generic.test(value)) reasons.push('여러 시대·국가에 쓰이는 일반 표현입니다. 구체적인 이름이나 검색 전용을 사용하세요.');
    if (!/\d{4}/u.test(value) && (lang === 'ko' ? /(?:협정|조약|선언)$/u : /\b(?:accords?|agreements?|treaties|treaty|declaration|pacts?)$/u).test(value)) {
        reasons.push('연도가 없는 협정·조약·선언명입니다. 동명이의어 여부를 검토하세요.');
    }
    return reasons;
}
module.exports = { KINDS, key, normalize, signature, reviewMap, applyReviews, risks };
