const { hasFlag, flagLabel } = require('./flag-icons');

const FILTER_KINDS = {
    citizenship: {
        personField: 'citizenship',
        pathSegment: 'citizenship',
        label: { ko: '국적', en: 'Citizenship' },
    },
    nationalOrigin: {
        personField: 'origin',
        pathSegment: 'national-origin',
        label: { ko: '민족·국가적 배경', en: 'National background' },
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
        href: nationalityHubHref(kind, code),
        people: (people || []).filter(person => {
            const value = person && person[config.personField];
            return value && value.code === code;
        }),
    };
}

module.exports = { nationalityHubHref, buildNationalityFilter, canonicalNationalityLabel };
