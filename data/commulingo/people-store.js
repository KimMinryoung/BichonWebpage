const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

// The people dictionary is served from a local JSON snapshot (fast, no
// per-request DB round-trip). The DB is only touched to (re)build that
// snapshot: on a background timer every REFRESH_MS, or synchronously the first
// time when no snapshot exists yet. The snapshot lives in the bind-mounted data
// dir so it persists across container restarts and doubles as an on-disk backup.
const REFRESH_MS = Number.parseInt(process.env.COMMULINGO_PEOPLE_REFRESH_MS || '600000', 10);
const SNAPSHOT_PATH = process.env.COMMULINGO_PEOPLE_SNAPSHOT
    || path.join(__dirname, 'people-snapshot.json');

let memory = null;          // { data, source, at } — in-process copy served on the hot path
let pendingRefresh = null;  // coalesced in-flight DB refresh
let refreshTimer = null;

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
    ] = await Promise.all([
        db.query(
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en
             FROM commulingo_people_groups
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT id, group_id, initial, cyrillic, years_label,
                    name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en,
                    epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                    fate_kind, fate_label_ko, fate_label_en,
                    citizenship_code, citizenship_label_ko, citizenship_label_en,
                    origin_code, origin_label_ko, origin_label_en
             FROM commulingo_people
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT person_id, patronymic_ko, patronymic_en, cyrillic_patronymic
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
            `SELECT person_id, period_label, role_ko, role_en
             FROM commulingo_person_career_entries
             ORDER BY person_id, sort_order, id`
        ),
        db.query(
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon, lineage
             FROM commulingo_offices
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT office_id, period_label, body_ko, body_en, person_id,
                    name_ko, name_en, note_ko, note_en
             FROM commulingo_office_rows
             ORDER BY office_id, sort_order, id`
        ),
        db.query(
            `SELECT person_id, icon, office_id, category_id, label_ko, label_en
             FROM commulingo_person_roles
             ORDER BY person_id`
        ),
        db.query(
            `SELECT id, icon, label_ko, label_en
             FROM commulingo_role_categories
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources
             FROM commulingo_person_sections
             ORDER BY person_id, sort_order, id`
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
    };
}

function rowsToPeopleData(rows) {
    const aliasesByPerson = {};
    rows.aliases.forEach(row => addLocalizedList(aliasesByPerson, row.person_id, row.lang, row.alias));

    const scenesByPerson = {};
    rows.scenes.forEach(row => {
        addListItem(scenesByPerson, row.person_id, [row.collection_id, row.episode_id]);
    });

    const careers = {};
    rows.careers.forEach(row => {
        addListItem(careers, row.person_id, {
            y: row.period_label || '',
            r: t(row.role_ko, row.role_en),
        });
    });

    const patronymics = {};
    const cyrillicPatronymics = {};
    rows.patronymics.forEach(row => {
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
        });
    });

    const personRoles = {};
    rows.personRoles.forEach(row => {
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
        })),
        offices: rows.offices.map(row => ({
            id: row.id,
            range: row.range_label || '',
            title: t(row.title_ko, row.title_en),
            blurb: t(row.blurb_ko, row.blurb_en),
            icon: row.icon || '',
            lineage: Array.isArray(row.lineage) ? row.lineage : [],
            rows: officeRowsByOffice[row.id] || [],
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
        })),
        careers,
        patronymics,
        cyrillicPatronymics,
        personRoles,
        roleCategories,
        sectionCounts,
        sections: sectionsByPerson,
    };
}

function readSnapshotFile() {
    try {
        const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
        if (data && Array.isArray(data.people) && data.people.length) return data;
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('[commulingo people] snapshot read failed:', err.message);
        }
    }
    return null;
}

function writeSnapshotFile(data) {
    try {
        const tmp = SNAPSHOT_PATH + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(data));
        fs.renameSync(tmp, SNAPSHOT_PATH); // atomic swap so readers never see a partial file
    } catch (err) {
        console.error('[commulingo people] snapshot write failed:', err.message);
    }
}

// Rebuild from the DB, persist the snapshot, refresh the in-memory copy.
// Coalesced so overlapping callers share one query.
function refreshFromDb() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = fetchRows()
        .then(rows => {
            if (!rows.people.length) {
                const err = new Error('commulingo_people has no rows');
                err.code = 'COMMULINGO_PEOPLE_EMPTY';
                throw err;
            }
            const data = rowsToPeopleData(rows);
            memory = { data, source: 'db', at: Date.now() };
            writeSnapshotFile(data);
            return data;
        })
        .finally(() => {
            pendingRefresh = null;
        });
    return pendingRefresh;
}

function ensureRefreshTimer() {
    if (refreshTimer) return;
    refreshTimer = setInterval(() => {
        refreshFromDb().catch(err =>
            console.error('[commulingo people] scheduled refresh failed:', err.message));
    }, REFRESH_MS);
    if (refreshTimer.unref) refreshTimer.unref(); // don't keep the process alive
}

// Primary loader. Serves the local snapshot (memory → disk); the DB is hit only
// when no snapshot exists yet, or explicitly via options.fresh. Returns
// { data, source } where source is 'db' | 'snapshot' | 'empty'.
async function loadCommuLingoPeople(options = {}) {
    ensureRefreshTimer();

    if (options.fresh) {
        try {
            return { data: await refreshFromDb(), source: 'db' };
        } catch (err) {
            if (memory) return { data: memory.data, source: memory.source };
            const snap = readSnapshotFile();
            if (snap) return { data: snap, source: 'snapshot' };
            throw err;
        }
    }

    // Hot path: serve the in-memory copy. If it is older than REFRESH_MS, kick a
    // background refresh but still return the current data immediately.
    if (memory) {
        if (Date.now() - memory.at >= REFRESH_MS) refreshFromDb().catch(() => {});
        return { data: memory.data, source: memory.source };
    }

    // Cold start: load the on-disk snapshot (fast), then refresh in the
    // background. at:0 marks it stale so the next call triggers that refresh too.
    const snap = readSnapshotFile();
    if (snap) {
        memory = { data: snap, source: 'snapshot', at: 0 };
        refreshFromDb().catch(() => {});
        return { data: snap, source: 'snapshot' };
    }

    // No snapshot yet: build it from the DB this once (the only hot-path DB hit).
    try {
        return { data: await refreshFromDb(), source: 'db' };
    } catch (err) {
        console.error('[commulingo people] no snapshot and DB load failed:', err.message);
        return { data: { groups: [], people: [] }, source: 'empty' };
    }
}

// Rebuild the snapshot from the DB now (used by scripts/deploy and by the admin
// store after an edit so operator changes surface without waiting for the timer).
async function snapshotCommuLingoPeople() {
    const data = await refreshFromDb();
    return { path: SNAPSHOT_PATH, people: data.people.length };
}

function clearCommuLingoPeopleCache() {
    // Frontend admin edits call this; rebuild promptly so the change shows.
    refreshFromDb().catch(err =>
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

module.exports = {
    loadCommuLingoPeople,
    snapshotCommuLingoPeople,
    loadCommuLingoPersonSections,
    clearCommuLingoPeopleCache,
    SNAPSHOT_PATH,
};
