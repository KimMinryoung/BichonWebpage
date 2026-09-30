#!/usr/bin/env node
// Research queue for activity affiliations: activities whose affiliation is
// still 'unresolved' in a function where the affiliation matters (every
// function not marked affiliationOptional in activity-catalog.json). These are
// the ones the card still labels 소속 미확정. Scholarship and arts are left out:
// their unresolved rows are not shown as gaps (person-activities.js
// isUnresolvedGap). Report only, exit 0; resolve rows through the Admin store
// with cited evidence, never by copying citizenship.
//
// Usage: node scripts/report-person-unresolved-affiliations.js [--all] [--function <id>]
//   --all       include secondary activities, not just the primary one
// (host or `docker exec leninbot-frontend node /app/scripts/...`)

const { db } = require('./lib/bootstrap');
const { isUnresolvedGap } = require('../data/commulingo/person-activities');

(async () => {
    const all = process.argv.includes('--all');
    const fnArg = process.argv.indexOf('--function');
    const onlyFunction = fnArg > 0 ? process.argv[fnArg + 1] : '';
    try {
        const { rows } = await db.query(
            `SELECT id, name_ko, years_label, citizenship_code, COALESCE(activities, '[]'::jsonb) AS activities
             FROM commulingo_people ORDER BY id`
        );
        const byFunction = new Map();
        for (const row of rows) {
            for (const a of row.activities) {
                if (!all && !a.primary) continue;
                if (!isUnresolvedGap(a) || (onlyFunction && a.functionId !== onlyFunction)) continue;
                if (!byFunction.has(a.functionId)) byFunction.set(a.functionId, []);
                byFunction.get(a.functionId).push(`${row.id}\t${row.name_ko}\t${row.years_label || ''}\t${row.citizenship_code || ''}${a.primary ? '' : '\t(secondary)'}`);
            }
        }
        const total = [...byFunction.values()].reduce((n, list) => n + list.length, 0);
        console.log(`${total} ${all ? '' : 'primary '}activit${total === 1 ? 'y' : 'ies'} with an unresolved affiliation to research`);
        for (const [fn, list] of [...byFunction].sort((a, b) => b[1].length - a[1].length)) {
            console.log(`\n## ${fn} (${list.length})`);
            for (const line of list) console.log(line);
        }
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await db.end().catch(() => {});
    }
})();
