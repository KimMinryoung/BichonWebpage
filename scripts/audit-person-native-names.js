#!/usr/bin/env node
// Audit the CommuLingo people dictionary for native-name lines written in the
// wrong script — the bug migration 057 cleaned up (박헌영 filed as "Пак Хон Ён").
//
// The ingest paths now reject these on write (people-admin-store.js and leninbot
// runtime_tools/commulingo_people.py), so this script is the backstop for rows
// written before the guard, or by hand-run SQL.
//
// Usage (inside the frontend container):
//   node scripts/audit-person-native-names.js
// Exits 1 when mismatches remain, so it can gate a deploy.

require('dotenv').config();
const db = require('../config/database');
const { checkNativeScript } = require('../data/commulingo/native-script');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT p.id, p.cyrillic, p.name_ko, p.name_en,
                    p.citizenship_code, p.origin_code,
                    pp.cyrillic_patronymic
             FROM commulingo_people p
             LEFT JOIN commulingo_person_patronymics pp ON pp.person_id = p.id
             ORDER BY p.id`
        );

        const problems = [];
        const missing = [];
        for (const row of rows) {
            const context = { citizenship: row.citizenship_code, origin: row.origin_code };
            // checkNativeScript passes an empty value — there is no script to be
            // wrong about — so an omitted native name used to slip through every
            // guard and render as a blank line under the display name. Thirty-one
            // people sat like that, all of them Latin-script, because a curator
            // who saw the column called `cyrillic` read it as "not applicable"
            // rather than "the name in this person's own script".
            if (!String(row.cyrillic || '').trim()) {
                missing.push({ id: row.id, name: row.name_en || row.name_ko,
                    code: [row.citizenship_code, row.origin_code].filter(Boolean).join(' + ') });
            }
            for (const [field, value] of [
                ['cyrillic', row.cyrillic],
                ['cyrillicPatronymic', row.cyrillic_patronymic],
            ]) {
                const problem = checkNativeScript(value, { ...context, field });
                if (problem) problems.push({ id: row.id, name: row.name_en || row.name_ko, ...problem, value });
            }
        }

        if (missing.length) {
            console.log(`${missing.length} person(s) with no native name at all:\n`);
            for (const row of missing) console.log(`  ${row.id} (${row.name}) — nationality '${row.code}'`);
            console.log('\nSet cyrillic to the person\'s name in their own orthography. For a Latin-script'
                + ' nationality that is usually name_en verbatim, diacritics included.\n');
        }

        if (!problems.length && !missing.length) {
            console.log(`OK — ${rows.length} people checked, every native name is present and matches its nationality's script.`);
            process.exit(0);
        }
        if (!problems.length) process.exit(1);

        console.log(`${problems.length} native-name script mismatch(es):\n`);
        for (const problem of problems) {
            console.log(
                `  ${problem.id} (${problem.name}) — ${problem.field || 'cyrillic'} "${problem.value}" `
                + `is ${problem.found.join('/')}, citizenship '${problem.code}' expects ${problem.allowed.join(' or ')}`
            );
        }
        console.log('\nFix the name, or fix the citizenship code if that is what is wrong.');
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
