// Editorial writes for history events (card fields, body sections, linked
// people) and office holder rows: the targets agents edit besides people and
// terms. Same contract as person-editorial-service: every write is a
// commulingo_agent_suggestions row; it is applied at once (approved) unless the
// caller stages it (directApply === false) for review, and review applies the
// stored patch. Structural integrity is checked here, fail-closed; curator
// prose policy (length targets, terminology) stays with the writer.
const { withTransaction, writeRevision } = require('./admin-tx');
const { badRequest, requireId } = require('./people-admin-fields');
const offices = require('./people-offices-store');

const TARGETS = ['history_event', 'history_event_section', 'history_event_person', 'office_row'];
const RELATION_KINDS = ['leader', 'executor', 'participant', 'opponent', 'target', 'witness', 'historian'];
const PATCH_KEYS = {
    history_event: ['question', 'summary', 'outcome', 'timeline', 'sources'],
    history_event_section: ['heading', 'body', 'after'],
    history_event_person: ['personId', 'sortOrder', 'relationKind', 'relation', 'note', 'side'],
    office_row: ['sortOrder', 'period', 'body', 'personId', 'name', 'note'],
};
const ACTIONS = {
    history_event: ['update'],
    history_event_section: ['create', 'update'],
    history_event_person: ['create', 'update'],
    office_row: ['create', 'update', 'delete'],
};
const LOCALIZED_EVENT_KEYS = ['question', 'summary', 'outcome'];
const SIDE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEADING_LINE = /^## +(.+?)[ \t]*$/gm;

function notFound(message) {
    return Object.assign(badRequest(message), { status: 404 });
}

