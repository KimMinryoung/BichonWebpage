// Deterministic missing-content commissions and requested-entry intake
// (ported from leninbot commulingo/pipeline/planner.py, editor workflow).
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const db = require('../../config/database');
const store = require('./store');
const { bundleCandidates } = require('./bundles');

const RENDER_CACHE = process.env.COMMULINGO_REPORT_RENDER_CACHE || path.join(__dirname, '../../data/cache/report-renders.json');

// Public reports whose rendered links include each glossary term: the
// "linked documents" measure that orders body-less terms (2026-09-17). Only
// links the site actually renders count; a missing cache means zero for all.
function reportMentionsByTerm(file = RENDER_CACHE) {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
        console.warn('[pipeline] report render cache unavailable; term mentions default to 0:', err.message);
        return {};
    }
    const perLanguage = new Map();
    for (const generation of data.generations || []) {
        const lang = generation.lang || '';
        if (!perLanguage.has(lang)) perLanguage.set(lang, new Map());
        const counts = perLanguage.get(lang);
        for (const entry of generation.entries || []) {
            const record = Array.isArray(entry) && entry.length === 2 ? entry[1] : entry;
            const links = ((record || {}).result || {}).links || [];
            for (const id of new Set(links.filter(link => link && link.kind === 'term' && link.id).map(link => link.id))) {
                counts.set(id, (counts.get(id) || 0) + 1);
            }
        }
    }
    // A report counts once per term, whichever language names it more often.
    const merged = {};
    for (const counts of perLanguage.values()) {
        for (const [id, n] of counts) merged[id] = Math.max(merged[id] || 0, n);
    }
    return merged;
}

