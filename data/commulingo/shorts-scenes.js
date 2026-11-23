// 쇼츠용 짧은 장면(데이터 문서 shorts/<강좌 id>). 강좌 장면 카드(storyCards)는
// 강좌 안에서 지도와 함께 읽도록 길게 쓰였으므로, 쇼츠에는 편마다 줄기 하나를
// 골라 2~4장, 장당 한두 문장으로 다시 쓴 카드를 따로 둔다(2026-11-23 소유자
// 요청: 「진짜 너무 기네」, 존댓말 없이). 강좌 원고는 건드리지 않는다.
//
// { episodes: { <레슨 id>: { ko: [{ when, title, text }], en: [...] } } }
// 레슨 id는 장면 카드가 있는 편의 첫 레슨이다(shards의 lesson payload).

const MIN_CARDS = 2;
const MAX_CARDS = 4;
const KO_TEXT_MAX = 110;
const EN_TEXT_MAX = 260;
const TITLE_MAX = { ko: 30, en: 70 };
const WHEN_MAX = { ko: 24, en: 40 };
// 존댓말 금지: 문장 끝의 「~습니다/~입니다/~했어요」. 「니다」 앞 글자에 받침
// ㅂ이 있을 때만 존댓말이다(「아니다」는 아니다).
const POLITE_END = /(?:([가-힣])니다|어요|아요|해요|예요|이에요|세요)[.!?」』"”')\]]*(?=\s|$)/g;
function polite(text) {
    for (const match of String(text).matchAll(POLITE_END)) {
        if (!match[1]) return true;
        if ((match[1].charCodeAt(0) - 0xAC00) % 28 === 17) return true; // 받침 ㅂ
    }
    return false;
}

function problem(list, where, message) {
    list.push(where + ': ' + message);
}

function cardProblems(card, lang, where) {
    const out = [];
    if (!card || typeof card !== 'object' || Array.isArray(card)) return [where + ': card must be an object'];
    for (const field of ['when', 'title', 'text']) {
        if (typeof card[field] !== 'string' || !card[field].trim()) problem(out, where, field + ' missing');
    }
    if (out.length) return out;
    const textMax = lang === 'ko' ? KO_TEXT_MAX : EN_TEXT_MAX;
    if (card.text.length > textMax) problem(out, where, `text is ${card.text.length} characters, over ${textMax}`);
    if (card.title.length > TITLE_MAX[lang]) problem(out, where, `title is ${card.title.length} characters, over ${TITLE_MAX[lang]}`);
    if (card.when.length > WHEN_MAX[lang]) problem(out, where, `when is ${card.when.length} characters, over ${WHEN_MAX[lang]}`);
    if (lang === 'ko' && (polite(card.text) || polite(card.title))) problem(out, where, 'polite ending (존댓말) — write in 했다체');
    if (/\{\{(?:flag|pos):/.test(card.text + card.title)) problem(out, where, 'story markers are not used in shorts');
    const extra = Object.keys(card).filter(key => !['when', 'title', 'text'].includes(key));
    if (extra.length) problem(out, where, 'unknown field ' + extra.join(', '));
    return out;
}

// 문제 목록(빈 배열이면 통과). courseLessons: 알려 주면 레슨 id가 그 강좌의 것인지 본다.
function shortsScenesProblems(content, key, courseLessons) {
    const out = [];
    if (!content || typeof content !== 'object' || !content.episodes || typeof content.episodes !== 'object' || Array.isArray(content.episodes)) {
        return [key + ': episodes must be an object keyed by lesson id'];
    }
    const extra = Object.keys(content).filter(field => field !== 'episodes');
    if (extra.length) out.push(key + ': unknown field ' + extra.join(', '));
    for (const [lessonId, episode] of Object.entries(content.episodes)) {
        const where = key + ' ' + lessonId;
        if (courseLessons && !courseLessons.has(lessonId)) problem(out, where, 'not a lesson of this course');
        if (!episode || !Array.isArray(episode.ko) || !Array.isArray(episode.en)) {
            problem(out, where, 'needs ko and en card lists');
            continue;
        }
        if (episode.ko.length !== episode.en.length) problem(out, where, `ko has ${episode.ko.length} cards, en ${episode.en.length}`);
        if (episode.ko.length < MIN_CARDS || episode.ko.length > MAX_CARDS) problem(out, where, `${episode.ko.length} cards; ${MIN_CARDS}–${MAX_CARDS} allowed`);
        episode.ko.forEach((card, i) => out.push(...cardProblems(card, 'ko', `${where} ko[${i}]`)));
        episode.en.forEach((card, i) => out.push(...cardProblems(card, 'en', `${where} en[${i}]`)));
    }
    return out;
}

module.exports = { shortsScenesProblems, KO_TEXT_MAX, EN_TEXT_MAX, MAX_CARDS };
