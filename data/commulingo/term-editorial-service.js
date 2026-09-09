const { createHash } = require('node:crypto');
const { withTransaction, writeRevision } = require('./admin-tx');
const { readSnapshot } = require('./read-snapshot');
const { badRequest, requireId } = require('./people-admin-fields');
const { sourcesFor } = require('./person-editorial-policy');
const { assertExpectedRevision } = require('./people-edit-version');
const contract = require('./term-editorial-contract.json');

const columns = {
    original: 'original', startYear: 'start_year', endYear: 'end_year',
    category: 'category', parentId: 'parent_id', sortOrder: 'sort_order',
};
const localized = { term: 'term', definition: 'definition', body: 'body', period: 'period' };
const allowed = new Set([...Object.keys(columns), ...Object.keys(localized),
    'id', 'sources', 'aliases', 'people', 'events', 'evidence', 'expectedRevision']);

async function readTermEditorial(id, options = {}) {
    if (!options.client) return readSnapshot(client => readTermEditorial(id, { client }));
    const client = options.client;
    const { rows } = await client.query('SELECT * FROM commulingo_terms WHERE id=$1', [id]);
    if (!rows.length) return null;
    const raw = rows[0], result = { id, sources: raw.sources || [] };
    const state = { row: raw };
    for (const [field, column] of Object.entries(columns)) result[field] = raw[column];
    for (const [field, prefix] of Object.entries(localized)) result[field] = {
        ko: raw[`${prefix}_ko`] || (field === 'period' ? raw.period_label : '') || '',
        en: raw[`${prefix}_en`] || (field === 'period' ? raw.period_label : '') || '',
    };
    result.aliases = { ko: [], en: [] };
    state.aliases = (await client.query('SELECT * FROM commulingo_term_aliases WHERE term_id=$1 ORDER BY lang,alias', [id])).rows;
    for (const row of state.aliases) result.aliases[row.lang]?.push(row.alias);
    for (const [field, table, column] of [['people','commulingo_term_people','person_id'], ['events','commulingo_term_events','event_id']]) {
        state[field] = (await client.query(`SELECT * FROM ${table} WHERE term_id=$1 ORDER BY ${column}`, [id])).rows;
        result[field] = state[field].map(row => row[column]);
    }
    state.relations = (await client.query('SELECT * FROM commulingo_term_relations WHERE term_id=$1 OR related_id=$1 ORDER BY term_id,related_id', [id])).rows;
    result.revision = `v1-${createHash('sha256').update(JSON.stringify(state)).digest('hex')}`;
    result.evidence = (await client.query('SELECT * FROM commulingo_term_evidence WHERE term_id=$1 ORDER BY id', [id])).rows;
    result.enrichment = (await client.query('SELECT * FROM commulingo_term_enrichment WHERE term_id=$1 ORDER BY topic', [id])).rows;
    return result;
}

function validateFields(fields, current, action, sources) {
    for (const key of Object.keys(fields)) if (!allowed.has(key)) throw badRequest(`unknown term field ${key}`);
    const merged = { ...(current || {}), ...fields };
    for (const field of contract.localized) {
        const value = fields[field];
        if (value !== undefined) {
            if (!value || typeof value !== 'object' || Array.isArray(value)
                || Object.keys(value).some(k => !['ko','en'].includes(k) || typeof value[k] !== 'string')) throw badRequest(`${field} must contain ko/en text`);
            merged[field] = { ...(current?.[field] || {}), ...value };
        }
        const limits = contract.limits[field];
        if (limits) ['ko','en'].forEach((lang,index) => {
            if ([...(merged[field]?.[lang] || '')].length > limits[index]) throw badRequest(`${field}.${lang} exceeds ${limits[index]}`);
        });
    }
    for (const field of ['term','definition','period']) {
        if (!merged[field]?.ko?.trim() || !merged[field]?.en?.trim()) throw badRequest(`${field} requires both languages`);
    }
    for (const field of ['startYear','endYear','sortOrder']) {
        if (merged[field] != null && !Number.isInteger(merged[field])) throw badRequest(`${field} must be integer or null`);
    }
    if (merged.startYear != null && merged.endYear != null && merged.endYear < merged.startYear) throw badRequest('endYear precedes startYear');
    if (action==='create' && merged.startYear==null && /\b(1[5-9]\d{2}|20\d{2})\b/.test(`${merged.period.ko} ${merged.period.en}`)) throw badRequest('dated period requires startYear');
    if (!merged.category || typeof merged.category !== 'string') throw badRequest('category required');
    if (fields.id !== undefined && fields.id !== merged.id) throw badRequest('id mismatch');
    if (fields.original !== undefined && typeof fields.original !== 'string') throw badRequest('original must be text');
    if (fields.aliases !== undefined && (!fields.aliases || typeof fields.aliases !== 'object'
        || Array.isArray(fields.aliases) || Object.entries(fields.aliases).some(([lang,values]) =>
            !['ko','en'].includes(lang) || !Array.isArray(values) || values.some(v => typeof v !== 'string' || !v.trim())))) throw badRequest('invalid aliases');
    for (const field of ['people','events']) if (fields[field] !== undefined &&
        (!Array.isArray(fields[field]) || fields[field].some(v => typeof v !== 'string' || !v))) throw badRequest(`invalid ${field}`);
    const evidence = fields.evidence || [];
    if (!Array.isArray(evidence) || evidence.length > 50) throw badRequest('at most 50 evidence items');
    for (const e of evidence) {
        if (!e || !Object.hasOwn(fields,e.field) || typeof e.claim !== 'string' || !e.claim.trim()
            || !sources.includes(e.source) || typeof e.locator !== 'string' || !e.locator.trim()
            || (e.excerpt !== undefined && typeof e.excerpt !== 'string')
            || !['supports','disputes'].includes(e.stance || 'supports')) throw badRequest('invalid field evidence');
    }
    for (const field of contract.factFields) if (Object.hasOwn(fields,field) && !evidence.some(e => e.field===field)) throw badRequest(`evidence required for ${field}`);
    return merged;
}

