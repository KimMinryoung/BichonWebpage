const db = require('../../config/database');
const path = require('path');
const { createDictionarySnapshotStore } = require('./snapshot-store');

// The people dictionary is served from a pre-normalized in-memory copy (no
// per-request DB round-trip or re-normalization). The DB is only touched to
// (re)build that copy: on a background timer every REFRESH_MS, or synchronously
// the first time when no snapshot exists yet. The on-disk snapshot in the
// bind-mounted data dir gives instant warm starts and keeps pages up when the
// local leninbot-pg container is down or restarting. Refreshes that fetch
// identical data keep the previous object (so downstream memoization in
// linkify.js stays valid) and skip the disk write.

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

function addLocalizedList(map, personId, lang, value) {
    if (!map[personId]) map[personId] = { ko: [], en: [] };
    map[personId][lang].push(value);
}

function addListItem(map, personId, value) {
    if (!map[personId]) map[personId] = [];
    map[personId].push(value);
}

function latestTimestamp(...values) {
    let latest = 0;
    values.flat().forEach(value => {
        const time = value ? new Date(value).getTime() : NaN;
        if (Number.isFinite(time) && time > latest) latest = time;
    });
    return latest ? new Date(latest).toISOString() : null;
}

async function fetchRows() {
    const [
        groups,
        people,
        patronymics,
        aliases,
        scenes,
        careers,
        offices,
        officeRows,
        personRoles,
        roleCategories,
        sections,
        redirects,
    ] = await Promise.all([
        db.query(
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, updated_at
             FROM commulingo_people_groups
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT id, group_id, initial, cyrillic, years_label,
                    name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en,
                    epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                    fate_kind, fate_label_ko, fate_label_en,
                    citizenship_code, citizenship_label_ko, citizenship_label_en,
                    origin_code, origin_label_ko, origin_label_en, updated_at
             FROM commulingo_people
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at
             FROM commulingo_person_patronymics`
        ),
        db.query(
            `SELECT person_id, lang, alias
             FROM commulingo_person_aliases
             ORDER BY person_id, lang, sort_order, alias`
        ),
        db.query(
            `SELECT person_id, collection_id, episode_id
             FROM commulingo_person_scenes
             ORDER BY person_id, sort_order, collection_id, episode_id`
        ),
        db.query(
            `SELECT person_id, period_label, role_ko, role_en, updated_at
             FROM commulingo_person_career_entries
             ORDER BY person_id, sort_order, id`
        ),
        db.query(
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon, lineage, updated_at
             FROM commulingo_offices
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT office_id, period_label, body_ko, body_en, person_id,
                    name_ko, name_en, note_ko, note_en, updated_at
             FROM commulingo_office_rows
             ORDER BY office_id, sort_order, id`
        ),
        db.query(
            `SELECT person_id, icon, office_id, category_id, label_ko, label_en, updated_at
             FROM commulingo_person_roles
             ORDER BY person_id`
        ),
        db.query(
            `SELECT id, icon, label_ko, label_en, updated_at
             FROM commulingo_role_categories
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at
             FROM commulingo_person_sections
             ORDER BY person_id, sort_order, id`
        ),
        db.query(
            `SELECT entity_type, from_id, to_id
             FROM commulingo_id_redirects
             ORDER BY entity_type, from_id`
        ),
    ]);

    return {
        groups: groups.rows,
        people: people.rows,
        patronymics: patronymics.rows,
        aliases: aliases.rows,
        scenes: scenes.rows,
        careers: careers.rows,
        offices: offices.rows,
        officeRows: officeRows.rows,
        personRoles: personRoles.rows,
        roleCategories: roleCategories.rows,
        sections: sections.rows,
        redirects: redirects.rows,
    };
}

// Retired ids -> the id serving them now, as { entity_type: { from: to } }.
// Chains are flattened here (A merged into B, B later merged into C, so A must
// land on C in one hop) and a cycle just drops the entry rather than looping a
// request forever.
function rowsToRedirects(rows) {
    const direct = {};
    (rows || []).forEach(row => {
        if (!row.entity_type || !row.from_id || !row.to_id) return;
        if (!direct[row.entity_type]) direct[row.entity_type] = {};
        direct[row.entity_type][row.from_id] = row.to_id;
    });

    const resolved = {};
    Object.entries(direct).forEach(([type, map]) => {
        resolved[type] = {};
        Object.keys(map).forEach(from => {
            const seen = new Set([from]);
            let to = map[from];
            while (map[to] && !seen.has(to)) {
                seen.add(to);
                to = map[to];
            }
            if (map[to] && seen.has(map[to])) {
                console.error(`[commulingo redirects] cycle at ${type}:${from}, entry dropped`);
                return;
            }
            resolved[type][from] = to;
        });
    });
    return resolved;
}

