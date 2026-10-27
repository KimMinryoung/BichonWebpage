// `edit` scope: writes through the editorial services, never raw SQL. Every
// call is recorded in commulingo_mcp_audit (mcp/audit.js) with the client
// token and the actor it wrote as. The actor (changedBy) is the caller's own
// label, kept verbatim because the editorial queues key on it
// (e.g. suggested_by='commulingo-pipeline'); it defaults to mcp:<client>.
const { str, bool, obj, arr, object } = require('../schema');
const { specPathArg, readSpecJson } = require('../spec');

// Lazy, like the services: loading the tool list needs no DB.
function withTransaction(options, callback) {
    return require('../../data/commulingo/admin-tx').withTransaction(options, callback);
}

const ACTOR = /^[A-Za-z0-9_.:@/-]{1,120}$/;
const TARGETS = ['person', 'person_section', 'term'];
const CONTENT_TARGETS = ['history_event', 'history_event_section', 'history_event_person', 'office_row'];

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

function actorOf(changedBy, client) {
    const actor = changedBy || `mcp:${client}`;
    if (!ACTOR.test(actor)) throw badRequest('changedBy must be 1–120 of A-Z a-z 0-9 _ . : @ / -');
    return actor;
}

const changedBy = str('Actor recorded on the edit (default mcp:<client>)', { maxLength: 120 });

function batchItems(items, specPath) {
    if (!items === !specPath) throw badRequest('pass items or specPath, not both');
    const list = specPath ? readSpecJson(specPath) : items;
    const out = Array.isArray(list) ? list : list && list.items;
    if (!Array.isArray(out) || !out.length || out.length > 1000) throw badRequest('a batch needs 1–1000 items');
    return out;
}

function editorialServices(target) {
    if (CONTENT_TARGETS.includes(target)) {
        const content = require('../../data/commulingo/content-editorial-service');
        const unsupported = command => async () => { throw badRequest(`${command} is not available for ${target}`); };
        return { submit: content.submitContentEdit, review: content.reviewContentSuggestion,
            enrichment: unsupported('enrichment'), note: unsupported('note') };
    }
    if (target === 'term') {
        const terms = require('../../data/commulingo/term-editorial-service');
        return { submit: terms.submitTermEdit, review: terms.reviewTermSuggestion, enrichment: terms.saveEnrichment, note: terms.saveNote };
    }
    const people = require('../../data/commulingo/person-editorial-service');
    return { submit: people.submitPersonEdit, review: people.reviewPersonSuggestion, enrichment: people.saveEnrichment, note: people.saveNote };
}

function summary(value) {
    if (!value || typeof value !== 'object') return value ?? null;
    const { status, suggestionId, reasons, topic, wouldStage, patchHash, dryRun } = value;
    const revision = value.revision ?? value.value?.revision;
    return { status, suggestionId, reasons, topic, wouldStage, patchHash, dryRun, ...(revision ? { revision } : {}) };
}

// One store command, inside the caller's transaction when client is given.
// A term submit with directApply: true is staged and approved in the same
// transaction (terms otherwise always wait for review), as the batch scripts
// did; a new term then needs its native-script form or a stated reason.
async function storeEdit(command, target, request, actor, client) {
    const service = editorialServices(target);
    const options = client ? { client, changedBy: actor } : { changedBy: actor };
    if (command === 'review') {
        if (typeof request.approve !== 'boolean') throw badRequest('request.approve must be boolean');
        return service.review(request.suggestionId, request.approve, request.note, options);
    }
    if (target === 'term' && command === 'submit' && request.directApply === true) {
        if (!client) return withTransaction({}, own => storeEdit(command, target, request, actor, own));
        const fields = request.fields || {};
        if (request.action === 'create' && !String(fields.original || '').trim() && !String(request.noOriginal || '').trim()) {
            throw badRequest(`${request.id}: fields.original (native-script name) is required for a new term, or noOriginal: "<reason>"`);
        }
        const { directApply, noOriginal, reviewNote, ...rest } = request;
        const submitted = await service.submit({ ...rest, target, changedBy: actor }, options);
        if (submitted.status !== 'pending') return submitted;
        return service.review(submitted.suggestionId, true, reviewNote || 'applied directly', options);
    }
    return service[command]({ ...request, target, changedBy: actor }, options);
}

const EVIDENCE_RULES = 'Sources must be external (books, archives, other encyclopedias), never this dictionary; a person/term body or '
    + 'card change needs evidence. ';

