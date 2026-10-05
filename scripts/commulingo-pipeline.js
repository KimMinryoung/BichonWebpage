#!/usr/bin/env node
// CommuLingo enrichment pipeline operator commands (dev_docs/commulingo-agent-pipeline.md).
// Run inside the production container through scripts/commulingo-pipeline.
//
//   list | show <id> | retry <id> | costs
//   plan [--apply]          candidates and requested entries (read-only without --apply)
//   consolidate [--apply]   bundle untouched update jobs per target
//   tick [--force] [--plan] one tick now; --force runs even while disabled in config
//   run <id>                advance only this job by one claim (a stage, or a check on its worker task)
const { db } = require('./lib/bootstrap');
const config = require('../services/commulingo-pipeline/config');
const store = require('../services/commulingo-pipeline/store');
const planner = require('../services/commulingo-pipeline/planner');
const { tick } = require('../services/commulingo-pipeline/tick');
const { Engine } = require('../services/commulingo-pipeline/engine');

(async () => {
    const [command, arg] = process.argv.slice(2);
    const flag = name => process.argv.includes(name);
    let result;
    if (command === 'list') result = await store.listJobs(100);
    else if (command === 'show') result = await store.detail(Number(arg));
    else if (command === 'retry') result = { retried: await store.retry(Number(arg)) };
    else if (command === 'costs') result = await store.costs();
    else if (command === 'plan') result = await planner.plan(config.load(), { apply: flag('--apply') });
    else if (command === 'consolidate') result = await store.consolidate({ apply: flag('--apply') });
    else if (command === 'run') result = await new Engine(require('../services/commulingo-pipeline/stages'), config.load()).runOne({ jobId: Number(arg) });
    else if (command === 'tick') result = await tick({ force: flag('--force'), plan: flag('--plan') ? true : null });
    else {
        console.error('usage: commulingo-pipeline list|show <id>|run <id>|retry <id>|costs|plan [--apply]|consolidate [--apply]|tick [--force] [--plan]');
        process.exitCode = 2;
    }
    if (result !== undefined) console.log(JSON.stringify(result, null, 2));
})().catch(err => {
    console.error(err);
    process.exitCode = 1;
}).finally(() => db.end().catch(() => {}));
