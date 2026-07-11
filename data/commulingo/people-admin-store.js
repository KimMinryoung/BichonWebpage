const db = require('../../config/database');
const { OFFICE_ICON, parsePeriod } = require('./people-standard');
const { clearCommuLingoPeopleCache } = require('./people-store');

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

function localized(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return lang === 'ko' ? value : '';
    return value[lang] || '';
}

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function parseLifeYears(label) {
    const match = /^(\d{3,4})[–-](\d{3,4})$/.exec(label || '');
    if (!match) return { birthYear: null, deathYear: null };
    return {
        birthYear: Number.parseInt(match[1], 10),
        deathYear: Number.parseInt(match[2], 10),
    };
}

function periodColumns(label) {
    const period = parsePeriod(label || '');
    return {
        startYear: period.start ? period.start.year : null,
        startMonth: period.start ? period.start.month : null,
        endYear: period.end ? period.end.year : null,
        endMonth: period.end ? period.end.month : null,
    };
}

function requireId(id, label) {
    const value = typeof id === 'string' ? id.trim() : '';
    if (!value || !/^[a-z0-9][a-z0-9-]{1,120}$/.test(value)) {
        const err = new Error(`invalid ${label || 'id'}`);
        err.status = 400;
        throw err;
    }
    return value;
}

function requireSlug(slug) {
    return requireId(slug, 'section slug');
}

function normalizeSources(sources) {
    if (sources === undefined) return [];
    if (!Array.isArray(sources)) throw badRequest('sources must be an array');
    return sources;
}

function normalizeLimit(value, fallback = 100) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.min(parsed, 250);
}

