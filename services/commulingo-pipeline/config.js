// Pipeline settings, data/commulingo/pipeline-config.json (host-mounted, so a
// change applies on the next tick). Carried over from leninbot
// config/commulingo_pipeline.json (dev_docs/commulingo-agent-pipeline.md).
const fs = require('node:fs');
const path = require('node:path');

const PATH = process.env.COMMULINGO_PIPELINE_CONFIG || path.join(__dirname, '../../data/commulingo/pipeline-config.json');

function positive(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive and finite`);
}

function load() {
    const value = JSON.parse(fs.readFileSync(PATH, 'utf8'));
    if (typeof value.enabled !== 'boolean') throw new Error('enabled must be boolean');
    if (!['draft', 'canary', 'live'].includes(value.phase)) throw new Error('invalid pipeline phase');
    for (const name of ['daily_cap_usd', 'stage_budget_usd', 'tick_seconds', 'batch_limit', 'plan_every_ticks']) positive(value[name], name);
    if (typeof value.review_fraction !== 'number' || value.review_fraction < 0 || value.review_fraction > 1) throw new Error('review_fraction must be 0..1');
    if (!Number.isInteger(value.canary_per_group_per_day) || value.canary_per_group_per_day < 1) throw new Error('canary_per_group_per_day must be a positive integer');
    if (typeof value.discovery !== 'boolean') throw new Error('discovery must be boolean');
    for (const name of ['term_event_overlap_allow', 'term_enrichment_exclude']) {
        if (!Array.isArray(value[name]) || value[name].some(v => typeof v !== 'string')) throw new Error(`${name} must be a list of term ids`);
    }
    return value;
}

module.exports = { load, PATH };
