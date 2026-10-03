// What a person alias may be (dev_docs/commulingo-alias-standard.md). Aliases
// are shown on the detail page and under a search hit, so each one is a name
// the reader can read in that language — not a note about it.
//
//   - Korean aliases are Hangul (digits and . · - allowed); English aliases are
//     Latin script (diacritics, digits and . , - ' ’ ʻ & allowed). The native-script
//     form belongs to `cyrillic`, not to the aliases.
//   - No parentheses, quotes or labels such as 본명/필명 or "born": the alias is
//     the name itself.
//   - Not the headword, the headword with its patronymic, or the bare one-word
//     family name — the dictionary already searches and links those.
// Storage syntax (NFC, spaces, length, duplicates) stays in headword-validation.js.

const { familyNameOf } = require('./family-name');

const KO_ALLOWED = /^[\p{Script=Hangul}0-9 .·\-]+$/u;
const EN_ALLOWED = /^[\p{Script=Latin}\p{M}0-9 .,\-'’ʻʼ&]+$/u;
const KO_LABEL = /(?:^|\s)(?:본명|필명|가명|작전명|암호명|별명|애칭|당명|영국명)(?:\s|$)/u;
const EN_LABEL = /^(?:born|née|né|nicknamed|pseudonym|operational|alias|aka|real name)\b/iu;

function aliasProblem(alias, lang, names = {}) {
    const value = String(alias || '');
    if (lang === 'ko') {
        if (!/\p{Script=Hangul}/u.test(value) || !KO_ALLOWED.test(value)) return 'Korean aliases are written in Hangul only (no Latin, native script, parentheses or quotes)';
        if (KO_LABEL.test(value)) return 'an alias is the name alone, without labels like 본명/필명';
    } else {
        if (!/\p{Script=Latin}/u.test(value) || !EN_ALLOWED.test(value)) return 'English aliases are written in Latin script only (no native script, parentheses or quotes)';
        if (EN_LABEL.test(value)) return 'an alias is the name alone, without labels like "born"';
    }
    // Exact match: an English case variant (Macarthur) is its own link form.
    // The family name is redundant only where the linker offers it by itself:
    // one word it trusts (not de Gaulle, not Mil, which reads as a numeral).
    const family = /\s/.test(names.family || '') ? '' : familyNameOf({ names: { family: names.family } });
    const own = [names.name, names.full, family].filter(Boolean);
    if (own.includes(value.trim())) return 'the headword and its bare family name are already searched and linked; do not repeat them as aliases';
    return '';
}

// names for one language: { name, family, full } where full is the display
// form with the patronymic.
function assertPersonAliases(aliases, namesByLang) {
    for (const lang of ['ko', 'en']) {
        for (const alias of (aliases && aliases[lang]) || []) {
            const problem = aliasProblem(alias, lang, namesByLang[lang] || {});
            if (problem) {
                const error = new Error(`aliases.${lang} '${alias}': ${problem}`);
                error.status = 400;
                throw error;
            }
        }
    }
}

module.exports = { aliasProblem, assertPersonAliases };
