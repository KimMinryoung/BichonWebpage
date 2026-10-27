// Reference documents, data documents, link reviews and the registries,
// through the stores the CLIs use (scripts/commulingo-docs, scripts/commulingo-data,
// scripts/review-commulingo-links.js, scripts/commulingo-carry-link-reviews.js) and
// data/commulingo/registry-edits.js. Writes default to a dry run that executes
// the whole write and rolls it back.
const { str, int, bool, obj, arr, object } = require('../schema');
const { specPathArg, readSpecFile, readSpecJson } = require('../spec');

const ACTOR = /^[A-Za-z0-9_.:@/-]{1,120}$/;
const changedBy = str('Actor recorded on the edit (default mcp:<client>)', { maxLength: 120 });
const dryRunArg = bool('Validate and roll back (default true)');
const noteArg = str('Revision note', { maxLength: 500 });

function badRequest(message, status = 400) {
    return Object.assign(new Error(message), { status });
}

function actorOf(given, client) {
    const actor = given || `mcp:${client}`;
    if (!ACTOR.test(actor)) throw badRequest('changedBy must be 1–120 of A-Z a-z 0-9 _ . : @ / -');
    return actor;
}

function db() {
    return require('../../config/database');
}

// Runs fn(client) in a transaction that commits, or rolls back when dryRun.
async function inTransaction(dryRun, fn) {
    const client = await db().connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

function payload(inline, specPath, what) {
    if ((inline === undefined) === !specPath) throw badRequest(`pass ${what} or specPath, not both`);
    return specPath ? readSpecJson(specPath) : inline;
}

const LOOKUP_SQL = [
    ['person', `SELECT id, 'name' AS via FROM commulingo_people p WHERE NAME_MATCH`],
    ['person', 'SELECT person_id AS id, \'alias:\' || lang AS via FROM commulingo_person_aliases WHERE lower(alias) = lower($1)'],
    ['term', 'SELECT id, \'headword\' AS via FROM commulingo_terms WHERE lower(term_ko) = lower($1) OR lower(term_en) = lower($1) OR lower(original) = lower($1)'],
    ['term', 'SELECT term_id AS id, \'alias:\' || lang AS via FROM commulingo_term_aliases WHERE lower(alias) = lower($1)'],
    ['event', 'SELECT id, \'title\' AS via FROM commulingo_history_events WHERE lower(title_ko) = lower($1) OR lower(title_en) = lower($1)'],
    ['blocklist', 'SELECT kind || \':\' || lang AS id, note AS via FROM commulingo_link_blocklist WHERE lower(phrase) = lower($1)'],
    ['generic_alias', 'SELECT lang AS id, note AS via FROM commulingo_generic_aliases WHERE lower(phrase) = lower($1)'],
];

const REGISTRY_SQL = {
    collections: `SELECT c.id, c.sort_order, c.icon, c.title_ko, c.title_en, c.intro_ko, c.intro_en, c.term_ids,
            count(m.person_id)::int AS members
        FROM commulingo_person_collections c LEFT JOIN commulingo_person_collection_members m ON m.collection_id = c.id
        WHERE ($1 = '' OR c.id ILIKE '%' || $1 || '%' OR c.title_ko ILIKE '%' || $1 || '%' OR c.title_en ILIKE '%' || $1 || '%')
        GROUP BY c.id ORDER BY c.sort_order, c.id`,
    collection_members: `SELECT collection_id, person_id FROM commulingo_person_collection_members
        WHERE ($1 = '' OR collection_id = $1 OR person_id = $1) ORDER BY collection_id, person_id`,
    blocklist: `SELECT kind, lang, phrase, note FROM commulingo_link_blocklist
        WHERE ($1 = '' OR phrase ILIKE '%' || $1 || '%') ORDER BY kind, lang, phrase`,
    generic_aliases: `SELECT lang, phrase, note FROM commulingo_generic_aliases
        WHERE ($1 = '' OR phrase ILIKE '%' || $1 || '%') ORDER BY lang, phrase`,
    event_link_exceptions: `SELECT id, no_auto_link, to_jsonb(e)->'term_links' AS term_links FROM commulingo_history_events e
        WHERE ($1 = '' OR id = $1) AND (no_auto_link <> '[]'::jsonb OR to_jsonb(e)->'term_links' <> '[]'::jsonb) ORDER BY id`,
};

const tools = [
    // ── reads ──────────────────────────────────────────────────────────────
    {
        scope: 'read',
        name: 'aliases_lookup',
        description: 'Who already owns this exact string (case-insensitive): person names and aliases, term headwords/original/aliases, '
            + 'event titles, document titles and aliases, link-blocklist rows and the generic-alias guard list. Use before adding an alias or a name.',
        inputSchema: object({ text: str('The exact expression') }, ['text']),
        async handler({ text }) {
            const { nameMatchSql } = require('../../data/commulingo/person-name');
            const owners = [];
            for (const [kind, sql] of LOOKUP_SQL) {
                const { rows } = await db().query(sql.replace('NAME_MATCH', nameMatchSql('p', '$1')), [text]);
                for (const row of rows) owners.push({ kind, id: row.id, via: row.via });
            }
            const { listCommuLingoDocs } = require('../../data/commulingo/docs-store');
            const needle = text.normalize('NFC').toLowerCase();
            for (const doc of listCommuLingoDocs()) {
                for (const [via, values] of [['title', Object.values(doc.title || {})], ['alias:ko', doc.aliases?.ko || []], ['alias:en', doc.aliases?.en || []]]) {
                    if (values.some(value => typeof value === 'string' && value.normalize('NFC').toLowerCase() === needle)) owners.push({ kind: 'doc', id: doc.id, via });
                }
            }
            return { text, owners };
        },
    },
    {
        scope: 'read',
        name: 'registry_get',
        description: 'Registry rows without an Admin screen: collections (정치적 입장 모음 with member counts), collection_members '
            + '(q = a collection id or a person id), blocklist (auto-link exceptions; q = substring), generic_aliases (q = substring), '
            + 'event_link_exceptions (events with no_auto_link or term_links; q = event id). Edit them with registry_edit.',
        inputSchema: object({
            table: str('Registry', { enum: Object.keys(REGISTRY_SQL) }),
            q: str('Filter (see description)'),
            limit: int('Max rows (default 200)', 1, 2000, { default: 200 }),
            offset: int('Rows to skip', 0, 1000000, { default: 0 }),
        }, ['table']),
        async handler({ table, q = '', limit, offset }) {
            const { rows } = await db().query(`SELECT *, count(*) OVER () AS total FROM (${REGISTRY_SQL[table]}) r LIMIT $2 OFFSET $3`, [q.trim(), limit, offset]);
            return { table, total: rows.length ? Number(rows[0].total) : 0, offset, rows: rows.map(({ total, ...row }) => row) };
        },
    },
    {
        scope: 'read',
        name: 'doc_revisions',
        description: 'Superseded revisions of one reference document, newest first (restore one with doc_restore).',
        inputSchema: object({ id: str('Document id') }, ['id']),
        async handler({ id }) {
            const { listDocRevisions } = require('../../data/commulingo/docs-db');
            return { id, revisions: await listDocRevisions(id) };
        },
    },
    {
        scope: 'read',
        name: 'data_documents_list',
        description: 'Data documents (activity-catalog, politburo/secretariat/orgburo rosters, event-control/<event id>, genealogy/<chart id>) '
            + 'with revision, last writer and size; prefix narrows the keys.',
        inputSchema: object({ prefix: str('Key prefix, e.g. genealogy/ or event-control/') }),
        async handler({ prefix = '' }) {
            const { readDataDocumentRows } = require('../../data/commulingo/data-documents');
            return { documents: (await readDataDocumentRows({ prefix })).map(row => ({ key: row.key, revision: row.revision,
                updatedAt: row.updated_at, updatedBy: row.updated_by, chars: row.content_text.length })) };
        },
    },
    {
        scope: 'read',
        name: 'data_document_get',
        description: 'One data document, or the part at a JSON Pointer (RFC 6901, e.g. /affiliations/12), with the revision data_document_put '
            + 'expects. keysOnly lists an object\'s keys or an array\'s length instead of the value (the activity catalog is large).',
        inputSchema: object({
            key: str('Document key'),
            pointer: str('JSON Pointer into the document (default whole document)', { maxLength: 400 }),
            keysOnly: bool('Return keys/length only'),
        }, ['key']),
        async handler({ key, pointer = '', keysOnly }) {
            const { readDataDocumentRows } = require('../../data/commulingo/data-documents');
            const { getPointer } = require('../pointer');
            const row = (await readDataDocumentRows({ prefix: key })).find(item => item.key === key);
            if (!row) throw badRequest(`data document not found: ${key}`, 404);
            const value = getPointer(JSON.parse(row.content_text), pointer);
            const shape = Array.isArray(value) ? { length: value.length } : value && typeof value === 'object' ? { keys: Object.keys(value) } : { value };
            return { key, revision: row.revision, pointer, ...(keysOnly ? shape : { value }) };
        },
    },
    {
        scope: 'read',
        name: 'data_document_revisions',
        description: 'Superseded revisions of one data document, newest first (restore one with data_document_restore).',
        inputSchema: object({ key: str('Document key') }, ['key']),
        async handler({ key }) {
            const { listDataDocumentRevisions } = require('../../data/commulingo/data-documents');
            return { key, revisions: await listDataDocumentRevisions(key) };
        },
    },
    // ── writes ─────────────────────────────────────────────────────────────
    {
        scope: 'edit',
        name: 'doc_put',
        description: 'Create or change one reference document (the store scripts/commulingo-docs put uses): entry replaces the manifest '
            + 'entry, entryPatch changes top-level entry keys (null removes one), body or bodyPath (an .html under content/) replaces the HTML, '
            + 'which is sanitized like an import. An existing document needs expectedRevision from doc_get. Returns the written revision and '
            + 'the person-link audit (mentions, warnings) to check before applying. dryRun defaults to true. Authoring rules: data/commulingo/docs/README.md.',
        inputSchema: object({
            id: str('Document id'),
            entry: obj('Whole manifest entry (title, byline, aliases, people, terms, events, noAutoLink, …)'),
            entryPatch: obj('Top-level entry keys to set (null removes the key)'),
            body: str('HTML body', { maxLength: 20000000 }),
            bodyPath: specPathArg,
            expectedRevision: int('Revision from doc_get (required for an existing document)', 0, 100000000),
            sortOrder: int('List position', -1000000, 1000000),
            fullAudit: bool('Return every person mention of the link audit (default: counts and warned links only)'),
            dryRun: dryRunArg,
            note: noteArg,
            changedBy,
        }, ['id']),
        audit: ({ id, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'doc', targetId: id, actor: actor || `mcp:${client}` }),
        async handler({ id, entry, entryPatch, body, bodyPath, expectedRevision, sortOrder, fullAudit, dryRun = true, note, changedBy: given }, { client }) {
            if (entry && entryPatch) throw badRequest('pass entry or entryPatch, not both');
            if (body !== undefined && bodyPath) throw badRequest('pass body or bodyPath, not both');
            const { readDocRow, writeDocs, storedEntry, sha256 } = require('../../data/commulingo/docs-db');
            const { canonicalEntry } = require('../../data/commulingo/docs-import');
            const { sanitizeDocHtml } = require('../../data/commulingo/doc-sanitize');
            const row = await readDocRow(id);
            if (row && expectedRevision === undefined) throw badRequest('expectedRevision is required for an existing document (doc_get returns it)');
            let next = entry || (row ? row.entry : null);
            if (!next) throw badRequest('a new document needs entry and body');
            if (entryPatch) {
                next = { ...next };
                for (const [key, value] of Object.entries(entryPatch)) {
                    if (value === null) delete next[key];
                    else next[key] = value;
                }
            }
            canonicalEntry({ id, ...next });
            const html = bodyPath ? readSpecFile(bodyPath) : body;
            if (!row && html === undefined) throw badRequest('a new document needs a body');
            const upsert = { id, entry: storedEntry(next), expectedRevision: row ? expectedRevision : 0,
                body: html !== undefined && (!row || sha256(html) !== row.body_sha256) ? sanitizeDocHtml(html) : undefined,
                sortOrder };
            const actor = actorOf(given, client);
            const result = await inTransaction(dryRun, c => writeDocs({ upserts: [upsert] }, { actor, note: note || 'mcp doc_put', client: c }));
            if (!dryRun) await require('../../data/commulingo/docs-store').refreshCommuLingoDocs();
            // The audit lists every person mention (hundreds in a long text);
            // unless fullAudit, keep the counts and the links that carry a warning.
            if (!fullAudit) result.linkAudits = (result.linkAudits || []).map(audit => {
                const mentions = audit.mentions || [];
                const decisions = {};
                for (const mention of mentions) decisions[mention.decision] = (decisions[mention.decision] || 0) + 1;
                const review = mentions.filter(mention => (mention.warnings || []).length && String(mention.decision).startsWith('linked'));
                return { id: audit.id, mentions: mentions.length, decisions, warnings: (audit.warnings || []).length, truncated: audit.truncated,
                    linkedWithWarnings: review.slice(0, 100).map(({ text, personId, decision, warnings, context }) => ({ text, personId, decision, warnings, context })) };
            });
            return { dryRun, ...result };
        },
        summarize: value => ({ dryRun: value.dryRun, written: value.written }),
    },
    {
        scope: 'edit',
        name: 'doc_restore',
        description: 'Restore a reference document to a superseded revision from doc_revisions (itself recorded as a new revision).',
        inputSchema: object({ id: str('Document id'), revision: int('Revision to restore', 1, 100000000), note: noteArg, changedBy }, ['id', 'revision']),
        audit: ({ id, revision, changedBy: actor }, client) => ({ command: `restore ${revision}`, targetType: 'doc', targetId: id, actor: actor || `mcp:${client}` }),
        async handler({ id, revision, note, changedBy: given }, { client }) {
            const { restoreDocRevision } = require('../../data/commulingo/docs-db');
            return restoreDocRevision(id, revision, { actor: actorOf(given, client), note });
        },
    },
    {
        scope: 'edit',
        name: 'data_document_put',
        description: 'Change one data document (validated like scripts/commulingo-data put): content replaces it, or patches '
            + '[{op: set|remove, path: JSON Pointer, value?}] edit parts ("-" appends to an array). expectedRevision from data_document_get '
            + 'is required for an existing document. An activity-catalog change also bumps its version field. dryRun defaults to true.',
        inputSchema: object({
            key: str('Document key'),
            content: obj('Whole document'),
            patches: arr('Pointer patches', 500),
            expectedRevision: int('Revision from data_document_get', 0, 100000000),
            dryRun: dryRunArg,
            note: noteArg,
            changedBy,
        }, ['key']),
        audit: ({ key, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'data_document', targetId: key, actor: actor || `mcp:${client}` }),
        async handler({ key, content, patches, expectedRevision, dryRun = true, note, changedBy: given }, { client }) {
            if (!content === !patches) throw badRequest('pass content or patches, not both');
            const { readDataDocumentRows, writeDataDocuments, refreshDataDocuments } = require('../../data/commulingo/data-documents');
            const row = (await readDataDocumentRows({ prefix: key })).find(item => item.key === key);
            if (row && expectedRevision === undefined) throw badRequest('expectedRevision is required for an existing document (data_document_get returns it)');
            if (patches && !row) throw badRequest(`data document not found: ${key}`, 404);
            const next = patches ? require('../pointer').applyPatches(JSON.parse(row.content_text), patches) : content;
            const actor = actorOf(given, client);
            const result = await inTransaction(dryRun, c => writeDataDocuments({ upserts: [{ key, content: next, expectedRevision: row ? expectedRevision : 0 }] },
                { actor, note: note || 'mcp data_document_put', client: c }));
            if (!dryRun) await refreshDataDocuments();
            return { dryRun, ...result };
        },
        summarize: value => ({ dryRun: value.dryRun, written: value.written }),
    },
    {
        scope: 'edit',
        name: 'data_document_restore',
        description: 'Restore a data document to a superseded revision from data_document_revisions.',
        inputSchema: object({ key: str('Document key'), revision: int('Revision to restore', 1, 100000000), note: noteArg, changedBy }, ['key', 'revision']),
        audit: ({ key, revision, changedBy: actor }, client) => ({ command: `restore ${revision}`, targetType: 'data_document', targetId: key, actor: actor || `mcp:${client}` }),
        async handler({ key, revision, note, changedBy: given }, { client }) {
            const { restoreDataDocumentRevision } = require('../../data/commulingo/data-documents');
            return restoreDataDocumentRevision(key, revision, { actor: actorOf(given, client), note });
        },
    },
    {
        scope: 'edit',
        name: 'link_reviews_apply',
        description: 'Check and apply a link-review manifest {decisions: [{kind, id, lang, text, role, policy, note, sourceSignature?, added?}]} '
            + '(the scripts/reviews/ format, same checks as scripts/review-commulingo-links.js: projected catalogue, renderer regressions, '
            + 'qualified and context expressions). apply: false (default) is the preflight; true writes added expressions and saves the reviews. '
            + 'New glossary terms and renamed event titles need this in the same job, or they never auto-link.',
        inputSchema: object({
            manifest: obj('Manifest with decisions'),
            specPath: specPathArg,
            apply: bool('Write (default false: preflight only)'),
            changedBy,
        }),
        audit: ({ specPath, apply, changedBy: actor }, client) => ({ command: apply ? 'apply' : 'preflight', targetType: 'link_review',
            targetId: specPath || 'inline', actor: actor || `mcp:${client}` }),
        async handler({ manifest, specPath, apply = false, changedBy: given }, { client }) {
            const spec = payload(manifest, specPath, 'manifest');
            const actor = actorOf(given, client);
            const { runLinkReviewManifest } = require('../../data/commulingo/link-review-manifest');
            const result = await runLinkReviewManifest(spec, { apply, actor });
            if (result.samples) result.samples = result.samples.slice(0, 50);
            return result;
        },
        summarize: value => ({ applied: value.applied, total: value.total, saved: value.saved }),
    },
    {
        scope: 'edit',
        name: 'link_expression_reject',
        description: 'Remove a wrong alias or link expression from a term, event or document (it neither links nor is searchable afterwards); '
            + 'the review row goes and the history keeps the reason. Headwords and titles cannot be rejected: rename the entry instead.',
        inputSchema: object({
            kind: str('Entry kind', { enum: ['term', 'event', 'doc'] }),
            id: str('Entry id'),
            lang: str('Language', { enum: ['ko', 'en'] }),
            text: str('The expression'),
            note: str('Reason, 12–2000 characters', { maxLength: 2000 }),
            changedBy,
        }, ['kind', 'id', 'lang', 'text', 'note']),
        audit: ({ kind, id, lang, changedBy: actor }, client) => ({ command: `reject ${lang}`, targetType: kind, targetId: id, actor: actor || `mcp:${client}` }),
        async handler({ changedBy: given, ...input }, { client }) {
            const { rejectExpression } = require('../../data/commulingo/link-review-service');
            return rejectExpression(input, actorOf(given, client));
        },
    },
    {
        scope: 'edit',
        name: 'link_reviews_carry',
        description: 'After an event or document title changed only in spelling (same subject), carry the old name\'s link reviews to the new '
            + 'one; otherwise every review of that language falls back to search-only and body links disappear. Terms carry inside the edit '
            + '(fields.carryLinkReviews: true). apply: false (default) lists what would carry. A narrowed or changed subject needs a new review instead.',
        inputSchema: object({
            kind: str('Entry kind', { enum: ['term', 'event', 'doc'] }),
            id: str('Entry id'),
            lang: str('Language', { enum: ['ko', 'en'] }),
            oldName: str('The previous title'),
            apply: bool('Write (default false)'),
            changedBy,
        }, ['kind', 'id', 'lang', 'oldName']),
        audit: ({ kind, id, apply, changedBy: actor }, client) => ({ command: apply ? 'carry' : 'carry-preview', targetType: kind, targetId: id, actor: actor || `mcp:${client}` }),
        async handler({ kind, id, lang, oldName, apply = false, changedBy: given }, { client }) {
            const { carryLinkReviews } = require('../../data/commulingo/link-review-carry');
            const records = kind === 'term' ? await require('../../data/commulingo/terms-store').loadCommuLingoTerms({ fresh: true })
                : kind === 'event' ? await require('../../data/commulingo/history-events-store').loadCommuLingoHistoryEvents({ fresh: true })
                    : require('../../data/commulingo/docs-store').listCommuLingoDocs();
            const record = records.find(item => item.id === id);
            if (!record) throw badRequest(`${kind} not found: ${id}`, 404);
            const actor = actorOf(given, client);
            const carried = await inTransaction(!apply, async c => {
                await c.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-link-review'))");
                return carryLinkReviews(c, kind, record, { [lang]: oldName }, actor);
            });
            if (apply) await require('../../data/commulingo/link-reviews-store').refreshLinkReviews();
            return { apply, carried };
        },
        summarize: value => ({ apply: value.apply }),
    },
    {
        scope: 'edit',
        name: 'registry_edit',
        description: 'Registry rows without an Admin screen, in one transaction (replaces hand SQL under scripts/migrations/data/). ops, in order: '
            + 'collection_upsert {id, fields {title {ko,en}, intro {ko,en}, icon, sortOrder, termIds}} (a new collection needs title, intro, icon); '
            + 'collection_member_add / collection_member_remove {collectionId, personId}; '
            + 'blocklist_add {kind: phrase|alias|term-phrase|term-alias|term-headword, lang, phrase, note} / blocklist_remove {kind, lang, phrase}; '
            + 'generic_alias_add {lang, phrase, note} / generic_alias_remove {lang, phrase}; '
            + 'event_no_auto_link_set {eventId, phrases[]} and event_term_links_set {eventId, termLinks [{lang, text, termId, reason}]} (each replaces the '
            + 'whole list: read it with registry_get event_link_exceptions first); id_redirect_add {entityType: person|office|role-category, fromId, toId, note}. '
            + 'Each change leaves a revision row. Pass ops inline or specPath to a file with {ops: [...]} or the list. dryRun defaults to true.',
        inputSchema: object({
            ops: arr('Registry edits', 500),
            specPath: specPathArg,
            dryRun: dryRunArg,
            changedBy,
        }),
        audit: ({ ops, specPath, dryRun, changedBy: actor }, client) => ({ command: dryRun === false ? 'apply' : 'dry-run', targetType: 'registry',
            targetId: specPath || `${(ops || []).length} ops`, actor: actor || `mcp:${client}` }),
        async handler({ ops, specPath, dryRun = true, changedBy: given }, { client }) {
            const spec = payload(ops, specPath, 'ops');
            const { applyRegistryEdits } = require('../../data/commulingo/registry-edits');
            return applyRegistryEdits(Array.isArray(spec) ? spec : spec && spec.ops, { actor: actorOf(given, client), dryRun });
        },
        summarize: value => ({ dryRun: value.dryRun, changed: value.changed }),
    },
];

module.exports = tools;
