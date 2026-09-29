const { checkNativeScript, familyFirstJoiner, isSingleNameNation } = require('./native-script');
const { hasFlag, flagLabel } = require('./flag-icons');
const { citizenshipOnlyCodes } = require('./nationality-policy.json');
const { canonicalNationalityLabel } = require('./nationality-filter');
const { mergePatronymicPatch, patronymicProblem, nationalOriginInput } = require('./person-name-validation');
const { t, localized, badRequest } = require('./people-admin-fields');

// Name and nationality rules for person writes: native-script checks,
// family/given/patronymic composition per nationality, and the aliases a
// native name implies. Pure functions — no DB access.

function nationality(code, ko, en) {
    if (!code) return null;
    return { code, label: t(ko || flagLabel(code, 'ko'), en || flagLabel(code, 'en')) };
}

// citizenship / origin payload: { code, label? } — the label defaults to the
// flag table, and {} (or null) clears the field. An unknown code is rejected
// rather than stored, since the card would render no flag for it.
function normalizeNationality(node, field) {
    if (node === null) return { code: '', ko: '', en: '' };
    if (typeof node !== 'object') throw badRequest(`${field} must be an object { code, label }`);
    const code = typeof node.code === 'string' ? node.code.trim() : '';
    if (!code) return { code: '', ko: '', en: '' };
    if (!hasFlag(code)) {
        throw badRequest(
            `${field}.code '${code}' is not a known nationality code (no flag icon). `
            + 'See FLAG_NAMES in data/commulingo/flag-icons.js.'
        );
    }
    if (['nationalOrigin', 'origin'].includes(field) && citizenshipOnlyCodes.includes(code)) {
        throw badRequest(`${field}.code '${code}' is citizenship-only. Use a sourced national/ethnic background; do not infer it from birthplace or citizenship.`);
    }
    return {
        code,
        ko: canonicalNationalityLabel(field, code, localized(node.label, 'ko'), 'ko'),
        en: canonicalNationalityLabel(field, code, localized(node.label, 'en'), 'en'),
    };
}

function requireNationalOrigin(payload) {
    const resolved = nationalOriginInput(payload);
    if (resolved.invalid) throw badRequest(resolved.invalid);
    return resolved;
}

function requirePatronymicState(payload, before, nativeName) {
    const state = mergePatronymicPatch(payload, before);
    const problem = patronymicProblem(state, nativeName);
    if (problem) throw badRequest(problem);
    return state;
}

// The native-name line must be written in the person's own script. Rejecting the
// mismatch here is what keeps a Russian transliteration from being filed under a
// Korean, Hungarian or Chinese figure (see data/commulingo/native-script.js).
function assertNativeScript(payload, { citizenship, origin }) {
    // An empty value has no script to be wrong about, so checkNativeScript
    // passes it — and nine cards created 2026-09-16..18 went out with a blank
    // line under the display name. The line is required; the override below
    // only waives the script check.
    if (!String(payload.cyrillic ?? '').trim()) {
        throw badRequest('cyrillic (nativeName) is required: the person\'s name in their own script — for a Latin-script nationality usually the English name verbatim, diacritics included');
    }
    if (payload.nativeScriptOverride === true) return;
    const checks = [
        ['cyrillic', payload.cyrillic],
        ['cyrillicPatronymic', payload.cyrillicPatronymic],
    ];
    for (const [field, value] of checks) {
        if (value === undefined || value === null || value === '') continue;
        const problem = checkNativeScript(value, { citizenship, origin, field });
        if (problem) throw badRequest(problem.message);
    }
}

// `cyrillic` is the legacy column name for the native-script name; `nativeName`
// is the same field under a name that does not mislead. Accept both on input.
function withNativeNameAliases(payload) {
    const merged = { ...payload };
    if (merged.cyrillic === undefined && merged.nativeName !== undefined) merged.cyrillic = merged.nativeName;
    if (merged.cyrillicPatronymic === undefined && merged.nativePatronymic !== undefined) {
        merged.cyrillicPatronymic = merged.nativePatronymic;
    }
    return merged;
}

function collapseSpaces(value) {
    return (value || '').trim().replace(/\s+/g, ' ');
}

function splitFullName(full, lang, citizenshipCode) {
    const name = collapseSpaces(full);
    if (!name) return { given: '', family: '' };
    // Single-token names (East Asian fused names, mononyms) live in family.
    if (!name.includes(' ')) return { given: '', family: name };
    // Family-first nationalities lead with the family name (Kim Mu-chong,
    // 도쿠다 규이치); everyone else ends with it.
    if (familyFirstJoiner(citizenshipCode, lang) !== null) {
        const idx = name.indexOf(' ');
        return { given: name.slice(idx + 1), family: name.slice(0, idx) };
    }
    const idx = name.lastIndexOf(' ');
    return { given: name.slice(0, idx), family: name.slice(idx + 1) };
}

// The derived full name honors the nationality's name order: 김+무정 → 김무정,
// Peng+Dehuai → Peng Dehuai, everyone else given-first with a space.
function composeFullName(given, family, lang, citizenshipCode) {
    const joiner = familyFirstJoiner(citizenshipCode, lang);
    if (joiner !== null && given && family) return `${family}${joiner}${given}`;
    return [given, family].filter(Boolean).join(' ');
}

