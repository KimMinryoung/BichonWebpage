// CommuLingo registry rows that have no editorial screen: person position
// collections (정치적 입장 모음) and their members, the auto-link blocklist,
// the generic-alias guard list, per-event link exceptions (no_auto_link,
// term_links), retired-id redirects, the glossary category registry and term category moves. Data batches used to write these with
// hand SQL under scripts/migrations/data/; this applies the same rows in one
// transaction with existence checks and a revision row per change, so the
// MCP tool (registry_edit) and any script share one path. The stores pick the
// rows up within a refresh (signature tables, ~60 s).
// Required lazily so the op list loads without a database (tests, tool listing).
function writeRevision(...args) {
    return require('./admin-tx').writeRevision(...args);
}

const ID = /^[a-z0-9][a-z0-9-]{0,199}$/;
const LANGS = ['ko', 'en'];
const BLOCK_KINDS = ['phrase', 'alias', 'term-phrase', 'term-alias', 'term-headword'];
const REDIRECT_TYPES = ['person', 'office', 'role-category'];

function badRequest(message, status = 400) {
    return Object.assign(new Error(message), { status });
}

function id(value, what) {
    if (typeof value !== 'string' || !ID.test(value)) throw badRequest(`${what} must be a lowercase slug`);
    return value;
}

function text(value, what, max = 200) {
    if (typeof value !== 'string' || !value.trim() || value.length > max) throw badRequest(`${what} must be 1–${max} characters`);
    return value.trim();
}

function lang(value) {
    if (!LANGS.includes(value)) throw badRequest('lang must be ko or en');
    return value;
}

function localized(value, what, max) {
    if (!value || typeof value !== 'object') throw badRequest(`${what} must be {ko, en}`);
    return { ko: text(value.ko, `${what}.ko`, max), en: text(value.en, `${what}.en`, max) };
}

async function mustExist(client, table, value, what) {
    if (!(await client.query(`SELECT 1 FROM ${table} WHERE id = $1`, [value])).rowCount) throw badRequest(`${what} not found: ${value}`, 404);
}

async function eventLinks(client, eventId) {
    const row = (await client.query(`SELECT no_auto_link, to_jsonb(e)->'term_links' AS term_links
        FROM commulingo_history_events e WHERE id = $1 FOR UPDATE`, [eventId])).rows[0];
    if (!row) throw badRequest(`event not found: ${eventId}`, 404);
    return row;
}

