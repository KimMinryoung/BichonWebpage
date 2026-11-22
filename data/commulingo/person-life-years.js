// A trailing dash means living; a question mark after it means unknown death
// date/status. Never infer that somebody is alive merely from deathYear=null.
//
// Label form (2026-11-22 owner decision): 1898–1976, 1987– (living), an
// uncertain year with a trailing ? (1757?–1791), a disputed year as two
// ascending years (1896/1898–1957/1960), an unknown year as ? (?–1918,
// 1905–?, ?–?). No c., no 이후/after, no spaces around the dash. Reading
// stays lenient (LEGACY_*) so an old snapshot still parses.
const YEAR_PART = '(?:\\d{3,4}(?:/\\d{3,4})?\\??|\\?)';
const LIFE_YEARS = new RegExp(`^${YEAR_PART}–(?:${YEAR_PART})?$`);
const LEGACY_YEAR_PART = YEAR_PART;
const LIVING_YEARS = new RegExp(`^(?:c\\.\\s*)?${LEGACY_YEAR_PART}\\s*[–-]\\s*$`);

function yearOrderProblem(years) {
    for (const [, a, b] of years.matchAll(/(\d{3,4})\/(\d{3,4})/g)) {
        if (Number(a) >= Number(b)) return `years «${years}»: write two possible years in ascending order (${b}/${a})`;
    }
    return '';
}
const STATUS_WORD = /현재|현대|생존|현존|현역|활동\s*중|\b(?:present|current|living|active|contemporary)\b/i;

// Read-side compatibility for old snapshots. Writes must use the canonical
// date form, so an invalid input is reported instead of silently accepted.
function normalizeLifeYears(value) {
    if (typeof value !== 'string') return '';
    const label = value.trim();
    if (/^(?:현재|현대|생존|현존|present|current|living|alive|contemporary)$/i.test(label)) return '?–';
    if (/^(?:20세기|\?)\s*[–-]\s*(?:현재|present|living|alive)$/i.test(label)) return '?–';
    const birthOnly = /^b\.\s*(\d{3,4})$/i.exec(label);
    if (birthOnly) return `${birthOnly[1]}–`;
    return label.replace(/\s*[–-]\s*(?:현재|present|current|living|alive)$/i, '–');
}

function parseLifeYears(value) {
    const label = normalizeLifeYears(value);
    const parts = label.split(/[–-]/).map(part => part.trim());
    const exactYear = part => /^\d{3,4}$/.test(part || '') ? Number(part) : null;
    return {
        label,
        birthYear: parts.length === 2 ? exactYear(parts[0]) : null,
        deathYear: parts.length === 2 ? exactYear(parts[1]) : null,
        isLiving: LIVING_YEARS.test(label),
    };
}

function personLifeProblems(years, fate) {
    const problems = [];
    if (typeof years !== 'string' || (years !== '' && (!LIFE_YEARS.test(years) || years !== years.trim()))) {
        problems.push('years must be a year range joined by – without spaces: 1898–1976; 1987– for living; ?– for living with unknown birth year; 1757?–1791 for an uncertain year; 1896/1898–1937 for two possible years; ?–? for unknown dates — never c., 이후/after or 현재/present');
    }
    const order = typeof years === 'string' ? yearOrderProblem(years) : '';
    if (order) problems.push(order);
    const labels = fate && fate.label;
    const ko = typeof labels === 'string' ? labels : labels && labels.ko || '';
    const en = typeof labels === 'object' && labels ? labels.en || '' : '';
    if (parseLifeYears(years).isLiving && (fate && fate.kind || ko || en)) {
        problems.push('living people must have an empty fate kind and labels (use fate: null to clear them)');
    }
    if (years !== '' && !parseLifeYears(years).isLiving && !(fate && fate.kind)) {
        problems.push('a dead person needs fate.kind — unknown when the cause of death is not known');
    }
    if (STATUS_WORD.test(`${ko} ${en}`) || /^(?:still\s+)?alive\b/i.test(en.trim())) problems.push('fate is not a living/current activity status field');
    return problems;
}

module.exports = { parseLifeYears, normalizeLifeYears, personLifeProblems };
