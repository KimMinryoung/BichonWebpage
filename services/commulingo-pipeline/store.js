// PostgreSQL work queue with fenced leases and conservative cost reservations
// (ported from leninbot commulingo/pipeline/store.py; the tables are this
// repository's since migration 288). A stage that waits on the leninbot worker
// parks its job (park) instead of holding a lease for minutes.
const { randomUUID } = require('node:crypto');
const db = require('../../config/database');
const { advance, bundleCandidates, gapIds } = require('./bundles');

class LostLease extends Error {}
class BudgetUnavailable extends Error {}

// The budget and canary publication day starts at 02:00 KST (operator decision 2026-09-29).
const BUDGET_DAY_SQL = "((now() AT TIME ZONE 'Asia/Seoul') - interval '2 hours')::date";
const ACTIVE = "('ready','running','deferred','escalated')";
const GROUPS = ['person:create', 'person:update', 'term:create', 'term:update'];
const LEASE_SECONDS = 300;

// Importance tier (operator decision 2026-09-17): people linked to at least this
// many history events get the deep section budget and the short re-enrichment grace.
const IMPORTANT_EVENTS = 6;
const GRACE_DAYS_IMPORTANT = 14, GRACE_DAYS_OTHER = 90;
const TERM_GRACE_DAYS = 90;
const TERM_BODY_ENOUGH_KO = 2000, TERM_BODY_ENOUGH_EN = 4500;
const personEvents = person => `(SELECT count(DISTINCT e.event_id) FROM commulingo_history_event_people e WHERE e.person_id=${person})`;
const SECTION_CAP = events => `CASE WHEN ${events}>=6 THEN 12 WHEN ${events}>=3 THEN 5 WHEN ${events}>=1 THEN 3 ELSE 2 END`;
// True while a person's last pipeline-applied edit is younger than their grace window.
const personInGrace = person => `EXISTS (SELECT 1 FROM commulingo_pipeline_artifacts a JOIN commulingo_pipeline_jobs g ON g.id=a.job_id
    WHERE g.kind='person' AND g.target=${person} AND a.stage='submit' AND a.value->>'status'='approved'
    AND a.created_at > now() - (CASE WHEN ${personEvents(person)} >= ${IMPORTANT_EVENTS}
        THEN ${GRACE_DAYS_IMPORTANT} ELSE ${GRACE_DAYS_OTHER} END) * interval '1 day')`;
const termInGrace = term => `EXISTS (SELECT 1 FROM commulingo_pipeline_artifacts a JOIN commulingo_pipeline_jobs g ON g.id=a.job_id
    WHERE g.kind='term' AND g.target=${term} AND a.stage='submit' AND a.value->>'status'='approved'
    AND a.created_at > now() - ${TERM_GRACE_DAYS} * interval '1 day')`;
const termBodyEnough = t => `(length(${t}.body_ko) >= ${TERM_BODY_ENOUGH_KO} OR length(${t}.body_en) >= ${TERM_BODY_ENOUGH_EN})`;
// A gap or discovery label naming an existing history event is not a new glossary entry.
const eventTitleMatch = (labelKo, labelEn) => `EXISTS (SELECT 1 FROM commulingo_history_events ev WHERE lower(ev.title_ko)=lower(${labelKo})
    OR (${labelEn}<>'' AND lower(ev.title_en)=lower(${labelEn})))`;

// Body-less terms first, then by linked public reports; always in the non-urgent range.
function termPriority(bodyEmpty, mentions) {
    return (bodyEmpty ? 21 : 51) + Math.max(0, 29 - Math.min(Number(mentions) || 0, 29));
}

