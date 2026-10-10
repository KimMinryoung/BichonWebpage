#!/usr/bin/env node
// Work queue for the posts named on activity rows (the activity `title`):
//   1. unnamed post lines — a post merged under a membership with neither a
//      title nor an office, so its line shows only the function name
//   2. people whose page repeats one organisation on several rows, each an
//      unnamed service/employment row (소련 국가기관 · 군사 / 소련 국가기관 · 정부)
//   3. unnamed primary service/employment rows
//   4. every other unnamed service/employment row
// and a review list of state-looking work filed under a party or force:
// a party row with a state function (government, legislature, …), or a
// party or force row whose title names a state post. A party's own international department or army can be right, so
// this is a list to read, not a write rule. Report only, exit 0; fix rows
// through build-person-activity-edits.js → apply-person-activities.js with
// cited evidence.
//
// Usage: node scripts/report-person-activity-posts.js [--tier <1-4>] [--json]
// (host or `docker exec leninbot-frontend node /app/scripts/...`)

const { db } = require('./lib/bootstrap');
const { affiliations, displayActivities } = require('../data/commulingo/person-activities');

const POST_RELATIONS = new Set(['service', 'employment']);
const STATE_FUNCTIONS = new Set(['government', 'legislature', 'monarchy', 'military', 'security', 'diplomacy', 'economy', 'law']);
const STATE_TITLE = /총리|장관|대통령|의원|인민위원|대사|판사|검찰|주지사|시장|Minister|President|Premier|Chancellor|Deputy|Ambassador|Judge|Governor|Mayor|Commissar/i;

const unnamed = a => POST_RELATIONS.has(a.relation) && !a.title && !a.officeId;
const line = (row, a) => `${row.id}\t${row.name_ko}\t${a.functionId}\t${a.affiliationId || '-'}\t${a.startYear ?? ''}–${a.endYear ?? ''}${a.primary ? '\t(primary)' : ''}`;

(async () => {
    const tierArg = process.argv.indexOf('--tier');
    const onlyTier = tierArg > 0 ? Number(process.argv[tierArg + 1]) : 0;
    const json = process.argv.includes('--json');
    try {
        const { rows } = await db.query(
            `SELECT id, name_ko, COALESCE(activities, '[]'::jsonb) AS activities FROM commulingo_people ORDER BY id`
        );
        const tiers = { 1: [], 2: [], 3: [], 4: [] }, review = [];
        for (const row of rows) {
            const acts = row.activities;
            const placed = new Set();
            const put = (tier, a) => { if (!placed.has(a)) { placed.add(a); tiers[tier].push({ row, a }); } };
            // Tier 1: the stored rows behind post lines named only by function.
            for (const shown of displayActivities(acts, 'ko')) {
                for (const p of shown.posts) {
                    if (!p.nameLabel) continue;
                    const a = acts.find(s => unnamed(s) && s.affiliationId === shown.affiliationId && s.startYear === p.startYear && s.endYear === p.endYear);
                    if (a) put(1, a);
                }
            }
            // Tier 2: one organisation on several unnamed rows.
            const count = new Map();
            for (const a of acts.filter(unnamed)) if (a.affiliationId) count.set(a.affiliationId, (count.get(a.affiliationId) || 0) + 1);
            for (const a of acts.filter(unnamed)) if (count.get(a.affiliationId) > 1) put(2, a);
            for (const a of acts.filter(unnamed)) put(a.primary ? 3 : 4, a);
            for (const a of acts) {
                const kind = affiliations.get(a.affiliationId)?.kind;
                if (a.relation !== 'service' || !['party', 'force'].includes(kind)) continue;
                // A force (백군, 7월 26일 운동) is often an army in its own right:
                // only a title naming a state post flags it.
                if ((kind === 'party' && STATE_FUNCTIONS.has(a.functionId)) || STATE_TITLE.test(`${a.title?.ko || ''} ${a.title?.en || ''}`)) review.push({ row, a });
            }
        }
        if (json) {
            const out = list => list.map(({ row, a }) => ({ personId: row.id, name: row.name_ko, activity: a }));
            console.log(JSON.stringify({ tiers: Object.fromEntries(Object.entries(tiers).map(([k, v]) => [k, out(v)])), review: out(review) }, null, 1));
            return;
        }
        const titles = { 1: 'post lines named only by function', 2: 'one organisation on several unnamed rows', 3: 'unnamed primary rows', 4: 'other unnamed rows' };
        for (const [tier, list] of Object.entries(tiers)) {
            if (onlyTier && Number(tier) !== onlyTier) continue;
            console.log(`\n## tier ${tier}: ${titles[tier]} (${list.length} rows, ${new Set(list.map(x => x.row.id)).size} people)`);
            if (onlyTier) for (const { row, a } of list) console.log(line(row, a));
        }
        if (!onlyTier) {
            console.log(`\n## review: state-looking work under a party or force (${review.length})`);
            for (const { row, a } of review) console.log(`${line(row, a)}${a.title ? `\t${a.title.ko}` : ''}`);
        }
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await db.end().catch(() => {});
    }
})();
