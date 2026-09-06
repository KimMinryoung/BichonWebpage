// Country tags on a history event's timeline entries.
//
// A multi-country event (the Baltic wars of independence, the people's
// democracies of 1944–1949) reads by phase in the prose and by country in the
// timeline: each entry may carry `country`, one flag code or a list of codes
// from flag-icons.js, and the panel prints the flags beside the date and offers
// one chip per country to filter the list. Unknown codes are dropped here so a
// typo in the DB neither breaks the page nor shows a broken image; the audit
// script (audit-event-locations.js) reports them.
const { hasFlag, flagLabel, flagImg } = require('./flag-icons');

// -> unique valid codes, in the order written.
function timelineCountries(value) {
    const list = Array.isArray(value) ? value : (value == null || value === '' ? [] : [value]);
    const out = [];
    list.forEach(code => {
        if (hasFlag(code) && !out.includes(code)) out.push(code);
    });
    return out;
}

// The chip row: every country that appears in the timeline, in order of first
// appearance, with its localized label and flag markup. Fewer than two
// countries is not a filter, so the caller gets an empty list and shows none.
function countryFilter(timeline, lang) {
    const codes = [];
    (timeline || []).forEach(item => {
        timelineCountries(item.country).forEach(code => { if (!codes.includes(code)) codes.push(code); });
    });
    if (codes.length < 2) return [];
    return codes.map(code => ({ code, label: flagLabel(code, lang), flagHtml: flagImg(code, flagLabel(code, lang)) }));
}

function flagsHtml(codes, lang) {
    return (codes || []).map(code => flagImg(code, flagLabel(code, lang))).join('');
}

module.exports = { timelineCountries, countryFilter, flagsHtml };
