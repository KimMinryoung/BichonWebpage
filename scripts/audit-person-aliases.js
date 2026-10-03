#!/usr/bin/env node
// Backstop for the person alias standard (data/commulingo/person-alias-rules.js,
// dev_docs/commulingo-alias-standard.md): the Admin store refuses these on
// write; this finds any that reached the table another way. Exit 1 on a hit.
//
// Usage: node scripts/audit-person-aliases.js [--json]
// (host or `docker exec leninbot-frontend node /app/scripts/...`)

const { db } = require('./lib/bootstrap');
const { aliasProblem } = require('../data/commulingo/person-alias-rules');
const { composeFromParts, composePersonName } = require('../data/commulingo/people-standard');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT a.person_id, a.lang, a.alias, p.name_ko, p.name_en, p.given_name_ko, p.given_name_en,
                    p.family_name_ko, p.family_name_en, p.citizenship_code, t.patronymic_ko, t.patronymic_en
             FROM commulingo_person_aliases a
             JOIN commulingo_people p ON p.id = a.person_id
             LEFT JOIN commulingo_person_patronymics t ON t.person_id = p.id
             ORDER BY a.person_id, a.lang, a.sort_order`
        );
        const hits = [];
        for (const row of rows) {
            const lang = row.lang;
            const given = row[`given_name_${lang}`] || '';
            const family = row[`family_name_${lang}`] || '';
            const patronymic = row[`patronymic_${lang}`] || '';
            const full = given || family
                ? composeFromParts(given, patronymic, family, lang, row.citizenship_code || '')
                : composePersonName(row[`name_${lang}`] || '', patronymic);
            const problem = aliasProblem(row.alias, lang, { name: row[`name_${lang}`], family, full });
            if (problem) hits.push({ id: row.person_id, lang, alias: row.alias, problem });
        }
        if (process.argv.includes('--json')) console.log(JSON.stringify(hits));
        else for (const h of hits) console.log(`${h.id} [${h.lang}] ${h.alias}: ${h.problem}`);
        console.error(`${hits.length} alias problem(s) in ${rows.length} aliases`);
        process.exitCode = hits.length ? 1 : 0;
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await db.end().catch(() => {});
    }
})();
