// `edit` scope: writes through the editorial services, never raw SQL. Every
// call is recorded in commulingo_mcp_audit (mcp/audit.js) with the client
// token and the actor it wrote as. The actor (changedBy) is the caller's own
// label, kept verbatim because the editorial queues key on it
// (e.g. suggested_by='commulingo-pipeline'); it defaults to mcp:<client>.
const { str, bool, obj, arr, object } = require('../schema');

const ACTOR = /^[A-Za-z0-9_.:@/-]{1,120}$/;
const TARGETS = ['person', 'person_section', 'term'];

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

function actorOf(changedBy, client) {
    const actor = changedBy || `mcp:${client}`;
    if (!ACTOR.test(actor)) throw badRequest('changedBy must be 1–120 of A-Z a-z 0-9 _ . : @ / -');
    return actor;
}

const changedBy = str('Actor recorded on the edit (default mcp:<client>)', { maxLength: 120 });

function editorialServices(target) {
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
    return { status, suggestionId, reasons, topic, wouldStage, patchHash, dryRun };
}

const tools = [
    {
        name: 'editorial_store',
        description: 'Direct editorial store call (as the Admin screens do). command submit: request {action: create|update|delete, id, fields '
            + '(updates need fields.expectedRevision from person_get/term_get), sources, confidence?, directApply?} — returns approved with the '
            + 'value, or pending (HTTP-202-like) when review is required. review: {suggestionId, approve, note}. enrichment: {id, topic, status, '
            + 'reason, sources, expectedRevision}. note: {id, note, jobRef?}. Terms always stage as pending.',
        inputSchema: object({
            command: str('Store command', { enum: ['submit', 'review', 'enrichment', 'note'] }),
            target: str('Target type', { enum: TARGETS, default: 'person' }),
            request: obj('Command payload (see description)'),
            changedBy,
        }, ['command', 'request']),
        audit: ({ command, target, request, changedBy: actor }, client) => ({ command, targetType: target,
            targetId: String(request.id || request.suggestionId || ''), actor: actor || `mcp:${client}` }),
        async handler({ command, target, request, changedBy: given }, { client }) {
            const actor = actorOf(given || request.changedBy, client);
            const service = editorialServices(target);
            if (command === 'review') {
                if (typeof request.approve !== 'boolean') throw badRequest('request.approve must be boolean');
                return service.review(request.suggestionId, request.approve, request.note, { changedBy: actor });
            }
            return service[command]({ ...request, target, changedBy: actor });
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
        name: 'people_upsert',
        description: 'Create or update people (with optional sections) in one transaction through the Admin store validation. Each person is the '
            + 'Admin create payload plus optional sections[]; an existing id is updated against its current revision. Spec format: '
            + 'scripts/commulingo-people-upsert.js. dryRun defaults to true.',
        inputSchema: object({
            people: arr('Person payloads', 100),
            dryRun: bool('Validate and roll back (default true)'),
            changedBy,
        }, ['people']),
        audit: ({ people, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'person',
            targetId: people.map(p => p && p.id).filter(Boolean).join(',').slice(0, 500), actor: actor || `mcp:${client}` }),
        async handler({ people, dryRun = true, changedBy: given }, { client }) {
            const { upsertPeople } = require('../../data/commulingo/people-upsert');
            return upsertPeople(people, { dryRun, changedBy: actorOf(given, client) });
        },
        summarize: value => ({ dryRun: value.dryRun, results: value.results }),
    },
    {
        name: 'office_row_save',
        description: 'Create a holder row in an office (officeId, no rowId) or update one (rowId). row: {period, body?, personId?, name?, note?} as '
            + 'in the Admin office editor.',
        inputSchema: object({
            officeId: str('Office id (create)'),
            rowId: str('Row id (update)'),
            row: obj('Row fields'),
            changedBy,
        }, ['row']),
        audit: ({ officeId, rowId, changedBy: actor }, client) => ({ command: rowId ? 'update' : 'create', targetType: 'office_row',
            targetId: rowId || officeId || '', actor: actor || `mcp:${client}` }),
        async handler({ officeId, rowId, row, changedBy: given }, { client }) {
            const offices = require('../../data/commulingo/people-offices-store');
            const options = { changedBy: actorOf(given, client) };
            if (!!officeId === !!rowId) throw badRequest('pass exactly one of officeId (create) or rowId (update)');
            return { row: rowId ? await offices.updateOfficeRowAdmin(rowId, row, options) : await offices.createOfficeRowAdmin(officeId, row, options) };
        },
        summarize: value => ({ rowId: value.row && value.row.id }),
    },
    {
        name: 'office_row_delete',
        description: 'Delete one office holder row.',
        inputSchema: object({ rowId: str('Row id'), changedBy }, ['rowId']),
        audit: ({ rowId, changedBy: actor }, client) => ({ command: 'delete', targetType: 'office_row', targetId: rowId, actor: actor || `mcp:${client}` }),
        async handler({ rowId, changedBy: given }, { client }) {
            const { deleteOfficeRowAdmin } = require('../../data/commulingo/people-offices-store');
            return deleteOfficeRowAdmin(rowId, { changedBy: actorOf(given, client) });
        },
        summarize: value => value,
    },
];

module.exports = tools.map(tool => ({ ...tool, scope: 'edit' }));