function normalizeOffset(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function withTransaction(options, callback) {
    if (options && options.client) return callback(options.client);
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        clearCommuLingoPeopleCache();
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function writeRevision(client, entityType, entityId, note, snapshot, changedBy) {
    await client.query(
        `INSERT INTO commulingo_people_revisions
            (entity_type, entity_id, revision_note, snapshot, changed_by)
         VALUES ($1, $2, $3, $4::jsonb, $5)`,
        [
            entityType,
            entityId,
            note || '',
            JSON.stringify(snapshot || {}),
            changedBy || 'commulingo-admin-api',
        ]
    );
}

async function replaceRole(client, personId, role) {
    if (role === undefined) return;
    if (role === null) {
        await client.query('DELETE FROM commulingo_person_roles WHERE person_id = $1', [personId]);
        return;
    }
    if (!role || typeof role !== 'object') throw badRequest('role must be an object or null');

    const category = typeof role.category === 'string' ? role.category.trim() : '';
    const icon = typeof role.icon === 'string' ? role.icon.trim() : '';
    const officeId = typeof role.officeId === 'string' ? role.officeId.trim() : '';
    if (!category && !icon && !officeId) throw badRequest('role.category, role.icon, or role.officeId is required');
    if (category) {
        const categoryResult = await client.query('SELECT 1 FROM commulingo_role_categories WHERE id = $1', [category]);
        if (!categoryResult.rows.length) throw badRequest('role.category not found');
    }
    if (!category && officeId) {
        const officeResult = await client.query('SELECT 1 FROM commulingo_offices WHERE id = $1', [officeId]);
        if (!officeResult.rows.length) throw badRequest('role.officeId not found');
    }

    const label = role.label || {};
    await client.query(
        `INSERT INTO commulingo_person_roles
            (person_id, icon, office_id, category_id, label_ko, label_en, updated_at)
         VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), $5, $6, NOW())
         ON CONFLICT (person_id)
         DO UPDATE SET
            icon = EXCLUDED.icon,
            office_id = EXCLUDED.office_id,
            category_id = EXCLUDED.category_id,
            label_ko = EXCLUDED.label_ko,
            label_en = EXCLUDED.label_en,
            updated_at = NOW()`,
        [
            personId,
            category ? '' : icon,
            category ? '' : officeId,
            category,
            category ? '' : localized(label, 'ko'),
            category ? '' : localized(label, 'en'),
        ]
    );
}

function rowToPerson(row) {
    return {
        id: row.id,
        group: row.group_id,
        groupId: row.group_id,
        initial: row.initial || '',
        cyrillic: row.cyrillic || '',
        years: row.years_label || '',
        birthYear: row.birth_year,
        deathYear: row.death_year,
        name: t(row.name_ko, row.name_en),
        epithet: t(row.epithet_ko, row.epithet_en),
        moment: t(row.moment_ko, row.moment_en),
        bio: t(row.bio_ko, row.bio_en),
        fate: {
            kind: row.fate_kind || '',
            label: t(row.fate_label_ko, row.fate_label_en),
        },
    };
}

async function listPeopleAdmin(options = {}) {
    const q = typeof options.q === 'string' ? options.q.trim() : '';
    const groupId = typeof options.groupId === 'string' ? options.groupId.trim() : '';
    const limit = normalizeLimit(options.limit);
    const offset = normalizeOffset(options.offset);
    const { rows } = await db.query(
        `SELECT id, group_id, initial, cyrillic, years_label, birth_year, death_year,
                name_ko, name_en, epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                fate_kind, fate_label_ko, fate_label_en
         FROM commulingo_people
         WHERE ($1 = ''
                OR id ILIKE '%' || $1 || '%'
                OR name_ko ILIKE '%' || $1 || '%'
                OR name_en ILIKE '%' || $1 || '%'
                OR cyrillic ILIKE '%' || $1 || '%')
           AND ($2 = '' OR group_id = $2)
         ORDER BY sort_order, id
         LIMIT $3 OFFSET $4`,
        [q, groupId, limit, offset]
    );
    return rows.map(rowToPerson);
}

async function getPersonAdmin(personId, options = {}) {
    const id = requireId(personId, 'person id');
    const client = options.client || db;
    const personResult = await client.query(
        `SELECT id, group_id, initial, cyrillic, years_label, birth_year, death_year,
                name_ko, name_en, epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                fate_kind, fate_label_ko, fate_label_en
         FROM commulingo_people
         WHERE id = $1`,
        [id]
    );
    if (!personResult.rows.length) return null;

    const [
        patronymicResult,
        aliasResult,
        sceneResult,
        careerResult,
        officeRowResult,
        roleResult,
    ] = await Promise.all([
        client.query(
            `SELECT patronymic_ko, patronymic_en, cyrillic_patronymic
             FROM commulingo_person_patronymics
             WHERE person_id = $1`,
            [id]
        ),
        client.query(
            `SELECT lang, alias
             FROM commulingo_person_aliases
             WHERE person_id = $1
             ORDER BY lang, sort_order, alias`,
            [id]
        ),
        client.query(
            `SELECT collection_id, episode_id
             FROM commulingo_person_scenes
             WHERE person_id = $1
             ORDER BY sort_order, collection_id, episode_id`,
            [id]
        ),
        client.query(
            `SELECT id, period_label, start_year, start_month, end_year, end_month, role_ko, role_en
             FROM commulingo_person_career_entries
             WHERE person_id = $1
             ORDER BY sort_order, id`,
            [id]
        ),
        client.query(
            `SELECT r.id, r.office_id, o.title_ko, o.title_en, r.period_label,
                    r.body_ko, r.body_en, r.note_ko, r.note_en
             FROM commulingo_office_rows r
             JOIN commulingo_offices o ON o.id = r.office_id
             WHERE r.person_id = $1
             ORDER BY o.sort_order, r.sort_order, r.id`,
            [id]
        ),
        client.query(
            `SELECT r.icon, r.office_id, r.category_id, r.label_ko, r.label_en,
                    o.icon AS office_icon, o.title_ko AS office_title_ko, o.title_en AS office_title_en,
                    c.icon AS category_icon, c.label_ko AS category_label_ko, c.label_en AS category_label_en
             FROM commulingo_person_roles r
             LEFT JOIN commulingo_offices o ON o.id = r.office_id
             LEFT JOIN commulingo_role_categories c ON c.id = r.category_id
             WHERE r.person_id = $1`,
            [id]
        ),
    ]);

    const person = rowToPerson(personResult.rows[0]);
    const patronymic = patronymicResult.rows[0] || {};
    person.patronymic = t(patronymic.patronymic_ko, patronymic.patronymic_en);
    person.cyrillicPatronymic = patronymic.cyrillic_patronymic || '';
    person.aliases = { ko: [], en: [] };
    aliasResult.rows.forEach(row => {
        person.aliases[row.lang].push(row.alias);
    });
    person.scenes = sceneResult.rows.map(row => [row.collection_id, row.episode_id]);
    person.career = careerResult.rows.map(row => ({
        id: row.id,
        y: row.period_label || '',
        period: {
            startYear: row.start_year,
            startMonth: row.start_month,
            endYear: row.end_year,
            endMonth: row.end_month,
        },
        r: t(row.role_ko, row.role_en),
    }));
    person.institutionRows = officeRowResult.rows.map(row => ({
        id: row.id,
        officeId: row.office_id,
        officeTitle: t(row.title_ko, row.title_en),
        years: row.period_label || '',
        body: t(row.body_ko, row.body_en),
        note: t(row.note_ko, row.note_en),
    }));
    if (roleResult.rows.length) {
        const role = roleResult.rows[0];
        const categoryLabel = t(role.category_label_ko, role.category_label_en);
        const legacyLabel = t(role.label_ko, role.label_en);
        const officeLabel = t(role.office_title_ko, role.office_title_en);
        person.role = {
            category: role.category_id || '',
            officeId: role.office_id || '',
            icon: role.icon || '',
            label: categoryLabel.ko || categoryLabel.en ? categoryLabel : (legacyLabel.ko || legacyLabel.en ? legacyLabel : officeLabel),
            resolvedIcon: role.category_icon || role.icon || role.office_icon || OFFICE_ICON[role.office_id] || 'circle-help',
        };
    } else {
        person.role = null;
    }
    return person;
}

async function replaceAliases(client, personId, aliases) {
    if (!aliases) return;
    await client.query('DELETE FROM commulingo_person_aliases WHERE person_id = $1', [personId]);
    for (const lang of ['ko', 'en']) {
        const values = Array.isArray(aliases[lang]) ? aliases[lang] : [];
        for (const [index, alias] of values.entries()) {
            const value = typeof alias === 'string' ? alias.trim() : '';
            if (!value) continue;
            await client.query(
                `INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (person_id, lang, alias)
                 DO UPDATE SET sort_order = EXCLUDED.sort_order`,
                [personId, lang, value, index]
            );
        }
    }
}

async function replaceScenes(client, personId, scenes) {
    if (!scenes) return;
    await client.query('DELETE FROM commulingo_person_scenes WHERE person_id = $1', [personId]);
    for (const [index, scene] of scenes.entries()) {
        if (!Array.isArray(scene) || scene.length < 2) continue;
        const collectionId = typeof scene[0] === 'string' ? scene[0].trim() : '';
        const episodeId = typeof scene[1] === 'string' ? scene[1].trim() : '';
        if (!collectionId || !episodeId) continue;
        await client.query(
            `INSERT INTO commulingo_person_scenes
                (person_id, collection_id, episode_id, sort_order)
             VALUES ($1, $2, $3, $4)`,
            [personId, collectionId, episodeId, index]
        );
    }
}

async function replacePatronymic(client, personId, payload) {
    if (!payload) return;
    await client.query('DELETE FROM commulingo_person_patronymics WHERE person_id = $1', [personId]);
    const patronymicKo = localized(payload.patronymic || payload, 'ko');
    const patronymicEn = localized(payload.patronymic || payload, 'en');
    const cyrillic = payload.cyrillicPatronymic || payload.cyrillic || '';
    if (!patronymicKo && !patronymicEn && !cyrillic) return;
    await client.query(
        `INSERT INTO commulingo_person_patronymics
            (person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [personId, patronymicKo, patronymicEn, cyrillic]
    );
}

async function replaceCareer(client, personId, career) {
    if (!career) return;
    await client.query('DELETE FROM commulingo_person_career_entries WHERE person_id = $1', [personId]);
    for (const [index, entry] of career.entries()) {
        const label = entry.y || entry.period || '';
        const cols = periodColumns(label);
        const role = entry.r || entry.role || {};
        await client.query(
            `INSERT INTO commulingo_person_career_entries
                (person_id, sort_order, period_label, start_year, start_month, end_year, end_month,
                 role_ko, role_en, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
            [
                personId,
                index,
                label,
                cols.startYear,
                cols.startMonth,
                cols.endYear,
                cols.endMonth,
                localized(role, 'ko'),
                localized(role, 'en'),
            ]
        );
    }
}

async function createPersonAdmin(payload, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(payload.id, 'person id');
        const groupId = requireId(payload.groupId || payload.group, 'group id');
        const nameKo = localized(payload.name, 'ko');
        const nameEn = localized(payload.name, 'en');
        if (!nameKo || !nameEn) {
            const err = new Error('name.ko and name.en are required');
            err.status = 400;
            throw err;
        }
        const sortResult = await client.query(
            'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort FROM commulingo_people'
        );
        const years = parseLifeYears(payload.years || '');
        await client.query(
            `INSERT INTO commulingo_people
                (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
                 name_ko, name_en, epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                 fate_kind, fate_label_ko, fate_label_en, updated_at)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8,
                 $9, $10, $11, $12, $13, $14, $15, $16,
                 $17, $18, $19, NOW())`,
            [
                id,
                groupId,
                Number.isInteger(payload.sortOrder) ? payload.sortOrder : sortResult.rows[0].next_sort,
                payload.initial || '',
                payload.cyrillic || '',
                payload.years || '',
                years.birthYear,
                years.deathYear,
                nameKo,
                nameEn,
                localized(payload.epithet, 'ko'),
                localized(payload.epithet, 'en'),
                localized(payload.moment, 'ko'),
                localized(payload.moment, 'en'),
                localized(payload.bio, 'ko'),
                localized(payload.bio, 'en'),
                payload.fate ? payload.fate.kind || '' : '',
                payload.fate ? localized(payload.fate.label, 'ko') : '',
                payload.fate ? localized(payload.fate.label, 'en') : '',
            ]
        );
        await replacePatronymic(client, id, payload);
        await replaceAliases(client, id, payload.aliases || { ko: [nameKo], en: [nameEn] });
        await replaceScenes(client, id, payload.scenes || []);
        await replaceCareer(client, id, payload.career || []);
        if (payload.role !== undefined) await replaceRole(client, id, payload.role);
        const person = await getPersonAdmin(id, { client });
        await writeRevision(client, 'person', id, 'create person', person, options.changedBy);
        return person;
    });
}

