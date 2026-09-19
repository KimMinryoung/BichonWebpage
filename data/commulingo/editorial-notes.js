const { badRequest, requireId } = require('./people-admin-fields');

// Working notes for the next author of an entry: commulingo_editorial_notes.
// The pipeline drafts one section per pass, so what its research supported
// but the patch did not write has to survive until the entry is commissioned
// again (weeks later, in another job). Notes are editorial data only and are
// never rendered publicly.

const TARGETS = new Set(['person', 'term']);
const NOTE_LIMIT = 4000;
const LIST_LIMIT = 20;

async function listEditorialNotes(client, targetType, targetId) {
    const { rows } = await client.query(
        `SELECT id, note, changed_by, job_ref, created_at FROM commulingo_editorial_notes
         WHERE target_type=$1 AND target_id=$2 ORDER BY created_at DESC, id DESC LIMIT $3`,
        [targetType, targetId, LIST_LIMIT]
    );
    return rows.map(row => ({ id: row.id, note: row.note, changedBy: row.changed_by, jobRef: row.job_ref, createdAt: row.created_at }));
}

async function saveEditorialNote(client, request, options = {}) {
    if (!TARGETS.has(request.target)) throw badRequest('note target must be person or term');
    const id = requireId(request.id, `${request.target} id`);
    const note = typeof request.note === 'string' ? request.note.trim() : '';
    if (!note) throw badRequest('note text is required');
    if ([...note].length > NOTE_LIMIT) throw badRequest(`note exceeds ${NOTE_LIMIT} characters`);
    const table = request.target === 'person' ? 'commulingo_people' : 'commulingo_terms';
    const exists = await client.query(`SELECT 1 FROM ${table} WHERE id=$1`, [id]);
    if (!exists.rows.length) { const error = badRequest(`${request.target} not found`); error.status = 404; throw error; }
    const { rows } = await client.query(
        `INSERT INTO commulingo_editorial_notes (target_type, target_id, note, changed_by, job_ref)
         VALUES ($1,$2,$3,$4,$5) RETURNING id, created_at`,
        [request.target, id, note, options.changedBy || request.changedBy || 'commulingo-editorial',
            typeof request.jobRef === 'string' ? request.jobRef.slice(0, 120) : '']
    );
    return { noteId: rows[0].id, createdAt: rows[0].created_at };
}

module.exports = { listEditorialNotes, saveEditorialNote };