const tools = [
    {
        name: 'editorial_store',
        description: EVIDENCE_RULES + 'Direct editorial store call (as the Admin screens do). command submit: request {action: create|update|delete, id, fields '
            + '(updates need fields.expectedRevision from person_get/term_get), sources, confidence?, directApply?} — returns approved with the '
            + 'value, or pending (HTTP-202-like) when review is required. review: {suggestionId, approve, note}. enrichment: {id, topic, status, '
            + 'reason, sources, expectedRevision}. note: {id, note, jobRef?}. Terms always stage as pending; a term period is '
            + '{start: [year, month?, day?], end?, startQual?, endQual?, ongoing?, label?: {ko, en}} (null when undated), with an optional '
            + 'periodNote {ko, en} for a qualifying remark. A history_event update takes title {ko, en} (then carry its link reviews with link_reviews_carry), '
            + 'period {start, end?}, question/summary/outcome {ko, en}, sources, locations [{lat, lng, label {ko, en}, kind: main|place|geo}] (exactly one main), '
            + 'focus {ko, en} or sides [{id, label}] (not both; null clears) and timeline; history_event timeline rows carry period in the same shape, plus optional geo ({kind: point, lat, lng, label {ko, en}} or {kind: arrow, points, actor?, variant?}) and country (country codes); a timeline update replaces the whole list, so send back every row with its geo and country. History events and office rows '
            + '(history_event update; history_event_section create/update {heading, body, after?}; history_event_person create/update '
            + '{personId, relationKind, relation, note, side?, sortOrder?}; office_row create (id = office id; fields period, body = formal post title, personId or name, note, trackId from the office tracks, seat state|government|empty) / update / delete (id = row id)) '
            + 'apply at once unless directApply is false; they support submit and review only. A term submit with request.directApply: true '
            + 'is approved in the same call (a new term then needs fields.original or request.noOriginal: "<reason>"). brief: true returns '
            + 'only {status, suggestionId, revision} instead of the whole stored entry.',
        inputSchema: object({
            command: str('Store command', { enum: ['submit', 'review', 'enrichment', 'note'] }),
            target: str('Target type', { enum: [...TARGETS, ...CONTENT_TARGETS], default: 'person' }),
            request: obj('Command payload (see description)'),
            brief: bool('Return only status, suggestion id and revision (default false)'),
            changedBy,
        }, ['command', 'request']),
        audit: ({ command, target, request, changedBy: actor }, client) => ({ command, targetType: target,
            targetId: String(request.id || request.suggestionId || ''), actor: actor || `mcp:${client}` }),
        async handler({ command, target, request, brief, changedBy: given }, { client }) {
            const value = await storeEdit(command, target, request, actorOf(given || request.changedBy, client));
            return brief ? summary(value) : value;
        },
        summarize: summary,
    },
    {
        name: 'editorial_batch',
        description: EVIDENCE_RULES + 'Several editorial_store submit/review calls in one transaction, all or nothing, in order (a later item '
            + 'may build on an earlier one: create an event, then its sections and people). Each item is {command: submit|review, target, request} '
            + 'exactly as editorial_store takes them (term items may set request.directApply: true). dryRun (default true) runs every write and rolls '
            + 'back, so it fails where the real run would. Pass items inline or specPath to a JSON file holding {items: [...]} or the list itself. '
            + 'Returns per item {status, suggestionId, revision}.',
        inputSchema: object({
            items: arr('Edit items', 300),
            specPath: specPathArg,
            dryRun: bool('Validate and roll back (default true)'),
            changedBy,
        }),
        audit: ({ items, specPath, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'batch',
            targetId: specPath || `${(items || []).length} items`, actor: actor || `mcp:${client}` }),
        async handler({ items, specPath, dryRun = true, changedBy: given }, { client }) {
            const actor = actorOf(given, client);
            const list = batchItems(items, specPath);
            const results = [];
            await withTransaction({}, async own => {
                for (const [i, item] of list.entries()) {
                    const { command, target = 'person', request } = item || {};
                    if (!['submit', 'review'].includes(command)) throw badRequest(`items[${i}].command must be submit or review`);
                    if (![...TARGETS, ...CONTENT_TARGETS].includes(target)) throw badRequest(`items[${i}].target is not an editorial target`);
                    if (!request || typeof request !== 'object' || Array.isArray(request)) throw badRequest(`items[${i}].request must be an object`);
                    const { dryRun: ignored, ...clean } = request;
                    try {
                        results.push({ index: i, target, id: String(clean.id || clean.suggestionId || ''),
                            ...summary(await storeEdit(command, target, clean, actor, own)) });
                    } catch (err) {
                        err.message = `items[${i}] ${target} ${clean.id || clean.suggestionId || ''}: ${err.message}`;
                        throw err;
                    }
                }
                if (dryRun) throw Object.assign(new Error('dry run'), { rollback: true });
            }).catch(err => { if (!err.rollback) throw err; });
            return { dryRun, count: results.length, results };
        },
        summarize: value => ({ dryRun: value.dryRun, count: value.count }),
    },
    {
        name: 'editorial_validate',
        description: 'Dry-run an edit through the editorial store: validates and rolls back, writes nothing. value: {fields, sources}; '
            + 'target/action/id say what it would edit. Used as the leninbot worker validator for draft results.',
        inputSchema: object({
            target: str('Target type', { enum: [...TARGETS, ...CONTENT_TARGETS] }),
            action: str('Edit action', { enum: ['create', 'update', 'delete'] }),
            id: str('Target id (office row: row id; office row create: office id)'),
            value: obj('Proposed {fields, sources}'),
        }, ['target', 'action', 'id', 'value']),
        audit: ({ target, action, id }, client) => ({ command: 'validate', targetType: target, targetId: id, actor: `mcp:${client}` }),
        async handler({ target, action, id, value }, { client }) {
            if (!value.fields || typeof value.fields !== 'object' || Array.isArray(value.fields)) throw badRequest('value.fields must be an object');
            if (value.sources !== undefined && !Array.isArray(value.sources)) throw badRequest('value.sources must be a list');
            return editorialServices(target).submit({ target, action, id, fields: value.fields, sources: value.sources || [],
                dryRun: true, directApply: false, changedBy: `mcp:${client}` });
        },
        summarize: summary,
    },
    {
        name: 'editorial_pipeline',
        description: 'Idempotent editorial pipeline (data/commulingo/editorial-pipeline-service.js). Mutating commands need request.idempotencyKey; '
            + 'a repeated key with the same request returns the stored receipt. validate is a dry run of submit. publish stages and approves in one '
            + 'transaction and requires approvedPatchHash plus an evidence-based review {decision: approve, reason, checks[]}.',
        inputSchema: object({
            command: str('Pipeline command', { enum: ['capabilities', 'validate', 'submit', 'review', 'enrichment', 'note', 'publish'] }),
            target: str('Target type', { enum: TARGETS }),
            request: obj('Command payload: id, action, fields, sources, changedBy, idempotencyKey, …'),
        }, ['command', 'target']),
        audit: ({ command, target, request = {} }, client) => ({ command, targetType: target,
            targetId: String(request.id || request.suggestionId || ''), actor: request.changedBy || `mcp:${client}` }),
        async handler({ command, target, request = {} }, { client }) {
            const { execute } = require('../../data/commulingo/editorial-pipeline-service');
            if (request.changedBy !== undefined) actorOf(request.changedBy, client);
            return execute({ ...request, command, target });
        },
        summarize: summary,
    },
    {
        name: 'gap_file',
        description: 'File curation gaps an editor\'s text needed (person, term, event, doc): each gap is {kind, label {ko,en}, '
            + 'target_id (existing entry too thin, or null), reason, priority 0-10}. Gaps the dictionaries already cover '
            + '(name, alias, bracket variants; event titles for terms; document titles) are not filed. Returns filed, already_queued, already_covered.',
        inputSchema: object({
            gaps: arr('Gaps', 50),
            eventId: str('The event whose text needed them'),
            changedBy,
        }, ['gaps', 'eventId']),
        audit: ({ gaps, eventId, changedBy: actor }, client) => ({ command: 'file', targetType: 'curation_gap',
            targetId: `${eventId}:${gaps.length}`, actor: actor || `mcp:${client}` }),
        async handler({ gaps, eventId, changedBy: given }, { client }) {
            for (const [i, gap] of gaps.entries()) {
                if (!gap || typeof gap !== 'object' || !['person', 'term', 'event', 'doc'].includes(gap.kind)) throw badRequest(`gaps[${i}].kind must be person, term, event or doc`);
                if (!gap.label || typeof gap.label !== 'object' || !String(gap.label.ko || '').trim()) throw badRequest(`gaps[${i}].label.ko is required`);
            }
            const { fileGaps } = require('../../data/commulingo/curation-gaps');
            return fileGaps(gaps, eventId, actorOf(given, client));
        },
        summarize: value => ({ filed: value.filed.length, already_queued: value.already_queued.length, already_covered: value.already_covered.length }),
    },
    {
        name: 'people_upsert',
        description: 'Create or update people (with optional sections) in one transaction through the Admin store validation. Each person is the '
            + 'Admin create payload plus optional sections[]; an existing id is updated against its current revision. Spec format: '
            + 'scripts/commulingo-people-upsert.js. Pass people inline or specPath to a spec file (a list or {people, changedBy?}). dryRun defaults to true.',
        inputSchema: object({
            people: arr('Person payloads', 100),
            specPath: specPathArg,
            dryRun: bool('Validate and roll back (default true)'),
            changedBy,
        }),
        audit: ({ people, specPath, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'person',
            targetId: specPath || (people || []).map(p => p && p.id).filter(Boolean).join(',').slice(0, 500), actor: actor || `mcp:${client}` }),
        async handler({ people, specPath, dryRun = true, changedBy: given }, { client }) {
            if (!people === !specPath) throw badRequest('pass people or specPath, not both');
            const spec = specPath ? readSpecJson(specPath) : people;
            const list = Array.isArray(spec) ? spec : spec && spec.people;
            if (!Array.isArray(list) || !list.length || list.length > 500) throw badRequest('the spec must list 1–500 people');
            const { upsertPeople } = require('../../data/commulingo/people-upsert');
            return upsertPeople(list, { dryRun, changedBy: actorOf(given || (!Array.isArray(spec) && spec.changedBy), client) });
        },
        summarize: value => ({ dryRun: value.dryRun, results: value.results }),
    },
];

module.exports = tools.map(tool => ({ ...tool, scope: 'edit' }));