async function updatePersonAdmin(personId, payload, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const before = await getPersonAdmin(id, { client });
        if (!before) {
            const err = new Error('person not found');
            err.status = 404;
            throw err;
        }
        const sets = [];
        const values = [];
        function set(column, value) {
            values.push(value);
            sets.push(`${column} = $${values.length}`);
        }
        if (payload.group !== undefined || payload.groupId !== undefined) set('group_id', requireId(payload.groupId || payload.group, 'group id'));
        if (payload.initial !== undefined) set('initial', payload.initial || '');
        if (payload.cyrillic !== undefined) set('cyrillic', payload.cyrillic || '');
        if (payload.years !== undefined) {
            const years = parseLifeYears(payload.years || '');
            set('years_label', payload.years || '');
            set('birth_year', years.birthYear);
            set('death_year', years.deathYear);
        }
        if (payload.name !== undefined) {
            set('name_ko', localized(payload.name, 'ko'));
            set('name_en', localized(payload.name, 'en'));
        }
        if (payload.epithet !== undefined) {
            set('epithet_ko', localized(payload.epithet, 'ko'));
            set('epithet_en', localized(payload.epithet, 'en'));
        }
        if (payload.moment !== undefined) {
            set('moment_ko', localized(payload.moment, 'ko'));
            set('moment_en', localized(payload.moment, 'en'));
        }
        if (payload.bio !== undefined) {
            set('bio_ko', localized(payload.bio, 'ko'));
            set('bio_en', localized(payload.bio, 'en'));
        }
        if (payload.fate !== undefined) {
            set('fate_kind', payload.fate ? payload.fate.kind || '' : '');
            set('fate_label_ko', payload.fate ? localized(payload.fate.label, 'ko') : '');
            set('fate_label_en', payload.fate ? localized(payload.fate.label, 'en') : '');
        }
        if (sets.length) {
            set('updated_at', new Date());
            values.push(id);
            await client.query(
                `UPDATE commulingo_people SET ${sets.join(', ')} WHERE id = $${values.length}`,
                values
            );
        }
        if (payload.patronymic !== undefined || payload.cyrillicPatronymic !== undefined) await replacePatronymic(client, id, payload);
        if (payload.aliases !== undefined) await replaceAliases(client, id, payload.aliases);
        if (payload.scenes !== undefined) await replaceScenes(client, id, payload.scenes);
        if (payload.career !== undefined) await replaceCareer(client, id, payload.career);
        if (payload.role !== undefined) await replaceRole(client, id, payload.role);
        const after = await getPersonAdmin(id, { client });
        await writeRevision(client, 'person', id, 'update person', { before, after }, options.changedBy);
        return after;
    });
}

