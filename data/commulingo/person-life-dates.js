// Exact birth and death dates (migration 373, 2026-11-01). The year stays in
// years_label (the card shows only it); a date is stored only when the source
// gives at least the month: [year, month] or [year, month, day], Gregorian (new
// style). Its year must equal the exact year in years_label, so the two never
// disagree. The person page shows the date where one exists.

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function normalizeLifeDate(value, label) {
    if (value === null || value === undefined) return null;
    if (!Array.isArray(value) || value.length < 2 || value.length > 3 || !value.every(Number.isInteger)) {
        throw badRequest(`lifeDates.${label} must be [year, month] or [year, month, day] (a year alone stays in years)`);
    }
    const [year, month, day] = value;
    if (year < 1 || year > 9999 || month < 1 || month > 12) throw badRequest(`lifeDates.${label} has an invalid year or month`);
    if (day !== undefined && (day < 1 || day > daysInMonth(year, month))) throw badRequest(`lifeDates.${label} has an invalid day`);
    return value.slice();
}

// input {birth?, death?}; a side left out keeps `stored`, null clears it.
function resolveLifeDates(input, stored, years) {
    if (input !== undefined && input !== null && (typeof input !== 'object' || Array.isArray(input))) {
        throw badRequest('lifeDates must be {birth, death} (null clears all)');
    }
    for (const key of Object.keys(input || {})) if (!['birth', 'death'].includes(key)) throw badRequest(`unknown lifeDates key ${key}`);
    const pick = side => input === null ? null
        : input && Object.hasOwn(input, side) ? normalizeLifeDate(input[side], side)
            : (stored && stored[side]) || null;
    const dates = { birth: pick('birth'), death: pick('death') };
    for (const [side, year] of [['birth', years.birthYear], ['death', years.deathYear]]) {
        if (dates[side] && dates[side][0] !== year) {
            throw badRequest(`lifeDates.${side} year ${dates[side][0]} does not match years (${years.label || 'empty'}); fix years or lifeDates together`);
        }
    }
    return dates;
}

function dateText(date, lang) {
    const [year, month, day] = date;
    if (lang === 'ko') return `${year}년 ${month}월${day ? ` ${day}일` : ''}`;
    return `${day ? `${day} ` : ''}${MONTHS_EN[month - 1]} ${year}`;
}

// Page label: each side with a date shows it, the other keeps its years part.
// Empty when neither side has a date, so the page falls back to years.
function lifeDatesLabel(yearsLabel, dates, lang) {
    if (!dates || (!dates.birth && !dates.death)) return '';
    const parts = String(yearsLabel || '').split(/\s*[–-]\s*/);
    if (parts.length !== 2) return '';
    const birth = dates.birth ? dateText(dates.birth, lang) : parts[0];
    const death = dates.death ? dateText(dates.death, lang) : parts[1];
    return death ? `${birth} – ${death}` : `${birth} –`;
}

module.exports = { normalizeLifeDate, resolveLifeDates, lifeDatesLabel };
