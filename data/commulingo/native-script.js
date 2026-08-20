// CommuLingo — which writing system a person's native-name line may use.
//
// `commulingo_people.cyrillic` is misnamed for historical reasons: it is the
// "name in the person's own script" line rendered under the display name on the
// card and detail page (see composePersonName in people-standard.js). Because of
// the column name, curators and ingest agents kept filling it with a Russian
// transliteration for everyone, so 박헌영 rendered as "Пак Хон Ён" and
// Kádár János as "Янош Кадар" (fixed wholesale by migration 057).
//
// This module is the rule that stops it happening again: a nationality code maps
// to the scripts its own orthography uses, and the ingest paths reject a native
// name written in anything else. The same table is ported to leninbot
// runtime_tools/commulingo_people.py (_NATION_SCRIPTS) — keep the two in sync.

// Unicode ranges per script we care about. Order matters only for reporting.
const SCRIPT_RANGES = [
    ['cyrillic', /[Ѐ-ӿԀ-ԯ]/],
    ['greek', /[Ͱ-Ͽ]/],
    ['hangul', /[가-힯ᄀ-ᇿ㄰-㆏]/],
    ['kana', /[぀-ヿ]/],
    ['han', /[㐀-䶿一-鿿]/],
    ['georgian', /[Ⴀ-ჿ]/],
    ['armenian', /[԰-֏]/],
    ['hebrew', /[֐-׿]/],
    ['arabic', /[؀-ۿ]/],
    ['devanagari', /[ऀ-ॿ]/],
    ['bengali', /[ঀ-৿]/],
    // Latin last: diacritics (ā, ș, ə) live in the extended blocks.
    ['latin', /[A-Za-zÀ-ɏḀ-ỿ]/],
];

const CYRILLIC = ['cyrillic'];
const LATIN = ['latin'];

// Nationality code (data/commulingo/flag-icons.js) -> scripts its own names use.
// Post-Soviet republics that switched alphabets accept both: the Soviet-era form
// and the modern one are each defensible for a figure who lived across the change.
const NATION_SCRIPTS = {
    soviet: CYRILLIC,
    russia: CYRILLIC,
    ukraine: CYRILLIC,
    belarus: CYRILLIC,
    bulgaria: CYRILLIC,
    kazakhstan: CYRILLIC,
    kyrgyzstan: CYRILLIC,
    tajikistan: CYRILLIC,
    moldova: ['cyrillic', 'latin'],
    uzbekistan: ['latin', 'cyrillic'],
    turkmenistan: ['latin', 'cyrillic'],
    azerbaijan: ['latin', 'cyrillic'],
    georgia: ['georgian'],
    armenia: ['armenian'],
    latvia: LATIN,
    lithuania: LATIN,
    estonia: LATIN,
    poland: LATIN,
    finland: LATIN,
    germany: LATIN,
    'east-germany': LATIN,
    austria: LATIN,
    hungary: LATIN,
    czechia: LATIN,
    romania: LATIN,
    albania: LATIN,
    // Both alphabets were official in Yugoslavia; Croats and Slovenes wrote Latin.
    yugoslavia: ['latin', 'cyrillic'],
    france: LATIN,
    italy: LATIN,
    spain: LATIN,
    portugal: LATIN,
    netherlands: LATIN,
    belgium: LATIN,
    uk: LATIN,
    usa: LATIN,
    turkey: LATIN,
    cuba: LATIN,
    argentina: LATIN,
    chile: LATIN,
    peru: LATIN,
    angola: LATIN,
    'burkina-faso': LATIN,
    congo: LATIN,
    ghana: LATIN,
    'guinea-bissau': LATIN,
    mozambique: LATIN,
    trinidad: LATIN,
    indonesia: LATIN,
    vietnam: LATIN,
    brazil: LATIN,
    'el-salvador': LATIN,
    grenada: LATIN,
    guyana: LATIN,
    nicaragua: LATIN,
    'south-africa': LATIN,
    tanzania: LATIN,
    ireland: LATIN,
    slovakia: LATIN,
    czechoslovakia: LATIN,
    martinique: LATIN,
    china: ['han'],
    japan: ['kana', 'han'],
    'north-korea': ['hangul', 'han'],
    'south-korea': ['hangul', 'han'],
    korea: ['hangul', 'han'],
    india: ['devanagari', 'bengali', 'latin'],
    israel: ['hebrew'],
    greece: ['greek'],
};

