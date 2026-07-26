// Auto-links CommuLingo history-event names inside prose, the event-side
// counterpart of people-linkify. Index shape ({ pattern, byAlias, en }) and the
// Korean preceding-char guard mirror buildPersonLinkIndex so both indexes can
// share one replacer pipeline (see report-links.js).

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

// Extra match terms per event beyond the stored titles: common alternate names
// a report would actually use. Keys are commulingo_history_events ids; events
// without an entry still match on their ko/en titles.
const EXTRA_TERMS = {
    'revolution-1905': { en: ['1905 Revolution'] },
    'october-revolution': { ko: ['10월혁명', '볼셰비키 혁명'], en: ['Bolshevik Revolution'] },
    'civil-war': { ko: ['러시아 내전'], en: ['Russian Civil War'] },
    'ussr-formation': { ko: ['소련 결성'], en: ['Formation of the Soviet Union'] },
    'five-year-plans': { ko: ['5개년 계획', '5개년계획'], en: ['Five-Year Plan', 'Five-Year Plans'] },
    // Title is now 대숙청 / The Great Purge, matching the glossary entry.
    // The former title stays a match term so older prose still links.
    'great-terror': { ko: ['대테러'], en: ['Great Terror'] },
    'great-patriotic-war': { ko: ['독소전쟁', '독소 전쟁'] },
    'marshall-plan': { ko: ['마셜 플랜', '마셜플랜', '마샬 플랜'] },
    'doctors-plot': { ko: ['의사들의 음모 사건'], en: ["Doctors' Plot"] },
    'beria-purge': { ko: ['베리야 숙청'], en: ['Fall of Beria'] },
    'hungarian-revolution': { ko: ['헝가리 봉기'] },
    'anti-party-group': { ko: ['반당그룹', '반당 그룹 사건'] },
    'soviet-space-program': { ko: ['스푸트니크'], en: ['Sputnik'] },
    'kosygin-reform': { en: ['Kosygin reform'] },
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

// Prose linking for the history dictionary, matching linkifyTermsHtml exactly
// in shape so the three indexes can be run one after another over the same
// html. report-links.js keeps its own replacer because its anchors also carry
// the mention ids that related-report deep links point at.
function makeEventReplacer(index, excludeId, seen) {
    return function replacer(match, _token, offset, source) {
        if (!index.en) {
            const prev = offset > 0 ? source.charAt(offset - 1) : '';
            if (WORD_CHAR.test(prev)) return match;
        }
        const event = index.byAlias[match];
        if (!event || event.id === excludeId || seen.has(event.id)) return match;
        seen.add(event.id);
        const title = escapeHtml(event.period ? event.period + ' · ' + event.title : event.title);
        return '<a class="commu-event-link" href="/commulingo/events/'
            + encodeURIComponent(event.id) + '" title="' + title + '">' + match + '</a>';
    };
}

function linkifyEventsHtml(html, index, excludeId, seen) {
    if (!html || !index) return html || '';
    const replacer = makeEventReplacer(index, excludeId, seen || new Set());
    return mapLinkableText(html, text => text.replace(index.pattern, replacer));
}

module.exports = {
    BLOCKED_EVENT_KO,
    buildEventLinkIndex,
    linkifyEventsHtml,
};
