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
                    pp.cyrillic_patronymic
             FROM commulingo_people p
             JOIN commulingo_person_patronymics pp ON pp.person_id = p.id
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
            if (!state.ko && !state.en && !state.native) {
                problems.push({ id: row.id, problem: 'empty patronymic row' });
            }
        }
        if (!problems.length) {
            console.log(`OK — ${rows.length} patronymic rows are complete and non-duplicated.`);
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
