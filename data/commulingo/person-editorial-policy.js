const { badRequest } = require('./people-admin-fields');

const { limits: LIMITS, factFields: FACT_FIELDS, reviewFlags: REVIEW_FLAGS } = require('./person-editorial-contract.json');
function sourcesFor(payload, options = {}) {
    const sources = payload.sources ?? options.sources;
    if (!Array.isArray(sources) || !sources.length || sources.some(s => typeof s !== 'string' || !s.trim())) {
        throw badRequest('sources must be a non-empty list of references for this edit');
    }
    if (sources.some(s => /https?:\/\/(?:www\.)?cyber-lenin\.com(?:[/:\s]|$)/i.test(s))) throw badRequest('cite external sources, not this dictionary');
    return sources.map(s => s.trim());
}

function validateEditorial(payload, options = {}, section = false) {
    const allowed = new Set(section
        ? ['slug','heading','body','sortOrder','sources','evidence','reviewFlags','expectedRevision','createdAt','updatedAt','revision']
        : ['id','group','groupId','sortOrder','initial','name','givenName','familyName','patronymic','cyrillic','cyrillicPatronymic','nativeName','nativePatronymic','nativeScriptOverride','years','epithet','moment','bio','citizenship','nationalOrigin','origin','role','fate','aliases','scenes','career','aliasEdits','careerEdits','sceneEdits','linkExpressions','sources','evidence','reviewFlags','expectedRevision']);
    for (const key of Object.keys(payload)) if (!allowed.has(key)) throw badRequest(`unknown person field ${key}`);
    if (payload.sortOrder !== undefined && !Number.isInteger(payload.sortOrder)) throw badRequest('sortOrder must be an integer');
    const sources = sourcesFor(payload, options);
    for (const [field, limits] of Object.entries(LIMITS)) {
        const input = field === 'fate_label' ? payload.fate?.label : payload[field];
        if ((field === 'body') !== section || input === undefined || input === null) continue;
        const value = typeof input === 'string' ? { ko: input } : input;
        if (typeof value !== 'object' || Array.isArray(value)) throw badRequest(`${field} must be ko/en text`);
        for (const [index, lang] of ['ko', 'en'].entries()) {
            if (value[lang] !== undefined && (typeof value[lang] !== 'string' || [...value[lang]].length > limits[index])) {
                throw badRequest(`${field}.${lang} exceeds ${limits[index]} characters or is not text`);
            }
        }
    }
    const evidence = payload.evidence ?? [];
    if (!Array.isArray(evidence) || evidence.length > 50) throw badRequest('evidence must be an array of at most 50 claims');
    for (const e of evidence) {
        if (!e || typeof e !== 'object' || !['supports', 'disputes'].includes(e.stance || 'supports')
            || !['field', 'claim', 'source', 'locator', 'excerpt', 'stance'].every(k => e[k] === undefined || typeof e[k] === 'string')
            || !e.field?.trim() || !e.claim?.trim() || !sources.includes(e.source)
            || !e.locator?.trim()) throw badRequest('each evidence item needs field, claim, cited source and locator (page/section), plus optional excerpt/stance');
        if (!Object.hasOwn(payload, e.field) && !FACT_FIELDS.includes(e.field)) throw badRequest(`evidence field ${e.field} is not part of this edit`);
    }
    for (const field of FACT_FIELDS) {
        if (payload[field] !== undefined && !evidence.some(e => e.field === field)) {
            throw badRequest(`evidence must identify the claim and page/section supporting ${field}`);
        }
    }
    if (payload.role === null) throw badRequest('a person must retain a primary role');
    const flags = payload.reviewFlags ?? [];
    if (!Array.isArray(flags) || flags.some(f => !REVIEW_FLAGS.includes(f))) throw badRequest('invalid reviewFlags');
    return { sources, evidence, flags };
}

function reviewReasons(target, action, payload, before) {
    const reasons = [...(payload.reviewFlags || [])];
    if (action === 'delete') reasons.push('deletion');
    if ((payload.evidence || []).some(e => e.stance === 'disputes')) reasons.push('source_conflict');
    const field = target === 'person_section' ? 'body' : 'bio';
    for (const lang of ['ko', 'en']) {
        const old = before?.[field]?.[lang] || '';
        const value = payload[field] === null ? '' : payload[field]?.[lang];
        if (typeof value === 'string' && old.length >= 120 && value.length < old.length * 0.6) reasons.push('large_deletion');
    }
    return [...new Set(reasons)];
}

async function recordEvidence(client, personId, sectionSlug, payload, options, revision) {
    const topics = new Set();
    if (sectionSlug) topics.add('sections');
    for (const key of new Set([...Object.keys(payload), ...(payload.evidence || []).map(e => e.field)])) {
        if (['name', 'givenName', 'familyName', 'years', 'bio', 'role', 'career', 'careerEdits', 'epithet'].includes(key)) topics.add('basics');
        if (['bio', 'epithet'].includes(key)) topics.add('bio');
        if (key === 'moment') topics.add('moment');
        if (['citizenship', 'nationalOrigin', 'origin'].includes(key)) topics.add('nationality');
    }
    if (topics.size) await client.query("UPDATE commulingo_person_enrichment SET status='open',review_after=NOW(),updated_at=NOW() WHERE person_id=$1 AND topic=ANY($2)", [personId, [...topics]]);
    for (const e of payload.evidence || []) await client.query(`INSERT INTO commulingo_person_evidence
        (person_id, section_slug, field, claim, source, locator, excerpt, stance, changed_by, revision)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [personId, sectionSlug || '', e.field, e.claim, e.source, e.locator, e.excerpt || '', e.stance || 'supports', options.changedBy || 'commulingo-admin-api', revision]);
}

module.exports = { LIMITS, sourcesFor, validateEditorial, reviewReasons, recordEvidence };
