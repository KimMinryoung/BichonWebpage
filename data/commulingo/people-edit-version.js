const { createHash } = require('node:crypto');
const { badRequest } = require('./people-admin-fields');

// Hash persisted state, including child rows. This also observes committed
// Python edits which do not update the parent timestamp or use the JS revision log.
async function personRevision(client, personId) {
    const { rows } = await client.query(`SELECT jsonb_build_object(
        'person', to_jsonb(p),
        'aliases', (SELECT jsonb_agg(to_jsonb(a) ORDER BY lang, alias) FROM commulingo_person_aliases a WHERE person_id=p.id),
        'career', (SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM commulingo_person_career_entries c WHERE person_id=p.id),
        'scenes', (SELECT jsonb_agg(to_jsonb(s) ORDER BY collection_id, episode_id) FROM commulingo_person_scenes s WHERE person_id=p.id),
        'patronymic', (SELECT to_jsonb(n) FROM commulingo_person_patronymics n WHERE person_id=p.id),
        'role', (SELECT to_jsonb(r) FROM commulingo_person_roles r WHERE person_id=p.id),
        'sections', (SELECT jsonb_agg(to_jsonb(s) ORDER BY slug) FROM commulingo_person_sections s WHERE person_id=p.id),
        'offices', (SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM commulingo_office_rows o WHERE person_id=p.id)
        )::text AS state FROM commulingo_people p WHERE p.id=$1`, [personId]);
    return rows.length ? `v1-${createHash('sha256').update(rows[0].state).digest('hex')}` : null;
}

function assertExpectedRevision(expected, current, required = false) {
    if (expected === undefined && required) {
        const error = badRequest("expectedRevision is required; read the person before editing"); error.status = 428; throw error;
    }
    if (expected === undefined) return; // Existing clients remain compatible.
    if (typeof expected !== 'string' || !/^v1-[a-f0-9]{64}$/.test(expected)) {
        throw badRequest('expectedRevision must be the revision returned by GET person');
    }
    if (expected !== current) {
        const error = new Error('person changed since it was read; reload and reconcile the edit');
        error.status = 409;
        error.code = 'revision_conflict';
        error.currentRevision = current;
        throw error;
    }
}

module.exports = { personRevision, assertExpectedRevision };