async function tx(fn) {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

async function enqueue({ kind, action, target, topic, baseline = '', reason, priority = 50, payload = {}, stage = 'research' }, client = db) {
    const { rows } = await client.query(
        `INSERT INTO commulingo_pipeline_jobs (kind,action,target,topic,baseline,reason,priority,payload,stage)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
         ON CONFLICT (kind,target,topic) WHERE status IN ${ACTIVE} DO NOTHING RETURNING id`,
        [kind, action, target, topic, baseline, reason, priority, JSON.stringify(payload), stage]);
    return rows[0] ? rows[0].id : null;
}

// Review and submit first, then urgent jobs, then a round-robin over the four
// kind:action groups so one long queue cannot starve the others.
async function claim({ jobId = null, stages = null } = {}) {
    const token = randomUUID();
    return tx(async client => {
        const cursor = (await client.query('SELECT cursor FROM commulingo_pipeline_scheduler WHERE id=1 FOR UPDATE')).rows[0].cursor;
        const { rows } = await client.query(
            `WITH candidate AS (
                SELECT id FROM commulingo_pipeline_jobs
                WHERE ((status IN ('ready','deferred') AND available_at <= now()) OR (status='running' AND lease_until < now()))
                  AND ($1::bigint IS NULL OR id = $1) AND ($2::text[] IS NULL OR stage = ANY($2::text[]))
                ORDER BY CASE WHEN stage IN ('review','submit') THEN 0 WHEN priority<20 THEN 1 ELSE 2 END,
                         mod(CASE kind || ':' || action WHEN 'person:create' THEN 0 WHEN 'person:update' THEN 1
                             WHEN 'term:create' THEN 2 ELSE 3 END - $3 + 4, 4),
                         priority, created_at, id
                FOR UPDATE SKIP LOCKED LIMIT 1)
             UPDATE commulingo_pipeline_jobs j SET status='running', lease_token=$4,
                 lease_until=now() + $5 * interval '1 second', attempts=attempts+1, updated_at=now()
             FROM candidate c WHERE j.id=c.id RETURNING j.*`,
            [jobId, stages, cursor, token, LEASE_SECONDS]);
        const job = rows[0] || null;
        if (job) {
            await client.query('UPDATE commulingo_pipeline_scheduler SET cursor=$1 WHERE id=1',
                [(GROUPS.indexOf(`${job.kind}:${job.action}`) + 1) % 4]);
        }
        return job;
    });
}

async function fenced(client, sql, params, job) {
    const { rows } = await client.query(sql, params);
    if (!rows.length) throw new LostLease(String(job.id));
}

const FENCE = "id=$1 AND lease_token=$2 AND status='running' AND lease_until>now()";

async function finishStage(job, value, { nextStage, status = 'ready', usage = {}, delaySeconds = 0 }) {
    const reason = ['deferred', 'escalated'].includes(status)
        ? (value.error || value.preflight_error || value.hold_reason || value.reason || '') : '';
    return tx(async client => {
        await fenced(client, `UPDATE commulingo_pipeline_jobs SET stage=$3, status=$4, lease_token=NULL, lease_until=NULL,
                last_error=$5, updated_at=now(), attempts=0, available_at=now() + $6 * interval '1 second',
                payload = payload - 'waiting' WHERE ${FENCE} RETURNING id`,
        [job.id, job.lease_token, nextStage, status, String(reason).slice(0, 2000), delaySeconds], job);
        const patch = {};
        if (usage.provider_fallback) patch.provider_fallback = usage.provider_fallback;
        if (value.remaining_topics) patch.remaining_topics = value.remaining_topics;
        if (Object.keys(patch).length) {
            await client.query('UPDATE commulingo_pipeline_jobs SET payload = payload || $2::jsonb WHERE id=$1', [job.id, JSON.stringify(patch)]);
        }
        const metrics = Object.fromEntries(Object.entries(usage).filter(([key]) => [
            'total_cost', 'model_calls', 'provider_fallback', 'worker_task', 'rejections', 'workflow'].includes(key)));
        await client.query('INSERT INTO commulingo_pipeline_artifacts(job_id,stage,value,metrics) VALUES ($1,$2,$3::jsonb,$4::jsonb)',
            [job.id, job.stage, JSON.stringify(value), JSON.stringify(metrics)]);
        if (job.stage === 'discover') await finishDiscovery(client, job, value);
        const gaps = gapIds(job.payload || {});
        if (job.stage === 'research' && status === 'complete' && job.action === 'create'
            && value.reason === 'target already exists' && gaps.length) {
            await client.query(`UPDATE commulingo_curation_gaps SET status='done', resolved_id=$1,
                resolution='Entry already existed when the pipeline researched it', updated_at=now()
                WHERE id = ANY($2::bigint[]) AND status='pending'`, [job.target, gaps]);
        }
        if (job.stage === 'submit' && value.status === 'approved' && gaps.length) {
            await client.query(`UPDATE commulingo_curation_gaps SET status='done', resolved_id=$1,
                resolution='Approved through durable pipeline', updated_at=now()
                WHERE id = ANY($2::bigint[]) AND status='pending'`, [job.target, gaps]);
        }
    });
}

// Accepted discovery candidates become create jobs, prioritized by how many
// materials mention them; the material is marked processed. A requested entry
// (gap) the model declined stays visible as skipped, never as a pending
// request nothing will pick up again.
async function finishDiscovery(client, job, value) {
    const payload = job.payload || {};
    const materialId = payload.material_id;
    for (const candidate of value.candidates || []) {
        const next = { candidate, material_id: materialId, ...(payload.workflow ? { workflow: payload.workflow } : {}),
            ...(materialId.startsWith('gap:') ? { gap_id: Number(materialId.split(':')[1]) } : {}) };
        await client.query(`INSERT INTO commulingo_pipeline_mentions(kind,target,material_id,mention) VALUES ($1,$2,$3,$4)
            ON CONFLICT(kind,target,material_id) DO UPDATE SET mention=EXCLUDED.mention`,
        [candidate.kind, candidate.target, materialId, candidate.mention]);
        const mentions = (await client.query('SELECT count(*)::int AS n FROM commulingo_pipeline_mentions WHERE kind=$1 AND target=$2',
            [candidate.kind, candidate.target])).rows[0].n;
        await client.query(`INSERT INTO commulingo_pipeline_jobs (kind,action,target,topic,reason,priority,payload)
            VALUES ($1,'create',$2,'basics',$3,$4,$5::jsonb)
            ON CONFLICT (kind,target,topic) WHERE status IN ${ACTIVE}
            DO UPDATE SET priority=LEAST(commulingo_pipeline_jobs.priority, EXCLUDED.priority)`,
        [candidate.kind, candidate.target, candidate.reason, 50 - Math.min(10, mentions), JSON.stringify(next)]);
    }
    await client.query(`INSERT INTO commulingo_pipeline_materials(material_id,content_hash) VALUES ($1,$2)
        ON CONFLICT(material_id) DO UPDATE SET content_hash=EXCLUDED.content_hash, processed_at=now()`,
    [materialId, payload.content_hash]);
    if (materialId.startsWith('gap:') && !(value.candidates || []).length) {
        await client.query(`UPDATE commulingo_curation_gaps SET status='skipped', resolution=$1, updated_at=now()
            WHERE id=$2 AND status='pending'`,
        [`Pipeline discovery declined: ${value.skip_reason || 'no reason recorded'}`, Number(materialId.split(':')[1])]);
    }
}

// Drops a parked worker handle: the stage starts over on the next claim.
async function defer(job, error, { seconds = 3600, escalate = false, failed = true } = {}) {
    await tx(client => fenced(client, `UPDATE commulingo_pipeline_jobs SET status=$3, available_at=now() + $4 * interval '1 second',
            last_error=$5, attempts=GREATEST(0, attempts - $6), lease_token=NULL, lease_until=NULL, updated_at=now(),
            payload = payload - 'waiting' WHERE ${FENCE} RETURNING id`,
    [job.id, job.lease_token, escalate ? 'escalated' : 'deferred', seconds, String(error?.message || error).slice(0, 2000), failed ? 0 : 1], job));
}

// A stage handed its model work to the leninbot worker: keep the task handle on
// the job and look again later, without counting the wait as a failed attempt.
async function park(job, waiting, seconds) {
    await tx(client => fenced(client, `UPDATE commulingo_pipeline_jobs SET status='deferred', available_at=now() + $3 * interval '1 second',
            last_error=$4, attempts=GREATEST(0, attempts - 1), payload = payload || $5::jsonb,
            lease_token=NULL, lease_until=NULL, updated_at=now() WHERE ${FENCE} RETURNING id`,
    [job.id, job.lease_token, seconds, `waiting for worker task ${waiting.taskId}`, JSON.stringify({ waiting })], job));
}

// Session checkpoints a worker task returned (editor_checkpoint, fetch_failures).
async function saveArtifacts(jobId, artifacts) {
    for (const { stage, value } of artifacts) {
        await db.query('INSERT INTO commulingo_pipeline_artifacts(job_id,stage,value) VALUES ($1,$2,$3::jsonb)', [jobId, stage, JSON.stringify(value)]);
    }
}

async function startAttempt(job) {
    const id = randomUUID();
    await db.query('INSERT INTO commulingo_pipeline_attempts(id,job_id,stage) VALUES ($1,$2,$3)', [id, job.id, job.stage]);
    return id;
}

async function finishAttempt(id, { outcome, nextStage = null, error = '', durationSeconds, metrics = {} }) {
    await db.query(`UPDATE commulingo_pipeline_attempts SET finished_at=now(), duration_seconds=$2, outcome=$3, next_stage=$4,
            error=$5, metrics=$6::jsonb WHERE id=$1`,
    [id, durationSeconds, outcome, nextStage, String(error).slice(0, 2000), JSON.stringify(metrics)]);
}

async function linkAttemptBudget(attempt, reservation) {
    await db.query('UPDATE commulingo_pipeline_attempts SET budget_id=$2 WHERE id=$1', [attempt, reservation]);
}

async function reserve(amount, { lane, jobId = null, cap, reviewFraction }) {
    if (!(amount > 0) || !(cap > 0)) throw new Error('positive finite reservation and cap required');
    if (!(reviewFraction >= 0 && reviewFraction <= 1)) throw new Error('invalid review fraction');
    const token = randomUUID();
    await tx(async client => {
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-pipeline-budget'))");
        const spent = (await client.query(`SELECT COALESCE(sum(COALESCE(actual,reserved)),0)::float8 AS total,
                COALESCE(sum(COALESCE(actual,reserved)) FILTER (WHERE lane!='review'),0)::float8 AS author
            FROM commulingo_pipeline_budget WHERE day=${BUDGET_DAY_SQL}`)).rows[0];
        if (spent.total + amount > cap || (lane !== 'review' && spent.author + amount > cap * (1 - reviewFraction))) {
            throw new BudgetUnavailable('daily budget reserved or spent');
        }
        await client.query(`INSERT INTO commulingo_pipeline_budget(id,day,lane,job_id,reserved) VALUES ($1,${BUDGET_DAY_SQL},$2,$3,$4)`,
            [token, lane, jobId, amount]);
    });
    return token;
}

async function settle(token, actual) {
    if (!(actual >= 0)) throw new Error('nonnegative finite cost required');
    const { rows } = await db.query('UPDATE commulingo_pipeline_budget SET actual=$2, settled_at=now() WHERE id=$1 AND actual IS NULL RETURNING id', [token, actual]);
    if (!rows.length) {
        const row = (await db.query('SELECT actual::float8 AS actual FROM commulingo_pipeline_budget WHERE id=$1', [token])).rows[0];
        if (!row || Math.abs(row.actual - actual) > 1e-9) throw new Error('unknown reservation or conflicting settlement');
    }
}

// Reconsider only known budget waits, never error or evidence holds.
async function releaseBudgetWaits({ cap, amount, reviewFraction }) {
    return tx(async client => {
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-pipeline-budget'))");
        const { rows } = await client.query(`WITH spent AS (
                SELECT coalesce(sum(coalesce(actual,reserved)),0) AS total,
                    coalesce(sum(coalesce(actual,reserved)) FILTER (WHERE lane!='review'),0) AS author
                FROM commulingo_pipeline_budget WHERE day=${BUDGET_DAY_SQL})
            UPDATE commulingo_pipeline_jobs SET status='ready', available_at=now(), last_error='', updated_at=now()
            FROM spent WHERE status='deferred' AND last_error='daily budget reserved or spent'
              AND (stage IN ('validate','judge','submit')
                   OR (spent.total+$1<=$2 AND (stage='review' OR spent.author+$1<=$2*(1-$3))))
            RETURNING id`, [amount, cap, reviewFraction]);
        return rows.length;
    });
}

async function releasePublicationWaits() {
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs SET status='ready', available_at=now(), last_error='', updated_at=now()
        WHERE status='deferred' AND stage='submit' AND last_error='canary publication slots exhausted'`);
    return rowCount;
}

async function publicationSlot(job, limit) {
    await tx(async client => {
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-pipeline-publication'))");
        const slot = (await client.query(`SELECT day=${BUDGET_DAY_SQL} AS current_day FROM commulingo_pipeline_publications WHERE job_id=$1`, [job.id])).rows[0];
        if (slot && slot.current_day) return;
        const used = (await client.query(`SELECT count(*)::int AS n FROM commulingo_pipeline_publications
            WHERE day=${BUDGET_DAY_SQL} AND kind=$1 AND action=$2`, [job.kind, job.action])).rows[0].n;
        if (used >= limit) throw new BudgetUnavailable('canary publication slots exhausted');
        await client.query(`INSERT INTO commulingo_pipeline_publications(job_id,day,kind,action) VALUES ($1,${BUDGET_DAY_SQL},$2,$3)
            ON CONFLICT(job_id) DO UPDATE SET day=EXCLUDED.day`, [job.id, job.kind, job.action]);
    });
}

const UNTOUCHED = `NOT EXISTS (SELECT 1 FROM commulingo_pipeline_artifacts a WHERE a.job_id=j.id)`;

// Refresh untouched person enrichment priorities from current event links.
async function reprioritizePeople() {
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs j SET priority=x.priority, updated_at=now()
        FROM (SELECT p.id, 100 - LEAST(${personEvents('p.id')}, 79) AS priority FROM commulingo_people p) x
        WHERE j.kind='person' AND j.action='update' AND j.topic='enrichment' AND j.status='ready' AND j.priority>=20
          AND ${UNTOUCHED} AND j.target=x.id AND j.priority!=x.priority`);
    return rowCount;
}