function rowsToPeopleData(rows) {
    const personUpdatedAt = {};
    const markPersonUpdated = (personId, value) => {
        if (!personId || !value) return;
        personUpdatedAt[personId] = latestTimestamp(personUpdatedAt[personId], value);
    };
    rows.people.forEach(row => markPersonUpdated(row.id, row.updated_at));

    const aliasesByPerson = {};
    rows.aliases.forEach(row => addLocalizedList(aliasesByPerson, row.person_id, row.lang, row.alias));

    const scenesByPerson = {};
    rows.scenes.forEach(row => {
        addListItem(scenesByPerson, row.person_id, [row.collection_id, row.episode_id]);
    });

    const careers = {};
    rows.careers.forEach(row => {
        markPersonUpdated(row.person_id, row.updated_at);
        addListItem(careers, row.person_id, {
            y: row.period_label || '',
            r: t(row.role_ko, row.role_en),
        });
    });

    const patronymics = {};
    const cyrillicPatronymics = {};
    rows.patronymics.forEach(row => {
        markPersonUpdated(row.person_id, row.updated_at);
        if (row.patronymic_ko || row.patronymic_en) {
            patronymics[row.person_id] = t(row.patronymic_ko, row.patronymic_en);
        }
        if (row.cyrillic_patronymic) {
            cyrillicPatronymics[row.person_id] = row.cyrillic_patronymic;
        }
    });

    const officeRowsByOffice = {};
    rows.officeRows.forEach(row => {
        addListItem(officeRowsByOffice, row.office_id, {
            years: row.period_label || '',
            body: t(row.body_ko, row.body_en),
            personId: row.person_id || '',
            name: t(row.name_ko, row.name_en),
            note: t(row.note_ko, row.note_en),
            updatedAt: latestTimestamp(row.updated_at),
        });
    });

    const personRoles = {};
    const officeUpdatedAt = Object.fromEntries(rows.offices.map(row => [row.id, row.updated_at]));
    const roleCategoryUpdatedAt = Object.fromEntries(rows.roleCategories.map(row => [row.id, row.updated_at]));
    rows.personRoles.forEach(row => {
        markPersonUpdated(row.person_id, latestTimestamp(
            row.updated_at,
            officeUpdatedAt[row.office_id],
            roleCategoryUpdatedAt[row.category_id],
        ));
        const label = t(row.label_ko, row.label_en);
        personRoles[row.person_id] = {
            icon: row.icon || '',
            officeId: row.office_id || '',
            categoryId: row.category_id || '',
            label: label.ko || label.en ? label : null,
        };
    });

    const roleCategories = {};
    rows.roleCategories.forEach(row => {
        roleCategories[row.id] = {
            icon: row.icon || '',
            label: t(row.label_ko, row.label_en),
        };
    });

    // Full detail-page sections, snapshotted so /commulingo/people/<id> renders
    // them locally instead of a per-request DB query. sectionCounts (used for the
    // card's hasDetail flag) is derived from the same rows.
    const sectionsByPerson = {};
    const sectionCounts = {};
    rows.sections.forEach(row => {
        markPersonUpdated(row.person_id, row.updated_at);
        addListItem(sectionsByPerson, row.person_id, {
            slug: row.slug || '',
            sortOrder: row.sort_order || 0,
            heading: t(row.heading_ko, row.heading_en),
            body: t(row.body_ko, row.body_en),
            sources: Array.isArray(row.sources) ? row.sources : [],
        });
        sectionCounts[row.person_id] = (sectionCounts[row.person_id] || 0) + 1;
    });

    return {
        groups: rows.groups.map(row => ({
            id: row.id,
            range: row.range_label || '',
            title: t(row.title_ko, row.title_en),
            blurb: t(row.blurb_ko, row.blurb_en),
            updatedAt: latestTimestamp(row.updated_at),
        })),
        offices: rows.offices.map(row => ({
            id: row.id,
            range: row.range_label || '',
            title: t(row.title_ko, row.title_en),
            blurb: t(row.blurb_ko, row.blurb_en),
            icon: row.icon || '',
            lineage: Array.isArray(row.lineage) ? row.lineage : [],
            rows: officeRowsByOffice[row.id] || [],
            updatedAt: latestTimestamp(
                row.updated_at,
                ...(officeRowsByOffice[row.id] || []).map(item => item.updatedAt),
            ),
        })),
        people: rows.people.map(row => ({
            id: row.id,
            group: row.group_id,
            initial: row.initial || '',
            cyrillic: row.cyrillic || '',
            name: t(row.name_ko, row.name_en),
            givenName: t(row.given_name_ko, row.given_name_en),
            familyName: t(row.family_name_ko, row.family_name_en),
            years: row.years_label || '',
            epithet: t(row.epithet_ko, row.epithet_en),
            moment: t(row.moment_ko, row.moment_en),
            bio: t(row.bio_ko, row.bio_en),
            fate: {
                kind: row.fate_kind || '',
                label: t(row.fate_label_ko, row.fate_label_en),
            },
            citizenship: {
                code: row.citizenship_code || '',
                label: t(row.citizenship_label_ko, row.citizenship_label_en),
            },
            origin: {
                code: row.origin_code || '',
                label: t(row.origin_label_ko, row.origin_label_en),
            },
            aliases: aliasesByPerson[row.id] || { ko: [], en: [] },
            scenes: scenesByPerson[row.id] || [],
            updatedAt: personUpdatedAt[row.id] || latestTimestamp(row.updated_at),
        })),
        careers,
        patronymics,
        cyrillicPatronymics,
        personRoles,
        roleCategories,
        sectionCounts,
        sections: sectionsByPerson,
        redirects: rowsToRedirects(rows.redirects),
    };
}

