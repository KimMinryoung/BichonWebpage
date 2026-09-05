#!/usr/bin/env node
// Backstop for CommuLingo people rows written by hand-run SQL: the card fields
// the Admin API validates on write (data/commulingo/person-card-validation.js)
// are not validated by psql. Migration 167 (2026-09-05) is the case that
// motivated it — voldemar-ulmer was inserted with no role row, a sentence for
// a fate label and a birthplace for the national-origin label.
//
// Rules (exit 1 on any hit):
//   - every person has a commulingo_person_roles row (office, category or icon);
//   - fate labels are short card labels, not sentences;
//   - citizenship / national-origin labels are not birthplaces.
// --verbose also lists fate labels longer than the soft limit as warnings.
//
// Usage: node scripts/audit-person-card-fields.js [--verbose]
// (host or `docker exec leninbot-frontend node /app/scripts/...`)

const { db } = require('./lib/bootstrap');
const { fateLabelProblems, nationalityLabelProblems, isLongFateLabel, FATE_KO_SOFT } = require('../data/commulingo/person-card-validation');

(async () => {
    const verbose = process.argv.includes('--verbose');
    try {
        const { rows } = await db.query(
            `SELECT p.id, p.fate_label_ko, p.fate_label_en,
                    p.citizenship_label_ko, p.citizenship_label_en,
                    p.origin_label_ko, p.origin_label_en,
                    r.person_id AS role_person_id
             FROM commulingo_people p
             LEFT JOIN commulingo_person_roles r ON r.person_id = p.id
             ORDER BY p.id`
        );
        const problems = [];
        const warnings = [];
        for (const row of rows) {
            if (!row.role_person_id) problems.push(`${row.id}: no commulingo_person_roles row (set officeId, category or icon)`);
            for (const p of fateLabelProblems({ ko: row.fate_label_ko, en: row.fate_label_en })) problems.push(`${row.id}: ${p}`);
            for (const p of nationalityLabelProblems({
                citizenshipKo: row.citizenship_label_ko, citizenshipEn: row.citizenship_label_en,
                originKo: row.origin_label_ko, originEn: row.origin_label_en,
            })) problems.push(`${row.id}: ${p}`);
            if (isLongFateLabel(row.fate_label_ko)) warnings.push(`${row.id}: fate_label_ko ${row.fate_label_ko.length} chars: «${row.fate_label_ko}»`);
        }
        if (verbose && warnings.length) {
            console.log(`${warnings.length} long fate label(s) (soft, > ${FATE_KO_SOFT} chars):`);
            for (const w of warnings) console.log(`  ${w}`);
        }
        if (problems.length) {
            console.log(`${problems.length} card-field problem(s):`);
            for (const p of problems) console.log(`  ${p}`);
            process.exitCode = 1;
        } else {
            console.log(`OK — ${rows.length} people checked: every card has a role row, a short fate label and nation (not birthplace) origin labels.`);
        }
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await db.end().catch(() => {});
    }
})();