// Untouched enrichment bundles for recently edited people wait out their grace window.
async function retirePeopleInGrace() {
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs j SET status='cancelled', updated_at=now(),
            last_error='re-enrichment grace after an applied edit'
        WHERE j.kind='person' AND j.action='update' AND j.topic='enrichment' AND j.status='ready' AND j.stage='research'
          AND j.priority>=20 AND COALESCE(j.payload->'topics','[]'::jsonb) <> '["sections"]'::jsonb
          AND ${UNTOUCHED} AND ${personInGrace('j.target')}`);
    return rowCount;
}

async function reprioritizeTerms(mentions) {
    const ids = Object.keys(mentions || {});
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs j SET priority=x.priority, updated_at=now()
        FROM (SELECT t.id, (CASE WHEN t.body_ko='' OR t.body_en='' THEN 21 ELSE 51 END)
                     + GREATEST(0, 29 - LEAST(COALESCE(m.mentions,0), 29)) AS priority
              FROM commulingo_terms t LEFT JOIN unnest($1::text[], $2::int[]) AS m(id, mentions) ON m.id=t.id) x
        WHERE j.kind='term' AND j.action='update' AND j.topic='enrichment' AND j.status='ready' AND j.stage='research'
          AND j.priority>=20 AND ${UNTOUCHED} AND j.target=x.id AND j.priority!=x.priority`,
    [ids, ids.map(id => Number(mentions[id]) || 0)]);
    return rowCount;
}

