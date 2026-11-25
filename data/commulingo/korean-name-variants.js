// Korean given names are written joined in English (Park Chunghee, owner
// decision 2026-11-25). Quotations and older prose still write the syllables
// apart (Park Chung-hee, Park Chung Hee); those forms are computed here for
// linking and search instead of being stored as aliases.
const KOREAN_CODES = new Set(['korea', 'south-korea', 'north-korea']);
const SYLLABLE = /^(?:kk|tt|pp|ss|jj|ch|sh|gh|[bdfghjklmnprstcy])?(?:[yw])?(?:[aeiou]{1,3}|[ŏŭ])(?:ng|[bdgklmnprth])?$/;
const JOINED = /^(\p{Lu}\p{Ll}*) (\p{Lu}\p{Ll}{2,})$/u;

function isKorean(person) {
    return [person.citizenship, person.nationalOrigin, person.origin]
        .some(value => value && KOREAN_CODES.has(value.code));
}

// Separated spellings of one joined two-word name; [] for anything else.
function separatedForms(text) {
    const match = JOINED.exec(text || '');
    if (!match) return [];
    const [, family, given] = match;
    const lower = given.toLowerCase();
    const forms = [];
    for (let i = 1; i < lower.length; i += 1) {
        const head = lower.slice(0, i);
        const tail = lower.slice(i);
        if (!SYLLABLE.test(head) || !SYLLABLE.test(tail)) continue;
        const first = given.slice(0, i);
        const capital = tail[0].toUpperCase() + tail.slice(1);
        forms.push(`${family} ${first}-${tail}`, `${family} ${first}-${capital}`, `${family} ${first} ${capital}`);
    }
    return forms;
}

function koreanNameVariants(person, text) {
    return isKorean(person) ? separatedForms(text) : [];
}

module.exports = { koreanNameVariants, separatedForms };