// Each handler returns { entityType, entityId, note, snapshot, changed }.
const OPS = {
    async collection_upsert(client, op) {
        const collectionId = id(op.id, 'id');
        const current = (await client.query('SELECT * FROM commulingo_person_collections WHERE id = $1 FOR UPDATE', [collectionId])).rows[0];
        const f = op.fields || {};
        const title = f.title !== undefined ? localized(f.title, 'title', 200) : current ? { ko: current.title_ko, en: current.title_en } : null;
        const intro = f.intro !== undefined ? localized(f.intro, 'intro', 4000) : current ? { ko: current.intro_ko, en: current.intro_en } : null;
        const icon = f.icon !== undefined ? text(f.icon, 'icon', 40) : current?.icon;
        const sortOrder = f.sortOrder !== undefined ? f.sortOrder : current ? current.sort_order : 0;
        const termIds = f.termIds !== undefined ? f.termIds : current ? current.term_ids : [];
        if (!title || !intro || !icon) throw badRequest('a new collection needs fields.title, fields.intro and fields.icon');
        if (!Number.isInteger(sortOrder)) throw badRequest('fields.sortOrder must be an integer');
        if (!Array.isArray(termIds)) throw badRequest('fields.termIds must be a list');
        for (const termId of termIds) await mustExist(client, 'commulingo_terms', id(termId, 'termIds[]'), 'term');
        await client.query(`INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en, term_ids)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8::text[])
            ON CONFLICT (id) DO UPDATE SET sort_order = EXCLUDED.sort_order, icon = EXCLUDED.icon, title_ko = EXCLUDED.title_ko,
                title_en = EXCLUDED.title_en, intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, term_ids = EXCLUDED.term_ids, updated_at = now()`,
        [collectionId, sortOrder, icon, title.ko, title.en, intro.ko, intro.en, termIds]);
        return { entityType: 'person_collection', entityId: collectionId, note: current ? 'update collection' : 'create collection',
            snapshot: { before: current || null, after: { sortOrder, icon, title, intro, termIds } }, changed: true };
    },
    async collection_member_add(client, op) {
        const collectionId = id(op.collectionId, 'collectionId');
        const personId = id(op.personId, 'personId');
        await mustExist(client, 'commulingo_person_collections', collectionId, 'collection');
        await mustExist(client, 'commulingo_people', personId, 'person');
        const { rowCount } = await client.query(`INSERT INTO commulingo_person_collection_members (collection_id, person_id)
            VALUES ($1, $2) ON CONFLICT DO NOTHING`, [collectionId, personId]);
        return { entityType: 'person_collection', entityId: collectionId, note: `add member ${personId}`, snapshot: { personId }, changed: rowCount > 0 };
    },
    async collection_member_remove(client, op) {
        const collectionId = id(op.collectionId, 'collectionId');
        const personId = id(op.personId, 'personId');
        const { rowCount } = await client.query('DELETE FROM commulingo_person_collection_members WHERE collection_id = $1 AND person_id = $2',
            [collectionId, personId]);
        if (!rowCount) throw badRequest(`${personId} is not in ${collectionId}`, 404);
        return { entityType: 'person_collection', entityId: collectionId, note: `remove member ${personId}`, snapshot: { personId }, changed: true };
    },
    async blocklist_add(client, op) {
        if (!BLOCK_KINDS.includes(op.kind)) throw badRequest(`kind must be one of ${BLOCK_KINDS.join(', ')}`);
        const row = [op.kind, lang(op.lang), text(op.phrase, 'phrase'), String(op.note || '').slice(0, 2000)];
        const { rowCount } = await client.query(`INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES ($1, $2, $3, $4)
            ON CONFLICT (kind, lang, phrase) DO UPDATE SET note = EXCLUDED.note WHERE commulingo_link_blocklist.note IS DISTINCT FROM EXCLUDED.note`, row);
        return { entityType: 'link_blocklist', entityId: `${row[0]}:${row[1]}:${row[2]}`, note: 'block', snapshot: { note: row[3] }, changed: rowCount > 0 };
    },
    async blocklist_remove(client, op) {
        const { rowCount } = await client.query('DELETE FROM commulingo_link_blocklist WHERE kind = $1 AND lang = $2 AND phrase = $3',
            [op.kind, lang(op.lang), text(op.phrase, 'phrase')]);
        if (!rowCount) throw badRequest(`no blocklist row ${op.kind}:${op.lang}:${op.phrase}`, 404);
        return { entityType: 'link_blocklist', entityId: `${op.kind}:${op.lang}:${op.phrase}`, note: 'unblock', snapshot: {}, changed: true };
    },
    async generic_alias_add(client, op) {
        const row = [lang(op.lang), text(op.phrase, 'phrase'), String(op.note || '').slice(0, 2000)];
        const { rowCount } = await client.query(`INSERT INTO commulingo_generic_aliases (lang, phrase, note) VALUES ($1, $2, $3)
            ON CONFLICT (lang, phrase) DO NOTHING`, row);
        return { entityType: 'generic_alias', entityId: `${row[0]}:${row[1]}`, note: 'add generic alias', snapshot: { note: row[2] }, changed: rowCount > 0 };
    },
    async generic_alias_remove(client, op) {
        const { rowCount } = await client.query('DELETE FROM commulingo_generic_aliases WHERE lang = $1 AND phrase = $2', [lang(op.lang), text(op.phrase, 'phrase')]);
        if (!rowCount) throw badRequest(`no generic alias ${op.lang}:${op.phrase}`, 404);
        return { entityType: 'generic_alias', entityId: `${op.lang}:${op.phrase}`, note: 'remove generic alias', snapshot: {}, changed: true };
    },
    // The whole list is replaced, like a timeline update: read it with
    // event_raw or registry_get first and send back every row.
    async event_no_auto_link_set(client, op) {
        const eventId = id(op.eventId, 'eventId');
        if (!Array.isArray(op.phrases)) throw badRequest('phrases must be a list');
        const phrases = [...new Set(op.phrases.map(phrase => text(phrase, 'phrases[]')))];
        const before = (await eventLinks(client, eventId)).no_auto_link || [];
        await client.query('UPDATE commulingo_history_events SET no_auto_link = $2::jsonb, updated_at = now() WHERE id = $1', [eventId, JSON.stringify(phrases)]);
        return { entityType: 'history_event', entityId: eventId, note: 'set no_auto_link', snapshot: { before, after: phrases },
            changed: JSON.stringify(before) !== JSON.stringify(phrases) };
    },
    async event_term_links_set(client, op) {
        const eventId = id(op.eventId, 'eventId');
        if (!Array.isArray(op.termLinks)) throw badRequest('termLinks must be a list');
        const links = [];
        for (const [i, link] of op.termLinks.entries()) {
            const termId = id(link && link.termId, `termLinks[${i}].termId`);
            await mustExist(client, 'commulingo_terms', termId, 'term');
            links.push({ lang: lang(link.lang), text: text(link.text, `termLinks[${i}].text`), termId, reason: text(link.reason, `termLinks[${i}].reason`, 2000) });
        }
        const before = (await eventLinks(client, eventId)).term_links || [];
        await client.query('UPDATE commulingo_history_events SET term_links = $2::jsonb, updated_at = now() WHERE id = $1', [eventId, JSON.stringify(links)]);
        return { entityType: 'history_event', entityId: eventId, note: 'set term_links', snapshot: { before, after: links },
            changed: JSON.stringify(before) !== JSON.stringify(links) };
    },
    // Glossary kind categories (first chip row). Reordering means upserting
    // each moved category with its new sortOrder in the same batch.
    async term_category_upsert(client, op) {
        const categoryId = id(op.id, 'id');
        const current = (await client.query('SELECT * FROM commulingo_term_categories WHERE id = $1 FOR UPDATE', [categoryId])).rows[0];
        const label = op.label !== undefined ? localized(op.label, 'label', 80) : current ? { ko: current.label_ko, en: current.label_en } : null;
        const sortOrder = op.sortOrder !== undefined ? op.sortOrder : current ? current.sort_order : null;
        if (!label || sortOrder === null) throw badRequest('a new category needs label and sortOrder');
        if (!Number.isInteger(sortOrder)) throw badRequest('sortOrder must be an integer');
        await client.query(`INSERT INTO commulingo_term_categories (id, sort_order, label_ko, label_en) VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET sort_order = EXCLUDED.sort_order, label_ko = EXCLUDED.label_ko, label_en = EXCLUDED.label_en, updated_at = now()`,
        [categoryId, sortOrder, label.ko, label.en]);
        const changed = !current || current.sort_order !== sortOrder || current.label_ko !== label.ko || current.label_en !== label.en;
        return { entityType: 'term_category', entityId: categoryId, note: current ? 'update category' : 'create category',
            snapshot: { before: current || null, after: { sortOrder, label } }, changed };
    },
    // Moves terms into a category (a split or a misfiled entry). Only the
    // category column changes, so the terms keep their editorial revision and
    // enrichment state; the revision row records each term's old category.
    async term_category_assign(client, op) {
        const categoryId = id(op.category, 'category');
        await mustExist(client, 'commulingo_term_categories', categoryId, 'category');
        if (!Array.isArray(op.termIds) || !op.termIds.length || op.termIds.length > 1000) throw badRequest('termIds must list 1–1000 terms');
        const termIds = [...new Set(op.termIds.map(termId => id(termId, 'termIds[]')))];
        const rows = (await client.query('SELECT id, category FROM commulingo_terms WHERE id = ANY($1) FOR UPDATE', [termIds])).rows;
        const missing = termIds.filter(termId => !rows.some(row => row.id === termId));
        if (missing.length) throw badRequest(`unknown terms: ${missing.join(', ')}`);
        const moved = rows.filter(row => row.category !== categoryId);
        if (moved.length) {
            await client.query('UPDATE commulingo_terms SET category = $2, updated_at = now() WHERE id = ANY($1)', [moved.map(row => row.id), categoryId]);
        }
        return { entityType: 'term_category', entityId: categoryId, note: `assign ${moved.length} terms`,
            snapshot: { before: Object.fromEntries(moved.map(row => [row.id, row.category])), after: categoryId }, changed: moved.length > 0 };
    },
    async id_redirect_add(client, op) {
        if (!REDIRECT_TYPES.includes(op.entityType)) throw badRequest(`entityType must be one of ${REDIRECT_TYPES.join(', ')}`);
        const fromId = id(op.fromId, 'fromId');
        const toId = id(op.toId, 'toId');
        if (op.entityType === 'person') {
            if ((await client.query('SELECT 1 FROM commulingo_people WHERE id = $1', [fromId])).rowCount) throw badRequest(`${fromId} is still a live person; merge it first`);
            await mustExist(client, 'commulingo_people', toId, 'person');
        }
        const note = text(op.note, 'note', 2000);
        await client.query(`INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES ($1, $2, $3, $4)
            ON CONFLICT (entity_type, from_id) DO UPDATE SET to_id = EXCLUDED.to_id, note = EXCLUDED.note`, [op.entityType, fromId, toId, note]);
        return { entityType: 'id_redirect', entityId: `${op.entityType}:${fromId}`, note: `redirect to ${toId}`, snapshot: { toId, note }, changed: true };
    },
};