const store = createDictionarySnapshotStore({
    label: 'commulingo people',
    refreshMs: Number.parseInt(process.env.COMMULINGO_PEOPLE_REFRESH_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_PEOPLE_SNAPSHOT
        || path.join(__dirname, 'people-snapshot.json'),
    fetchData: async () => rowsToPeopleData(await fetchRows()),
    isEmpty: data => !data.people.length,
    emptyErrorMessage: 'commulingo_people has no rows',
    emptyErrorCode: 'COMMULINGO_PEOPLE_EMPTY',
    validateSnapshot: data => Boolean(data) && Array.isArray(data.people) && data.people.length > 0,
    emptyFallback: { groups: [], people: [] },
});

// Primary loader. Serves the local snapshot (memory → disk); the DB is hit only
// when no snapshot exists yet, or explicitly via options.fresh. Returns
// { data, source } where source is 'db' | 'snapshot' | 'empty'.
function loadCommuLingoPeople(options = {}) {
    return store.load(options);
}

// Rebuild the snapshot from the DB now (used by scripts/deploy and by the admin
// store after an edit so operator changes surface without waiting for the timer).
async function snapshotCommuLingoPeople() {
    const data = await store.refresh();
    return { path: store.snapshotPath, people: data.people.length };
}

function clearCommuLingoPeopleCache() {
    // Frontend admin edits call this; rebuild promptly so the change shows.
    store.refresh().catch(err =>
        console.error('[commulingo people] refresh after edit failed:', err.message));
}

async function loadCommuLingoPersonSections(personId) {
    const id = typeof personId === 'string' ? personId.trim() : '';
    if (!id) return [];
    const { rows } = await db.query(
        `SELECT slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources
         FROM commulingo_person_sections
         WHERE person_id = $1
         ORDER BY sort_order, id`,
        [id]
    );
    return rows.map(row => ({
        slug: row.slug || '',
        sortOrder: row.sort_order || 0,
        heading: t(row.heading_ko, row.heading_en),
        body: t(row.body_ko, row.body_en),
        sources: Array.isArray(row.sources) ? row.sources : [],
    }));
}

// Where a retired id should send the request, or '' if it is simply unknown.
// Takes the loaded data object so callers read the same snapshot they rendered
// from — and tolerates a snapshot file written before redirects existed.
function redirectTarget(data, entityType, id) {
    if (!data || !id) return '';
    const map = (data.redirects || {})[entityType];
    return (map && map[id]) || '';
}

module.exports = {
    loadCommuLingoPeople,
    snapshotCommuLingoPeople,
    loadCommuLingoPersonSections,
    clearCommuLingoPeopleCache,
    redirectTarget,
    SNAPSHOT_PATH: store.snapshotPath,
};
