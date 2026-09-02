const db = require('../../config/database');
const { t, localized, contentLocalized, periodColumns, requireId } = require('./people-admin-fields');
const { withTransaction, writeRevision } = require('./admin-tx');

// Offices (기관) and their rows for the admin API: commulingo_offices /
// commulingo_office_rows only, through the shared transaction helpers.

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
                contentLocalized(payload.body, 'ko'),
                localized(payload.body, 'en'),
                payload.personId || '',
                localized(payload.name, 'ko'),
                localized(payload.name, 'en'),
                contentLocalized(payload.note, 'ko'),
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
            set('body_ko', contentLocalized(payload.body, 'ko'));
            set('body_en', localized(payload.body, 'en'));
        }
        if (payload.personId !== undefined) set('person_id', payload.personId || null);
        if (payload.name !== undefined) {
            set('name_ko', localized(payload.name, 'ko'));
            set('name_en', localized(payload.name, 'en'));
        }
        if (payload.note !== undefined) {
            set('note_ko', contentLocalized(payload.note, 'ko'));
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

module.exports = { listOfficesAdmin, getOfficeAdmin, createOfficeRowAdmin, updateOfficeRowAdmin, deleteOfficeRowAdmin };