async function deletePersonAdmin(personId, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const before = await getPersonAdmin(id, { client });
        if (!before) {
            const err = new Error('person not found');
            err.status = 404;
            throw err;
        }
        await client.query('DELETE FROM commulingo_people WHERE id = $1', [id]);
        await writeRevision(client, 'person', id, 'delete person', before, options.changedBy);
        return { deleted: true, person: before };
    });
}

async function listOfficesAdmin() {
    const { rows } = await db.query(
        `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon
         FROM commulingo_offices
         ORDER BY sort_order, id`
    );
    return rows.map(row => ({
        id: row.id,
        range: row.range_label || '',
        title: t(row.title_ko, row.title_en),
        blurb: t(row.blurb_ko, row.blurb_en),
        icon: row.icon || '',
    }));
}

async function getOfficeAdmin(officeId, options = {}) {
    const id = requireId(officeId, 'office id');
    const client = options.client || db;
    const officeResult = await client.query(
        `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon
         FROM commulingo_offices
         WHERE id = $1`,
        [id]
    );
    if (!officeResult.rows.length) return null;
    const rowsResult = await client.query(
        `SELECT id, period_label, start_year, start_month, end_year, end_month,
                body_ko, body_en, person_id, name_ko, name_en, note_ko, note_en
         FROM commulingo_office_rows
         WHERE office_id = $1
         ORDER BY sort_order, id`,
        [id]
    );
    const officeRow = officeResult.rows[0];
    return {
        id: officeRow.id,
        range: officeRow.range_label || '',
        title: t(officeRow.title_ko, officeRow.title_en),
        blurb: t(officeRow.blurb_ko, officeRow.blurb_en),
        icon: officeRow.icon || '',
        rows: rowsResult.rows.map(row => ({
            id: row.id,
            years: row.period_label || '',
            period: {
                startYear: row.start_year,
                startMonth: row.start_month,
                endYear: row.end_year,
                endMonth: row.end_month,
            },
            body: t(row.body_ko, row.body_en),
            personId: row.person_id || '',
            name: t(row.name_ko, row.name_en),
            note: t(row.note_ko, row.note_en),
        })),
    };
}

