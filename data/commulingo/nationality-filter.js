const { hasFlag, flagLabel } = require('./flag-icons');
const { countryHref } = require('./country-geography');

const FILTER_KINDS = {
    citizenship: {
        personField: 'citizenship',
        pathSegment: 'citizenship',
        label: { ko: '소속 국가', en: 'Citizenship' },
        peopleLabel: { ko: '소속 인물', en: 'Citizens' },
        countrySection: 'country-citizenship',
    },
    nationalOrigin: {
        personField: 'origin',
        pathSegment: 'national-origin',
        label: { ko: '출신 배경', en: 'National background' },
        peopleLabel: { ko: '출신 인물', en: 'People of origin' },
        countrySection: 'country-origin',
    },
};

// 조지아 is the US state; the country and the people are 그루지야 in Korean on
// this site. FLAG_NAMES has said so since the spellings were unified, and every
// stored row now agrees — this stays as the backstop for a row that arrives
// carrying the other spelling, and it covers citizenship as well as background
// because the rule does not distinguish the two.
function canonicalNationalityLabel(kind, code, label, lang) {
    if (code === 'georgia' && lang !== 'en') return '그루지야';
    return label || flagLabel(code, lang);
}

function nationalityHubHref(kind, code) {
    const config = FILTER_KINDS[kind];
    if (!config || !hasFlag(code)) return '';
    return `/commulingo/people/${config.pathSegment}/${encodeURIComponent(code)}`;
}

// A person's flag opens the country hub at the matching people section: the
// hub carries the events and organizations too, and its "view all" leads on to
// the full list. Codes without a hub keep the plain list.
function personFlagHref(kind, code) {
    const config = FILTER_KINDS[kind];
    const hub = config ? countryHref(code) : '';
    return hub ? `${hub}#${config.countrySection}` : nationalityHubHref(kind, code);
}

function buildNationalityFilter(people, kind, code, lang) {
    const config = FILTER_KINDS[kind];
    if (!config || !hasFlag(code)) return null;
    const localizedKind = config.label[lang === 'en' ? 'en' : 'ko'];
    const nationLabel = canonicalNationalityLabel(kind, code, flagLabel(code, lang), lang);
    return {
        kind,
        code,
        label: nationLabel,
        kindLabel: localizedKind,
        peopleLabel: config.peopleLabel[lang === 'en' ? 'en' : 'ko'],
        href: nationalityHubHref(kind, code),
        people: (people || []).filter(person => {
            const value = person && person[config.personField];
            return value && value.code === code;
        }),
    };
}

module.exports = { nationalityHubHref, personFlagHref, buildNationalityFilter, canonicalNationalityLabel };
