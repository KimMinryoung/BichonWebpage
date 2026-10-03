const { normalizeSovietKoreanText } = require('./korean-terminology');
const { parseLifeYears: parsePersonLifeYears } = require('./person-life-years');

// Small field helpers shared by the CommuLingo admin stores: bilingual
// values and validation errors. Periods: career-period.js.

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

function localized(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return lang === 'ko' ? value : '';
    return value[lang] || '';
}

function contentLocalized(value, lang) {
    const text = localized(value, lang);
    return lang === 'ko' ? normalizeSovietKoreanText(text) : text;
}

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function parseLifeYears(label) {
    const { birthYear, deathYear } = parsePersonLifeYears(label);
    return { birthYear, deathYear };
}

function requireId(id, label) {
    const value = typeof id === 'string' ? id.trim() : '';
    if (!value || !/^[a-z0-9][a-z0-9-]{1,120}$/.test(value)) {
        const err = new Error(`invalid ${label || 'id'}`);
        err.status = 400;
        throw err;
    }
    return value;
}

function requireSlug(slug) {
    return requireId(slug, 'section slug');
}

function normalizeSources(sources) {
    if (sources === undefined) return [];
    if (!Array.isArray(sources)) throw badRequest('sources must be an array');
    return sources;
}

function normalizeLimit(value, fallback = 100) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.min(parsed, 250);
}

function normalizeOffset(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

module.exports = { t, localized, contentLocalized, badRequest, parseLifeYears, requireId, requireSlug, normalizeSources, normalizeLimit, normalizeOffset };