async function createOfficeRowAdmin(officeId, payload, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(officeId, 'office id');
        const before = await getOfficeAdmin(id, { client });
        if (!before) {
            const err = new Error('office not found');
            err.status = 404;
            throw err;
        }
        const sortResult = await client.query(
            'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort FROM commulingo_office_rows WHERE office_id = $1',
            [id]
        );
        const label = payload.years || payload.period || '';
        const cols = periodColumns(label);
        const result = await client.query(
            `INSERT INTO commulingo_office_rows
                (office_id, sort_order, period_label, start_year, start_month, end_year, end_month,
                 body_ko, body_en, person_id, name_ko, name_en, note_ko, note_en, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
                     NULLIF($10, ''), $11, $12, $13, $14, NOW())
             RETURNING id`,
            [
                id,
                Number.isInteger(payload.sortOrder) ? payload.sortOrder : sortResult.rows[0].next_sort,
                label,
                cols.startYear,
                cols.startMonth,
                cols.endYear,
                cols.endMonth,
                localized(payload.body, 'ko'),
                localized(payload.body, 'en'),
                payload.personId || '',
                localized(payload.name, 'ko'),
                localized(payload.name, 'en'),
                localized(payload.note, 'ko'),
                localized(payload.note, 'en'),
            ]
        );
        const after = await getOfficeAdmin(id, { client });
        await writeRevision(client, 'office', id, 'create office row', { before, after }, options.changedBy);
        return after.rows.find(row => row.id === result.rows[0].id);
    });
}