// Only empty values are commissioned: prose that predates the evidence regime
// is not re-researched (operator decision 2026-09-20). People are ordered by
// importance, the number of linked history events (2026-09-17).
async function candidates(config, limit = 40) {
    const { rows } = await db.query(`SELECT 'person' AS kind, 'update' AS action, p.id AS target, topic.name AS topic,
            100 - LEAST(${store.personEvents('p.id')}, 79) AS priority,
            'Commissioned missing information or evidence: ' || topic.name AS reason,
            concat_ws(':', p.updated_at::text,
                (SELECT max(e.created_at)::text FROM commulingo_person_evidence e WHERE e.person_id=p.id),
                (SELECT max(s.updated_at)::text FROM commulingo_person_sections s WHERE s.person_id=p.id)) AS baseline,
            NULL::boolean AS body_empty
        FROM commulingo_people p CROSS JOIN LATERAL (VALUES
            ('basics', 20, p.years_label='' OR p.epithet_ko='' OR p.epithet_en=''
                OR NOT coalesce(p.activities,'[]'::jsonb) @> '[{"primary": true}]'::jsonb
                OR NOT EXISTS (SELECT 1 FROM commulingo_person_career_entries c WHERE c.person_id=p.id)),
            ('bio', 30, p.bio_ko='' OR p.bio_en=''),
            ('nationality', 35, p.citizenship_code='' OR p.origin_code=''),
            ('moment', 40, p.moment_ko='' OR p.moment_en=''),
            ('sections', 50, NOT EXISTS (SELECT 1 FROM commulingo_person_sections s WHERE s.person_id=p.id))
        ) AS topic(name, priority, needed)
        WHERE topic.needed
          AND NOT EXISTS (SELECT 1 FROM commulingo_person_enrichment e
              WHERE e.person_id=p.id AND e.topic=topic.name AND e.status!='open' AND e.review_after>now())
          AND NOT EXISTS (SELECT 1 FROM commulingo_agent_suggestions s
              WHERE s.target_id=p.id AND s.target_type IN ('person','person_section') AND s.status='pending')
          AND (topic.name='sections' OR NOT ${store.personInGrace('p.id')})
        UNION ALL
        SELECT 'term', 'update', t.id, topic.name, topic.priority, 'Commissioned glossary explanation: ' || topic.name,
            t.updated_at::text, (t.body_ko='' OR t.body_en='')
        FROM commulingo_terms t CROSS JOIN LATERAL (VALUES
            ('definition', 30, t.definition_ko='' OR t.definition_en=''),
            ('history', 40, t.body_ko='' OR t.body_en='')
        ) AS topic(name, priority, needed)
        WHERE topic.needed
          AND NOT EXISTS (SELECT 1 FROM commulingo_term_enrichment e
              WHERE e.term_id=t.id AND e.topic=topic.name AND e.status!='open' AND e.review_after>now())
          AND NOT EXISTS (SELECT 1 FROM commulingo_agent_suggestions s WHERE s.target_id=t.id AND s.target_type='term' AND s.status='pending')
          AND NOT ${store.termInGrace('t.id')}
          AND t.id <> ALL($1::text[])
        ORDER BY priority, target`, [config.term_enrichment_exclude]);
    // Term order: body-less first, then by public reports that link the term.
    const mentions = reportMentionsByTerm();
    const found = rows.map(row => {
        const { body_empty: bodyEmpty, ...rest } = row;
        return rest.kind === 'term' ? { ...rest, priority: store.termPriority(bodyEmpty, mentions[rest.target] || 0) } : rest;
    });
    // Explicitly requested entries (curation gaps) whose target is known.
    const gaps = await db.query(`SELECT kind, CASE WHEN
            (kind='person' AND EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id=COALESCE(NULLIF(g.target_id,''),NULLIF(g.resolved_id,'')))) OR
            (kind='term' AND EXISTS (SELECT 1 FROM commulingo_terms t WHERE t.id=COALESCE(NULLIF(g.target_id,''),NULLIF(g.resolved_id,''))))
            THEN 'update' ELSE 'create' END AS action, COALESCE(NULLIF(target_id,''), NULLIF(resolved_id,'')) AS target,
            'basics' AS topic, 'Explicit gap: ' || label_ko AS reason, 10 AS priority, '' AS baseline, id AS gap_id, label_ko, label_en
        FROM commulingo_curation_gaps g
        WHERE status='pending' AND kind IN ('person','term')
          AND NOT (kind='term' AND COALESCE(NULLIF(target_id,''),NULLIF(resolved_id,'')) <> ALL($1::text[])
               AND NOT EXISTS (SELECT 1 FROM commulingo_terms t WHERE t.id=COALESCE(NULLIF(g.target_id,''),NULLIF(g.resolved_id,'')))
               AND ${store.eventTitleMatch('g.label_ko', "COALESCE(g.label_en,'')")})
        ORDER BY priority DESC, id LIMIT $2`, [config.term_event_overlap_allow, limit]);
    for (const row of gaps.rows) {
        if (!row.target) continue;
        const { gap_id: gapId, label_ko: labelKo, label_en: labelEn, ...rest } = row;
        found.push({ ...rest, topic: rest.kind === 'term' ? 'definition' : rest.topic, payload: { gap_id: Number(gapId), label_ko: labelKo, label_en: labelEn } });
    }
    // Completed judgements are suppressed until the content changes or the TTL passes.
    const jobs = (await db.query(`SELECT kind, target, topic, baseline, status, payload FROM commulingo_pipeline_jobs
        WHERE status IN ${store.ACTIVE} OR (status='complete' AND updated_at > now() - CASE WHEN EXISTS (
            SELECT 1 FROM commulingo_pipeline_artifacts a WHERE a.job_id=commulingo_pipeline_jobs.id
              AND a.stage='research' AND a.value->>'status'='sources_unavailable') THEN interval '90 days' ELSE interval '180 days' END)`)).rows;
    const key = (...parts) => parts.join('\u0000');
    const active = new Set(), activeTargets = new Set(), completed = new Set();
    for (const job of jobs) {
        if (job.status === 'complete') {
            completed.add(key(job.kind, job.target, job.topic, job.baseline));
            for (const topic of (job.payload || {}).topics || []) completed.add(key(job.kind, job.target, topic, job.baseline));
        } else {
            active.add(key(job.kind, job.target, job.topic));
            activeTargets.add(key(job.kind, job.target));
        }
    }
    // Match the queue's unique key before the limit; explicit gaps win over
    // ordinary commissions so their completion link survives.
    const available = [], seen = new Set();
    for (const row of [...found].sort((a, b) => a.priority - b.priority)) {
        const k = key(row.kind, row.target, row.topic);
        if (active.has(k) || (seen.has(k) && row.action !== 'update') || completed.has(key(row.kind, row.target, row.topic, row.baseline))
            || (row.action === 'update' && activeTargets.has(key(row.kind, row.target)))) continue;
        seen.add(k);
        available.push(row);
    }
    const bundled = bundleCandidates(available);
    const urgent = bundled.filter(r => r.priority < 20).sort((a, b) => a.priority - b.priority || a.target.localeCompare(b.target));
    const groups = ['person:create', 'person:update', 'term:create', 'term:update']
        .map(group => bundled.filter(r => r.priority >= 20 && `${r.kind}:${r.action}` === group));
    const selected = urgent.slice(0, limit);
    while (selected.length < limit && groups.some(g => g.length)) {
        for (const group of groups) if (group.length && selected.length < limit) selected.push(group.shift());
    }
    return selected;
}

