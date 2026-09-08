const { withTransaction } = require('./admin-tx');
const { readSnapshot } = require('./read-snapshot');
const { badRequest, requireId } = require('./people-admin-fields');
const { getPersonAdmin, createPersonAdmin, updatePersonAdmin, deletePersonAdmin } = require('./people-admin-store');
const { listPersonSectionsAdmin, upsertPersonSectionAdmin, deletePersonSectionAdmin } = require('./people-sections-store');
const { sourcesFor, reviewReasons } = require('./person-editorial-policy');
const { assertExpectedRevision } = require('./people-edit-version');

async function readPersonEditorial(id, options = {}) {
    if (!options.client) return readSnapshot(client => readPersonEditorial(id, { client }));
    const person = await getPersonAdmin(id, options);
    if (!person) return null;
    const sections = await listPersonSectionsAdmin(id, options);
    const { rows: evidence } = await options.client.query('SELECT * FROM commulingo_person_evidence WHERE person_id=$1 ORDER BY id DESC LIMIT 100', [id]);
    const { rows: enrichment } = await options.client.query('SELECT * FROM commulingo_person_enrichment WHERE person_id=$1 ORDER BY topic', [id]);
    return { revision: person.revision, ...person, sections, evidence, enrichment };
}

async function submitPersonEdit(request, options = {}) {
    const { target, action } = request;
    if (!['person', 'person_section'].includes(target) || !['create', 'update', 'delete'].includes(action)) throw badRequest('invalid editorial target/action');
    const id = requireId(request.id, 'person id');
    const fields = { ...(request.fields || {}) };
    const sources = sourcesFor({ sources: request.sources ?? fields.sources });
    fields.sources = sources;
    const actor = options.changedBy || request.changedBy || 'commulingo-editorial';
    return withTransaction(options, async client => {
        await client.query('SELECT id FROM commulingo_people WHERE id=$1 FOR UPDATE', [id]);
        const person = await getPersonAdmin(id, { client });
        if (!(target === 'person' && action === 'create')) {
            if (!person) { const error = badRequest('person not found'); error.status = 404; throw error; }
            assertExpectedRevision(fields.expectedRevision, person.revision, true);
        }
        let before = person;
        if (target === 'person_section') {
            before = (await listPersonSectionsAdmin(id, { client })).find(s => s.slug === fields.slug) || null;
            if (action === 'create' && before) throw badRequest('section already exists; update the existing slug');
            if (action !== 'create' && !before) { const error = badRequest('section not found'); error.status = 404; throw error; }
        }
        const reasons = reviewReasons(target, action, fields, before);
        const pending = !options.reviewed && (request.directApply === false || reasons.length > 0);
        const writeOptions = { client, changedBy: actor, sources, requireRevision: true, reviewed: true, expectedRevision: fields.expectedRevision };
        await client.query('SAVEPOINT editorial_validation');
        let value;
        if (target === 'person') {
            if (action === 'create') value = await createPersonAdmin({ ...fields, id }, writeOptions);
            else if (action === 'update') value = await updatePersonAdmin(id, fields, writeOptions);
            else value = await deletePersonAdmin(id, writeOptions);
        } else if (action === 'delete') value = await deletePersonSectionAdmin(id, fields.slug, writeOptions);
        else value = await upsertPersonSectionAdmin(id, fields.slug, fields, writeOptions);
        if (pending || request.dryRun) await client.query('ROLLBACK TO SAVEPOINT editorial_validation');
        await client.query('RELEASE SAVEPOINT editorial_validation');
        if (request.dryRun) return { status: 'validated', wouldStage: pending, reasons };
        const status = pending ? 'pending' : 'approved';
        let suggestionId = options.suggestionId;
        if (!suggestionId) {
            const result = await client.query(`INSERT INTO commulingo_agent_suggestions
                (target_type,target_id,action,patch_json,source_refs,confidence,status,suggested_by,reviewer,review_note,reviewed_at)
                VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,CASE WHEN $7='approved' THEN NOW() ELSE NULL END) RETURNING id`,
            [target,id,action,JSON.stringify(fields),JSON.stringify(sources),request.confidence ?? null,status,actor,
                pending ? '' : 'auto:shared-store', reasons.join(', ')]);
            suggestionId = result.rows[0].id;
        } else {
            await client.query(`UPDATE commulingo_agent_suggestions SET status='approved', reviewer=$2,
                review_note=$3, reviewed_at=NOW() WHERE id=$1`, [suggestionId, actor, options.note || 'reviewed through shared store']);
        }
        return { status, suggestionId, reasons, ...(pending ? {} : { value }) };
    });
}

