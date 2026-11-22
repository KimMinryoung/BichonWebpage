const { badRequest } = require('./people-admin-fields');
const { assertEvidence } = require('./evidence-check');

const { limits: LIMITS, factFields: FACT_FIELDS, reviewFlags: REVIEW_FLAGS } = require('./person-editorial-contract.json');
const TASK_SOURCE = /task[- ]?(?:specified|supplied|provided|data|brief|pre-?verif)|pre-?verifi|per the task|from the (?:task|prompt|brief)|(?:작업|과제)\s*(?:지시|명세|자료)/i;

// A new card must show, in at least one cited excerpt, the person it is about:
// some part of the name in any of its scripts (a stem, so Козловского counts
// for Козловский). Rosters that do not name the person prove nothing.
function nameStems(payload, parts) {
    // The family name (and the native name's last word) when there is one; a
    // given name like Mikhail alone names half a roster.
    const family = payload.familyName && typeof payload.familyName === 'object' ? [payload.familyName.ko, payload.familyName.en].filter(Boolean) : [];
    const native = String(payload.cyrillic || payload.nativeName || '').trim();
    const everything = [payload.name && payload.name.ko, payload.name && payload.name.en, native,
        payload.givenName && payload.givenName.ko, payload.givenName && payload.givenName.en, ...parts.map(p => p && p.full)];
    // A regnal numeral (Nicholas I) is no family name: fall back to the whole name.
    const words = family.some(f => [...String(f)].length >= 2) ? [...family, native.split(/\s+/).pop()] : everything;
    const stems = new Set();
    for (const word of words.filter(w => typeof w === 'string')) {
        for (const token of fold(word).split(/[\s,.·'’\-]+/)) {
            const n = [...token].length;
            if (n >= 2) stems.add([...token].slice(0, n >= 6 ? n - 2 : n).join(''));
        }
    }
    return [...stems];
}

function fold(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function assertIdentityEvidence(payload, parts) {
    // An excerpt that names the person, or the page it was quoted from
    // (/wiki/Friedrich_Lessner: a life-dates line there need not repeat the name).
    const decode = url => { try { return decodeURIComponent(url); } catch { return url; } };
    const excerpts = [...(payload.evidence || []), ...(payload.activities || []).flatMap(a => (a && a.evidence) || [])]
        .flatMap(e => [fold(e && e.excerpt), fold(decode(String((e && e.source) || '')).replace(/[_+]/g, ' '))]).filter(Boolean);
    const stems = nameStems(payload, parts);
    if (!excerpts.some(text => stems.some(stem => text.includes(stem)))) {
        throw badRequest('a new person needs evidence that names them: an excerpt with their name, or one quoted from a page about them (its URL or title carries the name); '
            + 'if no source you read mentions this person, do not create the card');
    }
}

function sourcesFor(payload, options = {}) {
    const sources = payload.sources ?? options.sources;
    if (!Array.isArray(sources) || !sources.length || sources.some(s => typeof s !== 'string' || !s.trim())) {
        throw badRequest('sources must be a non-empty list of references for this edit');
    }
    if (sources.some(s => /https?:\/\/(?:www\.)?cyber-lenin\.com(?:[/:\s]|$)/i.test(s))) throw badRequest('cite external sources, not this dictionary');
    // A task, prompt or earlier pipeline step is not a source (2026-11-22:
    // the made-up card mikhail-kozlovsky cited "task-specified institutional
    // data ... from task pre-verification" after every search had failed).
    const taskClaim = sources.find(s => TASK_SOURCE.test(s));
    if (taskClaim) throw badRequest(`a source must be a work you read, not the task or prompt: «${taskClaim.slice(0, 120)}»`);
    return sources.map(s => s.trim());
}

function validateEditorial(payload, options = {}, section = false) {
    const allowed = new Set(section
        ? ['slug','heading','body','sortOrder','sources','evidence','reviewFlags','expectedRevision','createdAt','updatedAt','revision']
        : ['id','group','groupId','sortOrder','initial','name','givenName','familyName','nameQualifier','patronymic','cyrillic','cyrillicPatronymic','nativeName','nativePatronymic','nativeScriptOverride','years','lifeDates','wikidataId','epithet','moment','bio','citizenship','nationalOrigin','origin','role','activities','fate','aliases','scenes','career','aliasEdits','careerEdits','sceneEdits','linkExpressions','sources','evidence','reviewFlags','expectedRevision']);
    for (const key of Object.keys(payload)) if (!allowed.has(key)) throw badRequest(`unknown person field ${key}`);
    if (payload.sortOrder !== undefined && !Number.isInteger(payload.sortOrder)) throw badRequest('sortOrder must be an integer');
    const sources = sourcesFor(payload, options);
    for (const [field, limits] of Object.entries(LIMITS)) {
        const input = field === 'fate_label' ? payload.fate?.label : payload[field];
        if ((field === 'body') !== section || input === undefined || input === null) continue;
        const value = typeof input === 'string' ? { ko: input } : input;
        if (typeof value !== 'object' || Array.isArray(value)) throw badRequest(`${field} must be ko/en text`);
        for (const [index, lang] of ['ko', 'en'].entries()) {
            if (value[lang] !== undefined && typeof value[lang] !== 'string') throw badRequest(`${field}.${lang} must be text`);
            if (value[lang] !== undefined && [...value[lang]].length > limits[index]) {
                throw badRequest(`${field}.${lang} is ${[...value[lang]].length} characters, over the ${limits[index]} limit by ${[...value[lang]].length - limits[index]}`);
            }
        }
    }
    const evidence = payload.evidence ?? [];
    // Exact dates are a fact like the years (not in the shared contract's list:
    // leninbot does not write them).
    const required = [...FACT_FIELDS, 'lifeDates'].filter(field => payload[field] !== undefined && !(field === 'lifeDates' && payload[field] === null));
    const edited = Object.keys(payload).filter(key => !['sources', 'evidence', 'reviewFlags', 'expectedRevision', 'id', 'slug'].includes(key));
    assertEvidence(evidence, { sources, required, allowed: field => Object.hasOwn(payload, field) || FACT_FIELDS.includes(field),
        allowedLabel: `the fields this edit sends (${edited.join(', ') || 'none'}) or the facts ${FACT_FIELDS.join(', ')}` },
    missing => missing ? `evidence must identify the claim and page/section supporting ${missing}` : 'evidence problems');
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

// Live catalog (data-documents.js): rebuilt when the catalog object changes.
let partyIds = { source: null, ids: new Set() };
function partyIdSet() {
    const { catalog } = require('./person-activities');
    if (partyIds.source !== catalog) partyIds = { source: catalog, ids: new Set(catalog.affiliations.filter(a => a.kind === 'party').map(a => a.id)) };
    return partyIds.ids;
}

async function recordEvidence(client, personId, sectionSlug, payload, options, revision) {
    const topics = new Set();
    if (sectionSlug) topics.add('sections');
    for (const key of new Set([...Object.keys(payload), ...(payload.evidence || []).map(e => e.field)])) {
        if (['name', 'givenName', 'familyName', 'nameQualifier', 'years', 'lifeDates', 'bio', 'role', 'activities', 'career', 'careerEdits', 'epithet'].includes(key)) topics.add('basics');
        if (['bio', 'epithet'].includes(key)) topics.add('bio');
        if (key === 'moment') topics.add('moment');
        if (['citizenship', 'nationalOrigin', 'origin'].includes(key)) topics.add('nationality');
    }
    if (topics.size) await client.query("UPDATE commulingo_person_enrichment SET status='open',review_after=NOW(),updated_at=NOW() WHERE person_id=$1 AND topic=ANY($2)", [personId, [...topics]]);
    // A 'party' record saying no membership was found stops being true once a
    // party activity is saved: it becomes complete, not reopened.
    if ((payload.activities || []).some(a => partyIdSet().has(a?.affiliationId))) await client.query(`UPDATE commulingo_person_enrichment
        SET status='complete', reason='party activity recorded', review_after=NOW()+INTERVAL '3650 days', updated_at=NOW()
        WHERE person_id=$1 AND topic='party' AND status<>'complete'`, [personId]);
    for (const e of payload.evidence || []) await client.query(`INSERT INTO commulingo_person_evidence
        (person_id, section_slug, field, claim, source, locator, excerpt, stance, changed_by, revision)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [personId, sectionSlug || '', e.field, e.claim, e.source, e.locator, e.excerpt || '', e.stance || 'supports', options.changedBy || 'commulingo-admin-api', revision]);
}

module.exports = { assertIdentityEvidence, LIMITS, sourcesFor, validateEditorial, reviewReasons, recordEvidence };