// ops: [{ op, ...fields }], applied in order in one transaction. dryRun runs
// every write and rolls back, so it fails where the real run would.
async function applyRegistryEdits(ops, { actor, dryRun = true } = {}) {
    if (!Array.isArray(ops) || !ops.length || ops.length > 500) throw badRequest('ops must list 1–500 edits');
    if (!actor) throw badRequest('applyRegistryEdits needs an actor');
    const client = await require('../../config/database').connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout = '3s'");
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-editorial-write'))");
        const results = [];
        for (const [i, op] of ops.entries()) {
            const handler = op && Object.hasOwn(OPS, op.op) ? OPS[op.op] : null;
            if (!handler) throw badRequest(`ops[${i}].op must be one of ${Object.keys(OPS).join(', ')}`);
            let done;
            try {
                done = await handler(client, op);
            } catch (err) {
                err.message = `ops[${i}] ${op.op}: ${err.message}`;
                throw err;
            }
            if (done.changed) await writeRevision(client, done.entityType, done.entityId, done.note, done.snapshot, actor);
            results.push({ op: op.op, target: done.entityId, changed: done.changed });
        }
        await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
        return { dryRun, changed: results.filter(r => r.changed).length, results };
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { applyRegistryEdits, REGISTRY_OPS: Object.keys(OPS), BLOCK_KINDS };
