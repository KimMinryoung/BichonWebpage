const { badRequest } = require('./people-admin-fields');

// Omission preserves a language; null (whole field) and "" explicitly clear it.
// Legacy plain strings are Korean-only patches, never an instruction to erase EN.
function mergeLocalizedPatch(before, patch, field = 'text') {
    const stored = typeof before === 'string' ? { ko: before, en: '' } : (before || {});
    if (patch === undefined) return { ko: stored.ko || '', en: stored.en || '' };
    if (patch === null) return { ko: '', en: '' };
    const incoming = typeof patch === 'string' ? { ko: patch } : patch;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
        throw badRequest(`${field} must be localized text`);
    }
    for (const [lang, value] of Object.entries(incoming)) {
        if (!['ko', 'en'].includes(lang) || typeof value !== 'string') {
            throw badRequest(`${field}.${lang} must be ko/en text; use an empty string to clear`);
        }
    }
    return { ko: incoming.ko ?? stored.ko ?? '', en: incoming.en ?? stored.en ?? '' };
}

function mergeNationalityPatch(before, patch, field) {
    if (patch === null || patch === undefined) return patch;
    if (typeof patch !== 'object' || Array.isArray(patch)) throw badRequest(`${field} must be an object`);
    const code = patch.code !== undefined ? patch.code : (before?.code || '');
    // New nationality codes get their canonical labels, never the previous flag's label.
    const sameCode = typeof code === 'string' && code.trim() === (before?.code || '');
    return { ...patch, code, label: mergeLocalizedPatch(sameCode ? before?.label : null, patch.label, `${field}.label`) };
}

function mergePersonPatch(before, payload) {
    const patch = { ...payload };
    for (const field of ['givenName', 'familyName', 'epithet', 'moment', 'bio']) {
        if (patch[field] !== undefined) patch[field] = mergeLocalizedPatch(before[field], patch[field], field);
    }
    if (patch.fate !== undefined && patch.fate !== null) {
        if (typeof patch.fate !== 'object' || Array.isArray(patch.fate)) throw badRequest('fate must be an object or null');
        patch.fate = {
            ...before.fate, ...patch.fate,
            label: mergeLocalizedPatch(before.fate?.label, patch.fate.label, 'fate.label'),
        };
    }
    for (const field of ['citizenship', 'nationalOrigin', 'origin']) {
        if (patch[field] !== undefined) patch[field] = mergeNationalityPatch(before[field], patch[field], field);
    }
    if (patch.aliases !== undefined) patch.aliases = { ...before.aliases, ...patch.aliases };
    return patch;
}

module.exports = { mergeLocalizedPatch, mergePersonPatch };
