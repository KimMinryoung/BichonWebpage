const db = require('../../config/database');

const CACHE_MS = Number.parseInt(process.env.COMMULINGO_PEOPLE_CACHE_MS || '30000', 10);

let cache = null;
let pendingLoad = null;

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
    ] = await Promise.all([
        db.query(
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en
             FROM commulingo_people_groups
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT id, group_id, initial, cyrillic, years_label,
                    name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
                    fate_kind, fate_label_ko, fate_label_en
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
            `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon
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
            `SELECT person_id, icon, office_id, label_ko, label_en
             FROM commulingo_person_roles
             ORDER BY person_id`
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
            label: label.ko || label.en ? label : null,
        };
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
            rows: officeRowsByOffice[row.id] || [],
        })),
        people: rows.people.map(row => ({
            id: row.id,
            group: row.group_id,
            initial: row.initial || '',
            cyrillic: row.cyrillic || '',
            name: t(row.name_ko, row.name_en),
            years: row.years_label || '',
            epithet: t(row.epithet_ko, row.epithet_en),
            bio: t(row.bio_ko, row.bio_en),
            fate: {
                kind: row.fate_kind || '',
                label: t(row.fate_label_ko, row.fate_label_en),
            },
            aliases: aliasesByPerson[row.id] || { ko: [], en: [] },
            scenes: scenesByPerson[row.id] || [],
        })),
        careers,
        patronymics,
        cyrillicPatronymics,
        personRoles,
    };
}

async function loadCommuLingoPeopleFromDb(options = {}) {
    const now = Date.now();
    const cacheMs = Number.isFinite(CACHE_MS) && CACHE_MS >= 0 ? CACHE_MS : 30000;
    if (!options.fresh && cache && now < cache.expiresAt) return cache.data;
    if (!options.fresh && pendingLoad) return pendingLoad;

    pendingLoad = fetchRows()
        .then(rows => {
            if (!rows.people.length) {
                const err = new Error('commulingo_people has no rows');
                err.code = 'COMMULINGO_PEOPLE_EMPTY';
                throw err;
            }
            const data = rowsToPeopleData(rows);
            cache = {
                data,
                expiresAt: Date.now() + cacheMs,
            };
            return data;
        })
        .finally(() => {
            pendingLoad = null;
        });

    return pendingLoad;
}

function clearCommuLingoPeopleCache() {
    cache = null;
    pendingLoad = null;
}

module.exports = {
    loadCommuLingoPeopleFromDb,
    clearCommuLingoPeopleCache,
};
