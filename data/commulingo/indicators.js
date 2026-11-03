// Time-varying figures (policy rates and the like) kept once as dated series
// instead of being typed into prose, where they go stale when the figure
// changes. A series is the data document indicator/<id>:
//
//   { id, title: {ko, en}, unit: 'percent', annual: true, decimals: 2,
//     source: {ko, en, url},
//     values: [{ from: 'YYYY-MM-DD', value: 2.5, source: 'https://…' }, …] }
//
// unit is a key of UNITS. value is a number, or [low, high] for a target range
// (a percent series only). values are the levels in force from each date,
// oldest first; a row announced ahead of its date (next year's minimum wage)
// stays out of prose until that date, in the Asia/Seoul calendar. A figure
// computed from another one (the legal cap on the jeonse conversion rate is
// the base rate plus two points) is not stored: DERIVED below computes it from
// its series, so the two can never disagree.
//
// Prose (term definition/body, event summary/body/timeline) names a figure
// with a token that is replaced when the page is presented:
//   {{indicator:kr-base-rate}}        연 2.50%(2025년 5월 29일 기준)
//   {{indicator:kr-base-rate|value}}  연 2.50%
//   {{indicator:kr-base-rate|date}}   2025년 5월 29일
// The date always travels with the value in the default form, so a figure
// that has gone stale still reads as true for its date.
const { getDataDocument, listDataDocuments, dataDocumentsRef } = require('./data-documents');

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TOKEN = /\{\{indicator:([a-z0-9-]+)(?:\|(value|date))?\}\}/g;

const DERIVED = {
    // 주택임대차보호법 시행령 제9조: 한국은행 기준금리 + 연 2% (2020-09-29 시행).
    'kr-jeonse-conversion-cap': {
        from: 'kr-base-rate',
        compute: value => value + 2,
        title: { ko: '전월세전환율 법정 상한', en: 'Legal cap on the jeonse-to-monthly-rent conversion rate' },
    },
    // 최저임금 고시의 월 환산 기준: 주 40시간, 유급 주휴 포함 월 209시간.
    'kr-minimum-wage-monthly': {
        from: 'kr-minimum-wage',
        compute: value => value * 209,
        unit: 'krw-per-month',
        title: { ko: '최저임금 월 환산액', en: 'Minimum wage, monthly equivalent' },
    },
};

const won = (value, decimals) => value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const UNITS = {
    percent: {
        format(value, decimals, lang, annual) {
            const number = Array.isArray(value)
                ? `${value[0].toFixed(decimals)}${lang === 'en' ? '–' : '~'}${value[1].toFixed(decimals)}%`
                : `${value.toFixed(decimals)}%`;
            if (!annual) return number;
            return lang === 'en' ? `${number} a year` : `연 ${number}`;
        },
    },
    'krw-per-hour': {
        format: (value, decimals, lang) => (lang === 'en' ? `KRW ${won(value, decimals)} an hour` : `시간당 ${won(value, decimals)}원`),
    },
    'krw-per-month': {
        format: (value, decimals, lang) => (lang === 'en' ? `KRW ${won(value, decimals)} a month` : `월 ${won(value, decimals)}원`),
    },
};

const seoulDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' });
const today = () => seoulDate.format(new Date(Date.now()));

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