async function save(client, id, fields, current, action, actor, sources) {
    if (fields.id !== undefined && fields.id !== id) throw badRequest('id mismatch');
    const value = validateFields({ ...fields, id }, current, action, sources);
    const category = await client.query('SELECT id FROM commulingo_term_categories WHERE id=$1', [value.category]);
    if (!category.rows.length) throw badRequest('unknown category');
    if (value.parentId) {
        const parent = (await client.query('SELECT parent_id FROM commulingo_terms WHERE id=$1', [value.parentId])).rows[0];
        const children = (await client.query('SELECT id FROM commulingo_terms WHERE parent_id=$1 LIMIT 1', [id])).rows;
        if (value.parentId===id || !parent || parent.parent_id || children.length) throw badRequest('terms support one nesting level');
    }
    const names = [value.term.ko,value.term.en,...Object.values(value.aliases || {}).flat()];
    const collision = await client.query(`SELECT id FROM commulingo_terms WHERE id!=$1 AND
        (lower(btrim(term_ko))=ANY($2) OR lower(btrim(term_en))=ANY($2))
        UNION SELECT term_id FROM commulingo_term_aliases WHERE term_id!=$1 AND lower(btrim(alias))=ANY($2)`,
        [id,names.map(n => n.trim().toLowerCase())]);
    if (collision.rows.length) throw badRequest('term name or alias already belongs to another entry');
    if (action==='create') await client.query(`INSERT INTO commulingo_terms
        (id,term_ko,term_en,definition_ko,definition_en,category,sort_order)
        VALUES ($1,$2,$3,$4,$5,$6,(SELECT COALESCE(max(sort_order),0)+10 FROM commulingo_terms))`,
        [id,value.term.ko,value.term.en,value.definition.ko,value.definition.en,value.category]);
    const sets = [], params = [id];
    const set = (column,v) => { params.push(v); sets.push(`${column}=$${params.length}`); };
    for (const [field,column] of Object.entries(columns)) if (Object.hasOwn(fields,field)) set(column,fields[field]);
    for (const [field,prefix] of Object.entries(localized)) if (Object.hasOwn(fields,field)) {
        set(`${prefix}_ko`,value[field].ko); set(`${prefix}_en`,value[field].en);
        if (field==='period') set('period_label',value[field].ko);
    }
    set('sources',JSON.stringify([...new Set([...(current?.sources || []),...sources])]));
    await client.query(`UPDATE commulingo_terms SET ${sets.join(',')},updated_at=now() WHERE id=$1`,params);
    if (fields.aliases !== undefined || action==='create') {
        await client.query('DELETE FROM commulingo_term_aliases WHERE term_id=$1',[id]);
        for (const [lang,values] of Object.entries(fields.aliases || { ko:[value.term.ko], en:[value.term.en] })) {
            for (const [index,alias] of [...new Set(values)].entries()) await client.query(
                'INSERT INTO commulingo_term_aliases(term_id,lang,alias,sort_order) VALUES ($1,$2,$3,$4)',[id,lang,alias,index]);
        }
    }
    for (const [field,table,column] of [['people','commulingo_term_people','person_id'],['events','commulingo_term_events','event_id']]) {
        if (fields[field]===undefined) continue;
        await client.query(`DELETE FROM ${table} WHERE term_id=$1`,[id]);
        for (const [index,other] of [...new Set(fields[field])].entries()) await client.query(
            `INSERT INTO ${table}(term_id,${column},sort_order) VALUES ($1,$2,$3)`,[id,other,index]);
    }
    const after = await readTermEditorial(id,{client});
    for (const e of fields.evidence || []) await client.query(`INSERT INTO commulingo_term_evidence
        (term_id,field,claim,source,locator,excerpt,stance,revision,changed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [id,e.field,e.claim,e.source,e.locator,e.excerpt || '',e.stance || 'supports',after.revision,actor]);
    await client.query("UPDATE commulingo_term_enrichment SET status='open',review_after=now(),updated_at=now() WHERE term_id=$1",[id]);
    await writeRevision(client,'term',id,`${action} term`,{before:current,after},actor);
    return after;
}

async function submitTermEdit(request, options = {}) {
    const id = requireId(request.id,'term id');
    if (!['create','update'].includes(request.action)) throw badRequest('term action must be create/update');
    const fields = request.fields || {}, sources = sourcesFor({ sources:request.sources });
    const actor = request.changedBy || options.changedBy || 'commulingo-editorial';
    return withTransaction(options,async client => {
        const current = await readTermEditorial(id,{client});
        if (request.action==='create' && current) throw badRequest('term already exists');
        if (request.action==='update') {
            if (!current) throw badRequest('term not found');
            assertExpectedRevision(fields.expectedRevision,current.revision,true);
        }
        await client.query('SAVEPOINT term_validation');
        const value = await save(client,id,fields,current,request.action,actor,sources);
        const pending = !options.reviewed;
        if (pending || request.dryRun) await client.query('ROLLBACK TO SAVEPOINT term_validation');
        await client.query('RELEASE SAVEPOINT term_validation');
        if (request.dryRun) return {status:'validated',wouldStage:true};
        let suggestionId = options.suggestionId;
        if (!suggestionId) {
            suggestionId = (await client.query(`INSERT INTO commulingo_agent_suggestions
                (target_type,target_id,action,patch_json,source_refs,status,suggested_by)
                VALUES ('term',$1,$2,$3,$4,'pending',$5) RETURNING id`,
                [id,request.action,JSON.stringify(fields),JSON.stringify(sources),actor])).rows[0].id;
        } else await client.query(`UPDATE commulingo_agent_suggestions SET status='approved',reviewer=$2,
            review_note=$3,reviewed_at=now() WHERE id=$1`,[suggestionId,actor,options.note]);
        return {status:pending?'pending':'approved',suggestionId,...(pending?{}:{value})};
    });
}

async function reviewTermSuggestion(id, approve, note, options = {}) {
    if (typeof approve!=='boolean') throw badRequest('approve must be boolean');
    if (typeof note !== 'string' || !note.trim()) throw badRequest('review note required');
    return withTransaction(options,async client => {
        const row = (await client.query('SELECT * FROM commulingo_agent_suggestions WHERE id=$1 FOR UPDATE',[id])).rows[0];
        if (!row || row.target_type!=='term' || row.status!=='pending') throw badRequest('pending term suggestion not found');
        if (!approve) {
            await client.query("UPDATE commulingo_agent_suggestions SET status='rejected',reviewer=$2,review_note=$3,reviewed_at=now() WHERE id=$1",[id,options.changedBy || 'term-review',note]);
            return {status:'rejected',suggestionId:id};
        }
        return submitTermEdit({id:row.target_id,action:row.action,fields:row.patch_json,sources:row.source_refs},
            {client,reviewed:true,suggestionId:id,note,changedBy:options.changedBy});
    });
}

async function saveEnrichment(request, options = {}) {
    if (!contract.topics.includes(request.topic) || !['open','complete','not_applicable','sources_unavailable'].includes(request.status)
        || typeof request.reason!=='string' || !request.reason.trim()
        || !Array.isArray(request.sources) || request.sources.some(s => typeof s!=='string')) throw badRequest('invalid term enrichment judgment');
    return withTransaction(options,async client => {
        const current = await readTermEditorial(request.id,{client});
        if (!current) throw badRequest('term not found');
        assertExpectedRevision(request.expectedRevision,current.revision,true);
        const days = request.status==='sources_unavailable' ? 90 : request.status==='open' ? 0 : 180;
        await client.query(`INSERT INTO commulingo_term_enrichment
            (term_id,topic,status,reason,sources,revision,review_after) VALUES ($1,$2,$3,$4,$5,$6,now()+$7*interval '1 day')
            ON CONFLICT(term_id,topic) DO UPDATE SET status=EXCLUDED.status,reason=EXCLUDED.reason,
            sources=EXCLUDED.sources,revision=EXCLUDED.revision,review_after=EXCLUDED.review_after,updated_at=now()`,
            [request.id,request.topic,request.status,request.reason,JSON.stringify(request.sources),current.revision,days]);
        return {status:request.status,topic:request.topic,reviewDays:days};
    });
}

module.exports = {readTermEditorial,submitTermEdit,reviewTermSuggestion,saveEnrichment,validateFields};
