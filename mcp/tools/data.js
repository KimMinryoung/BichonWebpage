// `read` scope: registry, existence and bulk views for agents and mirrors.
// dataset_rows publishes a fixed list of row sets (columns follow the table) for
// consumers that mirror CommuLingo, such as leninbot's knowledge-graph sync;
// that list is this repository's contract with them.
const { str, int, arr, object } = require('../schema');

function db() {
    return require('../../config/database');
}

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

function idList(ids) {
    if (!ids.every(id => typeof id === 'string' && id.length <= 200)) throw badRequest('ids must be strings');
    return [...new Set(ids)];
}

const EXIST_SQL = {
    person: 'SELECT id FROM commulingo_people WHERE id = ANY($1::text[])',
    term: 'SELECT id FROM commulingo_terms WHERE id = ANY($1::text[])',
    event: 'SELECT id FROM commulingo_history_events WHERE id = ANY($1::text[])',
    office: 'SELECT id FROM commulingo_offices WHERE id = ANY($1::text[])',
    office_row: "SELECT id::text AS id FROM commulingo_office_rows WHERE id::text = ANY($1::text[])",
    group: 'SELECT id FROM commulingo_people_groups WHERE id = ANY($1::text[])',
};

const DATASETS = {
    people: 'SELECT * FROM commulingo_people ORDER BY id',
    person_aliases: 'SELECT person_id, lang, alias, sort_order FROM commulingo_person_aliases ORDER BY person_id, sort_order, alias',
    career: 'SELECT * FROM commulingo_person_career_entries ORDER BY id',
    people_groups: 'SELECT * FROM commulingo_people_groups ORDER BY sort_order, id',
    offices: 'SELECT id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en FROM commulingo_offices ORDER BY sort_order, id',
    office_rows: 'SELECT * FROM commulingo_office_rows ORDER BY id',
    events: `SELECT id, sort_order, period_label, title_ko, title_en, summary_ko, summary_en, outcome_ko, outcome_en, timeline, locations,
        to_jsonb(e)->'focus' AS focus, to_jsonb(e)->'sides' AS sides, updated_at FROM commulingo_history_events e ORDER BY sort_order, id`,
    event_people: 'SELECT * FROM commulingo_history_event_people ORDER BY event_id, sort_order, person_id',
    terms: `SELECT id, term_ko, term_en, original, period_label, definition_ko, definition_en, category, region, parent_id, updated_at
        FROM commulingo_terms ORDER BY sort_order, id`,
    term_aliases: 'SELECT term_id, lang, alias, sort_order FROM commulingo_term_aliases ORDER BY term_id, sort_order, alias',
    term_categories: 'SELECT * FROM commulingo_term_categories ORDER BY id',
    term_regions: 'SELECT * FROM commulingo_term_regions ORDER BY id',
    term_relations: 'SELECT term_id, related_id FROM commulingo_term_relations ORDER BY term_id, related_id',
    term_people: 'SELECT term_id, person_id FROM commulingo_term_people ORDER BY term_id, person_id',
    term_events: 'SELECT term_id, event_id, same_subject FROM commulingo_term_events ORDER BY term_id, event_id',
    id_redirects: 'SELECT entity_type, from_id, to_id FROM commulingo_id_redirects ORDER BY entity_type, from_id',
};

const REVISION_KIND = {
    person: 'person', person_career_entry: 'person', person_section: 'person',
    history_event: 'event', history_event_person: 'event', term: 'term', office: 'office',
};

