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
// commulingo/people.py (_NATION_SCRIPTS) — keep the two in sync.

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
    ['ethiopic', /[\u1200-\u139F\u2D80-\u2DDF]/],
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
    serbia: ['latin', 'cyrillic'],
    croatia: LATIN,
    slovenia: LATIN,
    montenegro: ['latin', 'cyrillic'],
    'bosnia-herzegovina': ['latin', 'cyrillic'],
    switzerland: LATIN,
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
    afghanistan: ['arabic'],
    greece: ['greek'],
    // Amharic/Tigrinya in Ge'ez; Oromo and Somali write Latin (Qubee, 1972
    // Somali orthography); older Somali and Eritrean names also appear in Arabic.
    ethiopia: ['ethiopic', 'latin'],
    eritrea: ['ethiopic', 'latin', 'arabic'],
    somalia: ['latin', 'arabic'],
};

// Nations whose people write the family name first, and how the two parts
// join per language. Korean text fuses Korean/Chinese/Vietnamese names
// (김무정, 펑더화이, 호찌민) and keeps the space for Japanese and Hungarian
// (도쿠다 규이치, 카다르 야노시 — Korean orthography follows the Hungarian
// order, as 국립국어원 and Korean reference works do); English follows each
// nation's own romanization — family first for Korean/Chinese/Vietnamese
// (Kim Mu-chong, Peng Dehuai, Le Duan), given first for Japanese and
// Hungarian (Sen Katayama, János Kádár). Khmer names are family first and
// spaced in both languages (폴 포트, 노로돔 시아누크 / Hun Sen, Khieu Samphan):
// 노로돔 is the family, 시아누크 the given name. Singaporean Chinese names are
// fused in Korean and family first in English (리콴유 / Lee Kuan Yew).
// Nations absent here use Western
// "given family". The rule keys on citizenship_code alone: an ethnic
// Hungarian with Romanian papers (Tőkés) or a Korean with Soviet ones (허가이)
// follows the citizenship's order. A fused Korean-text name is still stored as
// family + given (마오 + 쩌둥); only a mononym (푸이, 히로히토) lives wholly in
// the family part.
// Ported to leninbot commulingo/people.py — keep the two in
// sync, and run scripts/audit-person-name-order.js after touching either.
const FAMILY_FIRST = {
    korea: { ko: '', en: ' ' },
    'north-korea': { ko: '', en: ' ' },
    'south-korea': { ko: '', en: ' ' },
    china: { ko: '', en: ' ' },
    vietnam: { ko: '', en: ' ' },
    japan: { ko: ' ', en: null },
    hungary: { ko: ' ', en: null },
    cambodia: { ko: ' ', en: ' ' },
    singapore: { ko: '', en: ' ' },
};

// The joiner between family and given when `code` writes the family name
// first in `lang`; null means Western given-first order.
function familyFirstJoiner(code, lang) {
    const key = typeof code === 'string' ? code.trim() : '';
    const rule = Object.prototype.hasOwnProperty.call(FAMILY_FIRST, key) ? FAMILY_FIRST[key] : null;
    if (!rule) return null;
    return rule[lang] !== undefined ? rule[lang] : null;
}

// Korean, Chinese, Vietnamese and Singaporean names: Korean text fuses the
// family name onto the given name (마오쩌둥). The parts are still stored apart
// (마오 + 쩌둥, like Mao + Zedong); only a mononym or pen name with no
// surname to split off (푸이, 또흐우) keeps the whole name in family. These
// surnames are shared by millions (마오, 저우, 쯔엉; Mao, Zhou, Trường), so
// the linker never links one bare.
function fusesFamilyName(code) {
    return familyFirstJoiner(code, 'ko') === '';
}

// Korean names always carry a surname: 허가이 is 허 + 가이 (Ho + Ka-i), never
// one token, so a Korean citizen's given part is never empty.
const SURNAME_REQUIRED = new Set(['korea', 'north-korea', 'south-korea']);

function requiresSurname(code) {
    return SURNAME_REQUIRED.has(typeof code === 'string' ? code.trim() : '');
}

// Nations whose people carry no surname. The name as people call it lives
// wholly in the family part and given stays empty, so no father's name is
// ever offered as a bare "family name" alias. Two shapes:
// - Mongolia: "father's name in the genitive + own name" (Yumjaagiin
//   Tsedenbal), called by the own name alone — 체덴발, 수흐바타르. The genitive
//   form goes to the aliases (발링기인 체렌도르지), never into the name parts or
//   the native-name line (Цэдэнбал, not Юмжаагийн Цэдэнбал).
// - Ethiopia, Eritrea, Somalia: "own name + father's name (+ grandfather's)",
//   called by the whole chain — 멩기스투 하일레 마리암, 무함마드 시아드 바레 —
//   which is stored whole, native line included. The own name or a customary
//   short form (멩기스투, 시아드 바레) goes to the aliases.
// A monarch keeps the dictionary-wide regnal shape (하일레 셀라시에 + 1세).
// Ported to leninbot commulingo/people.py (_SINGLE_NAME) — keep in sync.
const SINGLE_NAME = new Set(['mongolia', 'ethiopia', 'eritrea', 'somalia']);

function isSingleNameNation(code) {
    return SINGLE_NAME.has(typeof code === 'string' ? code.trim() : '');
}

// '1세', 'II' — the family slot of a monarch's name.
const REGNAL_NUMBER = /^(?:[IVXLCDM]+|\d+세)$/;

function isRegnalNumber(text) {
    return REGNAL_NUMBER.test(String(text || '').trim());
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
    fusesFamilyName,
    requiresSurname,
    SINGLE_NAME,
    isSingleNameNation,
    isRegnalNumber,
    detectScripts,
    scriptsFor,
    checkNativeScript,
};
