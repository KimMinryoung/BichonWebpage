const { hasFlag, flagLabel } = require('./flag-icons');
const { countryHref } = require('./country-geography');

const FILTER_KINDS = {
    citizenship: { queryParam: 'citizenship', countrySection: 'country-citizenship' },
    nationalOrigin: { queryParam: 'origin', countrySection: 'country-origin' },
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

// A person's flag opens the country hub at the matching people section.
// Codes without a hub link directly to the filtered people explorer.
function personFlagHref(kind, code) {
    const config = FILTER_KINDS[kind];
    if (!config || !hasFlag(code)) return '';
    const hub = countryHref(code);
    return hub ? `${hub}#${config.countrySection}`
        : `/commulingo/people?${config.queryParam}=${encodeURIComponent(code)}`;
}

module.exports = { personFlagHref, canonicalNationalityLabel };