// A no-surname nation (Mongolia) keeps the personal name alone in family; a
// given part means a genitive patronymic was split off as if it were a name
// (수흐바타르 수흐바타르, 체렌도르지 발링기인).
function assertSingleName(parts, lang, citizenshipCode) {
    if (!isSingleNameNation(citizenshipCode) || !parts.given) return;
    throw badRequest(`'${citizenshipCode}' names have no surname: put only the personal name in `
        + `familyName.${lang} and leave givenName.${lang} empty ("${parts.given}" given). `
        + `The genitive patronymic form (발링기인 체렌도르지, Balingiin Tserendorj) belongs in aliases.`);
}

// Patronymics render between given and family in Western order, so a
// family-first or no-surname nation cannot hold one: 호른 줄러 with János filed
// as a patronymic rendered as 줄러 야노시 호른, 장쭤린 with his courtesy name as
// 위팅 장쭤린. A second given name, a courtesy name or a Mongolian genitive
// patronymic goes to the aliases instead.
function assertNoPatronymicForNameOrder(state, citizenshipCode) {
    const ordered = familyFirstJoiner(citizenshipCode, 'ko') !== null
        || familyFirstJoiner(citizenshipCode, 'en') !== null
        || isSingleNameNation(citizenshipCode);
    if (!ordered || !(state.ko || state.en || state.native)) return;
    throw badRequest(`'${citizenshipCode}' names take no patronymic ("${state.ko || state.en || state.native}" given): `
        + 'the page would compose it Western-style between given and family name. Put a second given name, '
        + 'courtesy name or genitive patronymic form in aliases and send patronymic: null.');
}

// A patronymic renders between given and family, so with no given part it
// leads the name: 카모 + 아르샤코비치 read 아르샤코비치 카모, 방 빠오 + his
// father's name read 넹추 방 방 빠오. A nickname or mononym takes no patronymic.
function assertPatronymicHasGiven(parts, patronymic, lang) {
    if (!patronymic || parts.given) return;
    throw badRequest(`patronymic.${lang} "${patronymic}" needs a given name: with givenName.${lang} empty `
        + 'it would render in front of the family name. Put the full form in aliases and send patronymic: null.');
}

// Name parts for one language from a payload: structured givenName/familyName
// win; the legacy full `name` is split per the nationality's name order.
function resolveNameParts(payload, lang, citizenshipCode) {
    const given = collapseSpaces(localized(payload.givenName, lang));
    const family = collapseSpaces(localized(payload.familyName, lang));
    if (given || family) {
        return { given, family, full: composeFullName(given, family, lang, citizenshipCode) };
    }
    const full = collapseSpaces(localized(payload.name, lang));
    return { ...splitFullName(full, lang, citizenshipCode), full };
}

// The patronymic lives only in commulingo_person_patronymics; a name that
// embeds it doubles on display (오토 율리예비치 율리예비치 시미트). Reject at
// the API instead of storing the duplication.
function assertPatronymicSeparate(parts, patronymic, lang) {
    const pat = collapseSpaces(patronymic);
    if (!pat) return;
    const tokens = `${parts.given} ${parts.family}`.split(' ').filter(Boolean);
    const embedded = lang === 'en'
        ? tokens.some(token => token.toLowerCase() === pat.toLowerCase())
        : tokens.includes(pat);
    if (embedded) {
        throw badRequest(
            `name (${lang}) embeds the patronymic '${pat}' — keep given/family names and the patronymic in separate fields`
        );
    }
}

// Letters NFKD cannot decompose to ASCII (same table as leninbot's _fold_slug).
const FOLD_LETTERS = { ł: 'l', Ł: 'l', ø: 'o', Ø: 'o', đ: 'd', Đ: 'd', ß: 'ss', æ: 'ae', Æ: 'ae', œ: 'oe', Œ: 'oe', þ: 'th', Þ: 'th', ð: 'd', Ð: 'd', ı: 'i' };
const slugOf = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
function foldSlug(text) {
    const folded = [...String(text || '')].map(ch => FOLD_LETTERS[ch] ?? ch).join('')
        .normalize('NFKD').replace(/\p{M}/gu, '').replace(/['’ʼ]/g, '');
    return slugOf(folded);
}

// A person id must romanize the name, not lose its letters: 2026-08 slugs
// dropped every non-ASCII letter (Lech Wałęsa -> lech-wa-sa, Edvard Beneš ->
// edvard-bene) and 24 cards had to be renamed with redirects. Reject an id that
// carries a name word with those letters dropped or turned into dashes.
function assertIdKeepsLetters(id, nameEn) {
    for (const word of String(nameEn || '').split(/\s+/)) {
        if (!/[^\x00-\x7f]/.test(word)) continue;
        const good = foldSlug(word);
        const cut = [word.replace(/[^\x00-\x7f]/g, ''), word.replace(/[^\x00-\x7f]/g, '-')].map(slugOf);
        for (const bad of cut) {
            if (bad && bad !== good && `-${id}-`.includes(`-${bad}-`)) {
                throw badRequest(`person id "${id}" drops letters of "${word}"; romanize it as "${good}"`);
            }
        }
    }
}

module.exports = { foldSlug, assertIdKeepsLetters, nationality, normalizeNationality, requireNationalOrigin, requirePatronymicState, assertNativeScript, withNativeNameAliases, collapseSpaces, splitFullName, composeFullName, resolveNameParts, assertSingleName, assertNoPatronymicForNameOrder, assertPatronymicHasGiven, assertPatronymicSeparate };