// Requested entries without a known target become discovery jobs. Public
// material mining (events, people) runs only when discovery is on.
async function materials(config, limit = 10) {
    const { rows } = await db.query(`WITH materials AS (
            SELECT 'gap:' || id::text AS material_id, label_ko AS label, concat_ws(E'\\n', label_ko, label_en, reason) AS body, kind AS requested_kind
            FROM commulingo_curation_gaps WHERE status='pending' AND kind IN ('person','term')
              AND NULLIF(target_id,'') IS NULL AND NULLIF(resolved_id,'') IS NULL
            UNION ALL SELECT 'event:' || id, title_ko, concat_ws(E'\\n', summary_ko, outcome_ko, timeline::text), NULL
            FROM commulingo_history_events WHERE $2
            UNION ALL SELECT 'person:' || id, name_ko, concat_ws(E'\\n', bio_ko, moment_ko), NULL FROM commulingo_people WHERE $2)
        SELECT m.*, md5(m.body) AS content_hash FROM materials m LEFT JOIN commulingo_pipeline_materials p USING(material_id)
        WHERE COALESCE(body,'')!='' AND (p.material_id IS NULL OR p.content_hash!=md5(m.body))
          AND NOT EXISTS (SELECT 1 FROM commulingo_pipeline_jobs j WHERE j.topic='discovery' AND j.status IN ${store.ACTIVE}
              AND j.payload->>'material_id'=m.material_id AND j.payload->>'content_hash'=md5(m.body))
        ORDER BY CASE WHEN material_id LIKE 'gap:%' THEN 0 ELSE 1 END, material_id LIMIT $1`, [limit, config.discovery]);
    return rows;
}

async function plan(config, { apply = false, limit = 40 } = {}) {
    const commissions = await candidates(config, limit);
    const found = await materials(config, Math.min(limit, 10));
    if (apply) {
        for (const candidate of commissions) await store.enqueue({ ...candidate, payload: { ...(candidate.payload || {}), workflow: 'editor' } });
        await store.reprioritizePeople();
        await store.retirePeopleInGrace();
        await store.reprioritizeTerms(reportMentionsByTerm());
        if (!config.discovery) await store.cancelDiscovery();
        for (const material of found) {
            const target = 'material-' + createHash('sha256').update(material.material_id + material.content_hash).digest('hex').slice(0, 32);
            await store.enqueue({ kind: 'term', action: 'create', target, topic: 'discovery', reason: 'New or changed public material',
                priority: material.material_id.startsWith('gap:') ? 10 : 60, payload: { ...material, workflow: 'editor' }, stage: 'discover' });
        }
    }
    return { commissions, materials: found.map(({ body, ...rest }) => rest), applied: apply };
}

module.exports = { candidates, materials, plan, reportMentionsByTerm };
