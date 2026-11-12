// Side markers inside scene-card prose: a force that had a state wears its
// flag, one that did not wears its political-position icon (owner's rule,
// 2026-11-12). The author writes the token right before the name:
//
//   {{flag:austrian-empire}}오스트리아군 사령관 라데츠키
//   {{pos:revolutionary-democrat}}마치니
//
// Flags are period flags where the modern one would mislead (the Habsburg
// black-and-yellow, not today's Austria; Prussia, not Germany), vendored under
// public/flags/historical/ (sources in public/flags/SOURCES.md), else any
// person-card flag code. pos takes a person position collection id and
// borrows that collection's icon, title and colour, as the cast chips do.
// Unknown codes render nothing; the plain text never shows a token.
const { FLAG_NAMES, hasFlag, flagSrc } = require('./flag-icons');

const STORY_FLAGS = {
    'austrian-empire': { ko: '오스트리아 제국', en: 'Austrian Empire', src: '/flags/historical/austrian-empire.svg' },
    prussia: { ko: '프로이센 왕국', en: 'Kingdom of Prussia', src: '/flags/historical/prussia.png' },
    'sardinia-1848': { ko: '사르데냐 왕국', en: 'Kingdom of Sardinia', src: '/flags/historical/sardinia-1848.png' },
    'two-sicilies': { ko: '양시칠리아 왕국', en: 'Kingdom of the Two Sicilies', src: '/flags/historical/two-sicilies.png' },
    'papal-states': { ko: '교황령', en: 'Papal States', src: '/flags/historical/papal-states.png' },
    'san-marco-1848': { ko: '산마르코 공화국 (베네치아)', en: 'Republic of San Marco (Venice)', src: '/flags/historical/san-marco-1848.png' },
    'croatia-1848': { ko: '크로아티아', en: 'Croatia', src: '/flags/historical/croatia-1848.svg' },
    // French Revolution (1789-1799): the royal white flag until the monarchy
    // fell in August 1792 (the republic uses the person-card code france);
    // the Union flag before the Irish saltire of 1801; Savoy's red-and-white
    // cross for the Kingdom of Sardinia before its 1848 tricolour.
    'kingdom-of-france': { ko: '프랑스 왕국', en: 'Kingdom of France', src: '/flags/historical/kingdom-of-france.png' },
    'habsburg-monarchy': { ko: '합스부르크 군주국', en: 'Habsburg Monarchy', src: '/flags/historical/austrian-empire.svg' },
    'great-britain-1707': { ko: '그레이트브리튼 왕국', en: 'Kingdom of Great Britain', src: '/flags/historical/great-britain-1707.svg' },
    'sardinia-savoy': { ko: '사르데냐 왕국 (사보이아)', en: 'Kingdom of Sardinia (Savoy)', src: '/flags/historical/sardinia-savoy.svg' },
    // Socialist divergences: the Kaiserreich's black-white-red, not today's
    // Germany; the Weimar republic's black-red-gold; the Second Spanish
    // Republic's red-yellow-purple, not the monarchy's flag Spain flies now.
    'german-empire': { ko: '독일 제국', en: 'German Empire', src: '/flags/historical/german-empire.svg' },
    'weimar-republic': { ko: '독일 공화국 (바이마르)', en: 'German Republic (Weimar)', src: '/flags/germany.svg' },
    'spanish-republic': { ko: '스페인 제2공화국', en: 'Second Spanish Republic', src: '/flags/historical/spanish-republic.svg' },
    // The Italian tricolour flew over the 1848 revolutionary governments.
    'roman-republic-1849': { ko: '로마 공화국', en: 'Roman Republic', src: '/flags/italy.svg' },
    'milan-1848': { ko: '밀라노 임시정부', en: 'Provisional government of Milan', src: '/flags/italy.svg' },
    'italian-revolution': { ko: '이탈리아 혁명 세력', en: 'Italian revolutionaries', src: '/flags/italy.svg' },
    // Black-red-gold was the flag of the 1848 national movement and the
    // Frankfurt National Assembly.
    'german-1848': { ko: '독일 국민의회 (흑적황 삼색기)', en: 'German National Assembly (black-red-gold)', src: '/flags/germany.svg' },
};

const TOKEN = /\{\{(flag|pos):([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/g;

function storyFlag(code, lang) {
    const own = STORY_FLAGS[code];
    if (own) return { label: lang === 'en' ? own.en : own.ko, src: own.src };
    if (!hasFlag(code)) return null;
    return { label: lang === 'en' ? FLAG_NAMES[code].en : FLAG_NAMES[code].ko, src: flagSrc(code) };
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

const stripStoryMarkers = text => String(text || '').replace(TOKEN, '');

// Marker kinds and codes in order, to compare the two languages of a card.
const storyMarkerList = text => Array.from(String(text || '').matchAll(TOKEN), m => m[1] + ':' + m[2]);

// text with tokens -> escaped HTML with the markers. positions: collection id
// -> { label, colour, iconSvg } in this language.
function renderStoryMarkers(text, lang, positions) {
    let out = '';
    let last = 0;
    const source = String(text || '');
    for (const match of source.matchAll(TOKEN)) {
        out += escapeHtml(source.slice(last, match.index));
        last = match.index + match[0].length;
        if (match[1] === 'flag') {
            const flag = storyFlag(match[2], lang);
            if (flag) out += `<img class="commu-story-flag" src="${escapeHtml(flag.src)}" alt="${escapeHtml(flag.label)}" title="${escapeHtml(flag.label)}" height="14" loading="lazy" decoding="async">`;
        } else {
            const tag = positions && positions.get(match[2]);
            if (tag) out += `<span class="commu-story-pos${tag.colour ? ' pos-' + escapeHtml(tag.colour) : ''}" role="img" aria-label="${escapeHtml(tag.label)}" title="${escapeHtml(tag.label)}">${tag.iconSvg || ''}</span>`;
        }
    }
    return out + escapeHtml(source.slice(last));
}

module.exports = { STORY_FLAGS, storyFlag, stripStoryMarkers, storyMarkerList, renderStoryMarkers };