async function cancelDiscovery() {
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs SET status='cancelled', updated_at=now(),
            last_error='discovery disabled in data/commulingo/pipeline-config.json'
        WHERE stage='discover' AND status IN ('ready','deferred','escalated') AND payload->>'material_id' NOT LIKE 'gap:%'`);
    return rowCount;
}

// Merge only untouched update jobs into one bundle per target; keep every old row.
async function consolidate({ apply = false } = {}) {
    return tx(async client => {
        if (apply) {
            await client.query("SET LOCAL lock_timeout='5s'");
            await client.query('LOCK TABLE commulingo_pipeline_jobs IN SHARE ROW EXCLUSIVE MODE');
        }
        const touched = id => `(EXISTS (SELECT 1 FROM commulingo_pipeline_artifacts a WHERE a.job_id=${id})
            OR EXISTS (SELECT 1 FROM commulingo_pipeline_job_sources s WHERE s.job_id=${id})
            OR EXISTS (SELECT 1 FROM commulingo_pipeline_budget b WHERE b.job_id=${id}))`;
        const { rows } = await client.query(`SELECT j.* FROM commulingo_pipeline_jobs j
            WHERE j.action='update' AND j.status='ready' AND j.stage='research' AND j.attempts=0 AND j.topic!='enrichment'
              AND NOT (j.payload ? 'replaces_suggestion_id') AND NOT ${touched('j.id')}
              AND NOT EXISTS (SELECT 1 FROM commulingo_pipeline_jobs other
                WHERE other.kind=j.kind AND other.target=j.target AND other.id!=j.id AND other.status IN ${ACTIVE}
                  AND (other.action!='update' OR other.topic='enrichment' OR other.payload ? 'replaces_suggestion_id'
                    OR other.status!='ready' OR other.stage!='research' OR other.attempts!=0 OR ${touched('other.id')}))
            ORDER BY j.priority, j.id`);
        const groups = new Map();
        for (const row of rows) {
            const key = `${row.kind}\u0000${row.target}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(row);
        }
        const bundles = bundleCandidates(rows);
        if (apply) {
            for (const bundle of bundles) {
                const members = groups.get(`${bundle.kind}\u0000${bundle.target}`);
                const [parent, ...children] = members.map(row => row.id);
                await client.query(`UPDATE commulingo_pipeline_jobs SET topic='enrichment', payload=$2::jsonb, baseline=$3, reason=$4,
                    updated_at=now() WHERE id=$1`, [parent, JSON.stringify({ ...bundle.payload, bundled_job_ids: members.map(row => row.id) }),
                    bundle.baseline, bundle.reason]);
                if (children.length) {
                    await client.query(`UPDATE commulingo_pipeline_jobs SET status='cancelled', payload=payload || $2::jsonb,
                        last_error='Consolidated into target bundle', updated_at=now() WHERE id = ANY($1::bigint[])`,
                    [children, JSON.stringify({ bundled_into: parent })]);
                }
            }
        }
        return { applied: apply, jobs_before: rows.length, bundles: bundles.length, merged_jobs: rows.length - bundles.length };
    });
}

