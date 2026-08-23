// The glossary alias index: which strings belong to which term. Index shape
// ({ pattern, byAlias, en }) matches the other indexes so linkify.js can run
// them all through one replacer.

const {
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    mapLinkableText,
} = require('./people-linkify');

// Korean compounds that contain a term alias but must never link.
// 전세계 contains 전세 (jeonse) and fired in the Communist Manifesto's
// '전세계의 프롤레타리아여' — the compound never means the housing lease.
// 58-6조 is an article-58 subsection, not 헌법 6조 (the hyphen passes the
// preceding-char guard); 근위축증·근위발달영역·젊은 근위대 carry 근위 without
// meaning the Guards designation; 오카야마 and 오카시오-코르테스 carry the 오카
// missile's two syllables in names (2026-08-23 link-fire audit).
const BLOCKED_TERM_KO = [
    '집단농장화', '전세계', '모티프',
    '58-6조', '근위축증', '근위발달영역', '젊은 근위대',
    '오카야마', '오카시오-코르테스',
];

// Aliases that are also ordinary Korean words — the term counterpart of
// NEVER_LINK_ALIAS_KO in people-linkify. They surfaced when lesson prose
// started being linked: 『자본론』 using 주체 in the plain sense of "subject"
// was pointed at 주체사상, and 소개 meaning "introduction" at the 1941
// evacuation. Each entry stays reachable by its headword and its longer
// aliases; only the bare ambiguous string is refused, and only when it is not
// the headword itself.
// 'UN' is two Latin letters the Korean pass matches without a word boundary,
// so it fires inside UNKVD, UNRRA and any other acronym that happens to start
// with those letters. The entry stays reachable as 유엔.
// 코르·레프: 두 글자 음차 별칭이라 오연결이 잦다 — 코르 드 발레의 「코르」가
// 폴란드 KOR로, 인명 레프(레프 카메네프)가 좌익예술전선(LEF)으로 걸린다.
// 항목은 표제어(좌익예술전선, 노동자방어위원회(KOR))로 계속 닿는다.
// 2026-08-23 전수 집계에서 추가된 것들: 정치국(1,084회 발화가 거의 다
// 제도로서의 정치국인데 1917년 10월 임시 지도부 항목으로 갔다), 볼가(강·
// 자동차 공장 165회가 보스호트 에어록으로), 인민위원회(소브나르콤·북조선
// 인민위원회가 유고 인민해방위원회로), 가속화(일반 동명사가 우스코레니예로),
// 매파적(정치·군사 강경파가 통화 매파로), 아라(아라곤·아라키의 머리가 ARA로),
// MO(UN과 같은 꼴 — MOPR·MOOP 머리에서 발화). 각 항목은 표제어와 긴
// 별칭(볼가 에어록, 우스코레니예, 인민해방위원회, 통화 매파)으로 계속 닿는다.
const NEVER_LINK_TERM_ALIAS_KO = [
    '주체', '소개', '호구', '씨밤', '소련 인민', 'UN', '코르', '레프',
    '정치국', '볼가', '인민위원회', '가속화', '매파적', '아라', 'MO',
];