function isLocalized(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function hasBoth(value) {
    return isLocalized(value) && typeof value.ko === 'string' && value.ko.trim() && typeof value.en === 'string' && value.en.trim();
}

// Heading identity for body sections: casefold, drop spacing and punctuation,
// so a topic that came back under a punctuation-only variant is the same one
// (leninbot's _dedup_key, which wrote these bodies until 2026-10-05).
function headingKey(heading) {
    return String(heading || '').toLowerCase().replace(/[^0-9a-z가-힣]+/g, '');
}

// [heading, block] parts; each block keeps its own `## ` line so joining the
// blocks reproduces the body. Text before the first heading is kept as-is.
function splitBody(body) {
    const text = String(body || '').replace(/^\n+|\n+$/g, '');
    if (!text) return [];
    const matches = [...text.matchAll(HEADING_LINE)];
    if (!matches.length) return [['', text]];
    const parts = [];
    const lead = text.slice(0, matches[0].index).replace(/^\n+|\n+$/g, '');
    if (lead) parts.push(['', lead]);
    matches.forEach((match, i) => {
        const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
        parts.push([match[1].trim(), text.slice(match.index, end).replace(/^\n+|\n+$/g, '')]);
    });
    return parts;
}

function findSection(parts, heading) {
    const key = headingKey(heading);
    if (!key) return -1;
    return parts.findIndex(([existing]) => existing && headingKey(existing) === key);
}

function spliceSection(body, heading, sectionBody, after, action) {
    const parts = splitBody(body);
    const title = String(heading || '').trim();
    const block = `## ${title}\n\n${String(sectionBody || '').trim()}`;
    if (action === 'update') {
        parts[findSection(parts, title)] = [title, block];
    } else {
        const anchor = after ? findSection(parts, after) : -1;
        parts.splice(anchor >= 0 ? anchor + 1 : parts.length, 0, [title, block]);
    }
    return parts.map(([, text]) => text).filter(text => text.trim()).join('\n\n');
}

async function eventRow(client, id, lock = false) {
    const { rows } = await client.query(
        `SELECT id, period_label, title_ko, title_en, question_ko, question_en, summary_ko, summary_en,
                outcome_ko, outcome_en, body_ko, body_en, timeline, sources, to_jsonb(e)->'sides' AS sides
         FROM commulingo_history_events e WHERE id = $1${lock ? ' FOR UPDATE' : ''}`, [id]);
    return rows[0] || null;
}

function snapshot(row) {
    if (!row) return null;
    const rest = { ...row };
    delete rest.sides;
    return rest;
}

function checkKeys(target, fields) {
    const unknown = Object.keys(fields).filter(key => !PATCH_KEYS[target].includes(key));
    if (unknown.length) throw badRequest(`unknown ${target} field(s): ${unknown.join(', ')}; allowed: ${PATCH_KEYS[target].join(', ')}`);
}

async function validateEvent(client, id, fields) {
    const event = await eventRow(client, id, true);
    if (!event) throw notFound(`history event '${id}' not found`);
    if (!String(event.summary_ko || '').trim()) {
        // A row without a summary is a hand-seeded skeleton; the store keys
        // visibility on summary, so a partial first fill would publish blanks.
        const missing = ['question', 'summary', 'outcome', 'timeline', 'sources'].filter(key => !fields[key] || (Array.isArray(fields[key]) && !fields[key].length));
        if (missing.length) throw badRequest(`event '${id}' is a skeleton; its first write must carry the whole card (missing: ${missing.join(', ')})`);
    }
    for (const key of LOCALIZED_EVENT_KEYS) {
        if (fields[key] !== undefined && fields[key] !== null && !isLocalized(fields[key])) throw badRequest(`${key} must be an object {ko, en}`);
    }
    if (fields.timeline !== undefined && fields.timeline !== null) {
        if (!Array.isArray(fields.timeline) || !fields.timeline.length) throw badRequest('timeline must be a non-empty list');
        fields.timeline.forEach((item, i) => {
            if (!isLocalized(item) || Object.keys(item).some(key => !['date', 'title', 'body'].includes(key))) {
                throw badRequest(`timeline[${i}] must be {date, title {ko,en}, body {ko,en}}`);
            }
            if (!String(item.date || '').trim()) throw badRequest(`timeline[${i}].date is required`);
            for (const key of ['title', 'body']) if (!hasBoth(item[key])) throw badRequest(`timeline[${i}].${key} needs ko and en`);
        });
    }
    if (fields.sources !== undefined && fields.sources !== null
        && (!Array.isArray(fields.sources) || !fields.sources.length || fields.sources.some(s => typeof s !== 'string' || !s.trim()))) {
        throw badRequest('sources must be a non-empty list of reference strings (it replaces the stored list)');
    }
    return event;
}

async function validateSection(client, id, action, fields) {
    const event = await eventRow(client, id, true);
    if (!event) throw notFound(`history event '${id}' not found`);
    for (const key of ['heading', 'body']) if (!hasBoth(fields[key])) throw badRequest(`${key} must be {ko, en}, both non-empty`);
    for (const lang of ['ko', 'en']) {
        if (/(^|\n)\s*#{1,6} /.test(fields.body[lang])) throw badRequest(`body.${lang} contains a markdown heading line; one call is one section`);
    }
    if (fields.after !== undefined && fields.after !== null && !isLocalized(fields.after)) throw badRequest('after must be {ko, en} headings, or omitted');
    for (const lang of ['ko', 'en']) {
        const parts = splitBody(event[`body_${lang}`]);
        const at = findSection(parts, fields.heading[lang]);
        if (action === 'create' && at >= 0) throw badRequest(`'${id}' already has a ${lang} section '${parts[at][0]}' on this topic; update it`);
        if (action === 'update' && at < 0) throw badRequest(`'${id}' has no ${lang} section '${fields.heading[lang]}'; create it`);
        const anchor = String((fields.after || {})[lang] || '').trim();
        if (action === 'create' && anchor && findSection(parts, anchor) < 0) throw badRequest(`after.${lang} '${anchor}' is not a heading of the ${lang} body`);
    }
    return event;
}

async function validateEventPerson(client, id, fields) {
    const event = await eventRow(client, id, true);
    if (!event) throw notFound(`history event '${id}' not found`);
    const sideIds = (Array.isArray(event.sides) ? event.sides : []).map(side => side && side.id).filter(Boolean);
    if (fields.side !== undefined && fields.side !== null) {
        if (typeof fields.side !== 'string' || !SIDE_ID.test(fields.side) || !sideIds.includes(fields.side)) {
            throw badRequest(sideIds.length ? `side must be one of ${sideIds.join(', ')}` : 'this event names no sides; omit side');
        }
    }
    const personId = String(fields.personId || '').trim();
    if (!personId) throw badRequest('personId is required');
    if (!(await client.query('SELECT 1 FROM commulingo_people WHERE id = $1', [personId])).rows.length) throw notFound(`person '${personId}' not found`);
    if (!RELATION_KINDS.includes(fields.relationKind)) throw badRequest(`relationKind must be one of ${RELATION_KINDS.join(', ')}`);
    if (sideIds.length && fields.relationKind === 'opponent') throw badRequest(`this event names its sides (${sideIds.join(', ')}); give the person's side instead of opponent`);
    if (!hasBoth(fields.relation)) throw badRequest('relation needs ko and en');
    // The caption under the person is optional for operator backfills; the
    // curator's own policy requires it before calling.
    if (fields.note !== undefined && fields.note !== null && !isLocalized(fields.note)) throw badRequest('note must be {ko, en}');
    if (fields.sortOrder !== undefined && fields.sortOrder !== null && !Number.isInteger(fields.sortOrder)) throw badRequest('sortOrder must be an integer, or null to append');
    return event;
}

async function applyEvent(client, id, fields, actor) {
    const before = snapshot(await eventRow(client, id));
    const sets = [], values = [];
    for (const key of LOCALIZED_EVENT_KEYS) {
        if (isLocalized(fields[key])) {
            values.push(fields[key].ko || '', fields[key].en || '');
            sets.push(`${key}_ko = $${values.length - 1}`, `${key}_en = $${values.length}`);
        }
    }
    for (const key of ['timeline', 'sources']) {
        if (fields[key] !== undefined && fields[key] !== null) {
            values.push(JSON.stringify(fields[key]));
            sets.push(`${key} = $${values.length}::jsonb`);
        }
    }
    if (sets.length) {
        values.push(id);
        await client.query(`UPDATE commulingo_history_events SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${values.length}`, values);
    }
    await writeRevision(client, 'history_event', id, 'update event', { before, after: snapshot(await eventRow(client, id)) }, actor);
    return { summary: `updated event '${id}' (${Object.keys(fields).sort().join(', ') || 'no fields'})` };
}

async function applySection(client, id, action, fields, actor) {
    const row = await eventRow(client, id);
    const after = fields.after || {};
    const body = lang => spliceSection(row[`body_${lang}`], fields.heading[lang], fields.body[lang], after[lang], action);
    await client.query('UPDATE commulingo_history_events SET body_ko = $1, body_en = $2, updated_at = NOW() WHERE id = $3', [body('ko'), body('en'), id]);
    const heading = fields.heading.ko || fields.heading.en;
    await writeRevision(client, 'history_event', id, `${action} body section '${heading}'`, { before: snapshot(row), after: snapshot(await eventRow(client, id)) }, actor);
    return { summary: `${action === 'create' ? 'added' : 'rewrote'} body section '${heading}' of event '${id}'` };
}

async function applyEventPerson(client, id, fields, actor) {
    const personId = String(fields.personId).trim();
    const { rows } = await client.query(
        `SELECT event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en, side
         FROM commulingo_history_event_people WHERE event_id = $1 AND person_id = $2`, [id, personId]);
    const before = rows[0] || null;
    const sortOrder = Number.isInteger(fields.sortOrder) ? fields.sortOrder
        : before ? before.sort_order
            : (await client.query('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM commulingo_history_event_people WHERE event_id = $1', [id])).rows[0].next;
    // A patch without "side" keeps the stored side; "side": null clears it.
    // Without "note" an existing caption is kept too.
    const note = isLocalized(fields.note) ? fields.note : {};
    await client.query(
        `INSERT INTO commulingo_history_event_people
            (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en, side)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (event_id, person_id) DO UPDATE SET
            sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
            relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
            note_ko = CASE WHEN $11 THEN EXCLUDED.note_ko ELSE commulingo_history_event_people.note_ko END,
            note_en = CASE WHEN $11 THEN EXCLUDED.note_en ELSE commulingo_history_event_people.note_en END,
            side = CASE WHEN $10 THEN EXCLUDED.side ELSE commulingo_history_event_people.side END`,
        [id, personId, sortOrder, fields.relationKind, fields.relation.ko, fields.relation.en,
            note.ko || '', note.en || '', fields.side ?? null, Object.hasOwn(fields, 'side'), Object.hasOwn(fields, 'note')]);
    await writeRevision(client, 'history_event_person', `${id}/${personId}`, 'upsert history event person',
        { before, after: { ...fields, eventId: id, sortOrder } }, actor);
    return { summary: `linked person '${personId}' to history event '${id}'` };
}

async function applyOfficeRow(client, id, action, fields, actor) {
    const options = { client, changedBy: actor };
    if (action === 'create') {
        const row = await offices.createOfficeRowAdmin(id, fields, options);
        return { summary: `created office row #${row.id} in '${id}'`, rowId: row.id };
    }
    if (action === 'update') {
        await offices.updateOfficeRowAdmin(id, fields, options);
        return { summary: `updated office row #${id}` };
    }
    await offices.deleteOfficeRowAdmin(id, options);
    return { summary: `deleted office row #${id}` };
}

async function validate(client, target, action, id, fields) {
    if (target === 'history_event') return validateEvent(client, id, fields);
    if (target === 'history_event_section') return validateSection(client, id, action, fields);
    if (target === 'history_event_person') return validateEventPerson(client, id, fields);
    // Office rows are validated by the office store when applied (savepoint below).
    if (fields.personId && !(await client.query('SELECT 1 FROM commulingo_people WHERE id = $1', [fields.personId])).rows.length) {
        throw notFound(`personId '${fields.personId}' does not exist`);
    }
    return null;
}

async function apply(client, target, action, id, fields, actor) {
    if (target === 'history_event') return applyEvent(client, id, fields, actor);
    if (target === 'history_event_section') return applySection(client, id, action, fields, actor);
    if (target === 'history_event_person') return applyEventPerson(client, id, fields, actor);
    return applyOfficeRow(client, id, action, fields, actor);
}

function rowIdOf(value) {
    const id = String(value ?? '').trim();
    if (!/^[1-9][0-9]{0,17}$/.test(id)) throw badRequest('office row update/delete targets a numeric row id');
    return id;
}

function checkRequest(target, action, fields) {
    if (!TARGETS.includes(target)) throw badRequest(`invalid content target '${target}'`);
    if (!ACTIONS[target].includes(action)) throw badRequest(`${target} supports ${ACTIONS[target].join('/')} only`);
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) throw badRequest('fields must be an object');
    checkKeys(target, fields);
}

// request: {target, action, id, fields, sources, confidence?, directApply?, dryRun?, changedBy}
async function submitContentEdit(request, options = {}) {
    const { target, action } = request;
    const fields = request.fields || {};
    checkRequest(target, action, fields);
    // Office row update/delete target a numeric row id; everything else a slug.
    const id = target === 'office_row' && action !== 'create' ? rowIdOf(request.id) : requireId(String(request.id ?? ''), `${target} id`);
    const sources = Array.isArray(request.sources) ? request.sources.filter(s => typeof s === 'string' && s.trim()) : [];
    const actor = options.changedBy || request.changedBy || 'commulingo-editorial';
    return withTransaction(options, async client => {
        await validate(client, target, action, id, fields);
        const pending = !options.reviewed && request.directApply === false;
        await client.query('SAVEPOINT content_validation');
        const applied = await apply(client, target, action, id, fields, actor);
        if (pending || request.dryRun) await client.query('ROLLBACK TO SAVEPOINT content_validation');
        await client.query('RELEASE SAVEPOINT content_validation');
        if (request.dryRun) return { status: 'validated', wouldStage: pending };
        let suggestionId = options.suggestionId;
        if (!suggestionId) {
            suggestionId = (await client.query(
                `INSERT INTO commulingo_agent_suggestions
                    (target_type, target_id, action, patch_json, source_refs, confidence, status, suggested_by, reviewer, review_note, reviewed_at)
                 VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9, $10, CASE WHEN $7 = 'approved' THEN NOW() ELSE NULL END)
                 RETURNING id`,
                [target, id, action, JSON.stringify(fields), JSON.stringify(sources), request.confidence ?? null,
                    pending ? 'pending' : 'approved', actor, pending ? '' : 'auto:direct_apply', pending ? '' : 'applied directly'])).rows[0].id;
        } else {
            await client.query(`UPDATE commulingo_agent_suggestions SET status = 'approved', reviewer = $2, review_note = $3, reviewed_at = NOW() WHERE id = $1`,
                [suggestionId, actor, options.note || 'reviewed through shared store']);
        }
        return pending ? { status: 'pending', suggestionId } : { status: 'approved', suggestionId, ...applied };
    });
}

async function reviewContentSuggestion(id, approve, note, options = {}) {
    return withTransaction(options, async client => {
        const row = (await client.query('SELECT * FROM commulingo_agent_suggestions WHERE id = $1 FOR UPDATE', [id])).rows[0];
        if (!row || !TARGETS.includes(row.target_type)) throw notFound('content suggestion not found');
        if (row.status !== 'pending') throw Object.assign(badRequest(`suggestion already ${row.status}`), { status: 409 });
        if (!approve) {
            await client.query("UPDATE commulingo_agent_suggestions SET status = 'rejected', reviewer = $2, review_note = $3, reviewed_at = NOW() WHERE id = $1",
                [id, options.changedBy || 'admin-review', note || 'rejected']);
            return { status: 'rejected', suggestionId: id };
        }
        if (!String(note || '').trim()) throw badRequest('approval requires a review note');
        return submitContentEdit({ target: row.target_type, action: row.action, id: row.target_id, fields: row.patch_json,
            sources: row.source_refs, confidence: row.confidence },
        { client, reviewed: true, suggestionId: id, note, changedBy: options.changedBy || `agent-suggestion:${id}` });
    });
}

module.exports = { submitContentEdit, reviewContentSuggestion, splitBody, findSection, spliceSection, headingKey, TARGETS, RELATION_KINDS };