// Data-document validator for the indicator/ family (data-documents.js).
function validateIndicatorDocument(content, key) {
    const id = key.slice('indicator/'.length);
    if (content.id !== id) throw badRequest(`${key}: id must match the key`);
    if (DERIVED[id]) throw badRequest(`${key}: ${id} is computed from ${DERIVED[id].from} and is not stored`);
    if (!content.title || typeof content.title.ko !== 'string' || typeof content.title.en !== 'string'
        || !content.title.ko.trim() || !content.title.en.trim()) throw badRequest(`${key}: title needs ko and en`);
    if (!Object.hasOwn(UNITS, content.unit)) throw badRequest(`${key}: unit must be one of ${Object.keys(UNITS).join(', ')}`);
    if (content.decimals !== undefined && !(Number.isInteger(content.decimals) && content.decimals >= 0 && content.decimals <= 4)) {
        throw badRequest(`${key}: decimals must be an integer 0–4`);
    }
    if (!Array.isArray(content.values) || !content.values.length) throw badRequest(`${key}: values missing`);
    let previous = '';
    content.values.forEach((row, index) => {
        if (!row || !DATE.test(row.from || '') || Number.isNaN(Date.parse(row.from))) throw badRequest(`${key}: values[${index}].from must be YYYY-MM-DD`);
        if (row.from <= previous) throw badRequest(`${key}: values must be in date order without repeats (${row.from})`);
        const isRange = Array.isArray(row.value);
        if (isRange && content.unit !== 'percent') throw badRequest(`${key}: values[${index}].value: only a percent series takes a range`);
        if (isRange ? !(row.value.length === 2 && row.value.every(Number.isFinite) && row.value[0] < row.value[1]) : !Number.isFinite(row.value)) {
            throw badRequest(`${key}: values[${index}].value must be a number or [low, high]`);
        }
        if (typeof row.source !== 'string' || !/^https:\/\//.test(row.source)) throw badRequest(`${key}: values[${index}].source must be an https URL`);
        previous = row.from;
    });
}

// { value, from, decimals, annual, unit } in force on `at` (YYYY-MM-DD, default
// today in Seoul), or null for an unknown id or a date before the series starts.
function resolveIndicator(id, at = today()) {
    const derived = DERIVED[id];
    if (derived) {
        const base = resolveIndicator(derived.from, at);
        return base && { ...base, value: derived.compute(base.value), unit: derived.unit || base.unit };
    }
    const series = getDataDocument(`indicator/${id}`);
    if (!series || !Array.isArray(series.values)) return null;
    const rows = series.values.filter(row => row.from <= at);
    const row = rows[rows.length - 1];
    if (!row) return null;
    return {
        value: row.value,
        from: row.from,
        decimals: Number.isInteger(series.decimals) ? series.decimals : 2,
        annual: series.annual !== false,
        unit: series.unit,
    };
}

function formatDate(from, lang) {
    const [y, m, d] = from.split('-').map(Number);
    if (lang === 'en') {
        const month = new Date(Date.UTC(y, m - 1, d)).toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
        return `${d} ${month} ${y}`;
    }
    return `${y}년 ${m}월 ${d}일`;
}

function formatValue(resolved, lang) {
    return UNITS[resolved.unit].format(resolved.value, resolved.decimals, lang, resolved.annual);
}

function formatIndicator(id, lang, form) {
    const resolved = resolveIndicator(id);
    if (!resolved) return null;
    if (form === 'value') return formatValue(resolved, lang);
    if (form === 'date') return formatDate(resolved.from, lang);
    return lang === 'en'
        ? `${formatValue(resolved, lang)} (as of ${formatDate(resolved.from, lang)})`
        : `${formatValue(resolved, lang)}(${formatDate(resolved.from, lang)} 기준)`;
}

// Replace every token in a text. An unknown id (writes refuse them, so this is
// a series deleted afterwards) shows as a visible gap rather than the raw token.
function expandIndicators(text, lang) {
    if (typeof text !== 'string' || !text.includes('{{indicator:')) return text;
    return text.replace(TOKEN, (match, id, form) => formatIndicator(id, lang, form) ?? '[?]');
}

// The same for a stored {ko, en} pair, for readers that keep both languages
// (the drill decks quote a definition in both).
function expandIndicatorPair(value) {
    if (!value || typeof value !== 'object') return value;
    return { ...value, ko: expandIndicators(value.ko, 'ko'), en: expandIndicators(value.en, 'en') };
}

// Ids named by tokens in a text that no series or derived figure answers.
function unknownIndicatorIds(text) {
    if (typeof text !== 'string' || !text.includes('{{indicator:')) return [];
    const unknown = new Set();
    for (const match of text.matchAll(TOKEN)) if (!resolveIndicator(match[1])) unknown.add(match[1]);
    return [...unknown];
}

// Throws when a localized field ({ko, en}) names an unknown indicator.
function assertKnownIndicators(field, value) {
    if (!value || typeof value !== 'object') return;
    for (const lang of Object.keys(value)) {
        const unknown = unknownIndicatorIds(value[lang]);
        if (unknown.length) throw badRequest(`${field}.${lang} names unknown indicator(s): ${unknown.join(', ')}`);
    }
}

// A stable object per set of figures in force, for render memos: it changes when
// an indicator document does or a dated row comes into force, not on every
// data-document write or every day.
let refMemo = { docs: null, day: '', signature: '', ref: {} };
function indicatorsRef() {
    const docs = dataDocumentsRef();
    const day = today();
    if (refMemo.docs === docs && refMemo.day === day) return refMemo.ref;
    const signature = listDataDocuments('indicator/')
        .map(entry => `${entry.key}@${entry.revision}:${resolveIndicator(entry.key.slice('indicator/'.length), day)?.from ?? ''}`)
        .join(',');
    refMemo = { docs, day, signature, ref: signature === refMemo.signature ? refMemo.ref : {} };
    return refMemo.ref;
}

module.exports = {
    DERIVED, validateIndicatorDocument, resolveIndicator, formatIndicator, expandIndicators, expandIndicatorPair,
    unknownIndicatorIds, assertKnownIndicators, indicatorsRef,
};
