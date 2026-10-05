#!/usr/bin/env node
// CommuLingo pipeline without a DB: bundling rules and the engine's stage
// transitions (local stage, worker hand-off, parked collection, budget and
// worker outages) against a stubbed store and worker.
const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.join(__dirname, '..');
function stub(relative, exports) {
    const file = path.join(root, relative);
    require.cache[file] = { id: file, filename: file, loaded: true, exports };
}

const { bundleCandidates, advance, workTopics, gapIds } = require('../services/commulingo-pipeline/bundles');

// Bundling: update commissions per target merge, keep topics, gaps and the first baseline.
const bundled = bundleCandidates([
    { kind: 'person', action: 'update', target: 'a', topic: 'bio', priority: 40, reason: 'r1', baseline: '', payload: {} },
    { kind: 'person', action: 'update', target: 'a', topic: 'basics', priority: 30, reason: 'r2', baseline: 'b1', payload: { gap_id: 7 } },
    { kind: 'person', action: 'create', target: 'n', topic: 'basics', priority: 10, reason: 'gap', baseline: '', payload: {} },
]);
assert.equal(bundled.length, 2);
const person = bundled.find(row => row.target === 'a');
assert.equal(person.topic, 'enrichment');
assert.deepEqual(person.payload.topics, ['basics', 'bio']);
assert.deepEqual(person.payload.gap_ids, [7]);
assert.equal(person.baseline, 'b1');
assert.equal(person.priority, 30);
assert.deepEqual(workTopics({ kind: 'person', topic: 'enrichment', payload: { topics: ['bio', 'sections'] } }), ['bio']);
assert.deepEqual(advance({ kind: 'person', topic: 'enrichment', payload: { topics: ['bio', 'sections'] } }, { status: 'approved' }),
    { status: 'approved', remaining_topics: ['sections'] });
assert.deepEqual(gapIds({ gap_ids: [1, 2], gap_id: 2 }), [1, 2]);

// Engine against stubs.
class LostLease extends Error {}
class BudgetUnavailable extends Error {}
class WorkerUnavailable extends Error {}
class WorkerRejected extends Error {}
const calls = [];
const state = { queue: [], budgetOk: true, task: null, workerDown: false };
stub('services/commulingo-pipeline/store.js', {
    LostLease, BudgetUnavailable,
    claim: async () => state.queue.shift() || null,
    detail: async () => ({ artifacts: [] }),
    startAttempt: async () => 'attempt-1',
    finishAttempt: async (_id, value) => calls.push(['attempt', value.outcome]),
    linkAttemptBudget: async () => {},
    reserve: async () => {
        if (!state.budgetOk) throw new BudgetUnavailable('daily budget reserved or spent');
        return 'res-1';
    },
    settle: async (token, cost) => calls.push(['settle', token, cost]),
    park: async (job, waiting, seconds) => calls.push(['park', job.id, waiting.taskId, seconds]),
    defer: async (job, error, options) => calls.push(['defer', job.id, String(error.message || error), options]),
    finishStage: async (job, value, options) => calls.push(['finish', job.id, value, options]),
});
stub('services/commulingo-pipeline/worker-client.js', {
    WorkerUnavailable, WorkerRejected,
    submit: async (key, request) => {
        calls.push(['submit', key, request.budgetUsd, request.instructions]);
        return { taskId: '42', status: 'queued' };
    },
    get: async () => {
        if (state.workerDown) throw new WorkerUnavailable('worker unreachable');
        return state.task;
    },
    cancel: async () => {},
});
const { Engine } = require('../services/commulingo-pipeline/engine');
const config = { phase: 'live', stage_budget_usd: 0.2, daily_cap_usd: 4, review_fraction: 0.3 };
const stages = {
    validate: { run: async job => ({ value: { ok: job.id }, nextStage: 'review' }) },
    research: {
        request: async job => (job.target === 'skip' ? { value: { reason: 'nothing to do' }, nextStage: 'complete', status: 'complete' }
            : { lane: 'person', request: { instructions: `research ${job.target}` } }),
        complete: async (job, _artifacts, task) => ({ value: { found: task.result.value }, nextStage: 'draft' }),
    },
};
const engine = new Engine(stages, config);
const job = (id, stage, extra = {}) => ({ id, stage, kind: 'person', action: 'update', target: 't', attempts: 1, payload: {}, ...extra });

