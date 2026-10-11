#!/usr/bin/env node
// Backstop for patronymic rows written by old code or hand-run SQL. The Admin
// API and leninbot enforce the same invariants during normal ingestion.
// Usage (inside the frontend container): node scripts/audit-person-patronymics.js

require('dotenv').config();
const db = require('../config/database');
const { patronymicProblem } = require('../data/commulingo/person-name-validation');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT p.id, p.cyrillic, pp.patronymic_ko, pp.patronymic_en,
                    pp.cyrillic_patronymic, pp.person_id IS NOT NULL AS has_row
             FROM commulingo_people p
             LEFT JOIN commulingo_person_patronymics pp ON pp.person_id = p.id
             ORDER BY p.id`
        );
        const problems = [];
        for (const row of rows) {
            const state = {
                ko: row.patronymic_ko || '',
                en: row.patronymic_en || '',
                native: row.cyrillic_patronymic || '',
                invalid: '',
            };
            const problem = patronymicProblem(state, row.cyrillic || '');
            if (problem) problems.push({ id: row.id, problem, ...state });
            // Rows without a patronymic row come through the LEFT JOIN only to
            // catch a patronymic left inside the native name (Борис Вениаминович Родос).
            if (row.has_row && !state.ko && !state.en && !state.native) {
                problems.push({ id: row.id, problem: 'empty patronymic row' });
            }
        }
        if (!problems.length) {
            console.log(`OK — ${rows.length} people checked: patronymic rows are complete and non-duplicated, no native name hides one.`);
            process.exit(0);
        }
        console.log(`${problems.length} patronymic problem(s):`);
        problems.forEach(item => console.log(`  ${item.id}: ${item.problem}`));
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