async function updateOfficeRowAdmin(rowId, payload, options = {}) {
    return withTransaction(options, async client => {
        const id = Number.parseInt(rowId, 10);
        if (!Number.isFinite(id) || id <= 0) {
            const err = new Error('invalid office row id');
            err.status = 400;
            throw err;
        }
        const rowResult = await client.query('SELECT office_id FROM commulingo_office_rows WHERE id = $1', [id]);
        if (!rowResult.rows.length) {
            const err = new Error('office row not found');
            err.status = 404;
            throw err;
        }
        const officeId = rowResult.rows[0].office_id;
        const before = await getOfficeAdmin(officeId, { client });
        const sets = [];
        const values = [];
        function set(column, value) {
            values.push(value);
            sets.push(`${column} = $${values.length}`);
        }
        if (payload.sortOrder !== undefined) set('sort_order', Number.parseInt(payload.sortOrder, 10) || 0);
        if (payload.years !== undefined || payload.period !== undefined) {
            const label = payload.years || payload.period || '';
            const cols = periodColumns(label);
            set('period_label', label);
            set('start_year', cols.startYear);
            set('start_month', cols.startMonth);
            set('end_year', cols.endYear);
            set('end_month', cols.endMonth);
        }
        if (payload.body !== undefined) {
            set('body_ko', localized(payload.body, 'ko'));
            set('body_en', localized(payload.body, 'en'));
        }
        if (payload.personId !== undefined) set('person_id', payload.personId || null);
        if (payload.name !== undefined) {
            set('name_ko', localized(payload.name, 'ko'));
            set('name_en', localized(payload.name, 'en'));
        }
        if (payload.note !== undefined) {
            set('note_ko', localized(payload.note, 'ko'));
            set('note_en', localized(payload.note, 'en'));
        }
        if (sets.length) {
            set('updated_at', new Date());
            values.push(id);
            await client.query(
                `UPDATE commulingo_office_rows SET ${sets.join(', ')} WHERE id = $${values.length}`,
                values
            );
        }
        const after = await getOfficeAdmin(officeId, { client });
        await writeRevision(client, 'office', officeId, 'update office row', { before, after }, options.changedBy);
        return after.rows.find(row => row.id === id);
    });
}

async function deleteOfficeRowAdmin(rowId, options = {}) {
    return withTransaction(options, async client => {
        const id = Number.parseInt(rowId, 10);
        if (!Number.isFinite(id) || id <= 0) {
            const err = new Error('invalid office row id');
            err.status = 400;
            throw err;
        }
        const rowResult = await client.query('SELECT office_id FROM commulingo_office_rows WHERE id = $1', [id]);
        if (!rowResult.rows.length) {
            const err = new Error('office row not found');
            err.status = 404;
            throw err;
        }
        const officeId = rowResult.rows[0].office_id;
        const before = await getOfficeAdmin(officeId, { client });
        await client.query('DELETE FROM commulingo_office_rows WHERE id = $1', [id]);
        const after = await getOfficeAdmin(officeId, { client });
        await writeRevision(client, 'office', officeId, 'delete office row', { before, after }, options.changedBy);
        return { deleted: true, officeId, rowId: id };
    });
}