// Strings refused even when they are the term's own headword. The list above
// spares the headword deliberately — an entry has to stay reachable by its own
// name. This one is for the opposite case: a headword so basic that linking it
// is noise rather than help. 소비에트 names the state, the council, and half
// the adjectives in this corpus; a page of running prose uses it fifty times
// and the one link it earns tells the reader nothing the context has not
// already given them. Excluded strings stay reachable from the glossary index,
// from related-term chips, and from their own longer aliases (노동자대표
// 소비에트, 소비에트 대회), which are specific enough to be worth a link.
// The English side is the same word with the same problem, and worse: most of
// its appearances are the adjective in "the Soviet Union", "Soviet advisers".
// Both languages are kept in step so a reader does not meet a link in one and
// plain text in the other. Matching is case-sensitive, so each casing that the
// alias table registers has to be named.
//
// 소개 is here for the other reason: homonymy the reader cannot disambiguate.
// It is the 1941 industrial evacuation, but in running prose it almost always
// means "introduction" (인물 소개, 소개하다), and NEVER_LINK_TERM_ALIAS_KO above
// cannot catch it because 소개 is the entry's own headword. The English side
// (Evacuation …) has no such twin and keeps its links.
//
// The same homonymy claimed three more headwords in the 2026-08-23 link-fire
// audit: 전세 is almost always 戰勢 in this corpus (전세를 역전, 전세가 기울다),
// not the housing lease; 개조 is the ordinary word for remodelling far more
// often than the Gulag's perekovka; 정상화 is 국교 정상화 and 관계 정상화, not
// the Husák regime; 매파 is the political/military hawk in every biography,
// not the central-bank kind. Each stays reachable from the glossary index and
// its longer aliases (전세제도, 페레코프카, 후사크 정상화, 통화 매파).
//
// The check runs on every candidate string, so the en side also carries alias
// strings whose plain-English reading swamps the term: Politburo / Political
// Bureau (603 + 7 fires, nearly all the standing institution or another
// party's bureau, target was the October 1917 seven), Volga (the river and
// the car plant, 126 fires), acceleration (the ordinary noun), hawk/hawkish
// (the war hawk). Capitalized 'Acceleration' stays: it only fires as the
// uskoreniye slogan.
const NEVER_LINK_TERM_HEADWORD = {
    ko: ['소비에트', '소개', '전세', '개조', '정상화', '매파'],
    en: [
        'Soviet', 'soviet', 'soviets', 'Soviets',
        'Politburo', 'Political Bureau', 'Volga', 'acceleration', 'hawk', 'hawkish',
    ],
};

// A word can name a thing that has its own main entry while a second entry
// exists about the word itself. '예조프시나' is the euphemism the post-Stalin
// USSR used for the 1937–38 campaign: the campaign is 대숙청, and the
// 예조프시나 entry is there to explain the naming. A reader who meets the word
// in prose wants the campaign, so the link points at 대숙청; the entry stays
// reachable from 대숙청's nested list and from the glossary index.
//
// This cannot be expressed in the alias table alone. Headwords are registered
// in the index alongside aliases and the first registration of a string wins,
// so the entry whose headword is the word always claims it first.
//
// Keys are alias strings, values are the term id to point them at. Only strings
// already in the index are repointed: an override never creates a new match.
const LINK_OVERRIDES = {
    '예조프시나': 'great-purge',
    'Yezhovshchina': 'great-purge',
};

// Builds an alias→term index from the terms snapshot
// ({ id, term: {ko,en}, aliases: {ko:[],en:[]}, ... }).
function buildTermLinkIndex(terms, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const byId = {};
    const tokens = [];
    (terms || []).forEach(term => {
        if (!term || !term.id) return;
        const label = (term.term && (term.term[lang] || term.term.ko || term.term.en)) || '';
        const entry = {
            id: term.id,
            kind: 'term',
            label,
            original: term.original || '',
            href: '/commulingo/terms/' + encodeURIComponent(term.id),
        };
        byId[term.id] = entry;
        const neverHeadword = NEVER_LINK_TERM_HEADWORD[en ? 'en' : 'ko'] || [];
        const candidates = [label].concat((term.aliases && term.aliases[lang]) || []);
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            if (neverHeadword.includes(alias)) return;
            if (!en && alias !== label && NEVER_LINK_TERM_ALIAS_KO.includes(alias)) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    Object.entries(LINK_OVERRIDES).forEach(([alias, targetId]) => {
        if (byAlias[alias] && byId[targetId]) byAlias[alias] = byId[targetId];
    });
    if (!tokens.length) return null;
    const all = (en ? tokens : BLOCKED_TERM_KO.concat(tokens)).slice().sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    const pattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    return { pattern, byAlias, en };
}

module.exports = {
    BLOCKED_TERM_KO,
    buildTermLinkIndex,
};