async function reviewPersonSuggestion(id, approve, note, options = {}) {
    return withTransaction(options, async client => {
        const { rows } = await client.query('SELECT * FROM commulingo_agent_suggestions WHERE id=$1 FOR UPDATE', [id]);
        const row = rows[0];
        if (!row || !['person', 'person_section'].includes(row.target_type)) throw badRequest('person suggestion not found');
        if (row.status !== 'pending') { const error = badRequest('suggestion already reviewed'); error.status = 409; throw error; }
        if (!approve) {
            await client.query("UPDATE commulingo_agent_suggestions SET status='rejected',reviewer=$2,review_note=$3,reviewed_at=NOW() WHERE id=$1", [id, options.changedBy || 'admin-review', note || 'rejected']);
            return { status: 'rejected', suggestionId: id };
        }
        if (!note?.trim()) throw badRequest('approval requires a review note explaining the evidence/identity decision');
        return submitPersonEdit({ target: row.target_type, action: row.action, id: row.target_id,
            fields: row.patch_json, sources: row.source_refs, confidence: row.confidence },
        { client, reviewed: true, suggestionId: id, note, changedBy: options.changedBy || `agent-suggestion:${id}` });
    });
}

async function saveEnrichment(request, options = {}) {
    const topics = ['basics', 'nationality', 'bio', 'moment', 'events', 'sections'];
    const statuses = ['open', 'complete', 'not_applicable', 'sources_unavailable'];
    if (!topics.includes(request.topic) || !statuses.includes(request.status) || !request.reason?.trim()) throw badRequest('topic, status and reason are required');
    if (!Array.isArray(request.sources) || request.sources.some(s => typeof s !== 'string')) throw badRequest('sources must list the references inspected');
    return withTransaction(options, async client => {
        const id = requireId(request.id, 'person id');
        await client.query('SELECT id FROM commulingo_people WHERE id=$1 FOR UPDATE', [id]);
        const person = await getPersonAdmin(id, { client });
        if (!person) throw badRequest('person not found');
        assertExpectedRevision(request.expectedRevision, person.revision, true);
        const days = request.status === 'sources_unavailable' ? 90 : request.status === 'open' ? 0 : 180;
        await client.query(`INSERT INTO commulingo_person_enrichment
            (person_id,topic,status,reason,sources,revision,review_after,changed_by)
            VALUES ($1,$2,$3,$4,$5::jsonb,$6,NOW()+$7*INTERVAL '1 day',$8)
            ON CONFLICT(person_id,topic) DO UPDATE SET status=EXCLUDED.status,reason=EXCLUDED.reason,
            sources=EXCLUDED.sources,revision=EXCLUDED.revision,review_after=EXCLUDED.review_after,
            changed_by=EXCLUDED.changed_by,updated_at=NOW()`,
        [id,request.topic,request.status,request.reason,JSON.stringify(request.sources),person.revision,days,options.changedBy || request.changedBy || 'commulingo-maintainer']);
        return { status: request.status, topic: request.topic, reviewDays: days };
    });
}

module.exports = { readPersonEditorial, submitPersonEdit, reviewPersonSuggestion, saveEnrichment };
