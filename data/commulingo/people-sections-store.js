const { validateEditorial, reviewReasons, recordEvidence } = require('./person-editorial-policy');
const { assertExpectedRevision } = require('./people-edit-version');
const { mergeLocalizedPatch } = require('./people-patch');
const db = require('../../config/database');
const { t, localized, contentLocalized, requireId, requireSlug, normalizeSources } = require('./people-admin-fields');
const { withTransaction, writeRevision } = require('./admin-tx');
const { getPersonAdmin } = require('./people-admin-store');

// Person sections (상세 절) for the admin API: commulingo_person_sections
// only, through the shared transaction helpers.

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

async function ensurePersonExists(client, personId, lock = false) {
    const result = await client.query('SELECT 1 FROM commulingo_people WHERE id = $1' + (lock ? ' FOR UPDATE' : ''), [personId]);
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
        await ensurePersonExists(client, id, true);
        const before = await getPersonAdmin(id, { client });
        assertExpectedRevision(payload.expectedRevision, before.revision, options.requireRevision !== false);
        validateEditorial(payload, options, true);
        const sectionBefore = (await listPersonSectionsAdmin(id, { client }))
            .find(section => section.slug === sectionSlug) || null;
        if (!options.reviewed && reviewReasons('person_section', 'update', payload, sectionBefore).length) {
            const error = new Error('edit requires review; submit through shared editorial service'); error.status = 422; throw error;
        }
        const sortOrder = payload.sortOrder === undefined
            ? (sectionBefore?.sortOrder || 0) : Number.parseInt(payload.sortOrder, 10);
        const heading = mergeLocalizedPatch(sectionBefore?.heading, payload.heading, 'heading');
        const body = mergeLocalizedPatch(sectionBefore?.body, payload.body, 'body');
        const sources = payload.sources === undefined ? (sectionBefore?.sources || []) : normalizeSources(payload.sources);
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
                contentLocalized(heading, 'ko'),
                localized(heading, 'en'),
                contentLocalized(body, 'ko'),
                localized(body, 'en'),
                JSON.stringify(sources),
            ]
        );
        const sections = await listPersonSectionsAdmin(id, { client });
        const after = await getPersonAdmin(id, { client });
        const sectionAfter = sections.find(section => section.slug === sectionSlug);
        await recordEvidence(client, id, sectionSlug, payload, options, after.revision);
        await writeRevision(client, 'person', id, `upsert section ${sectionSlug}`,
            { before, after, sections, sectionBefore, sectionAfter }, options.changedBy);
        return { ...sectionAfter, revision: after.revision };
    });
}

async function deletePersonSectionAdmin(personId, slug, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(personId, 'person id');
        const sectionSlug = requireSlug(slug);
        await ensurePersonExists(client, id, true);
        const before = await getPersonAdmin(id, { client });
        assertExpectedRevision(options.expectedRevision, before.revision, options.requireRevision !== false);
        if (!options.reviewed) { const error = new Error('deletion requires reviewed approval'); error.status = 422; throw error; }
        const sectionBefore = (await listPersonSectionsAdmin(id, { client }))
            .find(section => section.slug === sectionSlug) || null;
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
        await writeRevision(client, 'person', id, `delete section ${sectionSlug}`, { before, after, sectionBefore, sectionAfter: null }, options.changedBy);
        return { deleted: true, personId: id, slug: sectionSlug, revision: after.revision };
    });
}

module.exports = { listPersonSectionsAdmin, upsertPersonSectionAdmin, deletePersonSectionAdmin };