(async () => {
    const reset = () => calls.splice(0);

    state.queue = [job(1, 'validate')];
    let result = await engine.runOne();
    assert.equal(result.status, 'ready');
    assert.deepEqual(calls[0], ['finish', 1, { ok: 1 }, { nextStage: 'review', status: 'ready', usage: {}, delaySeconds: 0 }]);
    reset();

    // A worker stage reserves, submits with an idempotency key and parks.
    state.queue = [job(2, 'research')];
    result = await engine.runOne();
    assert.equal(result.status, 'submitted');
    assert.deepEqual(calls.slice(0, 2), [['submit', 'commulingo-pipeline:2:research:attempt-1', 0.2, 'research t'], ['park', 2, '42', 45]]);
    reset();

    // Preflight result without the model: no reservation, no submit.
    state.queue = [job(3, 'research', { target: 'skip' })];
    result = await engine.runOne();
    assert.equal(result.status, 'complete');
    assert.equal(calls[0][0], 'finish');
    reset();

    const parked = () => job(4, 'research', { payload: { waiting: { taskId: '42', stage: 'research', reservation: 'res-9', submittedAt: new Date().toISOString() } } });
    state.task = { status: 'running' };
    state.queue = [parked()];
    assert.equal((await engine.runOne()).status, 'waiting');
    assert.deepEqual(calls[0], ['park', 4, '42', 45]);
    reset();

    // Finished task: settle with its cost, then complete the stage.
    state.task = { status: 'done', result: { value: { year: 1903 } }, usage: { costUsd: 0.013, modelCalls: 1 }, rejections: [] };
    state.queue = [parked()];
    result = await engine.runOne();
    assert.equal(result.status, 'ready');
    assert.deepEqual(calls[0], ['settle', 'res-9', 0.013]);
    assert.deepEqual(calls[1][2], { found: { year: 1903 } });
    assert.equal(calls[1][3].usage.total_cost, 0.013);
    reset();

    // A failed task still settles what it spent, and the job is deferred (handle dropped by defer).
    state.task = { status: 'failed', error: 'no accepted result', usage: { costUsd: 0.02 } };
    state.queue = [parked()];
    assert.equal((await engine.runOne()).status, 'error');
    assert.deepEqual(calls[0], ['settle', 'res-9', 0.02]);
    assert.equal(calls[1][0], 'defer');
    reset();

    // Worker unreachable while parked: keep the handle and wait longer.
    state.workerDown = true;
    state.queue = [parked()];
    assert.equal((await engine.runOne()).status, 'worker_unavailable');
    assert.deepEqual(calls[0], ['park', 4, '42', 300]);
    state.workerDown = false;
    reset();

    // Budget spent: defer without counting a failure; the batch then sticks to free stages.
    state.budgetOk = false;
    state.queue = [job(5, 'research'), job(6, 'validate')];
    const results = await engine.runBatch({ limit: 3 });
    assert.deepEqual(results.map(r => r.status), ['budget_deferred', 'ready', 'idle']);
    assert.deepEqual(calls[0], ['defer', 5, 'daily budget reserved or spent', { seconds: 3600, failed: false }]);
    reset();

    // Unported stage and draft phase.
    state.queue = [job(7, 'judge')];
    assert.equal((await engine.runOne()).status, 'unported');
    state.queue = [job(8, 'submit')];
    assert.equal((await new Engine(stages, { ...config, phase: 'draft' }).runOne()).status, 'draft_ready');

    console.log('commulingo pipeline ok');
})().catch(err => {
    console.error(err);
    process.exit(1);
});
