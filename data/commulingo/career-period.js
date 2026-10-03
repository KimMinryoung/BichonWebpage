// Structured periods for career entries and office rows.
//
// The table columns are the source of truth: start/end year-month-day, a
// qualifier per side, an ongoing flag and, only for periods the columns cannot
// express ("전후", conflicting sources), a bilingual override label. The
// display string is formatted from them per language; nothing parses a label.
//
// Admin/upsert input (career entry `period`, office row `period`):
//   { "start": [1918, 7], "end": [1918, 9] }            → 1918.07–09
//   { "start": [1920], "startQual": "decade" }           → 1920년대 / 1920s
//   { "start": [2017], "ongoing": true }                 → 2017–현재 / 2017–present
//   { "start": [1963], "label": {"ko": "1963 또는 1964", "en": "1963 or 1964"} }

const QUALS = {
    circa: 'start or end — about that date',
    decade: 'the year is a decade (1920 = the 1920s)',
    early: 'early part of the decade', mid: 'middle of the decade', late: 'late part of the decade',
    after: 'that date or later',
    summer: 'summer of the year',
    until: 'end only, with no start: up to that date',
    open: 'end only, with no date: continued, end not recorded',
    unknown: 'end only, with no date: ended at an unknown date',
};
const DECADE_QUALS = new Set(['decade', 'early', 'mid', 'late']);
const END_ONLY = new Set(['until', 'open', 'unknown']);
const NO_DATE = new Set(['open', 'unknown']);

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

const SHAPE = 'period must be {"start": [year, month?, day?], "end": [year, month?, day?] | null, '
    + '"startQual"?, "endQual"?, "ongoing"?, "label"?: {"ko","en"}}';

function point(value, side, where) {
    if (value === undefined || value === null) return null;
    if (!Array.isArray(value) || value.length < 1 || value.length > 3 || !value.every(Number.isInteger)) {
        throw badRequest(`${where}.${side} must be [year, month?, day?] of integers`);
    }
    const [year, month = null, day = null] = value;
    if (year < 1 || year > 2100) throw badRequest(`${where}.${side} year out of range`);
    if (month !== null && (month < 1 || month > 12)) throw badRequest(`${where}.${side} month must be 1–12`);
    if (day !== null) {
        const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
        if (day < 1 || day > last) throw badRequest(`${where}.${side} day out of range`);
    }
    return { year, month, day };
}

function qual(value, side, where) {
    if (value === undefined || value === null || value === '') return null;
    if (!Object.hasOwn(QUALS, value)) throw badRequest(`${where}.${side}Qual must be one of ${Object.keys(QUALS).join(', ')}`);
    return value;
}

function order(p) {
    return p ? [p.year, p.month || 0, p.day || 0] : null;
}

// Validated input → column values. Throws 400 with the expected shape.
function periodColumns(input, where = 'period') {
    if (typeof input === 'string') throw badRequest(`${where} is a string; ${SHAPE}`);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw badRequest(`${where} is required; ${SHAPE}`);
    const allowed = new Set(['start', 'end', 'startQual', 'endQual', 'ongoing', 'label']);
    const extra = Object.keys(input).filter(key => !allowed.has(key));
    if (extra.length) throw badRequest(`${where} has unknown keys ${extra.join(', ')}; ${SHAPE}`);
    const start = point(input.start, 'start', where);
    const end = point(input.end, 'end', where);
    const startQual = qual(input.startQual, 'start', where);
    const endQual = qual(input.endQual, 'end', where);
    const ongoing = input.ongoing === true;
    if (input.ongoing !== undefined && typeof input.ongoing !== 'boolean') throw badRequest(`${where}.ongoing must be a boolean`);
    let label = null;
    if (input.label !== undefined && input.label !== null) {
        const ko = input.label && typeof input.label.ko === 'string' ? input.label.ko.trim() : '';
        const en = input.label && typeof input.label.en === 'string' ? input.label.en.trim() : '';
        if (!ko || !en) throw badRequest(`${where}.label must have non-empty ko and en`);
        label = { ko, en };
    }
    if (startQual && END_ONLY.has(startQual)) throw badRequest(`${where}.startQual ${startQual} applies to the end only`);
    if (startQual && !start) throw badRequest(`${where}.startQual needs a start`);
    if (endQual && NO_DATE.has(endQual) && end) throw badRequest(`${where}.endQual ${endQual} takes no end date`);
    if (endQual && !NO_DATE.has(endQual) && !end) throw badRequest(`${where}.endQual ${endQual} needs an end`);
    if (endQual === 'until' && start) throw badRequest(`${where}.endQual until is for a period with no start`);
    for (const [p, q, side] of [[start, startQual, 'start'], [end, endQual, 'end']]) {
        if (q && DECADE_QUALS.has(q) && (p.month !== null || p.year % 10)) {
            throw badRequest(`${where}.${side}Qual ${q} needs a decade year (1920) without month`);
        }
    }
    if (ongoing && (end || endQual)) throw badRequest(`${where}.ongoing excludes an end`);
    if (!start && !end && !ongoing && !label && !endQual) throw badRequest(`${where} is empty; ${SHAPE}`);
    if (start && end) {
        const a = order(start), b = order(end);
        if (b[0] < a[0] || (b[0] === a[0] && (b[1] < a[1] || (b[1] === a[1] && b[2] < a[2])))) {
            throw badRequest(`${where}.end precedes start`);
        }
    }
    return {
        startYear: start ? start.year : null, startMonth: start ? start.month : null, startDay: start ? start.day : null,
        endYear: end ? end.year : null, endMonth: end ? end.month : null, endDay: end ? end.day : null,
        startQual, endQual, ongoing,
        labelKo: label ? label.ko : null, labelEn: label ? label.en : null,
    };
}

