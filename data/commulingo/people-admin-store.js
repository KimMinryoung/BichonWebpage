const db = require('../../config/database');
const { OFFICE_ICON, normalizeFateLabel } = require('./people-standard');
const { t, localized, contentLocalized, badRequest, parseLifeYears, periodColumns, requireId, normalizeLimit, normalizeOffset } = require('./people-admin-fields');
const { withTransaction, writeRevision } = require('./admin-tx');
const { nationality, normalizeNationality, requireNationalOrigin, requirePatronymicState, assertNativeScript, withNativeNameAliases, collapseSpaces, splitFullName, composeFullName, resolveNameParts, assertPatronymicSeparate } = require('./people-admin-validation');

// Person records for the CommuLingo admin API: list/get, create/update/
// delete with the child tables (role, aliases, scenes, patronymic, career).
// Offices and sections have their own stores; name/nationality rules are in
// people-admin-validation.js; field helpers and the transaction/revision
// primitives are shared with them.

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
            category ? '' : contentLocalized(label, 'ko'),
            category ? '' : localized(label, 'en'),
        ]
    );
}

function rowToPerson(row) {
    const origin = nationality(row.origin_code, row.origin_label_ko, row.origin_label_en);
    return {
        id: row.id,
        group: row.group_id,
        groupId: row.group_id,
        initial: row.initial || '',
        cyrillic: row.cyrillic || '',
        nativeName: row.cyrillic || '',
        citizenship: nationality(row.citizenship_code, row.citizenship_label_ko, row.citizenship_label_en),
        origin,
        nationalOrigin: origin,
        years: row.years_label || '',
        birthYear: row.birth_year,
        deathYear: row.death_year,
        name: t(row.name_ko, row.name_en),
        givenName: t(row.given_name_ko, row.given_name_en),
        familyName: t(row.family_name_ko, row.family_name_en),
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
                name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en,
                epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                fate_kind, fate_label_ko, fate_label_en,
                citizenship_code, citizenship_label_ko, citizenship_label_en,
                origin_code, origin_label_ko, origin_label_en
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
                name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en,
                epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                fate_kind, fate_label_ko, fate_label_en,
                citizenship_code, citizenship_label_ko, citizenship_label_en,
                origin_code, origin_label_ko, origin_label_en
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

async function replacePatronymic(client, personId, state) {
    await client.query('DELETE FROM commulingo_person_patronymics WHERE person_id = $1', [personId]);
    if (!state.ko && !state.en && !state.native) return;
    await client.query(
        `INSERT INTO commulingo_person_patronymics
            (person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [personId, state.ko, state.en, state.native]
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
                contentLocalized(role, 'ko'),
                localized(role, 'en'),
            ]
        );
    }
}

async function createPersonAdmin(rawPayload, options = {}) {
    const payload = withNativeNameAliases(rawPayload || {});
    return withTransaction(options, async client => {
        const id = requireId(payload.id, 'person id');
        const citizenship = normalizeNationality(payload.citizenship || null, 'citizenship');
        const originInput = requireNationalOrigin(payload);
        const origin = normalizeNationality(originInput.touched ? originInput.value : null, 'nationalOrigin');
        const patronymicState = requirePatronymicState(payload, {}, payload.cyrillic || '');
        assertNativeScript(payload, { citizenship: citizenship.code, origin: origin.code });
        const groupId = requireId(payload.groupId || payload.group, 'group id');
        const partsKo = resolveNameParts(payload, 'ko', citizenship.code);
        const partsEn = resolveNameParts(payload, 'en', citizenship.code);
        if (!partsKo.full || !partsEn.full) {
            throw badRequest('name.ko and name.en (or givenName/familyName per language) are required');
        }
        assertPatronymicSeparate(partsKo, patronymicState.ko, 'ko');
        assertPatronymicSeparate(partsEn, patronymicState.en, 'en');
        const nameKo = partsKo.full;
        const nameEn = partsEn.full;
        const sortResult = await client.query(
            'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort FROM commulingo_people'
        );
        const years = parseLifeYears(payload.years || '');
        await client.query(
            `INSERT INTO commulingo_people
                (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
                 name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en,
                 epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
                 fate_kind, fate_label_ko, fate_label_en,
                 citizenship_code, citizenship_label_ko, citizenship_label_en,
                 origin_code, origin_label_ko, origin_label_en, updated_at)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8,
                 $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                 $21, $22, $23,
                 $24, $25, $26,
                 $27, $28, $29, NOW())`,
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
                partsKo.given,
                partsEn.given,
                partsKo.family,
                partsEn.family,
                contentLocalized(payload.epithet, 'ko'),
                localized(payload.epithet, 'en'),
                contentLocalized(payload.moment, 'ko'),
                localized(payload.moment, 'en'),
                contentLocalized(payload.bio, 'ko'),
                localized(payload.bio, 'en'),
                payload.fate ? payload.fate.kind || '' : '',
                payload.fate ? normalizeFateLabel(contentLocalized(payload.fate.label, 'ko'), years.deathYear) : '',
                payload.fate ? normalizeFateLabel(localized(payload.fate.label, 'en'), years.deathYear) : '',
                citizenship.code,
                citizenship.ko,
                citizenship.en,
                origin.code,
                origin.ko,
                origin.en,
            ]
        );
        await replacePatronymic(client, id, patronymicState);
        await replaceAliases(client, id, payload.aliases || { ko: [nameKo], en: [nameEn] });
        await replaceScenes(client, id, payload.scenes || []);
        await replaceCareer(client, id, payload.career || []);
        if (payload.role !== undefined) await replaceRole(client, id, payload.role);
        const person = await getPersonAdmin(id, { client });
        await writeRevision(client, 'person', id, 'create person', person, options.changedBy);
        return person;
    });
}

async function updatePersonAdmin(personId, rawPayload, options = {}) {
    const payload = withNativeNameAliases(rawPayload || {});
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const before = await getPersonAdmin(id, { client });
        if (!before) {
            const err = new Error('person not found');
            err.status = 404;
            throw err;
        }
        // The script check runs against the nationality the record will HAVE
        // after this patch, so fixing a wrong citizenship and the native name in
        // one call is accepted while either alone is still checked.
        const citizenship = payload.citizenship !== undefined
            ? normalizeNationality(payload.citizenship, 'citizenship')
            : { code: before.citizenship ? before.citizenship.code : '' };
        const originInput = requireNationalOrigin(payload);
        const origin = originInput.touched
            ? normalizeNationality(originInput.value, 'nationalOrigin')
            : { code: before.origin ? before.origin.code : '' };
        const patronymicState = requirePatronymicState(
            payload,
            {
                ko: localized(before.patronymic, 'ko'),
                en: localized(before.patronymic, 'en'),
                native: before.cyrillicPatronymic,
            },
            payload.cyrillic !== undefined ? payload.cyrillic : before.cyrillic
        );
        assertNativeScript(
            {
                ...payload,
                cyrillic: payload.cyrillic !== undefined ? payload.cyrillic : before.cyrillic,
                cyrillicPatronymic: patronymicState.native,
            },
            { citizenship: citizenship.code, origin: origin.code }
        );
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
        // Name parts: any of name / givenName / familyName recomputes all six
        // name columns so parts and the derived full name never diverge.
        const nameChanged = payload.name !== undefined
            || payload.givenName !== undefined
            || payload.familyName !== undefined;
        const storedParts = lang => ({
            given: collapseSpaces(localized(before.givenName, lang)),
            family: collapseSpaces(localized(before.familyName, lang)),
        });
        const effectiveParts = lang => {
            if (payload.givenName !== undefined || payload.familyName !== undefined) {
                const stored = storedParts(lang);
                const given = payload.givenName !== undefined
                    ? collapseSpaces(localized(payload.givenName, lang)) : stored.given;
                const family = payload.familyName !== undefined
                    ? collapseSpaces(localized(payload.familyName, lang)) : stored.family;
                return { given, family, full: composeFullName(given, family, lang, citizenship.code) };
            }
            const full = collapseSpaces(localized(payload.name, lang));
            return { ...splitFullName(full, lang, citizenship.code), full };
        };
        let newPartsKo = null;
        let newPartsEn = null;
        if (nameChanged) {
            newPartsKo = effectiveParts('ko');
            newPartsEn = effectiveParts('en');
            if (!newPartsKo.full || !newPartsEn.full) {
                throw badRequest('name.ko and name.en (or givenName/familyName per language) are required');
            }
            set('name_ko', newPartsKo.full);
            set('name_en', newPartsEn.full);
            set('given_name_ko', newPartsKo.given);
            set('given_name_en', newPartsEn.given);
            set('family_name_ko', newPartsKo.family);
            set('family_name_en', newPartsEn.family);
        }
        // Guard against embedding whenever the record's name or patronymic is
        // touched, checked against what the record will hold AFTER the patch.
        if (nameChanged || patronymicState.touched) {
            assertPatronymicSeparate(newPartsKo || storedParts('ko'), patronymicState.ko, 'ko');
            assertPatronymicSeparate(newPartsEn || storedParts('en'), patronymicState.en, 'en');
        }
        if (payload.epithet !== undefined) {
            set('epithet_ko', contentLocalized(payload.epithet, 'ko'));
            set('epithet_en', localized(payload.epithet, 'en'));
        }
        if (payload.moment !== undefined) {
            set('moment_ko', contentLocalized(payload.moment, 'ko'));
            set('moment_en', localized(payload.moment, 'en'));
        }
        if (payload.bio !== undefined) {
            set('bio_ko', contentLocalized(payload.bio, 'ko'));
            set('bio_en', localized(payload.bio, 'en'));
        }
        if (payload.citizenship !== undefined) {
            const value = normalizeNationality(payload.citizenship, 'citizenship');
            set('citizenship_code', value.code);
            set('citizenship_label_ko', value.ko);
            set('citizenship_label_en', value.en);
        }
        if (originInput.touched) {
            const value = normalizeNationality(originInput.value, 'nationalOrigin');
            set('origin_code', value.code);
            set('origin_label_ko', value.ko);
            set('origin_label_en', value.en);
        }
        if (payload.fate !== undefined) {
            // Death year comes from an incoming years payload if present, else the
            // stored record — so the fate label is stripped against the right year.
            const deathYear = payload.years !== undefined
                ? parseLifeYears(payload.years || '').deathYear
                : before.deathYear;
            set('fate_kind', payload.fate ? payload.fate.kind || '' : '');
            set('fate_label_ko', payload.fate ? normalizeFateLabel(contentLocalized(payload.fate.label, 'ko'), deathYear) : '');
            set('fate_label_en', payload.fate ? normalizeFateLabel(localized(payload.fate.label, 'en'), deathYear) : '');
        }
        if (sets.length) {
            set('updated_at', new Date());
            values.push(id);
            await client.query(
                `UPDATE commulingo_people SET ${sets.join(', ')} WHERE id = $${values.length}`,
                values
            );
        }
        if (patronymicState.touched) await replacePatronymic(client, id, patronymicState);
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

module.exports = { listPeopleAdmin, getPersonAdmin, createPersonAdmin, updatePersonAdmin, deletePersonAdmin };
