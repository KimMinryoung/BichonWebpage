// `read` scope: the same views the Admin screens and editorial services use.
// Modules are required lazily so loading the tool list needs no DB.
const { str, int, bool, arr, object } = require('../schema');

const page = {
    limit: int('Max items (default 20)', 1, 100, { default: 20 }),
    offset: int('Items to skip', 0, 100000, { default: 0 }),
};

function notFound(what, id) {
    const err = new Error(`${what} not found: ${id}`);
    err.status = 404;
    return err;
}

function matches(needle, values) {
    if (!needle) return true;
    return values.some(value => typeof value === 'string' && value.normalize('NFC').toLowerCase().includes(needle));
}

function needleOf(q) {
    return String(q || '').trim().normalize('NFC').toLowerCase();
}

function flatStrings(value) {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flatStrings);
    if (value && typeof value === 'object') return Object.values(value).flatMap(flatStrings);
    return [];
}

function paged(items, { limit, offset }) {
    return { total: items.length, offset, items: items.slice(offset, offset + limit) };
}

const tools = [
    {
        name: 'people_search',
        description: 'Search CommuLingo people by id, Korean/English name or native name; optional group, and activity filters '
            + '(functionId and affiliationIds must match the same activity). Returns compact cards.',
        inputSchema: object({
            q: str('Substring of id or name'),
            groupId: str('Exact group id'),
            functionId: str('Activity function id (activity catalog)'),
            affiliationIds: arr('Activity affiliation ids, usually one id plus its descendants', 200),
            ...page,
        }),
        async handler({ q = '', groupId = '', functionId = '', affiliationIds = [], limit, offset }) {
            if (affiliationIds.some(id => typeof id !== 'string')) throw Object.assign(new Error('affiliationIds must be strings'), { status: 400 });
            const db = require('../../config/database');
            const activity = functionId || affiliationIds.length;
            const { rows } = await db.query(`SELECT p.id, p.group_id, p.name_ko, p.name_en, p.cyrillic, p.years_label, p.epithet_ko,
                    p.epithet_en, p.fate_kind, p.citizenship_code, p.origin_code, left(p.bio_ko, 200) AS bio_ko_excerpt
                FROM commulingo_people p
                WHERE ($1 = '' OR p.id ILIKE '%' || $1 || '%' OR p.name_ko ILIKE '%' || $1 || '%'
                       OR p.name_en ILIKE '%' || $1 || '%' OR p.cyrillic ILIKE '%' || $1 || '%')
                  AND ($2 = '' OR p.group_id = $2)
                  AND (NOT $3 OR EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(p.activities, '[]'::jsonb)) a
                       WHERE ($4 = '' OR a->>'functionId' = $4) AND (cardinality($5::text[]) = 0 OR a->>'affiliationId' = ANY($5::text[]))))
                ORDER BY p.sort_order, p.id LIMIT $6 OFFSET $7`,
            [q.trim(), groupId.trim(), !!activity, functionId, affiliationIds, limit, offset]);
            return { offset, people: rows };
        },
    },
    {
        name: 'person_get',
        description: 'Full editorial state of one person: card, sections, evidence, enrichment, notes and the revision token later edits must pass as expectedRevision.',
        inputSchema: object({ id: str('Person id') }, ['id']),
        async handler({ id }) {
            const { readPersonEditorial } = require('../../data/commulingo/person-editorial-service');
            const person = await readPersonEditorial(id);
            if (!person) throw notFound('person', id);
            return { person };
        },
    },
    {
        name: 'person_events',
        description: 'History events a person takes part in, with role, side and relation.',
        inputSchema: object({ id: str('Person id') }, ['id']),
        async handler({ id }) {
            const { loadCommuLingoPersonHistoryEvents } = require('../../data/commulingo/history-events-store');
            return { events: await loadCommuLingoPersonHistoryEvents(id) };
        },
    },
    {
        name: 'term_search',
        description: 'Search glossary terms by id, headword, original form or alias.',
        inputSchema: object({ q: str('Substring of id, headword, original or alias'),
            category: str('Exact category id'), region: str('Exact region id'), ...page }),
        async handler({ q, category, region, limit, offset }) {
            const { loadCommuLingoTerms } = require('../../data/commulingo/terms-store');
            const needle = needleOf(q);
            const terms = (await loadCommuLingoTerms()).filter(term => (!category || term.category === category)
                && (!region || term.region === region)
                && matches(needle, [term.id, term.original, ...flatStrings(term.term), ...flatStrings(term.aliases)]));
            const result = paged(terms, { limit, offset });
            result.items = result.items.map(term => ({ id: term.id, term: term.term, original: term.original,
                period: term.period, category: term.category, region: term.region, parent: term.parent || null,
                aliases: flatStrings(term.aliases) }));
            return result;
        },
    },
    {
        name: 'term_get',
        description: 'Full editorial state of one term: fields, aliases, linked people/events, evidence, enrichment, notes and revision.',
        inputSchema: object({ id: str('Term id') }, ['id']),
        async handler({ id }) {
            const { readTermEditorial } = require('../../data/commulingo/term-editorial-service');
            const term = await readTermEditorial(id);
            if (!term) throw notFound('term', id);
            return { term };
        },
    },
    {
        name: 'event_search',
        description: 'Search history events by id or title.',
        inputSchema: object({ q: str('Substring of id or title'), ...page }),
        async handler({ q, limit, offset }) {
            const { loadCommuLingoHistoryEvents } = require('../../data/commulingo/history-events-store');
            const needle = needleOf(q);
            const events = (await loadCommuLingoHistoryEvents()).filter(event => matches(needle, [event.id, ...flatStrings(event.title)]));
            const result = paged(events, { limit, offset });
            result.items = result.items.map(event => ({ id: event.id, title: event.title, period: event.period, people: event.people.length }));
            if (result.items.length) {
                const db = require('../../config/database');
                const sizes = new Map((await db.query(`SELECT id, length(body_ko) AS body_ko_chars, jsonb_array_length(timeline) AS timeline_entries
                    FROM commulingo_history_events WHERE id = ANY($1::text[])`, [result.items.map(e => e.id)])).rows.map(r => [r.id, r]));
                result.items = result.items.map(e => ({ ...e, bodyKoChars: sizes.get(e.id)?.body_ko_chars ?? 0, timelineEntries: sizes.get(e.id)?.timeline_entries ?? 0 }));
            }
            return result;
        },
    },
    {
        name: 'event_get',
        description: 'One history event as published: title, period, summary, body, sides and people.',
        inputSchema: object({ id: str('Event id') }, ['id']),
        async handler({ id }) {
            const { loadCommuLingoHistoryEvents } = require('../../data/commulingo/history-events-store');
            const event = (await loadCommuLingoHistoryEvents()).find(item => item.id === id);
            if (!event) throw notFound('event', id);
            return { event };
        },
    },
    {
        name: 'offices_list',
        description: 'Offices (position lists such as party leaders) with title and range.',
        inputSchema: object({}),
        async handler() {
            const { listOfficesAdmin } = require('../../data/commulingo/people-offices-store');
            const db = require('../../config/database');
            const counts = new Map((await db.query('SELECT office_id, count(*)::int AS n FROM commulingo_office_rows GROUP BY office_id')).rows.map(r => [r.office_id, r.n]));
            return { offices: (await listOfficesAdmin()).map(office => ({ ...office, rowCount: counts.get(office.id) || 0 })) };
        },
    },
    {
        name: 'office_get',
        description: 'One office with all its holder rows.',
        inputSchema: object({ id: str('Office id') }, ['id']),
        async handler({ id }) {
            const { getOfficeAdmin } = require('../../data/commulingo/people-offices-store');
            const office = await getOfficeAdmin(id);
            if (!office) throw notFound('office', id);
            return { office };
        },
    },
    {
        name: 'suggestions_list',
        description: 'Editorial suggestions (agent or admin edits awaiting or past review), newest first. Pass id for one suggestion (status is then ignored).',
        inputSchema: object({
            id: str('One suggestion id'),
            status: str('Suggestion status', { enum: ['pending', 'approved', 'rejected', 'all'], default: 'pending' }),
            targetType: str('Target type, e.g. person, person_section, term'),
            targetId: str('Target id'),
            includePatch: bool('Include patch_json and source_refs (default false)'),
            ...page,
        }),
        async handler({ id, status, targetType, targetId, includePatch, limit, offset }) {
            if (id && !/^[0-9]{1,18}$/.test(id)) throw Object.assign(new Error('id must be numeric'), { status: 400 });
            const db = require('../../config/database');
            const { rows } = await db.query(
                `SELECT id, target_type, target_id, action, confidence, status, suggested_by, reviewer, review_note,
                        created_at, reviewed_at${includePatch ? ', patch_json, source_refs' : ''},
                        count(*) OVER () AS total
                 FROM commulingo_agent_suggestions
                 WHERE ($6::bigint IS NOT NULL AND id = $6::bigint
                        OR $6::bigint IS NULL AND ($1 = 'all' OR status = $1))
                   AND ($2 = '' OR target_type = $2) AND ($3 = '' OR target_id = $3)
                 ORDER BY created_at DESC, id DESC LIMIT $4 OFFSET $5`,
                [status, targetType || '', targetId || '', limit, offset, id || null]);
            return { total: rows.length ? Number(rows[0].total) : 0, offset, items: rows.map(({ total, ...row }) => row) };
        },
    },
    {
        name: 'entry_lookup',
        description: 'Is this person or term already registered? Matches the id, the Korean/English name or headword, or an alias '
            + '(case-insensitive). Also says whether the label is the title of a history event (such names are events, not glossary terms).',
        inputSchema: object({
            kind: str('Entry kind', { enum: ['person', 'term'] }),
            id: str('Proposed id (slug)'),
            label: str('Name or headword as written'),
        }, ['kind', 'label']),
        async handler({ kind, id, label }) {
            const db = require('../../config/database');
            const [table, aliases, foreign, column] = kind === 'person'
                ? ['commulingo_people', 'commulingo_person_aliases', 'person_id', 'name']
                : ['commulingo_terms', 'commulingo_term_aliases', 'term_id', 'term'];
            const existing = (await db.query(`SELECT id FROM ${table}
                    WHERE id=$1 OR lower(${column}_ko)=lower($2) OR lower(${column}_en)=lower($2)
                    UNION SELECT ${foreign} FROM ${aliases} WHERE lower(alias)=lower($2) LIMIT 1`, [id || '', label])).rows[0];
            const event = (await db.query(`SELECT id FROM commulingo_history_events
                    WHERE lower(title_ko)=lower($1) OR ($1<>'' AND lower(title_en)=lower($1)) LIMIT 1`, [label])).rows[0];
            return { existingId: existing ? existing.id : null, eventTitleMatch: event ? event.id : null };
        },
    },
    {
        name: 'id_redirects_list',
        description: 'Retired ids and the id each now points to (person/term/event renames), oldest first. Callers that keep CommuLingo ids '
            + 'in their own state follow renames with this.',
        inputSchema: object({
            entityType: str('Entity type, e.g. person, term, history_event'),
            since: str('Only redirects created at or after this ISO timestamp'),
            ...page,
        }),
        async handler({ entityType, since, limit, offset }) {
            if (since && Number.isNaN(Date.parse(since))) throw Object.assign(new Error('since must be an ISO timestamp'), { status: 400 });
            const db = require('../../config/database');
            const { rows } = await db.query(
                `SELECT entity_type, from_id, to_id, note, created_at, count(*) OVER () AS total
                 FROM commulingo_id_redirects
                 WHERE ($1 = '' OR entity_type = $1) AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
                 ORDER BY created_at, entity_type, from_id LIMIT $3 OFFSET $4`,
                [entityType || '', since || null, limit, offset]);
            return { total: rows.length ? Number(rows[0].total) : 0, offset, items: rows.map(({ total, ...row }) => row) };
        },
    },
    {
        name: 'link_reviews_list',
        description: 'Auto-link expressions and their review state (same listing as the Admin link review screen).',
        inputSchema: object({
            q: str('Substring of expression, label or id'),
            kind: str('Entry kind', { enum: ['person', 'term', 'event'] }),
            pending: bool('Only unreviewed rows'),
            risk: bool('Only rows with risks or collisions'),
            ...page,
        }),
        async handler({ q, kind, pending, risk, limit, offset }) {
            const { listReviews } = require('../../data/commulingo/link-review-service');
            return listReviews({ q: q || '', kind: kind || '', pending: !!pending, risk: !!risk, offset, limit });
        },
    },
    {
        name: 'doc_get',
        description: 'One reference document: its manifest entry (title, aliases, linked people/terms/events, excerpts, modifiedAt) '
            + 'and the stored HTML body as published.',
        inputSchema: object({ id: str('Document id') }, ['id']),
        async handler({ id }) {
            const fs = require('node:fs');
            const path = require('node:path');
            const { getCommuLingoDoc } = require('../../data/commulingo/docs-store');
            const doc = getCommuLingoDoc(id);
            if (!doc) throw notFound('document', id);
            const file = path.join(__dirname, '../../data/commulingo/docs', path.basename(String(doc.file || '')));
            let html = null;
            try { html = doc.file ? fs.readFileSync(file, 'utf8') : null; } catch (err) { if (err.code !== 'ENOENT') throw err; }
            return { doc, html };
        },
    },
    {
        name: 'docs_list',
        description: 'Reference documents (manifest metadata, no body) with linked people, terms and events.',
        inputSchema: object({ q: str('Substring of id or title'), ...page }),
        async handler({ q, limit, offset }) {
            const { listCommuLingoDocs } = require('../../data/commulingo/docs-store');
            const needle = needleOf(q);
            const docs = listCommuLingoDocs().filter(doc => matches(needle, [doc.id, ...flatStrings(doc.title)]));
            const result = paged(docs, { limit, offset });
            result.items = result.items.map(({ excerpts, ...doc }) => doc);
            return result;
        },
    },
];

module.exports = tools.map(tool => ({ ...tool, scope: 'read' }));
