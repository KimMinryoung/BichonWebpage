// The one assembler of a person's name (migration 361 dropped name_ko/name_en:
// the full name is never stored, only its parts — given_name_*, family_name_*,
// the patronymic in commulingo_person_patronymics and the citizenship that
// decides the order). Every reader composes through here: JS stores and
// presenters with personName/personLabel, SQL that only has to find a person
// by name with nameMatchSql, and leninbot through the composed name_ko/name_en
// the MCP datasets add to each row.
const { familyFirstJoiner } = require('./native-script');

// The patronymic sits between given and family names, which also places it
// correctly after multi-word given names. Family-first nationalities
// (korea/china/vietnam/japan — see native-script.js) lead with the family name
// instead: 김+무정 → 김무정, Peng+Dehuai → Peng Dehuai; those names never carry
// a patronymic, so a present patronymic keeps the Western shape.
function composeFromParts(given, patronymic, family, lang, citizenshipCode) {
    const joiner = familyFirstJoiner(citizenshipCode, lang);
    if (joiner !== null && given && family && !patronymic) return `${family}${joiner}${given}`;
    return [given, patronymic, family].filter(Boolean).join(' ');
}

// A commulingo_people row (given_name_*, family_name_*, citizenship_code) in
// one language, without the patronymic unless one is passed.
function personName(row, lang, patronymic = '') {
    const given = String(row[`given_name_${lang}`] || '').trim();
    const family = String(row[`family_name_${lang}`] || '').trim();
    return composeFromParts(given, String(patronymic || '').trim(), family, lang, row.citizenship_code || '');
}

function personNames(row) {
    return { ko: personName(row, 'ko'), en: personName(row, 'en') };
}

// Lists label a person by the name plus the card's disambiguating qualifier
// when it shares that name, 「오토 브라운 (프로이센 총리)」 (name_qualifier_*,
// migration 360). The person page heads with the bare name and prints the
// qualifier under it, so it does not use this.
function personLabel(name, qualifier) {
    const base = String(name || '').trim();
    const extra = String(qualifier || '').trim();
    return base && extra ? `${base} (${extra})` : base;
}

function personLabels(row) {
    return {
        ko: personLabel(personName(row, 'ko'), row.name_qualifier_ko),
        en: personLabel(personName(row, 'en'), row.name_qualifier_en),
    };
}

// The columns personName/personLabels read, for SELECT lists (prefix a table alias with `p.`).
function nameColumns(alias = '') {
    const a = alias ? `${alias}.` : '';
    return ['given_name_ko', 'given_name_en', 'family_name_ko', 'family_name_en', 'citizenship_code',
        'name_qualifier_ko', 'name_qualifier_en'].map(column => a + column).join(', ');
}

// SQL that finds a person by name without composing it: the parts in either
// order, spaces and case ignored, so 마오쩌둥, 마오 쩌둥, Mao Zedong and Zedong
// Mao all match. `mode` 'equals' compares the whole name, 'contains' a
// substring; `param` is the placeholder holding the query text ($1).
function nameMatchSql(alias, param, mode = 'equals') {
    const a = alias ? `${alias}.` : '';
    const query = `replace(lower(${param}), ' ', '')`;
    const target = mode === 'contains' ? `'%' || ${query} || '%'` : query;
    const op = mode === 'contains' ? 'LIKE' : '=';
    const forms = ['ko', 'en'].flatMap(lang => [
        `replace(lower(${a}given_name_${lang} || ${a}family_name_${lang}), ' ', '')`,
        `replace(lower(${a}family_name_${lang} || ${a}given_name_${lang}), ' ', '')`,
    ]);
    return '(' + forms.map(form => `${form} ${op} ${target}`).join(' OR ') + ')';
}

module.exports = { composeFromParts, personName, personNames, personLabel, personLabels, nameColumns, nameMatchSql };