// Escalated jobs whose review suggestion was decided in the Admin queue move on.
async function reconcileReviews() {
    return tx(async client => {
        const { rows } = await client.query(`SELECT j.*, s.status AS review_status FROM commulingo_pipeline_jobs j
            JOIN LATERAL (SELECT id, value FROM commulingo_pipeline_artifacts WHERE job_id=j.id AND stage='review' ORDER BY id DESC LIMIT 1) a ON true
            JOIN commulingo_agent_suggestions s ON s.id=(a.value->>'suggestionId')::bigint
            WHERE j.status='escalated' AND s.status IN ('approved','rejected')
              AND NOT EXISTS (SELECT 1 FROM commulingo_pipeline_artifacts newer WHERE newer.job_id=j.id AND newer.id>a.id
                  AND newer.value ? 'remaining_topics')
            FOR UPDATE OF j`);
        for (const row of rows) {
            const value = row.review_status === 'approved' ? advance(row, { status: row.review_status }) : {};
            const remaining = value.remaining_topics;
            await client.query(`UPDATE commulingo_pipeline_jobs SET status=$2, stage=$3, payload=payload || $4::jsonb,
                available_at=now(), updated_at=now() WHERE id=$1`,
            [row.id, remaining ? 'ready' : 'complete', remaining ? 'research' : 'complete', JSON.stringify(remaining ? { remaining_topics: remaining } : {})]);
            if (remaining) {
                await client.query("INSERT INTO commulingo_pipeline_artifacts(job_id,stage,value) VALUES ($1,'handoff',$2::jsonb)", [row.id, JSON.stringify(value)]);
            }
            const gaps = gapIds(row.payload || {});
            if (row.review_status === 'approved' && gaps.length) {
                await client.query(`UPDATE commulingo_curation_gaps SET status='done', resolved_id=$1, resolution='Approved after pipeline handoff',
                    updated_at=now() WHERE id = ANY($2::bigint[]) AND status='pending'`, [row.target, gaps]);
            }
        }
        return rows.length;
    });
}

