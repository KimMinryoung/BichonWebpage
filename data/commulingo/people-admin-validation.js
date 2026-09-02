const { checkNativeScript, familyFirstJoiner } = require('./native-script');
const { hasFlag, flagLabel } = require('./flag-icons');
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

module.exports = { nationality, normalizeNationality, requireNationalOrigin, requirePatronymicState, assertNativeScript, withNativeNameAliases, collapseSpaces, splitFullName, composeFullName, resolveNameParts, assertPatronymicSeparate };
