// Stage orchestration (ported from leninbot commulingo/pipeline/engine.py).
//
// A stage is either local, `run(job, artifacts) -> Result`, or a worker stage:
// `request(job, artifacts) -> {lane, request} | Result` hands model work to the
// leninbot worker, the job is parked with the task handle, and a later claim
// calls `complete(job, artifacts, task) -> Result` once the task is finished.
// Result = {value, nextStage, status = 'ready', delaySeconds = 0}.
const store = require('./store');
const worker = require('./worker-client');

const WAIT_SECONDS = 45;
const WORKER_TIMEOUT_MS = 60 * 60 * 1000;
const UNPORTED_DELAY = 24 * 3600;

function isResult(value) {
    return value && typeof value === 'object' && 'value' in value && 'nextStage' in value;
}

function disposition(stage, result) {
    if (stage === 'submit' && result.value.status === 'approved') return 'published';
    if (stage === 'judge' && result.status === 'complete') return 'no_edit';
    if (result.status === 'escalated') return 'held';
    if (result.status === 'deferred') return 'deferred';
    return 'progress';
}

class Engine {
    constructor(stages, config) {
        this.stages = stages;
        this.config = config;
    }

    async runBatch({ limit = 12, jobId = null } = {}) {
        const results = [];
        let stages = null;
        for (let i = 0; i < limit; i++) {
            const result = await this.runOne({ jobId, stages });
            results.push(result);
            if (result.status === 'budget_deferred' && jobId === null) {
                // Budget is spent: only finish work that costs nothing more.
                stages = ['validate', 'judge', ...(this.config.phase === 'draft' ? [] : ['submit'])];
                continue;
            }
            if (['idle', 'lease_lost'].includes(result.status) || (jobId !== null && result.status !== 'ready')) break;
        }
        return results;
    }

    async runOne({ jobId = null, stages = null } = {}) {
        const job = await store.claim({ jobId, stages });
        if (!job) return { status: 'idle' };
        if (this.config.phase === 'draft' && ['submit', 'review'].includes(job.stage)) {
            await store.defer(job, 'draft-only execution', { seconds: 3600, failed: false });
            return { status: 'draft_ready', job_id: job.id };
        }
        const stage = this.stages[job.stage];
        if (!stage) {
            await store.defer(job, `stage ${job.stage} is not ported to the frontend pipeline yet`, { seconds: UNPORTED_DELAY, failed: false });
            return { status: 'unported', job_id: job.id, stage: job.stage };
        }
        const started = Date.now();
        const attempt = await store.startAttempt(job);
        let outcome = 'error', nextStage = null, error = '';
        const metrics = {};
        try {
            const { artifacts } = await store.detail(job.id);
            const waiting = (job.payload || {}).waiting;
            let result;
            if (waiting && waiting.stage === job.stage) {
                result = await this.collect(job, artifacts, stage, waiting, metrics);
                if (!result) {
                    outcome = 'waiting';
                    return { status: 'waiting', job_id: job.id, task: waiting.taskId };
                }
            } else if (stage.request) {
                const prepared = await stage.request(job, artifacts, this.config);
                if (isResult(prepared)) {
                    result = prepared;
                    metrics.preflight_no_model = true;
                } else {
                    const reservation = await store.reserve(this.config.stage_budget_usd, {
                        lane: job.stage === 'review' ? 'review' : job.kind, jobId: job.id,
                        cap: this.config.daily_cap_usd, reviewFraction: this.config.review_fraction });
                    await store.linkAttemptBudget(attempt, reservation);
                    let task;
                    try {
                        task = await worker.submit(`commulingo-pipeline:${job.id}:${job.stage}:${attempt}`,
                            { budgetUsd: this.config.stage_budget_usd, ...prepared.request });
                    } catch (err) {
                        await store.settle(reservation, 0);
                        throw err;
                    }
                    await store.park(job, { taskId: task.taskId, stage: job.stage, reservation, submittedAt: new Date().toISOString() }, WAIT_SECONDS);
                    outcome = 'submitted';
                    metrics.worker_task = task.taskId;
                    return { status: 'submitted', job_id: job.id, stage: job.stage, task: task.taskId };
                }
            } else {
                result = await stage.run(job, artifacts, this.config);
            }
            await store.finishStage(job, result.value, { nextStage: result.nextStage, status: result.status || 'ready',
                usage: metrics, delaySeconds: result.delaySeconds || 0 });
            outcome = result.status || 'ready';
            nextStage = result.nextStage;
            error = result.value.error || result.value.preflight_error || '';
            return { status: outcome, stage: nextStage, job_id: job.id, completed_stage: job.stage,
                disposition: disposition(job.stage, result), cost_usd: metrics.total_cost || 0 };
        } catch (err) {
            error = err.message;
            if (err instanceof store.LostLease) {
                outcome = 'lease_lost';
                return { status: 'lease_lost', job_id: job.id };
            }
            if (err instanceof store.BudgetUnavailable) {
                outcome = 'budget_deferred';
                await store.defer(job, err.message, { seconds: 3600, failed: false }).catch(() => {});
                return { status: 'budget_deferred', disposition: 'budget_wait', job_id: job.id, reason: err.message, blocked_stage: job.stage };
            }
            if (err instanceof worker.WorkerUnavailable) {
                // The worker being down is not the job's fault; a parked task keeps its handle.
                const waiting = (job.payload || {}).waiting;
                await (waiting ? store.park(job, waiting, 300) : store.defer(job, err.message, { seconds: 600, failed: false })).catch(() => {});
                return { status: 'worker_unavailable', job_id: job.id, error: err.message };
            }
            console.error(`[pipeline] job ${job.id} ${job.stage} failed:`, err);
            await store.defer(job, err, { escalate: job.attempts >= 3 }).catch(() => {});
            return { status: 'error', disposition: 'failed', job_id: job.id, error: err.message };
        } finally {
            await store.finishAttempt(attempt, { outcome, nextStage, error, durationSeconds: (Date.now() - started) / 1000, metrics })
                .catch(err => console.error('[pipeline] attempt record failed:', err.message));
        }
    }

    // A parked worker stage: still running -> park again; finished -> settle the
    // reservation with the reported cost and let the stage turn it into a Result.
    async collect(job, artifacts, stage, waiting, metrics) {
        const task = await worker.get(waiting.taskId);
        if (['queued', 'running'].includes(task.status)) {
            if (Date.now() - Date.parse(waiting.submittedAt) > WORKER_TIMEOUT_MS) {
                await worker.cancel(waiting.taskId).catch(() => {});
                throw new Error(`worker task ${waiting.taskId} exceeded ${WORKER_TIMEOUT_MS / 60000} minutes`);
            }
            await store.park(job, waiting, WAIT_SECONDS);
            return null;
        }
        const cost = Number(task.usage?.costUsd) || 0;
        await store.settle(waiting.reservation, cost);
        Object.assign(metrics, { worker_task: waiting.taskId, total_cost: cost, model_calls: task.usage?.modelCalls,
            provider_fallback: task.usage?.providerFallback, rejections: (task.rejections || []).slice(-12) });
        if (task.status !== 'done') throw new Error(`worker task ${waiting.taskId} ${task.status}: ${task.error || 'no result'}`);
        return stage.complete(job, artifacts, task, this.config);
    }
}

module.exports = { Engine, disposition, isResult };