function rowToPersonSection(row) {
    return {
        slug: row.slug,
        sortOrder: row.sort_order || 0,
        heading: t(row.heading_ko, row.heading_en),
        body: t(row.body_ko, row.body_en),
        sources: Array.isArray(row.sources) ? row.sources : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function ensurePersonExists(client, personId) {
    const result = await client.query('SELECT 1 FROM commulingo_people WHERE id = $1', [personId]);
    if (!result.rows.length) {
        const err = new Error('person not found');
        err.status = 404;
        throw err;
    }
}

async function listPersonSectionsAdmin(personId, options = {}) {
    const id = requireId(personId, 'person id');
    const client = options.client || db;
    await ensurePersonExists(client, id);
    const { rows } = await client.query(
        `SELECT slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, created_at, updated_at
         FROM commulingo_person_sections
         WHERE person_id = $1
         ORDER BY sort_order, id`,
        [id]
    );
    return rows.map(rowToPersonSection);
}

async function upsertPersonSectionAdmin(personId, slug, payload, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const sectionSlug = requireSlug(slug);
        await ensurePersonExists(client, id);
        const before = await getPersonAdmin(id, { client });
        const sortOrder = Number.parseInt(payload.sortOrder, 10);
        const heading = payload.heading || {};
        const body = payload.body || {};
        await client.query(
            `INSERT INTO commulingo_person_sections
                (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, NOW())
             ON CONFLICT (person_id, slug)
             DO UPDATE SET
                sort_order = EXCLUDED.sort_order,
                heading_ko = EXCLUDED.heading_ko,
                heading_en = EXCLUDED.heading_en,
                body_ko = EXCLUDED.body_ko,
                body_en = EXCLUDED.body_en,
                sources = EXCLUDED.sources,
                updated_at = NOW()`,
            [
                id,
                sectionSlug,
                Number.isFinite(sortOrder) ? sortOrder : 0,
                localized(heading, 'ko'),
                localized(heading, 'en'),
                localized(body, 'ko'),
                localized(body, 'en'),
                JSON.stringify(normalizeSources(payload.sources)),
            ]
        );
        const sections = await listPersonSectionsAdmin(id, { client });
        const after = await getPersonAdmin(id, { client });
        await writeRevision(client, 'person', id, `upsert section ${sectionSlug}`, { before, after, sections }, options.changedBy);
        return sections.find(section => section.slug === sectionSlug);
    });
}

async function deletePersonSectionAdmin(personId, slug, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const sectionSlug = requireSlug(slug);
        await ensurePersonExists(client, id);
        const before = await getPersonAdmin(id, { client });
        const result = await client.query(
            'DELETE FROM commulingo_person_sections WHERE person_id = $1 AND slug = $2',
            [id, sectionSlug]
        );
        if (!result.rowCount) {
            const err = new Error('section not found');
            err.status = 404;
            throw err;
        }
        const after = await getPersonAdmin(id, { client });
        await writeRevision(client, 'person', id, `delete section ${sectionSlug}`, { before, after }, options.changedBy);
        return { deleted: true, personId: id, slug: sectionSlug };
    });
}

module.exports = {
    listPeopleAdmin,
    getPersonAdmin,
    createPersonAdmin,
    updatePersonAdmin,
    deletePersonAdmin,
    listOfficesAdmin,
    getOfficeAdmin,
    createOfficeRowAdmin,
    updateOfficeRowAdmin,
    deleteOfficeRowAdmin,
    listPersonSectionsAdmin,
    upsertPersonSectionAdmin,
    deletePersonSectionAdmin,
};
