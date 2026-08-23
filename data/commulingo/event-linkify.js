// The history-event alias index: which strings belong to which event. Index
// shape ({ pattern, byAlias, en }) matches the other indexes so linkify.js can
// run them all through one replacer.

const {
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    mapLinkableText,
} = require('./people-linkify');

// Korean compounds that contain an event term but must never link. '대테러'
// (the event title for the Great Terror) is also the ordinary word for
// counter-terrorism; consume its compounds first so they pass through.
const BLOCKED_EVENT_KO = ['대테러리즘', '대테러전', '대테러 작전', '대테러 정책', '대테러 활동'];

// Title-variant strings that must not go into the Korean index. '네프' is the
// paren short form of '신경제정책(네프)', but it is also the head of unrelated
// transliterations — 네프테신디카트 (the oil syndicate), 네프스키 — and Korean
// matching cannot refuse a glued tail (particles hang there legitimately), so
// the two-glyph form mislinked oil agencies to the NEP. The entry keeps
// linking from 신경제정책, 신경제정책(네프), and NEP (2026-08-23).
const NEVER_LINK_EVENT_KO = ['네프'];

// Extra match terms per event beyond the stored titles: common alternate names
// a report would actually use. Keys are commulingo_history_events ids; events
// without an entry still match on their ko/en titles.
const EXTRA_TERMS = {
    'revolution-1905': { en: ['1905 Revolution'] },
    'october-revolution': { ko: ['10월혁명', '볼셰비키 혁명'], en: ['Bolshevik Revolution'] },
    'civil-war': { ko: ['러시아 내전'], en: ['Russian Civil War'] },
    // Korean prose writes the Latin abbreviation too; the hangul short form
    // 네프 is refused above (NEVER_LINK_EVENT_KO), so NEP carries instead.
    'new-economic-policy': { ko: ['NEP'] },
    'ussr-formation': { ko: ['소련 결성'], en: ['Formation of the Soviet Union'] },
    'five-year-plans': { ko: ['5개년 계획', '5개년계획'], en: ['Five-Year Plan', 'Five-Year Plans'] },
    // Title is now 대숙청 / The Great Purge, matching the glossary entry.
    // The former title stays a match term so older prose still links.
    'great-terror': { ko: ['대테러'], en: ['Great Terror'] },
    // 계속전쟁 / Continuation War is deliberately absent — a different war,
    // covered here only in the entry's outcome.
    'winter-war': {
        ko: ['소련-핀란드 전쟁', '소련·핀란드 전쟁', '겨울 전쟁'],
        en: ['Winter War', 'Russo-Finnish War', 'Soviet-Finnish War'],
    },
    // The date is how every account names this night, in both languages; the
    // stored title ('1934년 2월 6일 위기') is almost never the form in prose.
    'february-1934-crisis': {
        ko: ['1934년 2월 6일', '2월 6일 폭동', '1934년 프랑스 폭동'],
        en: ['6 February 1934', 'crisis of 6 February 1934'],
    },
    'great-patriotic-war': { ko: ['독소전쟁', '독소 전쟁'] },
    'marshall-plan': { ko: ['마셜 플랜', '마셜플랜', '마샬 플랜'] },
    'doctors-plot': { ko: ['의사들의 음모 사건'], en: ["Doctors' Plot"] },
    'beria-purge': { ko: ['베리야 숙청'], en: ['Fall of Beria'] },
    'hungarian-revolution': { ko: ['헝가리 봉기'] },
    'anti-party-group': { ko: ['반당그룹', '반당 그룹 사건'] },
    'soviet-space-program': { ko: ['스푸트니크'], en: ['Sputnik'] },
    'kosygin-reform': { en: ['Kosygin reform'] },
    // 원자탄/수소폭탄 like 겨울전쟁's 계속전쟁 is deliberately absent: the bare
    // words are ordinary nouns that appear in prose about other countries too.
    'soviet-atomic-project': {
        ko: ['소련 원자폭탄 개발', '소련 핵개발', '원자력 사업'],
        en: ['Soviet atomic project', 'Soviet nuclear programme', 'Soviet nuclear program'],
    },
    'korean-war': { ko: ['한국 전쟁', '6·25 전쟁'], en: ['Korean War'] },
    // '제20차 당대회' and '비밀연설' are each used alone far more often than the
    // full title, so both carry.
    'twentieth-party-congress': {
        ko: ['제20차 당대회', '20차 당대회', '비밀연설', '개인숭배와 그 결과에 대하여'],
        en: ['Twentieth Party Congress', '20th Party Congress', 'Secret Speech'],
    },
    'sino-soviet-split': {
        ko: ['중소 분열', '중소 갈등', '중소 논쟁'],
        en: ['Sino-Soviet split', 'Sino-Soviet dispute', 'Sino-Soviet rift'],
    },
    'afghanistan-war': { ko: ['아프가니스탄 전쟁', '아프간 전쟁'], en: ['Soviet-Afghan War', 'Afghan War'] },
    'perestroika': { ko: ['페레스트로이카', '글라스노스트'], en: ['Perestroika', 'Glasnost'] },
    'chernobyl': { ko: ['체르노빌'], en: ['Chernobyl'] },
    'revolutions-1989': { ko: ['동유럽 혁명'] },
    'soviet-collapse': {
        ko: ['소련 해체', '소련의 해체', '8월 쿠데타'],
        en: ['August Coup', 'Collapse of the Soviet Union', 'Collapse of the USSR', 'Dissolution of the Soviet Union'],
    },
};

// '신경제정책(네프)' → ['신경제정책(네프)', '신경제정책', '네프'];
// 'The New Economic Policy (NEP)' additionally drops the leading article.
function titleVariants(title, en) {
    const variants = new Set();
    const raw = typeof title === 'string' ? title.trim() : '';
    if (!raw) return [];
    variants.add(raw);
    const paren = raw.match(/^(.+?)\s*[(（]([^)）]+)[)）]$/);
    if (paren) {
        variants.add(paren[1].trim());
        variants.add(paren[2].trim());
    }
    if (en) {
        Array.from(variants).forEach(value => {
            if (/^The\s+/i.test(value)) variants.add(value.replace(/^The\s+/i, ''));
        });
    }
    return Array.from(variants);
}

// Builds an alias→event index and a matching regex from the raw history-events
// list ({ id, period, title: {ko,en}, ... }).
function buildEventLinkIndex(events, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const tokens = [];
    (events || []).forEach(event => {
        if (!event || !event.id) return;
        const title = event.title && (event.title[lang] || event.title.ko || event.title.en) || '';
        const extra = (EXTRA_TERMS[event.id] && EXTRA_TERMS[event.id][lang]) || [];
        const candidates = titleVariants(title, en).concat(extra);
        const entry = { id: event.id, period: event.period || '', title };
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2) return;
            if (!en && NEVER_LINK_EVENT_KO.includes(alias)) return;
            if (byAlias[alias]) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    if (!tokens.length) return null;
    const all = (en ? tokens : BLOCKED_EVENT_KO.concat(tokens)).slice().sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    const pattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    return { pattern, byAlias, en };
}

module.exports = {
    BLOCKED_EVENT_KO,
    buildEventLinkIndex,
};
