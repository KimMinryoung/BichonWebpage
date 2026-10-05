// `read` scope: the same views the Admin screens and editorial services use.
// Modules are required lazily so loading the tool list needs no DB.
const { str, int, bool, object } = require('../schema');

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
        description: 'Search CommuLingo people by id, Korean/English name or native name. Returns card fields.',
        inputSchema: object({ q: str('Substring of id or name'), groupId: str('Exact group id'), ...page }),
        async handler({ q, groupId, limit, offset }) {
            const { listPeopleAdmin } = require('../../data/commulingo/people-admin-store');
            const people = await listPeopleAdmin({ q, groupId, limit, offset });
            return { offset, people: people.map(({ bio, moment, ...card }) => ({ ...card, bio: { ko: (bio.ko || '').slice(0, 200), en: (bio.en || '').slice(0, 200) } })) };
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
                period: term.period, category: term.category, region: term.region, parent: term.parent || null }));
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
            return { offices: await listOfficesAdmin() };
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
        description: 'Editorial suggestions (agent or admin edits awaiting or past review), newest first.',
        inputSchema: object({
            status: str('Suggestion status', { enum: ['pending', 'approved', 'rejected'], default: 'pending' }),
            targetType: str('Target type, e.g. person, person_section, term'),
            targetId: str('Target id'),
            includePatch: bool('Include patch_json and source_refs (default false)'),
            ...page,
        }),
        async handler({ status, targetType, targetId, includePatch, limit, offset }) {
            const db = require('../../config/database');
            const { rows } = await db.query(
                `SELECT id, target_type, target_id, action, confidence, status, suggested_by, reviewer, review_note,
                        created_at, reviewed_at${includePatch ? ', patch_json, source_refs' : ''},
                        count(*) OVER () AS total
                 FROM commulingo_agent_suggestions
                 WHERE status = $1 AND ($2 = '' OR target_type = $2) AND ($3 = '' OR target_id = $3)
                 ORDER BY created_at DESC, id DESC LIMIT $4 OFFSET $5`,
                [status, targetType || '', targetId || '', limit, offset]);
            return { total: rows.length ? Number(rows[0].total) : 0, offset, items: rows.map(({ total, ...row }) => row) };
        },
    },
    {
        name: 'curation_gaps_list',
        description: 'Curation gaps (missing people/terms/links found while curating events), highest priority first.',
        inputSchema: object({
            status: str('Gap status', { enum: ['pending', 'done', 'skipped'], default: 'pending' }),
            kind: str('Gap kind'),
            eventId: str('Event the gap was found in'),
            ...page,
        }),
        async handler({ status, kind, eventId, limit, offset }) {
            const db = require('../../config/database');
            const { rows } = await db.query(
                `SELECT id, kind, event_id, target_id, label_ko, label_en, reason, priority, status, resolved_id,
                        resolution, claimed_by, claimed_at, created_by, created_at, updated_at, count(*) OVER () AS total
                 FROM commulingo_curation_gaps
                 WHERE status = $1 AND ($2 = '' OR kind = $2) AND ($3 = '' OR event_id = $3)
                 ORDER BY priority DESC, created_at, id LIMIT $4 OFFSET $5`,
                [status, kind || '', eventId || '', limit, offset]);
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