// Nations whose people write the family name first, and how the two parts
// join per language. Korean text fuses Korean/Chinese/Vietnamese names
// (김무정, 펑더화이, 호찌민) and keeps the space for Japanese (도쿠다 규이치);
// English follows each nation's own romanization — family first for
// Korean/Chinese/Vietnamese (Kim Mu-chong, Peng Dehuai, Le Duan), given first
// for Japanese (Sen Katayama). Nations absent here use Western "given family".
// Ported to leninbot runtime_tools/commulingo_people.py — keep the two in sync.
const FAMILY_FIRST = {
    korea: { ko: '', en: ' ' },
    'north-korea': { ko: '', en: ' ' },
    'south-korea': { ko: '', en: ' ' },
    china: { ko: '', en: ' ' },
    vietnam: { ko: '', en: ' ' },
    japan: { ko: ' ', en: null },
};

// The joiner between family and given when `code` writes the family name
// first in `lang`; null means Western given-first order.
function familyFirstJoiner(code, lang) {
    const key = typeof code === 'string' ? code.trim() : '';
    const rule = Object.prototype.hasOwnProperty.call(FAMILY_FIRST, key) ? FAMILY_FIRST[key] : null;
    if (!rule) return null;
    return rule[lang] !== undefined ? rule[lang] : null;
}

// Regnal numbers are Latin letters in every script: Николай II is a Cyrillic
// name, not a mixed-script one. Drop those tokens before sniffing.
const ROMAN_NUMERAL = /(^|\s)[IVXLCDM]+(?=$|\s)/g;

// Every script present in `text`, ignoring digits, spaces and punctuation.
function detectScripts(text) {
    const value = String(text || '').replace(ROMAN_NUMERAL, ' ');
    const found = [];
    for (const [name, pattern] of SCRIPT_RANGES) {
        if (pattern.test(value)) found.push(name);
    }
    return found;
}

function scriptsFor(code) {
    const key = typeof code === 'string' ? code.trim() : '';
    return Object.prototype.hasOwnProperty.call(NATION_SCRIPTS, key) ? NATION_SCRIPTS[key] : null;
}

// Check one native-name string against a person's nationality.
// Returns null when it is fine (or when there is nothing to check against), or
// { code, allowed, found, message } describing the mismatch.
//
// Both nationalities count: the convention files Soviet republic officials as
// citizenship 'soviet' + origin 'latvia'/'georgia'/…, and a Latvian in the USSR
// legitimately writes Mārtiņš Lācis in Latin, not only Мартын Лацис. So the
// allowed set is the union of what each code permits — still enough to catch a
// Russian transliteration standing in for Hangul, Hanzi or Georgian.
function checkNativeScript(text, { citizenship, origin, field = 'cyrillic' } = {}) {
    const value = String(text || '').trim();
    if (!value) return null;
    const codes = [citizenship, origin]
        .map(entry => (typeof entry === 'string' ? entry.trim() : ''))
        .filter(Boolean);
    const code = codes.join(' + ');
    const allowed = [...new Set(codes.flatMap(entry => scriptsFor(entry) || []))];
    if (!allowed.length) return null;
    const found = detectScripts(value);
    if (!found.length) return null;
    const wrong = found.filter(script => !allowed.includes(script));
    if (!wrong.length) return null;
    return {
        code,
        allowed,
        found: wrong,
        message:
            `${field} "${value}" is written in ${wrong.join('/')} but nationality '${code}' `
            + `writes its names in ${allowed.join(' or ')}. `
            + `${field} is the person's name in their OWN script, not a Russian transliteration `
            + `(박헌영, not Пак Хон Ён; Kádár János, not Янош Кадар). `
            + `Set the correct script, fix citizenship if it is wrong, or pass `
            + `nativeScriptOverride: true if the mismatch is deliberate.`,
    };
}

module.exports = {
    NATION_SCRIPTS,
    FAMILY_FIRST,
    familyFirstJoiner,
    detectScripts,
    scriptsFor,
    checkNativeScript,
};