// DB row (snake_case columns) → the input shape, for Admin reads and round trips.
function periodFromRow(row) {
    const pt = (y, m, d) => (y == null ? null : [y, m, d].slice(0, d != null ? 3 : m != null ? 2 : 1));
    const period = { start: pt(row.start_year, row.start_month, row.start_day), end: pt(row.end_year, row.end_month, row.end_day) };
    if (row.start_qual) period.startQual = row.start_qual;
    if (row.end_qual) period.endQual = row.end_qual;
    if (row.ongoing) period.ongoing = true;
    if (row.period_label_ko || row.period_label_en) period.label = { ko: row.period_label_ko || '', en: row.period_label_en || '' };
    return period;
}

const pad = n => String(n).padStart(2, '0');

function formatPoint(p, q, lang) {
    if (!p) return '';
    const ko = lang === 'ko';
    if (q === 'decade') return ko ? `${p.year}년대` : `${p.year}s`;
    if (q === 'early') return ko ? `${p.year}년대 초` : `early ${p.year}s`;
    if (q === 'mid') return ko ? `${p.year}년대 중반` : `mid-${p.year}s`;
    if (q === 'late') return ko ? `${p.year}년대 후반` : `late ${p.year}s`;
    if (q === 'summer') return ko ? `${p.year} 여름` : `summer ${p.year}`;
    const base = String(p.year) + (p.month ? '.' + pad(p.month) : '') + (p.day ? '.' + pad(p.day) : '');
    if (q === 'circa') return ko ? `${base}${p.month ? '' : '년'}경` : `c. ${base}`;
    if (q === 'after') return ko ? `${base} 이후` : `after ${base}`;
    return base;
}

// Columns → display string. Same year/month ends are shortened the way the
// hand-written labels were: 1918.07–09, 1965.03.18–19; years stay full.
function formatPeriod(period, lang = 'ko') {
    if (!period) return '';
    if (period.label) return (lang === 'en' ? period.label.en : period.label.ko) || period.label.ko || period.label.en || '';
    const toPoint = a => (a ? { year: a[0], month: a[1] || null, day: a[2] || null } : null);
    const start = toPoint(period.start);
    const end = toPoint(period.end);
    const sq = period.startQual || null;
    const eq = period.endQual || null;
    const s = formatPoint(start, sq, lang);
    if (period.ongoing) return s ? `${s}–${lang === 'en' ? 'present' : '현재'}` : (lang === 'en' ? 'present' : '현재');
    if (eq === 'open') return `${s}–`;
    if (eq === 'unknown') return `${s}–?`;
    if (!end) return s;
    if (eq === 'until' || !start) return `–${formatPoint(end, null, lang)}`;
    let e = formatPoint(end, eq, lang);
    if (!sq && !eq && start.month && end.month && start.year === end.year) {
        if (start.month === end.month && start.day && end.day) e = start.day === end.day ? '' : pad(end.day);
        else if (!start.day && !end.day) e = start.month === end.month ? '' : pad(end.month);
    } else if (!sq && !eq && !start.month && !end.month && start.year === end.year) {
        e = '';
    }
    return e ? `${s}–${e}` : s;
}

function formatBoth(period) {
    return { ko: formatPeriod(period, 'ko'), en: formatPeriod(period, 'en') };
}

// Column list and values for INSERT/UPDATE, in one order.
const PERIOD_COLUMNS = ['start_year', 'start_month', 'start_day', 'end_year', 'end_month', 'end_day',
    'start_qual', 'end_qual', 'ongoing', 'period_label_ko', 'period_label_en'];

function periodValues(cols) {
    return [cols.startYear, cols.startMonth, cols.startDay, cols.endYear, cols.endMonth, cols.endDay,
        cols.startQual, cols.endQual, cols.ongoing, cols.labelKo, cols.labelEn];
}

module.exports = { QUALS, SHAPE, periodColumns, periodFromRow, formatPeriod, formatBoth, PERIOD_COLUMNS, periodValues };
