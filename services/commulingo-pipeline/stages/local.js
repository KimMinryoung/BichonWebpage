// Stages that run in the frontend without a model: record the judgement,
// validate the draft, publish the approved patch (ported from leninbot
// commulingo/pipeline/stages.py judge and workflow.py validate/publish).
const db = require('../../../config/database');
const { execute } = require('../../../data/commulingo/editorial-pipeline-service');
const { patchHash } = require('../../../data/commulingo/editorial-patch');
const store = require('../store');
const { advance, workTopics } = require('../bundles');
const { latest, writeRequest, reviewNoteChecks, isRevisionConflict, isRejection } = require('./shared');

const REPLACED_NOTE_PREFIX = 'Replaced by independently approved patch ';
const result = (value, nextStage, status = 'ready', delaySeconds = 0) => ({ value, nextStage, status, delaySeconds });

const judge = {
    async run(job, artifacts) {
        const research = latest(artifacts, 'research');
        const payload = job.payload || {};
        if (payload.replaces_suggestion_id) {
            return result({ research, hold_reason: 'correction research produced no supported edit' }, 'complete', 'escalated');
        }
        if (research.current) {
            try {
                for (const topic of workTopics(job)) {
                    const suffix = payload.topics ? `:${topic}` : '';
                    await execute({ command: 'enrichment', target: job.kind, id: job.target, topic, status: research.status,
                        reason: research.reason, sources: research.inspected_sources, expectedRevision: research.baseline,
                        idempotencyKey: `pipeline:${job.id}:${artifacts.length}:enrichment${suffix}` });
                }
            } catch (err) {
                if (isRevisionConflict(err)) return result({ reason: err.message }, 'research');
                throw err;
            }
        }
        if (research.status === 'sources_unavailable') return result({ status: research.status }, 'research', 'deferred', 90 * 86400);
        if (job.action === 'create' && research.status === 'complete' && !research.current) {
            return result({ research, hold_reason: 'create judged complete but the entry does not exist' }, 'complete', 'escalated');
        }
        const value = advance(job, { status: research.status });
        return value.remaining_topics ? result(value, 'research') : result(value, 'complete', 'complete');
    },
};

// Compatibility resume for queued drafts; schema failures return to the editor.
const validate = {
    async run(job, artifacts) {
        const draft = latest(artifacts, 'draft');
        try {
            return result(await execute({ command: 'validate', ...writeRequest(job, draft) }), 'review');
        } catch (err) {
            if (!isRejection(err)) throw err;
            return result({ error: err.message }, isRevisionConflict(err) ? 'research' : 'draft');
        }
    },
};

const submit = {
    async run(job, artifacts, config) {
        if (config.phase === 'draft') throw new Error('publication disabled during draft evaluation');
        const draft = latest(artifacts, 'draft');
        const decision = latest(artifacts, 'review');
        const request = writeRequest(job, draft);
        const digest = patchHash(request);
        if (decision.decision !== 'approve' || decision.approved_patch_hash !== digest) {
            return result({ reason: 'independent approval does not bind this exact patch' }, 'review');
        }
        const replaced = (job.payload || {}).replaces_suggestion_id;
        if (replaced) {
            // An original someone already decided by hand is no longer ours to
            // replace; one this job's own earlier publish replaced replays its receipt.
            const original = (await db.query('SELECT status, review_note FROM commulingo_agent_suggestions WHERE id=$1', [replaced])).rows[0];
            const ours = original && original.status === 'rejected' && (original.review_note || '') === REPLACED_NOTE_PREFIX + digest;
            if (!original || (original.status !== 'pending' && !ours)) {
                return result({ reason: 'original proposal no longer eligible for replacement' }, 'complete', 'complete');
            }
        }
        if (config.phase === 'canary') await store.publicationSlot(job, config.canary_per_group_per_day);
        const issues = draft.issue_results || [];
        const deferred = issues.filter(issue => issue.status === 'deferred');
        let notes = draft.notes || '';
        if (deferred.length) notes = `${notes}\nDeferred issues:\n${deferred.map(i => `${i.id}: ${i.reason}`).join('\n')}`.trim().slice(0, 4000);
        const publish = { ...request, command: 'publish', approvedPatchHash: digest,
            review: { decision: 'approve', reason: decision.reason, checks: reviewNoteChecks(decision.checks) },
            notes, jobRef: `job ${job.id}`, idempotencyKey: `pipeline:${job.id}:publish:${digest}`,
            ...(replaced ? { replacesSuggestionId: replaced } : {}) };
        let receipt;
        try {
            receipt = await execute(publish);
        } catch (err) {
            if (isRevisionConflict(err)) return result({ error: err.message }, 'research');
            throw err;
        }
        if (receipt.status !== 'approved') throw new Error('atomic publication returned no approved receipt');
        const value = advance(job, { ...receipt, patch_hash: digest,
            resolved_issues: issues.filter(i => i.status === 'resolved').map(i => i.id), deferred_issues: deferred });
        return value.remaining_topics ? result(value, 'research') : result(value, 'complete', 'complete');
    },
};

module.exports = { judge, validate, submit, REPLACED_NOTE_PREFIX };
