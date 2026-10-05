// One pipeline tick: queue maintenance and planning every few ticks, then a
// bounded batch of stages. Only one tick runs at a time across containers
// (the deploy standby and the primary overlap briefly): a session advisory
// lock on a dedicated connection.
const db = require('../../config/database');
const config = require('./config');
const store = require('./store');
const planner = require('./planner');
const { Engine } = require('./engine');

let ticks = 0;

async function maintain(settings) {
    const report = {};
    report.reviews = await store.reconcileReviews();
    if (settings.phase === 'live') report.publication_waits = await store.releasePublicationWaits();
    report.budget_waits = await store.releaseBudgetWaits({ cap: settings.daily_cap_usd, amount: settings.stage_budget_usd,
        reviewFraction: settings.review_fraction });
    report.consolidated = (await store.consolidate({ apply: true })).merged_jobs;
    const plan = await planner.plan(settings, { apply: true });
    report.commissions = plan.commissions.length;
    report.materials = plan.materials.length;
    return report;
}

async function tick({ force = false, plan = null } = {}) {
    const settings = config.load();
    if (!settings.enabled && !force) return { skipped: 'disabled in data/commulingo/pipeline-config.json' };
    const client = await db.connect();
    try {
        const locked = (await client.query("SELECT pg_try_advisory_lock(hashtext('commulingo-pipeline-tick')) AS ok")).rows[0].ok;
        if (!locked) return { skipped: 'another tick is running' };
        try {
            const doPlan = plan ?? (ticks++ % settings.plan_every_ticks === 0);
            const maintenance = doPlan ? await maintain(settings) : null;
            const stages = require('./stages');
            const results = await new Engine(stages, settings).runBatch({ limit: settings.batch_limit });
            return { maintenance, results };
        } finally {
            await client.query("SELECT pg_advisory_unlock(hashtext('commulingo-pipeline-tick'))");
        }
    } finally {
        client.release();
    }
}

// In-process scheduler, started by server.js only where COMMULINGO_PIPELINE_TICK=1
// (scripts/deploy sets it on the primary container alone).
function startScheduler() {
    let running = false, timer = null;
    const schedule = () => {
        let seconds = 120;
        try { seconds = config.load().tick_seconds; } catch (err) { console.error('[pipeline] config:', err.message); }
        timer = setTimeout(run, seconds * 1000);
        timer.unref();
    };
    const run = async () => {
        if (running) return schedule();
        running = true;
        try {
            const result = await tick();
            if (!result.skipped) console.log(`[pipeline] tick ${JSON.stringify(summary(result))}`);
        } catch (err) {
            console.error('[pipeline] tick failed:', err);
        } finally {
            running = false;
            schedule();
        }
    };
    schedule();
    return { stop: () => clearTimeout(timer) };
}

function summary(result) {
    const counts = {};
    for (const r of result.results || []) counts[r.status] = (counts[r.status] || 0) + 1;
    return { maintenance: result.maintenance, results: counts };
}

module.exports = { tick, maintain, startScheduler };