async function detail(jobId) {
    const job = (await db.query('SELECT * FROM commulingo_pipeline_jobs WHERE id=$1', [jobId])).rows[0];
    if (!job) return null;
    const artifacts = (await db.query('SELECT stage, value, metrics, created_at FROM commulingo_pipeline_artifacts WHERE job_id=$1 ORDER BY id', [jobId])).rows;
    return { job, artifacts };
}

async function listJobs(limit = 50) {
    return (await db.query(`SELECT id, kind, action, target, topic, stage, status, priority, attempts, available_at, last_error
        FROM commulingo_pipeline_jobs WHERE status IN ${ACTIVE} ORDER BY priority, created_at, id LIMIT $1`, [limit])).rows;
}

async function retry(jobId) {
    const { rowCount } = await db.query(`UPDATE commulingo_pipeline_jobs SET status='ready',
        stage=CASE WHEN stage='complete' AND payload->>'workflow'='editor' THEN 'research' ELSE stage END,
        available_at=now(), attempts=0, last_error='', updated_at=now(), payload = payload - 'waiting'
        WHERE id=$1 AND status IN ('deferred','escalated')`, [jobId]);
    return rowCount;
}

async function costs() {
    return (await db.query(`SELECT day, lane, count(*)::int AS reservations, sum(reserved)::float8 AS reserved,
            sum(actual)::float8 AS actual, count(*) FILTER (WHERE actual IS NULL)::int AS unsettled
        FROM commulingo_pipeline_budget WHERE day >= ${BUDGET_DAY_SQL} - 7 GROUP BY day, lane ORDER BY day DESC, lane`)).rows;
}

module.exports = {
    LostLease, BudgetUnavailable, BUDGET_DAY_SQL, ACTIVE, SECTION_CAP, personEvents, personInGrace, termInGrace, termBodyEnough,
    eventTitleMatch, termPriority, tx, enqueue, claim, finishStage, defer, park, startAttempt, finishAttempt, linkAttemptBudget, saveArtifacts,
    reserve, settle, releaseBudgetWaits, releasePublicationWaits, publicationSlot, reprioritizePeople, retirePeopleInGrace,
    reprioritizeTerms, cancelDiscovery, consolidate, reconcileReviews, detail, listJobs, retry, costs,
};