const tools = [
    {
        name: 'groups_list',
        description: 'People groups (era shelves) with title, range, the blurb that defines membership, and people counts.',
        inputSchema: object({}),
        async handler() {
            const { rows } = await db().query(`SELECT g.id, g.shelf, g.range_label, g.title_ko, g.title_en, g.blurb_ko, g.blurb_en,
                    count(p.id)::int AS people_count
                FROM commulingo_people_groups g LEFT JOIN commulingo_people p ON p.group_id = g.id
                GROUP BY g.id ORDER BY g.sort_order, g.id`);
            return { groups: rows };
        },
    },
    {
        name: 'entries_exist',
        description: 'Which of these ids exist. kind: person, term, event, office, office_row, group. For terms also each '
            + 'existing term\'s parentId and whether it has children.',
        inputSchema: object({
            kind: str('Entry kind', { enum: Object.keys(EXIST_SQL) }),
            ids: arr('Ids to check', 500),
        }, ['kind', 'ids']),
        async handler({ kind, ids }) {
            const wanted = idList(ids);
            const existing = (await db().query(EXIST_SQL[kind], [wanted])).rows.map(r => r.id);
            if (kind !== 'term') return { existing };
            const { rows } = await db().query(`SELECT t.id, t.parent_id, EXISTS (SELECT 1 FROM commulingo_terms c WHERE c.parent_id = t.id) AS has_children
                FROM commulingo_terms t WHERE t.id = ANY($1::text[])`, [wanted]);
            return { existing, terms: rows.map(r => ({ id: r.id, parentId: r.parent_id, hasChildren: r.has_children })) };
        },
    },
    {
        name: 'event_raw',
        description: 'One history event as stored (also unpublished skeletons): card fields, full ko/en bodies, timeline, sources, '
            + 'focus, sides and linked people with relation, note and side.',
        inputSchema: object({ id: str('Event id') }, ['id']),
        async handler({ id }) {
            const event = (await db().query(`SELECT id, period_label, title_ko, title_en, question_ko, question_en, summary_ko, summary_en,
                    outcome_ko, outcome_en, body_ko, body_en, timeline, sources, to_jsonb(e)->'focus' AS focus, to_jsonb(e)->'sides' AS sides
                FROM commulingo_history_events e WHERE id = $1`, [id])).rows[0];
            if (!event) throw Object.assign(new Error(`event not found: ${id}`), { status: 404 });
            event.people = (await db().query(`SELECT person_id, sort_order, relation_kind, side, relation_ko, relation_en, note_ko, note_en
                FROM commulingo_history_event_people WHERE event_id = $1 ORDER BY sort_order, person_id`, [id])).rows;
            return { event };
        },
    },
    {
        name: 'dataset_rows',
        description: `Raw rows of a published dataset, for mirrors (columns follow the table). Datasets: ${Object.keys(DATASETS).join(', ')}.`,
        inputSchema: object({
            dataset: str('Dataset name', { enum: Object.keys(DATASETS) }),
            limit: int('Max rows (default 2000)', 1, 5000, { default: 2000 }),
            offset: int('Rows to skip', 0, 10000000, { default: 0 }),
        }, ['dataset']),
        async handler({ dataset, limit, offset }) {
            const { rows } = await db().query(`SELECT * FROM (${DATASETS[dataset]}) d LIMIT $1 OFFSET $2`, [limit, offset]);
            return { dataset, offset, rows, done: rows.length < limit };
        },
    },
    {
        name: 'changes_since',
        description: 'Ids of people, events, terms and offices changed after an ISO timestamp (updated_at columns and the revision log; '
            + 'office rows count for their office and person, career entries for their person).',
        inputSchema: object({ since: str('ISO timestamp', { maxLength: 40 }) }, ['since']),
        async handler({ since }) {
            if (Number.isNaN(Date.parse(since))) throw badRequest('since must be an ISO timestamp');
            const changed = { person: new Set(), event: new Set(), term: new Set(), office: new Set() };
            for (const [kind, sql] of [
                ['person', 'SELECT id FROM commulingo_people WHERE updated_at > $1'],
                ['event', 'SELECT id FROM commulingo_history_events WHERE updated_at > $1'],
                ['term', 'SELECT id FROM commulingo_terms WHERE updated_at > $1'],
                ['office', 'SELECT id FROM commulingo_offices WHERE updated_at > $1'],
                ['office', 'SELECT office_id AS id FROM commulingo_office_rows WHERE updated_at > $1'],
                ['person', 'SELECT person_id AS id FROM commulingo_office_rows WHERE updated_at > $1 AND person_id IS NOT NULL'],
                ['person', 'SELECT person_id AS id FROM commulingo_person_career_entries WHERE updated_at > $1'],
            ]) {
                for (const row of (await db().query(sql, [since])).rows) if (row.id) changed[kind].add(String(row.id));
            }
            const revisions = (await db().query('SELECT entity_type, entity_id FROM commulingo_people_revisions WHERE created_at > $1', [since])).rows;
            for (const row of revisions) {
                const kind = REVISION_KIND[row.entity_type];
                if (kind && row.entity_id) changed[kind].add(String(row.entity_id).split('/')[0]);
            }
            const latest = (await db().query('SELECT max(created_at) AS at FROM commulingo_people_revisions')).rows[0].at;
            return { ...Object.fromEntries(Object.entries(changed).map(([k, v]) => [k, [...v].sort()])), latestRevisionAt: latest };
        },
    },
];

module.exports = tools.map(tool => ({ ...tool, scope: 'read' }));
