const db = require('../../config/database');
const { t, localized, contentLocalized, requireId, badRequest } = require('./people-admin-fields');
const { periodColumns, periodFromRow, formatBoth, PERIOD_COLUMNS, periodValues } = require('./career-period');

// `years` is the formatted display, read-only; writes send `period`.
function rowPeriod(payload) {
    if (payload.years !== undefined && payload.period === undefined) throw badRequest('years is read-only; send period');
    return periodColumns(payload.period, 'period');
}
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
        `SELECT id, range_label, title_ko, title_en, blurb_ko, blurb_en, icon, tracks
         FROM commulingo_offices
         WHERE id = $1`,
        [id]
    );
    if (!officeResult.rows.length) return null;
    const rowsResult = await client.query(
        `SELECT id, track_id, ${PERIOD_COLUMNS.join(', ')},
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
        tracks: Array.isArray(officeRow.tracks) ? officeRow.tracks : [],
        rows: rowsResult.rows.map(row => ({
            id: row.id,
            trackId: row.track_id || '',
            period: periodFromRow(row),
            years: formatBoth(periodFromRow(row)),
            body: t(row.body_ko, row.body_en),
            personId: row.person_id || '',
            name: t(row.name_ko, row.name_en),
            note: t(row.note_ko, row.note_en),
        })),
    };
}

// Row edits read the office's whole history for the revision log and pick the
// next sort order from it, so two concurrent edits of one office must not
// interleave. Every write locks the office row first (office -> office row, one
// order everywhere, so no deadlock) and re-reads what it edits under the lock.
async function lockOffice(client, officeId) {
    await client.query('SELECT id FROM commulingo_offices WHERE id = $1 FOR UPDATE', [officeId]);
}

async function lockedOfficeRow(client, id) {
    const found = await client.query('SELECT office_id FROM commulingo_office_rows WHERE id = $1', [id]);
    if (!found.rows.length) return null;
    const officeId = found.rows[0].office_id;
    await lockOffice(client, officeId);
    const again = await client.query('SELECT office_id FROM commulingo_office_rows WHERE id = $1 FOR UPDATE', [id]);
    return again.rows.length && again.rows[0].office_id === officeId ? officeId : null;
}

// A row's track must be one the office lists (commulingo_offices.tracks).
function trackOf(payload, office) {
    const trackId = payload.trackId == null ? '' : payload.trackId;
    if (typeof trackId !== 'string') throw badRequest('trackId must be a string');
    if (trackId && !office.tracks.some(track => track.id === trackId)) throw badRequest(`unknown track ${trackId} for office ${office.id}`);
    return trackId;
}

async function createOfficeRowAdmin(officeId, payload, options = {}) {
    return withTransaction(options, async client => {
        const id = requireId(officeId, 'office id');
        await lockOffice(client, id);
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
        const periodVals = periodValues(rowPeriod(payload));
        const p = i => '$' + (i + 3 + periodVals.length);
        const result = await client.query(
            `INSERT INTO commulingo_office_rows
                (office_id, sort_order, ${PERIOD_COLUMNS.join(', ')},
                 body_ko, body_en, person_id, name_ko, name_en, note_ko, note_en, track_id, updated_at)
             VALUES ($1, $2, ${periodVals.map((_, i) => '$' + (i + 3)).join(', ')}, ${p(0)}, ${p(1)},
                     NULLIF(${p(2)}, ''), ${p(3)}, ${p(4)}, ${p(5)}, ${p(6)}, NULLIF(${p(7)}, ''), NOW())
             RETURNING id`,
            [
                id,
                Number.isInteger(payload.sortOrder) ? payload.sortOrder : sortResult.rows[0].next_sort,
                ...periodVals,
                contentLocalized(payload.body, 'ko'),
                localized(payload.body, 'en'),
                payload.personId || '',
                localized(payload.name, 'ko'),
                localized(payload.name, 'en'),
                contentLocalized(payload.note, 'ko'),
                localized(payload.note, 'en'),
                trackOf(payload, before),
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
        const officeId = await lockedOfficeRow(client, id);
        if (!officeId) {
            const err = new Error('office row not found');
            err.status = 404;
            throw err;
        }
        const before = await getOfficeAdmin(officeId, { client });
        const sets = [];
        const values = [];
        function set(column, value) {
            values.push(value);
            sets.push(`${column} = $${values.length}`);
        }
        if (payload.sortOrder !== undefined) set('sort_order', Number.parseInt(payload.sortOrder, 10) || 0);
        if (payload.years !== undefined || payload.period !== undefined) {
            const vals = periodValues(rowPeriod(payload));
            PERIOD_COLUMNS.forEach((column, i) => set(column, vals[i]));
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
        if (payload.trackId !== undefined) set('track_id', trackOf(payload, before) || null);
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
        const officeId = await lockedOfficeRow(client, id);
        if (!officeId) {
            const err = new Error('office row not found');
            err.status = 404;
            throw err;
        }
        const before = await getOfficeAdmin(officeId, { client });
        await client.query('DELETE FROM commulingo_office_rows WHERE id = $1', [id]);
        const after = await getOfficeAdmin(officeId, { client });
        await writeRevision(client, 'office', officeId, 'delete office row', { before, after }, options.changedBy);
        return { deleted: true, officeId, rowId: id };
    });
}

module.exports = { listOfficesAdmin, getOfficeAdmin, createOfficeRowAdmin, updateOfficeRowAdmin, deleteOfficeRowAdmin };
